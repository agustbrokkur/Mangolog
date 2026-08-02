// types/sort.ts

export type SortKey = "custom" | "title" | "score" | "communityRating" | "episodesWatched" | "totalEpisodes" | "addedAt" | "startedAt" | "finishedAt" | "aired";

export type SortDirection = "asc" | "desc";

export interface EntrySort {
	key: SortKey;
	direction: SortDirection;
}

export const DEFAULT_SORT: EntrySort = { key: "custom", direction: "asc" };

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
	{ key: "custom", label: "Custom order" },
	{ key: "title", label: "Title" },
	{ key: "score", label: "Your Rating" },
	{ key: "communityRating", label: "Community Rating" },
	{ key: "episodesWatched", label: "Episodes Watched" },
	{ key: "totalEpisodes", label: "Total Episodes" },
	{ key: "addedAt", label: "Date Added" },
	{ key: "startedAt", label: "Date Started" },
	{ key: "finishedAt", label: "Date Finished" },
	{ key: "aired", label: "Date Aired" },
];

// Sensible starting direction when a key is first selected (newest/highest first for most fields).
export const SORT_DEFAULT_DIRECTION: Record<SortKey, SortDirection> = {
	custom: "asc",
	title: "asc",
	score: "desc",
	communityRating: "desc",
	episodesWatched: "desc",
	totalEpisodes: "desc",
	addedAt: "desc",
	startedAt: "desc",
	finishedAt: "desc",
	aired: "desc",
};
