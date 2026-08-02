// utils/sortEntries.ts
import type { Entry } from "../types/entry";
import { resolveEntry } from "../types/entry";
import type { EntrySort, SortKey } from "../types/sort";

const getSortValue = (entry: Entry, key: SortKey): number | string | null => {
	switch (key) {
		case "title":
			return resolveEntry(entry).displayTitle.toLowerCase();
		case "score":
			return entry.score;
		case "communityRating":
			return entry.source?.communityRating ?? null;
		case "episodesWatched":
			return entry.progress;
		case "totalEpisodes":
			return resolveEntry(entry).displayTotalEpisodes;
		case "addedAt":
			return entry.timestamps.added;
		case "startedAt":
			return entry.timestamps.lastStarted;
		case "finishedAt":
			return entry.timestamps.lastFinished;
		case "aired":
			return entry.source?.airedFrom ?? null;
		default:
			return null;
	}
};

export function sortEntries(entries: Entry[], sort: EntrySort): Entry[] {
	if (sort.key === "custom") return sort.direction === "asc" ? entries : [...entries].reverse();

	const sign = sort.direction === "asc" ? 1 : -1;

	return [...entries].sort((a, b) => {
		const va = getSortValue(a, sort.key);
		const vb = getSortValue(b, sort.key);

		// entries missing the sorted value always sink to the bottom
		if (va == null && vb == null) return 0;
		if (va == null) return 1;
		if (vb == null) return -1;

		if (typeof va === "string" && typeof vb === "string") return va.localeCompare(vb) * sign;
		return ((va as number) - (vb as number)) * sign;
	});
}
