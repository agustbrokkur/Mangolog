import type { EntrySource } from "./entry";

/** A single AniList search result — `format` is AniList's raw enum value (e.g. "TV", "MOVIE"), shown as a badge but not persisted. */
export type SourceCandidate = EntrySource & { format: string | null };
