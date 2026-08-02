// utils/applyEntryFilters.ts
import type { Entry } from "../types/entry";
import { resolveEntry } from "../types/entry";
import type { EntryFilters, NumberRange, DateRange } from "../types/filters";
import { isFiltersActive } from "../types/filters";

const inRange = (value: number | null, range: NumberRange) => {
	if (value == null) return !(range.min != null || range.max != null); // exclude unknowns if range is active
	if (range.min != null && value < range.min) return false;
	if (range.max != null && value > range.max) return false;
	return true;
};

const inDateRange = (value: number | null, range: DateRange) => {
	if (value == null) return !(range.from != null || range.to != null);
	if (range.from != null && value < range.from) return false;
	if (range.to != null && value > range.to) return false;
	return true;
};

export function applyEntryFilters(entries: Entry[], filters: EntryFilters): Entry[] {
	if (!isFiltersActive(filters)) return entries;

	return entries.filter((entry) => {
		if (filters.mediaTypes.length > 0 && !filters.mediaTypes.includes(entry.mediaType)) return false;
		if (filters.statuses.length > 0 && !filters.statuses.includes(entry.status)) return false;
		if (filters.favoriteOnly && !entry.favorite) return false;
		if (filters.genres.length > 0 && !filters.genres.some((g) => entry.source?.genres.includes(g))) return false;
		if (filters.studios.length > 0 && !filters.studios.some((s) => entry.source?.studios.includes(s))) return false;
		if (filters.tags.length > 0 && !filters.tags.some((t) => entry.tags?.includes(t))) return false;

		if (!inRange(resolveEntry(entry).displayTotalEpisodes, filters.episodeRange)) return false;
		if (!inRange(entry.score, filters.scoreRange)) return false;

		if (!inDateRange(entry.source?.airedFrom ?? null, filters.airedRange)) return false;
		if (!inDateRange(entry.timestamps.lastStarted, filters.startedRange)) return false;
		if (!inDateRange(entry.timestamps.lastFinished, filters.finishedRange)) return false;
		if (!inDateRange(entry.timestamps.lastDropped, filters.droppedRange)) return false;

		return true;
	});
}
