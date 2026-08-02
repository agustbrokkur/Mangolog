// types/filters.ts
import type { MediaType } from "./mediaType";
import type { Status } from "./status";

export interface NumberRange {
	min: number | null;
	max: number | null;
}

export interface DateRange {
	from: number | null;
	to: number | null;
}

export interface EntryFilters {
	mediaTypes: MediaType[];
	statuses: Status[];
	genres: string[];
	studios: string[];
	tags: string[];
	favoriteOnly: boolean;

	episodeRange: NumberRange; // resolved total episodes (totalEpisodesOverride ?? source.totalEpisodes)
	scoreRange: NumberRange; // your own score (entry.score)

	airedRange: DateRange; // entry.source.airedFrom
	startedRange: DateRange; // entry.timestamps.lastStarted
	finishedRange: DateRange; // entry.timestamps.lastFinished
	droppedRange: DateRange; // entry.timestamps.lastDropped
}

export const EMPTY_RANGE: NumberRange = { min: null, max: null };
export const EMPTY_DATE_RANGE: DateRange = { from: null, to: null };

export const EMPTY_FILTERS: EntryFilters = {
	mediaTypes: [],
	statuses: [],
	genres: [],
	studios: [],
	tags: [],
	favoriteOnly: false,
	episodeRange: EMPTY_RANGE,
	scoreRange: EMPTY_RANGE,
	airedRange: EMPTY_DATE_RANGE,
	startedRange: EMPTY_DATE_RANGE,
	finishedRange: EMPTY_DATE_RANGE,
	droppedRange: EMPTY_DATE_RANGE,
};

export const isRangeActive = (r: NumberRange) => r.min != null || r.max != null;
export const isDateRangeActive = (r: DateRange) => r.from != null || r.to != null;

export function isFiltersActive(filters: EntryFilters): boolean {
	return (
		filters.mediaTypes.length > 0 ||
		filters.statuses.length > 0 ||
		filters.genres.length > 0 ||
		filters.studios.length > 0 ||
		filters.tags.length > 0 ||
		filters.favoriteOnly ||
		isRangeActive(filters.episodeRange) ||
		isRangeActive(filters.scoreRange) ||
		isDateRangeActive(filters.airedRange) ||
		isDateRangeActive(filters.startedRange) ||
		isDateRangeActive(filters.finishedRange) ||
		isDateRangeActive(filters.droppedRange)
	);
}
