import type { EntrySource } from "../types/entry";
import type { SourceCandidate } from "../types/source";
import type { SourceJob } from "../types/sourceJob";

const BASE_API_URL = import.meta.env.VITE_API_URL;

export const searchSources = async (query: string): Promise<SourceCandidate[]> => {
	const res = await fetch(`${BASE_API_URL}/sources/search`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ query }),
	});

	if (!res.ok) throw new Error("Failed to search AniList");

	return res.json();
};

export const applyEntrySource = async (entryId: string, source: EntrySource): Promise<void> => {
	const res = await fetch(`${BASE_API_URL}/animu/entries/${entryId}/source`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(source),
	});

	if (!res.ok) throw new Error("Failed to update entry source");
};

export const startBatchFetch = async (mode: "all" | "missing", entryIds: string[] | null = null): Promise<{ jobId: string }> => {
	const res = await fetch(`${BASE_API_URL}/sources/batch`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ mode, entryIds }),
	});

	if (!res.ok) throw new Error("Failed to start source-fetch job");

	return res.json();
};

export const getBatchJob = async (jobId: string): Promise<SourceJob> => {
	const res = await fetch(`${BASE_API_URL}/sources/batch/${jobId}`);

	if (!res.ok) throw new Error("Failed to fetch job status");

	return res.json();
};

export const cancelBatchJob = async (jobId: string): Promise<void> => {
	const res = await fetch(`${BASE_API_URL}/sources/batch/${jobId}/cancel`, { method: "POST" });

	if (!res.ok) throw new Error("Failed to cancel job");
};
