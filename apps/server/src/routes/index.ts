import { type Request, type Response, Router } from "express";
import { animuRouter } from "./animu.ts"
import { settingsRouter } from "./settings.ts"
import { sourceRouter } from "./sources.ts"

const routes = Router();

routes.use("/animu", animuRouter);
routes.use("/settings", settingsRouter);
routes.use("/sources", sourceRouter);

routes.get("/", (_: Request, res: Response) => {
    res.status(200).send("This is the API endpoint");
});

export { routes };