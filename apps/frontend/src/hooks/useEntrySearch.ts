// hooks/useEntrySearch.ts
import { useMemo } from "react";
import Fuse from "fuse.js";
import type { Entry } from "../types/entry";
import { resolveEntry } from "../types/entry";

type SearchableEntry = Entry & { displayTitle: string };

const QUICK_KEYS = [
	{ name: "displayTitle", weight: 0.6 },
	{ name: "source.englishTitle", weight: 0.25 },
	{ name: "source.japaneseTitle", weight: 0.15 },
];

const FULL_KEYS = [
	{ name: "displayTitle", weight: 0.35 },
	{ name: "source.englishTitle", weight: 0.2 },
	{ name: "source.japaneseTitle", weight: 0.15 },
	{ name: "source.genres", weight: 0.1 },
	{ name: "source.studios", weight: 0.08 },
	{ name: "note", weight: 0.07 },
	{ name: "source.synopsis", weight: 0.05 },
];

export type SearchScope = "quick" | "full";

function getFieldValues(entry: SearchableEntry, scope: SearchScope): string[] {
	const keys = scope === "quick" ? QUICK_KEYS : FULL_KEYS;
	return keys.flatMap(({ name }) => {
		const value = name.split(".").reduce<any>((obj, key) => obj?.[key], entry);
		if (value == null) return [];
		return Array.isArray(value) ? value : [String(value)];
	});
}

export function useEntrySearch(entries: Entry[], query: string, scope: SearchScope = "quick") {
	const searchable = useMemo<SearchableEntry[]>(() => entries.map((entry) => ({ ...entry, displayTitle: resolveEntry(entry).displayTitle })), [entries]);

	const fuse = useMemo(() => {
		return new Fuse(searchable, {
			keys: scope === "quick" ? QUICK_KEYS : FULL_KEYS,
			threshold: 0.35,
			ignoreLocation: true,
		});
	}, [searchable, scope]);

	return useMemo(() => {
		const trimmed = query.trim();

		if (trimmed.length < 2) return entries;

		if (trimmed.length < 3) {
			const lower = trimmed.toLowerCase();
			return searchable.filter((entry) => getFieldValues(entry, scope).some((value) => value.toLowerCase().includes(lower)));
		}

		return fuse.search(trimmed).map((result) => result.item);
	}, [fuse, query, entries, searchable, scope]);
}
