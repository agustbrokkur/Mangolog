// types/settings.ts
import type { Status } from "./status";
import type { EntrySort } from "./sort";
import type { MediaType } from "./mediaType";
import type { ViewMode } from "../components/entry/EntryRenderer";

export type Settings = {
	defaultEntryStatus: Status;
	defaultSort: EntrySort;
	defaultViewMode: ViewMode;
	autoBackup: { enabled: boolean; intervalHours: number };
	/** Throttle for AniList requests (search + batch source fetching). AniList's normal limit is 90/min, currently degraded to 30/min. */
	anilistRequestsPerMinute: number;
};

export type Backup = { filename: string; createdAt: number; sizeBytes: number };

export type ImportRow = {
	title: string;
	status: Status;
	mediaType: MediaType;
	progress: number | null;
	totalEpisodesOverride: number | null;
	note: string | null;
	favorite: boolean;
	matchedEntryId: string | null;
};
