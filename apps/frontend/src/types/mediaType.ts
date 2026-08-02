import { Disc, Film, Shapes, Star, Tv, type LucideIcon } from "lucide-react";

export type MediaType = "movie" | "tv" | "ova" | "special" | "other";
export const MEDIA_TYPES: MediaType[] = ["movie", "tv", "ova", "special", "other"] as const;

export const MEDIA_ICONS: Record<MediaType, LucideIcon> = {
	movie: Film,
	tv: Tv,
	ova: Disc,
	special: Star,
	other: Shapes,
};

export const MEDIA_TYPE_COLORS: Record<MediaType, string> = {
	movie: "#7F77DD",
	tv: "#1D9E75",
	ova: "#D4537E",
	special: "#FAC775",
	other: "#3FB6C7",
};

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
	movie: "Movie",
	tv: "TV",
	ova: "OVA",
	special: "Special",
	other: "Other",
};
