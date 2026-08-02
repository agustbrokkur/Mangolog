import type { EntryId, FranchiseId, SectionId } from "./ids.ts";
import type { Entry } from "./entry.model.ts";
import type { Section } from "./section.model.ts";
import type { Franchise } from "./franchise.model.ts";
import type { Relation, RelationKind } from "./relation.model.ts";

export type GroupType = 'watching' | 'watched' | 'backlog' | 'other';
export const GROUP_TYPES: GroupType[] = ['watching', 'watched', 'backlog', 'other'] as const;

export type MediaType = 'movie' | "tv" | "ova" | "special" | "other";
export const MEDIA_TYPES: MediaType[] = ['movie', "tv", "ova", "special", "other"] as const;

// Single source of truth for watch state. GroupType stays purely presentational (sidebar grouping/colour only).
export type Status = "unsorted" | "backlog" | "watching" | "on_hold" | "watched" | "dropped";
export const STATUSES: Status[] = ["unsorted", "backlog", "watching", "on_hold", "watched", "dropped"] as const;

export type Animu = {
    entries: Record<EntryId, Entry>;
    sections: Record<SectionId, Section>;
    franchises: Record<FranchiseId, Franchise>;
    relations: Relation[];
};

export type Neighbour = { id: EntryId; kind: RelationKind; inverse: boolean };

export type AnimuIndex = {
    sectionsByEntry: Map<EntryId, SectionId[]>;
    franchiseByEntry: Map<EntryId, FranchiseId>;
    neighbours: Map<EntryId, Neighbour[]>;
};

/** Derived, never persisted. Containers own ordered membership; reverse lookups are derived — never store both directions. */
export function buildIndex(data: Animu): AnimuIndex {
    const sectionsByEntry = new Map<EntryId, SectionId[]>();
    for (const section of Object.values(data.sections)) {
        if (section.kind !== "manual") continue;
        for (const entryId of section.entryIds) {
            const list = sectionsByEntry.get(entryId);
            if (list) list.push(section.id);
            else sectionsByEntry.set(entryId, [section.id]);
        }
    }

    const franchiseByEntry = new Map<EntryId, FranchiseId>();
    for (const franchise of Object.values(data.franchises)) {
        for (const entryId of franchise.entryIds) {
            franchiseByEntry.set(entryId, franchise.id);
        }
    }

    const neighbours = new Map<EntryId, Neighbour[]>();
    const addNeighbour = (of: EntryId, neighbour: Neighbour) => {
        const list = neighbours.get(of);
        if (list) list.push(neighbour);
        else neighbours.set(of, [neighbour]);
    };
    for (const relation of data.relations) {
        addNeighbour(relation.from, { id: relation.to, kind: relation.kind, inverse: false });
        addNeighbour(relation.to, { id: relation.from, kind: relation.kind, inverse: true });
    }

    return { sectionsByEntry, franchiseByEntry, neighbours };
}
