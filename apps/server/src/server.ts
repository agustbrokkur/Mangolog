import cors from "cors";
import express, { type Request, type Response} from "express";
import { routes } from "./routes/index.ts";
import { checkAutoBackup } from "./utils/backup.ts";

const PORT = 3001;
const AUTO_BACKUP_CHECK_INTERVAL_MS = 60 * 60 * 1000;

// TEMP DIAGNOSTIC: lets us see in DevTools/terminal whether two requests hit the same
// process — stamped on every response so a restart between requests is unmistakable.
const BOOT_ID = `${process.pid}-${Date.now()}`;

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"]
}))
app.use((_req: Request, res: Response, next) => {
    res.setHeader("X-Server-Boot", BOOT_ID);
    next();
});
app.use("/api", routes);

app.get("/", (_: Request, res: Response) => {
    res.send("Animulog Server");
});

app.listen(PORT, () => console.log(`Animulog Server running on http://localhost:${PORT} — boot ${BOOT_ID}`));

checkAutoBackup();
setInterval(checkAutoBackup, AUTO_BACKUP_CHECK_INTERVAL_MS);