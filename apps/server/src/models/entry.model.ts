import type { EntryId } from "./ids.ts";
import type { MediaType, Status } from "./animu.model.ts";

/** A cache of provider data, not user input. Deleting every `source` on every entry must lose nothing the user typed. */
export type EntrySource = {
    provider: "mal" | "anilist" | "legacy"; // "legacy" = migrated, no real provider id
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
    /** 0 when never finished. Rewatch count is `finishedCount - 1`. */
    finishedCount: number;

    /** Most recent drop. Deliberately not counted — a drop is terminal. */
    lastDropped: number | null;
};

export type Entry = {
    id: EntryId;
    mediaType: MediaType;
    /** The title the user chose for this entry — used to search/match providers, not a fallback over `source`. Always set, even for custom entries with no `source` yet. */
    title: string;
    status: Status;
    favorite: boolean;
    note: string | null;
    score: number | null; // personal rating
    progress: number | null;

    coverOverride: string | null;
    /** null = defer to source.totalEpisodes */
    totalEpisodesOverride: number | null;
    tags: string[];

    source: EntrySource | null; // null for custom entries (VNs, western, unmatched)

    timestamps: EntryTimestamps;
};

/** True when `source` is either absent or a "legacy" placeholder with no real provider data — both cases a source fetch should treat as unfetched. */
export function needsSourceFetch(entry: Pick<Entry, "source">): boolean {
    return entry.source === null || entry.source.provider === "legacy";
}

export type ResolvedEntry = Entry & { displayTitle: string; displayCover: string | null };

export function resolve(entry: Entry): ResolvedEntry {
    return {
        ...entry,
        // `title` is always meant to be set — the fallback chain only protects entries written before this field existed.
        displayTitle: entry.title || entry.source?.englishTitle || entry.source?.japaneseTitle || "Untitled",
        displayCover: entry.coverOverride ?? entry.source?.coverUrl ?? null,
    };
}

// source is never client-settable — a new entry always starts with source: null (the cache is populated later).
// status defaults to "unsorted" server-side when omitted.
export type CreateEntry = Omit<Entry, "id" | "timestamps" | "source" | "status"> & { status?: Status };

// timestamps stay fully editable — status and timestamps are independent and neither is derived
// from the other here or anywhere else.
export type UpdateEntry = Omit<Entry, "id" | "source">;
