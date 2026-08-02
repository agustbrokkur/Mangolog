// types/status.ts

export type Status = "unsorted" | "backlog" | "watching" | "on_hold" | "watched" | "dropped";

export const ENTRY_STATUSES: Status[] = ["unsorted", "backlog", "watching", "on_hold", "watched", "dropped"];

export const STATUS_LABELS: Record<Status, string> = {
	unsorted: "Unsorted",
	backlog: "Backlog",
	watching: "Watching",
	on_hold: "On Hold",
	watched: "Watched",
	dropped: "Dropped",
};

// watching/watched intentionally match GROUP_COLORS in types/groupType.ts (the sidebar's colors for those same buckets) so the two color systems agree.
export const STATUS_COLORS: Record<Status, string> = {
	unsorted: "#9ca3af",
	backlog: "#fbbf24",
	watching: "#378ADD",
	on_hold: "#c084fc",
	watched: "#5DCAA5",
	dropped: "#f87171",
};
