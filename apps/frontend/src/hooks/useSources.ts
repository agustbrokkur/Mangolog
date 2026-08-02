import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applyEntrySource, cancelBatchJob, getBatchJob, searchSources, startBatchFetch } from "../services/sourceService";
import type { EntrySource } from "../types/entry";

/** `enabled` lets the caller gate the request behind a debounce/minimum-length check. */
export const useSourceSearch = (query: string, enabled: boolean) => {
	return useQuery({
		queryKey: ["sourceSearch", query],
		queryFn: () => searchSources(query),
		enabled,
	});
};

export const useApplyEntrySource = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ entryId, source }: { entryId: string; source: EntrySource }) => applyEntrySource(entryId, source),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["animu"] }),
	});
};

export const useStartBatchFetch = () => {
	return useMutation({
		mutationFn: ({ mode, entryIds = null }: { mode: "all" | "missing"; entryIds?: string[] | null }) => startBatchFetch(mode, entryIds),
	});
};

/**
 * Polls every second while the job is running, stops once it settles. Callers should invalidate `["animu"]`
 * themselves when `jobStatus` leaves `"running"` — batch writes happen server-side outside any mutation.
 * Jobs live in server memory only, so a dev-server restart (or process restart generally) makes a jobId
 * permanently 404 — `retry: false` avoids hammering that with retries that can never succeed.
 */
export const useBatchJob = (jobId: string | null) => {
	return useQuery({
		queryKey: ["sourceBatchJob", jobId],
		queryFn: () => getBatchJob(jobId as string),
		enabled: jobId != null,
		refetchInterval: (query) => (query.state.data?.jobStatus === "running" ? 1000 : false),
		retry: false,
	});
};

export const useCancelBatchJob = () => {
	return useMutation({
		mutationFn: (jobId: string) => cancelBatchJob(jobId),
	});
};
