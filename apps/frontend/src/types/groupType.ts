import { PlayCircle, CheckCircle2, Layers, type LucideIcon, Diamond } from "lucide-react";

export type GroupType = "watching" | "watched" | "backlog" | "other";
export const GROUP_TYPES: GroupType[] = ["watching", "backlog", "watched", "other"] as const;
export const GROUP_TYPE_MAPPINGS = {
	watching: "In Progress",
	backlog: "Backlog",
	watched: "Watched",
	other: "Other",
} as const;

export const GROUP_ICONS: Record<GroupType, LucideIcon> = {
	watching: PlayCircle,
	backlog: Layers,
	watched: CheckCircle2,
	other: Diamond,
};

export const GROUP_COLORS: Record<GroupType, string> = {
	watching: "#378ADD",
	backlog: "#EF9F27",
	watched: "#5DCAA5",
	other: "#5B5FC7",
};

export const GROUP_COLOR_VARS: Record<GroupType, string> = {
	watching: "var(--color-group-watching)",
	backlog: "var(--color-group-backlog)",
	watched: "var(--color-group-watched)",
	other: "var(--color-group-other)",
};
