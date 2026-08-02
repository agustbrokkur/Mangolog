import { type Request, type Response, Router } from "express";
import { handleError } from "../utils/errorUtils.ts";
import { readAnimuData } from "../utils/fileUtils.ts";
import { sectionRouter } from "./sections.ts";
import { entryRouter } from "./entries.ts";
import { franchiseRouter } from "./franchises.ts";
import { backupRouter } from "./backups.ts";
import { textLogRouter } from "./textLog.ts";

const animuRouter = Router();

animuRouter.use("/sections", sectionRouter);
animuRouter.use("/entries", entryRouter);
animuRouter.use("/franchises", franchiseRouter);
animuRouter.use("/backups", backupRouter);
animuRouter.use("/", textLogRouter);

// Global
animuRouter.get("/", (_: Request, res: Response) => {
    try {
        const data = readAnimuData();

        res.status(200).json(data);
    } catch (error: unknown) {
        handleError(res, error, "Error fetching animulog");
    }
});

export { animuRouter };
