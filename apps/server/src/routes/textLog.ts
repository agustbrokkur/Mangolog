import { type Request, type Response, Router } from "express";
import { MEDIA_TYPES, STATUSES, type MediaType, type Status } from "../models/animu.model.ts";
import type { Entry } from "../models/entry.model.ts";
import { asEntryId, newEntryId } from "../models/ids.ts";
import { handleError } from "../utils/errorUtils.ts";
import { readAnimuData, writeAnimuData } from "../utils/fileUtils.ts";

const textLogRouter = Router();

// A lightweight, human-readable subset of the library (title/status/mediaType/progress/note/favorite) —
// not full fidelity. Full-fidelity restore is what the JSON backups are for.
const STATUS_LABELS: Record<Status, string> = {
    unsorted: "Unsorted",
    backlog: "Backlog",
    watching: "Watching",
    on_hold: "On Hold",
    watched: "Watched",
    dropped: "Dropped",
};

const LABEL_TO_STATUS: Record<string, Status> = Object.fromEntries(
    STATUSES.map((status) => [STATUS_LABELS[status].toLowerCase(), status])
);

const HEADER_PATTERN = /^-----(.+)-----:$/;

type LogRow = {
    title: string;
    status: Status;
    mediaType: MediaType;
    progress: number | null;
    totalEpisodesOverride: number | null;
    note: string | null;
    favorite: boolean;
    matchedEntryId: string | null;
};

// GET /api/animu/export
// Plain-text log, grouped by status header, tab-separated fields per line —
// tabs (not " - ") are the separator so titles containing " - " (e.g. "C - The Money of Soul...") can't corrupt parsing.
textLogRouter.get("/export", (_: Request, res: Response) => {
    try {
        const data = readAnimuData();
        const entries = Object.values(data.entries);

        const lines: string[] = [];
        for (const status of STATUSES) {
            lines.push(`-----${STATUS_LABELS[status]}-----:`);

            for (const entry of entries.filter((e) => e.status === status)) {
                const total = entry.totalEpisodesOverride ?? entry.source?.totalEpisodes ?? null;
                const progress = entry.progress ?? null;

                lines.push([
                    `[${entry.mediaType}]`,
                    entry.title,
                    `${progress ?? "?"}/${total ?? "?"}`,
                    entry.note ?? "",
                    entry.favorite ? "1" : "",
                ].join("\t"));
            }

            lines.push("");
        }

        res.status(200)
            .type("text/plain")
            .set("Content-Disposition", "attachment; filename=\"animulog-export.txt\"")
            .send(lines.join("\n"));
    } catch (error: unknown) {
        handleError(res, error, "Error exporting library");
    }
});

function parseLog(text: string, entries: Entry[]): LogRow[] {
    const rows: LogRow[] = [];
    let currentStatus: Status = "unsorted";

    for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line) continue;

        const header = line.match(HEADER_PATTERN);
        if (header) {
            currentStatus = LABEL_TO_STATUS[header[1].trim().toLowerCase()] ?? currentStatus;
            continue;
        }

        const [mediaTypeTag, title, progressTotal, note, favorite] = rawLine.split("\t");
        if (!title) continue;

        const mediaType = mediaTypeTag?.replace(/[[\]]/g, "").trim() as MediaType;
        const [progressRaw, totalRaw] = (progressTotal ?? "").split("/");
        const progress = progressRaw && progressRaw !== "?" ? Number(progressRaw) : null;
        const total = totalRaw && totalRaw !== "?" ? Number(totalRaw) : null;

        const matched = entries.find((e) => e.title.toLowerCase() === title.trim().toLowerCase());

        rows.push({
            title: title.trim(),
            status: currentStatus,
            mediaType: MEDIA_TYPES.includes(mediaType) ? mediaType : "other",
            progress: Number.isFinite(progress) ? progress : null,
            totalEpisodesOverride: Number.isFinite(total) ? total : null,
            note: note?.trim() || null,
            favorite: favorite?.trim() === "1",
            matchedEntryId: matched?.id ?? null,
        });
    }

    return rows;
}

// POST /api/animu/import/preview
// Parses the exported format back into rows without writing anything, so the caller can review/edit before committing.
textLogRouter.post("/import/preview", (req: Request<any, any, { text: string }>, res: Response) => {
    try {
        const { text } = req.body;
        if (typeof text !== "string") {
            return res.status(400).json({
                message: "Invalid text"
            });
        }

        const data = readAnimuData();
        const rows = parseLog(text, Object.values(data.entries));

        res.status(200).json(rows);
    } catch (error: unknown) {
        handleError(res, error, "Error previewing import");
    }
});

// POST /api/animu/import/commit
// Applies a (possibly hand-edited) set of previewed rows: patches matched entries, creates the rest.
textLogRouter.post("/import/commit", (req: Request<any, any, LogRow[]>, res: Response) => {
    try {
        const rows = req.body;
        if (!Array.isArray(rows)) {
            return res.status(400).json({
                message: "Invalid import rows"
            });
        }

        const data = readAnimuData();
        const now = Date.now();

        for (const row of rows) {
            const existing = row.matchedEntryId ? data.entries[asEntryId(row.matchedEntryId)] : undefined;

            if (existing) {
                existing.status = row.status;
                existing.mediaType = row.mediaType;
                existing.progress = row.progress;
                existing.totalEpisodesOverride = row.totalEpisodesOverride;
                existing.favorite = row.favorite;
                if (row.note) existing.note = row.note;
                existing.timestamps.updated = now;
            } else {
                const newId = newEntryId();
                const newEntry: Entry = {
                    id: newId,
                    mediaType: row.mediaType,
                    title: row.title,
                    status: row.status,
                    favorite: row.favorite,
                    note: row.note,
                    score: null,
                    progress: row.progress,
                    coverOverride: null,
                    totalEpisodesOverride: row.totalEpisodesOverride,
                    tags: [],
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
            }
        }

        writeAnimuData(data);
        res.status(200).json({ ok: true });
    } catch (error: unknown) {
        handleError(res, error, "Error committing import");
    }
});

export { textLogRouter };
