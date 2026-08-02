import { needsSourceFetch, type Entry } from "../models/entry.model.ts";
import { readAnimuData, writeAnimuData } from "../utils/fileUtils.ts";
import { pickBestMatch, searchAnilist, toEntrySource } from "./anilist.ts";

type JobMode = "all" | "missing";
type JobOutcome = "updated" | "skipped" | "error";
type JobLogEntry = { entryId: string; title: string; outcome: JobOutcome; message?: string };

export type SourceJob = {
	id: string;
	mode: JobMode;
	/** Restricts the batch to these entry ids (a section, a group of sections, ...), or null for the whole library. */
	entryIds: string[] | null;
	jobStatus: "running" | "done" | "cancelled" | "error";
	total: number;
	processed: number;
	updated: number;
	skipped: number;
	failed: number;
	/** The entry actively being searched, so the UI can show a live "fetching" row. */
	current: { entryId: string; title: string } | null;
	log: JobLogEntry[];
	startedAt: number;
	finishedAt: number | null;
	cancelRequested: boolean;
};

const jobs = new Map<string, SourceJob>();
let activeJobId: string | null = null;

export function getJob(id: string): SourceJob | undefined {
	const job = jobs.get(id);
	if (!job) {
		// TEMP DIAGNOSTIC: helps tell "job never existed here" (process mismatch) apart from
		// "job existed and got removed" (it never does — jobs are only ever added, never deleted).
		console.warn(`[sourceJobs] job "${id}" not found — known jobs: [${[...jobs.keys()].join(", ")}], active: ${activeJobId}`);
	}
	return job;
}

export function isJobRunning(): boolean {
	return activeJobId !== null;
}

export function cancelJob(id: string): boolean {
	const job = jobs.get(id);
	if (!job || job.jobStatus !== "running") return false;
	job.cancelRequested = true;
	return true;
}

export function startBatchJob(mode: JobMode, entryIds: string[] | null): SourceJob {
	if (activeJobId) {
		throw new Error("A source-fetch job is already running");
	}

	// Walk in the caller's order (its top-to-bottom on-screen order), not object insertion order —
	// falling back to insertion order only if no explicit scope/order was given at all.
	const data = readAnimuData();
	const orderedIds = entryIds ?? Object.keys(data.entries);
	const targets: Entry[] = [];
	for (const id of orderedIds) {
		const entry = data.entries[id as keyof typeof data.entries];
		if (!entry) continue;
		if (mode === "missing" && !needsSourceFetch(entry)) continue;
		targets.push(entry);
	}

	const job: SourceJob = {
		id: crypto.randomUUID(),
		mode,
		entryIds,
		jobStatus: "running",
		total: targets.length,
		processed: 0,
		updated: 0,
		skipped: 0,
		failed: 0,
		current: null,
		log: [],
		startedAt: Date.now(),
		finishedAt: null,
		cancelRequested: false,
	};
	jobs.set(job.id, job);
	activeJobId = job.id;
	console.log(`[sourceJobs] started job "${job.id}" (${mode}, ${targets.length} targets)`);

	void runJob(job, targets);

	return job;
}

function record(job: SourceJob, entryId: string, title: string, outcome: JobOutcome, message?: string): void {
	job.log.push({ entryId, title, outcome, message });
	job.processed++;
	job.current = null;
	if (outcome === "updated") job.updated++;
	else if (outcome === "skipped") job.skipped++;
	else job.failed++;
}

async function runJob(job: SourceJob, targets: Entry[]): Promise<void> {
	for (const entry of targets) {
		if (job.cancelRequested) {
			job.jobStatus = "cancelled";
			break;
		}

		job.current = { entryId: entry.id, title: entry.title };

		// AniList only indexes anime — custom/VN/western entries have nothing to match against.
		if (entry.mediaType === "other") {
			record(job, entry.id, entry.title, "skipped", "Not an anime title");
			continue;
		}

		try {
			const candidates = await searchAnilist(entry.title);
			const best = pickBestMatch(candidates, entry.mediaType);
			if (!best) {
				record(job, entry.id, entry.title, "skipped", "No AniList results");
				continue;
			}

			const data = readAnimuData();
			const existing = data.entries[entry.id];
			if (!existing) {
				record(job, entry.id, entry.title, "skipped", "Entry no longer exists");
				continue;
			}

			existing.source = toEntrySource(best);
			existing.timestamps.updated = Date.now();
			writeAnimuData(data);

			record(job, entry.id, entry.title, "updated");
		} catch (error: unknown) {
			record(job, entry.id, entry.title, "error", error instanceof Error ? error.message : "Unknown error");
		}
	}

	job.current = null;
	if (job.jobStatus === "running") job.jobStatus = "done";
	job.finishedAt = Date.now();
	activeJobId = null;
}
