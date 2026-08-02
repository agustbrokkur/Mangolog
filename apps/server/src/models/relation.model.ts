import type { EntryId } from "./ids.ts";

export type RelationKind = "sequel" | "side_story" | "spin_off" | "adaptation" | "alternative" | "related";
export const RELATION_KINDS: RelationKind[] = ["sequel", "side_story", "spin_off", "adaptation", "alternative", "related"] as const;

export const INVERSE_LABEL: Record<RelationKind, string> = {
    sequel: "prequel",
    side_story: "main_story",
    spin_off: "parent",
    adaptation: "source",
    alternative: "alternative",
    related: "related",
};

/** Stored once, in one direction only. Identified by (from, to, kind) — no id of its own. The reverse edge is generated when the index is built, never persisted. */
export type Relation = {
    from: EntryId;
    to: EntryId;
    kind: RelationKind;
};
