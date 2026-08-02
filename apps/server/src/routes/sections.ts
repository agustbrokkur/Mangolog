import { type Request, type Response, Router } from "express";
import type { CreateSection, ManualSection, Section, SectionEntries, SmartSection } from "../models/section.model.ts";
import { isValidId, isValidIdArray, validateCreateSection, validateSectionEntries, validateUpdateSection } from "../utils/validators.ts";
import { asSectionId, newSectionId } from "../models/ids.ts";
import { handleError } from "../utils/errorUtils.ts";
import { readAnimuData, writeAnimuData } from "../utils/fileUtils.ts";

const sectionRouter = Router();

// GET /api/animu/sections
// list all sections
sectionRouter.get("/", (_: Request, res: Response) => {
    try {
        const data = readAnimuData();
        const sections = Object.values(data.sections);

        res.status(200).json(sections);
    } catch (error: unknown) {
        handleError(res, error, "Error fetching sections");
    }
});

// POST /api/animu/sections
// create section
sectionRouter.post("/", (req: Request<any, any, CreateSection>, res: Response) => {
    try {
        const createdSection = req.body;
        const validated = validateCreateSection(createdSection);
        if (validated) {
            return res.status(400).json({
                message: validated
            });
        }

        const data = readAnimuData();
        if (Object.values(data.sections).some(section => section.label === createdSection.label)) {
            return res.status(400).json({
                message: `Section "${createdSection.label}" already exists`
            });
        }

        const newId = newSectionId();
        const order = Object.keys(data.sections).length;

        const newSection: Section = createdSection.kind === "smart"
            ? {
                id: newId,
                label: createdSection.label,
                group: createdSection.group,
                system: createdSection.system,
                order,
                kind: "smart",
                filter: createdSection.filter,
                sort: createdSection.sort,
            } satisfies SmartSection
            : {
                id: newId,
                label: createdSection.label,
                group: createdSection.group,
                system: createdSection.system,
                order,
                kind: "manual",
                entryIds: [],
            } satisfies ManualSection;

        data.sections[newId] = newSection;
        writeAnimuData(data);

        res.status(201).json({
            message: `Section ${newSection.label} created`,
            ok: true,
        });
    } catch (error: unknown) {
        handleError(res, error, "Error creating section");
    }
});

// Get /api/animu/sections/:id
// Get section
sectionRouter.get("/:id", (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json({
                message: "Invalid section id"
            });
        }

        const data = readAnimuData();
        const section = data.sections[asSectionId(id)];

        if (!section) {
            return res.status(404).json({
                message: `Section id "${id}" not found`
            });
        }

        res.status(200).json(section);
    } catch (error: unknown) {
        handleError(res, error, "Error fetching sections");
    }
});

// PUT /api/animu/sections/reorder
// Reassigns every section's `order` to its index in `sectionIds` — registered before `/:id` so it isn't
// swallowed by that dynamic route.
sectionRouter.put("/reorder", (req: Request<any, any, { sectionIds: string[] }>, res: Response) => {
    try {
        const { sectionIds } = req.body;
        if (!isValidIdArray(sectionIds)) {
            return res.status(400).json({
                message: "Invalid section id list"
            });
        }

        const data = readAnimuData();
        const existingIds = Object.keys(data.sections);

        if (sectionIds.length !== existingIds.length || !existingIds.every(id => sectionIds.includes(id))) {
            return res.status(400).json({
                message: "sectionIds must be a permutation of every existing section id"
            });
        }

        sectionIds.forEach((id, index) => {
            data.sections[asSectionId(id)].order = index;
        });
        writeAnimuData(data);

        res.status(200).json(sectionIds);
    } catch (error: unknown) {
        handleError(res, error, "Error reordering sections");
    }
});

// PUT /api/animu/sections/:id
// Update section label
sectionRouter.put("/:id", (req: Request<{ id: string }, any, { label: string; group: Section["group"] }>, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json({
                message: "Invalid section id"
            });
        }

        const updatedSection = req.body;
        const validated = validateUpdateSection(updatedSection);
        if (validated) {
            return res.status(400).json({
                message: validated
            });
        }

        const data = readAnimuData();
        const existingSection = data.sections[asSectionId(id)];

        if (!existingSection) {
            return res.status(404).json({
                message: `Section id "${id}" not found`
            });
        }

        if (Object.values(data.sections).some(s => s.id !== id && s.label === updatedSection.label)) {
            return res.status(400).json({
                message: `Section "${updatedSection.label}" already exists`
            });
        }

        const oldSectionName = existingSection.label;
        const newSectionName = updatedSection.label;

        existingSection.label = newSectionName;
        existingSection.group = updatedSection.group;
        writeAnimuData(data);

        const returnMessage = oldSectionName === newSectionName
            ? `Updated section ${newSectionName}`
            : `Updated section ${oldSectionName} (previously "${newSectionName}")`;

        res.status(200).json({
            message: returnMessage,
            ok: true,
        });
    } catch (error: unknown) {
        handleError(res, error, "Error renaming section");
    }
});

// DELETE /api/animu/sections/:id
// Delete section
sectionRouter.delete("/:id", (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json({
                message: "Invalid section id"
            });
        }

        const data = readAnimuData();
        const existingSection = data.sections[asSectionId(id)];

        if (!existingSection) {
            return res.status(404).json({
                message: `Section id "${id}" not found`
            });
        }

        delete data.sections[asSectionId(id)];
        writeAnimuData(data);

        res.status(200).json({
            message: `Section "${existingSection.label}" (${existingSection.id}) was deleted`,
            ok: true,
        });
    } catch (error: unknown) {
        handleError(res, error, "Error deleting section");
    }
});

// PUT /api/animu/sections/:id/entries
// add entry to section
sectionRouter.put("/:id/entries", (req: Request<{ id: string }, any, SectionEntries>, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json({
                message: "Invalid section id"
            });
        }

        const sectionEntries = req.body;
        const validated = validateSectionEntries(sectionEntries.entryIds);
        if (validated) {
            return res.status(400).json({
                message: validated
            });
        }

        const data = readAnimuData();
        const existingSection = data.sections[asSectionId(id)];

        if (!existingSection) {
            return res.status(404).json({
                message: `Section id "${id}" not found`
            });
        }
        if (existingSection.kind !== "manual") {
            return res.status(400).json({
                message: `Section "${existingSection.label}" is a smart section; its membership is derived from its filter, not editable directly`
            });
        }

        existingSection.entryIds = [...new Set(sectionEntries.entryIds)];
        writeAnimuData(data);

        res.status(200).json(existingSection.entryIds);
    } catch (error: unknown) {
        handleError(res, error, "Error fetching section");
    }
});

export { sectionRouter };
