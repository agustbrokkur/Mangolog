export type RelationKind = "sequel" | "side_story" | "spin_off" | "adaptation" | "alternative" | "related";

export type Relation = {
	from: string;
	to: string;
	kind: RelationKind;
};
