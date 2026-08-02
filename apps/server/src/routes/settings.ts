import { type Request, type Response, Router } from "express";
import type { Settings } from "../models/settings.model.ts";
import { validateSettings } from "../utils/validators.ts";
import { handleError } from "../utils/errorUtils.ts";
import { readSettings, writeSettings } from "../utils/fileUtils.ts";

const settingsRouter = Router();

// GET /api/settings
settingsRouter.get("/", (_: Request, res: Response) => {
    try {
        const settings = readSettings();

        res.status(200).json(settings);
    } catch (error: unknown) {
        handleError(res, error, "Error fetching settings");
    }
});

// PUT /api/settings
settingsRouter.put("/", (req: Request<any, any, Settings>, res: Response) => {
    try {
        const updatedSettings = req.body;
        const validated = validateSettings(updatedSettings);
        if (validated) {
            return res.status(400).json({
                message: validated
            });
        }

        writeSettings(updatedSettings);

        res.status(200).json(updatedSettings);
    } catch (error: unknown) {
        handleError(res, error, "Error updating settings");
    }
});

export { settingsRouter };
