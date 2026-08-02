import type { GroupType } from "./groupType";
import type { MediaType } from "./mediaType";
import type { Status } from "./status";

export type SmartSectionFilter = {
	status?: Status[];
	mediaType?: MediaType[];
	favorite?: boolean;
	genres?: string[];
	studios?: string[];
	airedFrom?: number;
	airedTo?: number;
	unsectioned?: boolean;
};

export type SmartSectionSortKey = "title" | "score" | "communityRating" | "added" | "lastStarted" | "lastFinished" | "finishedCount" | "airedFrom" | "progress";
export type SmartSectionSort = { key: SmartSectionSortKey; direction: "asc" | "desc" };

type SectionBase = {
	id: string;
	label: string;
	group: GroupType;
	system: boolean;
	order: number;
};

export type ManualSection = SectionBase & { kind: "manual"; entryIds: string[] };
export type SmartSection = SectionBase & { kind: "smart"; filter: SmartSectionFilter; sort: SmartSectionSort };
export type Section = ManualSection | SmartSection;

export const isManualSection = (s: Section): s is ManualSection => s.kind === "manual";
export const isSmartSection = (s: Section): s is SmartSection => s.kind === "smart";

/** Frontend section creation is manual-only for now — smart-section filters aren't evaluated on the frontend yet. */
export type CreateSection = { label: string; group: GroupType; system: false; kind: "manual" };
export type UpdateSection = Pick<Section, "label" | "group">;

/**
 * Manual sections store membership directly; smart sections derive it from `filter`,
 * which isn't evaluated on the frontend yet — treated as empty until that lands.
 */
export function sectionEntryIds(section: Section): string[] {
	return isManualSection(section) ? section.entryIds : [];
}

/** Sections come from the wire as a Record keyed by id — this is the one place that flattens it into a display-ordered list. */
export function sortedSections(sections: Record<string, Section>): Section[] {
	return Object.values(sections).sort((a, b) => a.order - b.order);
}
