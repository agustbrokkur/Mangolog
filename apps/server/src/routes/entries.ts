import { type Request, type Response, Router } from "express";
import type { CreateEntry, Entry, EntrySource, UpdateEntry } from "../models/entry.model.ts";
import { isValidId, isValidString, validateCreateEntry, validateEntrySource, validateUpdateEntry } from "../utils/validators.ts";
import { asEntryId, franchiseIdFor, newEntryId } from "../models/ids.ts";
import { handleError } from "../utils/errorUtils.ts";
import { readAnimuData, readSettings, writeAnimuData } from "../utils/fileUtils.ts";

const entryRouter = Router();

// GET /api/animu/entries
// List all entries
entryRouter.get("/", (_: Request, res: Response) => {
    try {
        const data = readAnimuData();
        const entries = Object.values(data.entries);

        res.status(200).json(entries);
    } catch (error: unknown) {
        handleError(res, error, "Error fetching entries");
    }
});

// POST /api/animu/entries
// Create entry
entryRouter.post("/", (req: Request<any, any, CreateEntry>, res: Response) => {
    try {
        const createdEntry = req.body;
        const validated = validateCreateEntry(createdEntry);
        if (validated) {
            return res.status(400).json({
                message: validated
            });
        }

        const data = readAnimuData();
        const newId = newEntryId();
        const now = Date.now();
        const newEntry: Entry = {
            id: newId,
            mediaType: createdEntry.mediaType,
            title: createdEntry.title,
            status: createdEntry.status ?? readSettings().defaultEntryStatus,
            favorite: createdEntry.favorite,
            note: createdEntry.note,
            score: createdEntry.score,
            progress: createdEntry.progress,
            coverOverride: createdEntry.coverOverride,
            totalEpisodesOverride: createdEntry.totalEpisodesOverride,
            tags: createdEntry.tags,
            source: null,
            timestamps: {
                added: now,
                updated: now,
                firstStarted: null,
                lastStarted: null,
                firstFinished: null,
                lastFinished: null,
                finishedCount: 0,
                lastDropped: null,
            },
        };

        data.entries[newId] = newEntry;
        writeAnimuData(data);

        res.status(201).json({
            message: `Entry with id ${newEntry.id} created`,
            ok: true,
        });
    } catch (error: unknown) {
        handleError(res, error, "Error creating entry");
    }
});

// GET /api/animu/entries/:id
// get single entry
entryRouter.get("/:id", (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json({
                message: "Invalid entry id"
            });
        }

        const data = readAnimuData();
        const entry = data.entries[asEntryId(id)];

        if (!entry) {
            return res.status(404).json({
                message: `Entry id "${id}" not found`
            });
        }

        res.status(200).json(entry);
    } catch (error: unknown) {
        handleError(res, error, "Error fetching entry");
    }
});

// PUT /api/animu/entries/:id
// Update entry
entryRouter.put("/:id", (req: Request<{ id: string }, any, UpdateEntry>, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json({
                message: "Invalid entry id"
            });
        }

        const updatedEntry = req.body;
        const validated = validateUpdateEntry(updatedEntry);
        if (validated) {
            return res.status(400).json({
                message: validated
            });
        }

        const data = readAnimuData();
        const existingEntry = data.entries[asEntryId(id)];

        if (!existingEntry) {
            return res.status(404).json({
                message: `Entry id "${id}" not found`
            });
        }

        data.entries[asEntryId(id)] = { ...updatedEntry, id: existingEntry.id, source: existingEntry.source };

        writeAnimuData(data);
        res.status(201).json({ ok: true });
    } catch (error: unknown) {
        handleError(res, error, "Error creating entry");
    }
});

// DELETE /api/animu/entries/:id
// Delete entry
entryRouter.delete("/:id", (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json({
                message: "Invalid entry id"
            });
        }

        const data = readAnimuData();
        const existingEntry = data.entries[asEntryId(id)];

        if (!existingEntry) {
            return res.status(404).json({
                message: `Entry id "${id}" not found`
            });
        }

        delete data.entries[asEntryId(id)];
        writeAnimuData(data);

        res.status(201).json({ ok: true });
    } catch (error: unknown) {
        handleError(res, error, "Error deleting entry");
    }
});

// PUT /api/animu/entries/:id/franchise
// Assigns the entry to the franchise matching `title` (case-insensitive), creating one if none matches.
// Passing title: null clears the entry's franchise membership. The entry is always removed from
// whatever franchise it previously belonged to first; a franchise left with no entries is deleted.
entryRouter.put("/:id/franchise", (req: Request<{ id: string }, any, { title: string | null }>, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json({
                message: "Invalid entry id"
            });
        }

        const { title } = req.body;
        if (title !== null && !isValidString(title)) {
            return res.status(400).json({
                message: "Invalid franchise title"
            });
        }

        const data = readAnimuData();
        const entryId = asEntryId(id);
        const existingEntry = data.entries[entryId];

        if (!existingEntry) {
            return res.status(404).json({
                message: `Entry id "${id}" not found`
            });
        }

        for (const franchise of Object.values(data.franchises)) {
            if (!franchise.entryIds.includes(entryId)) continue;
            franchise.entryIds = franchise.entryIds.filter((existingId) => existingId !== entryId);
            if (franchise.entryIds.length === 0) delete data.franchises[franchise.id];
        }

        if (title !== null) {
            const trimmed = title.trim();
            let target = Object.values(data.franchises).find((f) => f.title.toLowerCase() === trimmed.toLowerCase());
            if (!target) {
                const newId = franchiseIdFor(entryId);
                target = { id: newId, title: trimmed, coverUrl: existingEntry.coverOverride ?? existingEntry.source?.coverUrl ?? null, entryIds: [] };
                data.franchises[newId] = target;
            }
            if (!target.entryIds.includes(entryId)) target.entryIds.push(entryId);
        }

        writeAnimuData(data);
        res.status(200).json({ ok: true });
    } catch (error: unknown) {
        handleError(res, error, "Error updating entry franchise");
    }
});

// PUT /api/animu/entries/:id/source
// Applies a chosen provider match (from manual search or the picker) as the entry's source cache.
entryRouter.put("/:id/source", (req: Request<{ id: string }, any, EntrySource>, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json({
                message: "Invalid entry id"
            });
        }

        const source = req.body;
        const validated = validateEntrySource(source);
        if (validated) {
            return res.status(400).json({
                message: validated
            });
        }

        const data = readAnimuData();
        const existingEntry = data.entries[asEntryId(id)];

        if (!existingEntry) {
            return res.status(404).json({
                message: `Entry id "${id}" not found`
            });
        }

        existingEntry.source = source;
        existingEntry.timestamps.updated = Date.now();

        writeAnimuData(data);
        res.status(200).json({ ok: true });
    } catch (error: unknown) {
        handleError(res, error, "Error updating entry source");
    }
});

export { entryRouter }
