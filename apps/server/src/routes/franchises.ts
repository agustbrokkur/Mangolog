import { type Request, type Response, Router } from "express";
import type { FranchiseEntries, UpdateFranchise } from "../models/franchise.model.ts";
import { isValidId, validateFranchiseEntries, validateUpdateFranchise } from "../utils/validators.ts";
import { asFranchiseId } from "../models/ids.ts";
import { handleError } from "../utils/errorUtils.ts";
import { readAnimuData, writeAnimuData } from "../utils/fileUtils.ts";

const franchiseRouter = Router();

// GET /api/animu/franchises
// list all franchises
franchiseRouter.get("/", (_: Request, res: Response) => {
    try {
        const data = readAnimuData();
        const franchises = Object.values(data.franchises);

        res.status(200).json(franchises);
    } catch (error: unknown) {
        handleError(res, error, "Error fetching franchises");
    }
});

// GET /api/animu/franchises/:id
// Get franchise
franchiseRouter.get("/:id", (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json({
                message: "Invalid franchise id"
            });
        }

        const data = readAnimuData();
        const franchise = data.franchises[asFranchiseId(id)];

        if (!franchise) {
            return res.status(404).json({
                message: `Franchise id "${id}" not found`
            });
        }

        res.status(200).json(franchise);
    } catch (error: unknown) {
        handleError(res, error, "Error fetching franchise");
    }
});

// PUT /api/animu/franchises/:id
// Update franchise title/cover
franchiseRouter.put("/:id", (req: Request<{ id: string }, any, UpdateFranchise>, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json({
                message: "Invalid franchise id"
            });
        }

        const updatedFranchise = req.body;
        const validated = validateUpdateFranchise(updatedFranchise);
        if (validated) {
            return res.status(400).json({
                message: validated
            });
        }

        const data = readAnimuData();
        const existingFranchise = data.franchises[asFranchiseId(id)];

        if (!existingFranchise) {
            return res.status(404).json({
                message: `Franchise id "${id}" not found`
            });
        }

        if (Object.values(data.franchises).some(f => f.id !== id && f.title.toLowerCase() === updatedFranchise.title.toLowerCase())) {
            return res.status(400).json({
                message: `Franchise "${updatedFranchise.title}" already exists`
            });
        }

        const oldFranchiseTitle = existingFranchise.title;
        const newFranchiseTitle = updatedFranchise.title;

        existingFranchise.title = newFranchiseTitle;
        existingFranchise.coverUrl = updatedFranchise.coverUrl;
        writeAnimuData(data);

        const returnMessage = oldFranchiseTitle === newFranchiseTitle
            ? `Updated franchise ${newFranchiseTitle}`
            : `Updated franchise ${oldFranchiseTitle} (previously "${newFranchiseTitle}")`;

        res.status(200).json({
            message: returnMessage,
            ok: true,
        });
    } catch (error: unknown) {
        handleError(res, error, "Error renaming franchise");
    }
});

// DELETE /api/animu/franchises/:id
// Delete franchise
franchiseRouter.delete("/:id", (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json({
                message: "Invalid franchise id"
            });
        }

        const data = readAnimuData();
        const existingFranchise = data.franchises[asFranchiseId(id)];

        if (!existingFranchise) {
            return res.status(404).json({
                message: `Franchise id "${id}" not found`
            });
        }

        delete data.franchises[asFranchiseId(id)];
        writeAnimuData(data);

        res.status(200).json({
            message: `Franchise "${existingFranchise.title}" (${existingFranchise.id}) was deleted`,
            ok: true,
        });
    } catch (error: unknown) {
        handleError(res, error, "Error deleting franchise");
    }
});

// PUT /api/animu/franchises/:id/entries
// reorder entries within a franchise
franchiseRouter.put("/:id/entries", (req: Request<{ id: string }, any, FranchiseEntries>, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json({
                message: "Invalid franchise id"
            });
        }

        const franchiseEntries = req.body;
        const validated = validateFranchiseEntries(franchiseEntries.entryIds);
        if (validated) {
            return res.status(400).json({
                message: validated
            });
        }

        const data = readAnimuData();
        const existingFranchise = data.franchises[asFranchiseId(id)];

        if (!existingFranchise) {
            return res.status(404).json({
                message: `Franchise id "${id}" not found`
            });
        }

        existingFranchise.entryIds = [...new Set(franchiseEntries.entryIds)];
        writeAnimuData(data);

        res.status(200).json(existingFranchise.entryIds);
    } catch (error: unknown) {
        handleError(res, error, "Error reordering franchise entries");
    }
});

export { franchiseRouter };
