import { type Request, type Response, Router } from "express";
import { createBackup, listBackups, restoreBackup } from "../utils/backup.ts";
import { handleError } from "../utils/errorUtils.ts";

const backupRouter = Router();

// GET /api/animu/backups
// list existing backups, newest first
backupRouter.get("/", (_: Request, res: Response) => {
    try {
        res.status(200).json(listBackups());
    } catch (error: unknown) {
        handleError(res, error, "Error listing backups");
    }
});

// POST /api/animu/backups
// create a new backup of the current data
backupRouter.post("/", (_: Request, res: Response) => {
    try {
        const backupPath = createBackup();

        res.status(201).json({ backupPath });
    } catch (error: unknown) {
        handleError(res, error, "Error creating backup");
    }
});

// POST /api/animu/backups/:filename/restore
// restore animu.json from an existing backup, safety-backing up the current state first
backupRouter.post("/:filename/restore", (req: Request<{ filename: string }>, res: Response) => {
    try {
        const { filename } = req.params;
        const exists = listBackups().some((backup) => backup.filename === filename);
        if (!exists) {
            return res.status(404).json({
                message: `Backup "${filename}" not found`
            });
        }

        restoreBackup(filename);

        res.status(200).json({ ok: true });
    } catch (error: unknown) {
        handleError(res, error, "Error restoring backup");
    }
});

export { backupRouter };
