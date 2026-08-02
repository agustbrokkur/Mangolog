import { type Request, type Response, Router } from "express";
import { searchAnilist } from "../services/anilist.ts";
import { cancelJob, getJob, isJobRunning, startBatchJob } from "../services/sourceJobs.ts";
import { isValidIdArray, isValidString } from "../utils/validators.ts";
import { handleError } from "../utils/errorUtils.ts";

const sourceRouter = Router();

// POST /api/sources/search
// Searches AniList for candidate matches — the caller (manual picker UI) picks one.
sourceRouter.post("/search", async (req: Request<any, any, { query: string }>, res: Response) => {
	try {
		const { query } = req.body;
		if (!isValidString(query)) {
			return res.status(400).json({ message: "Invalid query" });
		}

		const candidates = await searchAnilist(query);
		res.status(200).json(candidates);
	} catch (error: unknown) {
		handleError(res, error, "Error searching AniList");
	}
});

// POST /api/sources/batch
// Starts a batch source-fetch job over all entries (optionally scoped to an explicit set of entry
// ids — a section, a group of sections, ...), or just entries missing a source within that scope.
sourceRouter.post("/batch", (req: Request<any, any, { mode: "all" | "missing"; entryIds?: string[] | null }>, res: Response) => {
	try {
		const { mode, entryIds = null } = req.body;
		if (mode !== "all" && mode !== "missing") {
			return res.status(400).json({ message: "Invalid mode" });
		}
		if (entryIds !== null && !isValidIdArray(entryIds)) {
			return res.status(400).json({ message: "Invalid entryIds" });
		}
		if (isJobRunning()) {
			return res.status(409).json({ message: "A source-fetch job is already running" });
		}

		const job = startBatchJob(mode, entryIds);
		res.status(202).json({ jobId: job.id });
	} catch (error: unknown) {
		handleError(res, error, "Error starting source-fetch job");
	}
});

// GET /api/sources/batch/:jobId
sourceRouter.get("/batch/:jobId", (req: Request<{ jobId: string }>, res: Response) => {
	try {
		const job = getJob(req.params.jobId);
		if (!job) {
			return res.status(404).json({ message: `Job "${req.params.jobId}" not found` });
		}
		res.status(200).json(job);
	} catch (error: unknown) {
		handleError(res, error, "Error fetching job status");
	}
});

// POST /api/sources/batch/:jobId/cancel
sourceRouter.post("/batch/:jobId/cancel", (req: Request<{ jobId: string }>, res: Response) => {
	try {
		const cancelled = cancelJob(req.params.jobId);
		if (!cancelled) {
			return res.status(404).json({ message: `No running job "${req.params.jobId}"` });
		}
		res.status(200).json({ ok: true });
	} catch (error: unknown) {
		handleError(res, error, "Error cancelling job");
	}
});

export { sourceRouter };
