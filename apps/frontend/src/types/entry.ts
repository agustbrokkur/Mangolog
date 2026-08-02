import type { MediaType } from "./mediaType";
import type { Status } from "./status";

export type EntrySource = {
	provider: "mal" | "anilist" | "legacy";
	externalId: string;
	fetchedAt: number;

	englishTitle: string;
	japaneseTitle: string;
	synopsis: string;

	studios: string[];
	genres: string[];

	coverUrl: string | null;
	totalEpisodes: number | null;
	communityRating: number | null;

	airedFrom: number | null;
	airedTo: number | null;
};

export type EntryTimestamps = {
	added: number;
	updated: number;

	firstStarted: number | null;
	lastStarted: number | null;

	firstFinished: number | null;
	lastFinished: number | null;
	finishedCount: number;

	lastDropped: number | null;
};

export type Entry = {
	id: string;
	mediaType: MediaType;
	/** The title the user chose for this entry — used to search/match providers, not a fallback over `source`. Always set, even for custom entries with no `source` yet. */
	title: string;
	status: Status;
	favorite: boolean;
	note: string | null;

	score: number | null;
	progress: number | null;

	coverOverride: string | null;
	/** null = defer to source.totalEpisodes */
	totalEpisodesOverride: number | null;
	tags: string[];

	source: EntrySource | null;

	timestamps: EntryTimestamps;
};

export type UpdateEntry = Omit<Entry, "id" | "source">;

/** True when `source` is either absent or a "legacy" placeholder with no real provider data — both cases a source fetch should treat as unfetched. */
export function needsSourceFetch(entry: Pick<Entry, "source">): boolean {
	return entry.source === null || entry.source.provider === "legacy";
}

export type ResolvedEntry = Entry & { displayTitle: string; displayCover: string | null; displayTotalEpisodes: number | null };

export function resolveEntry(entry: Entry): ResolvedEntry {
	return {
		...entry,
		// `title` is always meant to be set — the fallback chain only protects entries written before this field existed.
		displayTitle: entry.title || entry.source?.englishTitle || entry.source?.japaneseTitle || "Untitled",
		displayCover: entry.coverOverride ?? entry.source?.coverUrl ?? null,
		displayTotalEpisodes: entry.totalEpisodesOverride ?? entry.source?.totalEpisodes ?? null,
	};
}
