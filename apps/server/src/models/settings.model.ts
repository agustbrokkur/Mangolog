import type { Status } from "./animu.model.ts";

// defaultSort is an opaque passthrough — the frontend owns the SortKey enum (same decoupling
// section.model.ts's own SortKey already has from the frontend's sort types).
// Mirrors the frontend's ViewMode ("detail" | "list" | "grid") without importing frontend types.
export type ViewMode = "detail" | "list" | "grid";

export type Settings = {
    defaultEntryStatus: Status;
    defaultSort: { key: string; direction: "asc" | "desc" };
    defaultViewMode: ViewMode;
    autoBackup: { enabled: boolean; intervalHours: number };
    /** Throttle for AniList GraphQL requests (search + batch source fetching). AniList's normal limit is 90/min, currently degraded to 30/min — keep this under that. */
    anilistRequestsPerMinute: number;
};

export const DEFAULT_SETTINGS: Settings = {
    defaultEntryStatus: "unsorted",
    defaultSort: { key: "custom", direction: "asc" },
    defaultViewMode: "grid",
    autoBackup: { enabled: false, intervalHours: 24 },
    anilistRequestsPerMinute: 24,
};
