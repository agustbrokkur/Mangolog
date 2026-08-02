import type { EntryId, SectionId } from "./ids.ts";
import type { GroupType, MediaType, Status } from "./animu.model.ts";

export type EntryFilter = {
    status?: Status[];
    mediaType?: MediaType[];
    favorite?: boolean;
    genres?: string[];
    studios?: string[];
    airedFrom?: number;
    airedTo?: number;
    unsectioned?: boolean;
};

export type SortKey = "title" | "score" | "communityRating" | "added"
    | "lastStarted" | "lastFinished" | "finishedCount"
    | "airedFrom" | "progress";
export type SortSpec = { key: SortKey; direction: "asc" | "desc" };

type SectionBase = {
    id: SectionId;
    label: string;
    group: GroupType;
    system: boolean;
    order: number;
};

export type ManualSection = SectionBase & { kind: "manual"; entryIds: EntryId[] };
export type SmartSection = SectionBase & { kind: "smart"; filter: EntryFilter; sort: SortSpec };
export type Section = ManualSection | SmartSection;

export const isManual = (s: Section): s is ManualSection => s.kind === "manual";
export const isSmart = (s: Section): s is SmartSection => s.kind === "smart";

export type CreateManualSection = Omit<ManualSection, "id" | "order" | "entryIds">;
export type CreateSmartSection = Omit<SmartSection, "id" | "order">;
export type CreateSection = CreateManualSection | CreateSmartSection;

// label/group are shared by both branches, so Pick over the Section union is safe here —
// unlike entryIds/filter/sort, which only exist on one branch and would collapse the discriminant.
export type UpdateSection = Pick<Section, "label" | "group">;

export type SectionEntries = { entryIds: EntryId[] };
