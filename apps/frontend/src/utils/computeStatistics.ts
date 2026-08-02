// utils/computeStatistics.ts
import type { Entry } from "../types/entry";
import { resolveEntry } from "../types/entry";
import type { Section } from "../types/section";
import { sectionEntryIds, sortedSections } from "../types/section";
import type { Relation } from "../types/relation";
import { ENTRY_STATUSES, STATUS_COLORS, STATUS_LABELS } from "../types/status";
import { MEDIA_TYPES, MEDIA_TYPE_COLORS } from "../types/mediaType";
import { GROUP_COLOR_VARS } from "../types/groupType";

export interface StatBreakdownSlice {
	key: string;
	label: string;
	count: number;
	color: string;
}

export interface ActivityMonth {
	month: string; // "2026-07"
	label: string; // "Jul 2026"
	added: number;
	finished: number;
}

export interface RankedCount {
	label: string;
	count: number;
	color?: string;
}

export interface RatingBucket {
	rating: number;
	count: number;
}

export interface Statistics {
	totalEntries: number;
	totalEpisodesWatched: number;
	averageRating: number | null;
	favoritesCount: number;
	ratedCount: number;
	genreCount: number;
	studioCount: number;
	totalRewatches: number;
	metadataCoverage: number; // 0-100, % of entries with a non-null source
	statusBreakdown: StatBreakdownSlice[];
	mediaTypeBreakdown: StatBreakdownSlice[];
	sectionBreakdown: RankedCount[];
	activityOverTime: ActivityMonth[];
	topGenres: RankedCount[];
	topStudios: RankedCount[];
	topFranchises: RankedCount[];
	topRewatches: RankedCount[];
	ratingDistribution: RatingBucket[];
}

const MONTH_LABEL = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });
const ACTIVITY_MONTHS = 12;

function monthKey(timestamp: number): string {
	const d = new Date(timestamp);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function topN(counts: Map<string, number>, n: number): RankedCount[] {
	return Array.from(counts.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, n)
		.map(([label, count]) => ({ label, count }));
}

/**
 * Groups entries into franchises via connected components over `relations`.
 * This over-merges (one loose "related" edge fuses two unrelated clusters) — it's a rough
 * clustering for the stats page, not the curated `Franchise` records the backend can store.
 */
function computeFranchises(entries: Entry[], relations: Relation[], n: number): RankedCount[] {
	const byId = new Map(entries.map((e) => [e.id, e]));
	const parent = new Map<string, string>();

	const find = (id: string): string => {
		let root = id;
		while (parent.get(root) !== root) root = parent.get(root) ?? root;
		let cur = id;
		while (parent.get(cur) !== root) {
			const next = parent.get(cur) ?? root;
			parent.set(cur, root);
			cur = next;
		}
		return root;
	};

	const union = (a: string, b: string) => {
		const ra = find(a);
		const rb = find(b);
		if (ra !== rb) parent.set(ra, rb);
	};

	for (const entry of entries) parent.set(entry.id, entry.id);
	for (const relation of relations) {
		if (byId.has(relation.from) && byId.has(relation.to)) union(relation.from, relation.to);
	}

	const clusters = new Map<string, Entry[]>();
	for (const entry of entries) {
		const root = find(entry.id);
		const cluster = clusters.get(root);
		if (cluster) cluster.push(entry);
		else clusters.set(root, [entry]);
	}

	return Array.from(clusters.values())
		.filter((cluster) => cluster.length > 1)
		.sort((a, b) => b.length - a.length)
		.slice(0, n)
		.map((cluster) => {
			const earliest = cluster.reduce((oldest, e) =>
				(e.source?.airedFrom ?? e.timestamps.added) < (oldest.source?.airedFrom ?? oldest.timestamps.added) ? e : oldest,
			);
			return { label: resolveEntry(earliest).displayTitle, count: cluster.length };
		});
}

export function computeStatistics(entriesById: Record<string, Entry>, sectionsById: Record<string, Section>, relations: Relation[]): Statistics {
	const entries = Object.values(entriesById);
	const sections = sortedSections(sectionsById);
	const totalEntries = entries.length;
	const totalEpisodesWatched = entries.reduce((sum, e) => sum + (e.progress ?? 0), 0);
	const favoritesCount = entries.filter((e) => e.favorite).length;

	const ratedEntries = entries.filter((e): e is Entry & { score: number } => e.score != null);
	const averageRating = ratedEntries.length > 0 ? ratedEntries.reduce((sum, e) => sum + e.score, 0) / ratedEntries.length : null;

	const statusCounts = new Map(ENTRY_STATUSES.map((status) => [status, 0]));
	for (const entry of entries) {
		statusCounts.set(entry.status, (statusCounts.get(entry.status) ?? 0) + 1);
	}
	const statusBreakdown: StatBreakdownSlice[] = ENTRY_STATUSES.map((status) => ({
		key: status,
		label: STATUS_LABELS[status],
		count: statusCounts.get(status) ?? 0,
		color: STATUS_COLORS[status],
	}));

	const mediaTypeCounts = new Map(MEDIA_TYPES.map((type) => [type, 0]));
	for (const entry of entries) {
		mediaTypeCounts.set(entry.mediaType, (mediaTypeCounts.get(entry.mediaType) ?? 0) + 1);
	}
	const mediaTypeBreakdown: StatBreakdownSlice[] = MEDIA_TYPES.map((type) => ({
		key: type,
		label: type.toUpperCase(),
		count: mediaTypeCounts.get(type) ?? 0,
		color: MEDIA_TYPE_COLORS[type],
	}));

	const months: ActivityMonth[] = [];
	const now = new Date();
	for (let i = ACTIVITY_MONTHS - 1; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		const key = monthKey(d.getTime());
		months.push({ month: key, label: MONTH_LABEL.format(d), added: 0, finished: 0 });
	}
	const monthIndex = new Map(months.map((m, i) => [m.month, i]));
	for (const entry of entries) {
		const addedIdx = monthIndex.get(monthKey(entry.timestamps.added));
		if (addedIdx != null) months[addedIdx].added += 1;

		if (entry.timestamps.lastFinished != null) {
			const finishedIdx = monthIndex.get(monthKey(entry.timestamps.lastFinished));
			if (finishedIdx != null) months[finishedIdx].finished += 1;
		}
	}

	const genreCounts = new Map<string, number>();
	const studioCounts = new Map<string, number>();
	for (const entry of entries) {
		for (const genre of entry.source?.genres ?? []) genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);
		for (const studio of entry.source?.studios ?? []) studioCounts.set(studio, (studioCounts.get(studio) ?? 0) + 1);
	}

	const sectionBreakdown: RankedCount[] = [...sections]
		.sort((a, b) => sectionEntryIds(b).length - sectionEntryIds(a).length)
		.map((section) => ({ label: section.label, count: sectionEntryIds(section).length, color: GROUP_COLOR_VARS[section.group] }));

	const topFranchises = computeFranchises(entries, relations, 8);

	const rewatchCounts = new Map<string, number>();
	let totalRewatches = 0;
	for (const entry of entries) {
		const rewatches = Math.max(0, entry.timestamps.finishedCount - 1);
		if (rewatches > 0) rewatchCounts.set(resolveEntry(entry).displayTitle, rewatches);
		totalRewatches += rewatches;
	}
	const topRewatches = topN(rewatchCounts, 8);

	const sourcedCount = entries.filter((e) => e.source != null).length;
	const metadataCoverage = totalEntries > 0 ? Math.round((sourcedCount / totalEntries) * 100) : 0;

	const ratingCounts = new Map<number, number>();
	for (const entry of ratedEntries) {
		const bucket = Math.round(entry.score);
		ratingCounts.set(bucket, (ratingCounts.get(bucket) ?? 0) + 1);
	}
	const ratingDistribution: RatingBucket[] = Array.from({ length: 10 }, (_, i) => i + 1).map((rating) => ({
		rating,
		count: ratingCounts.get(rating) ?? 0,
	}));

	return {
		totalEntries,
		totalEpisodesWatched,
		averageRating,
		favoritesCount,
		ratedCount: ratedEntries.length,
		genreCount: genreCounts.size,
		studioCount: studioCounts.size,
		totalRewatches,
		metadataCoverage,
		statusBreakdown,
		mediaTypeBreakdown,
		sectionBreakdown,
		activityOverTime: months,
		topGenres: topN(genreCounts, 8),
		topStudios: topN(studioCounts, 8),
		topFranchises,
		topRewatches,
		ratingDistribution,
	};
}
