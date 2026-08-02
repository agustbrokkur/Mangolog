export type SourceJobOutcome = "updated" | "skipped" | "error";
export type SourceJobLogEntry = { entryId: string; title: string; outcome: SourceJobOutcome; message?: string };

export type SourceJob = {
	id: string;
	mode: "all" | "missing";
	/** Explicit entry-id scope the batch was restricted to (a section, a group of sections, ...), or null for the whole library. */
	entryIds: string[] | null;
	jobStatus: "running" | "done" | "cancelled" | "error";
	total: number;
	processed: number;
	updated: number;
	skipped: number;
	failed: number;
	current: { entryId: string; title: string } | null;
	log: SourceJobLogEntry[];
	startedAt: number;
	finishedAt: number | null;
};
