import { MEDIA_TYPES, GROUP_TYPES, STATUSES } from "../models/animu.model.ts";
import type { CreateEntry, UpdateEntry, EntrySource } from "../models/entry.model.ts";
import type { CreateSection, UpdateSection } from "../models/section.model.ts";
import type { UpdateFranchise } from "../models/franchise.model.ts";
import type { Settings } from "../models/settings.model.ts";

export function isValidId(value: string): boolean {
    return typeof value === "string" && value.length > 0;
}

export function isValidIdArray(value: string[]): boolean {
    return Array.isArray(value) && value.every(item => typeof item === "string" && isValidId(item));
}

export function isValidString(value: string): boolean {
    return value !== null && value !== undefined && value.trim().length > 0;
}

export function isValidStringArray(value: string[]): boolean {
    return Array.isArray(value) && value.every(item => typeof item === "string");
}

export function isValidUrl(url: string | null): boolean {
    if (url !== null) {
        try {
            new URL(url);
        } catch {
            return false;
        }
    }
    return true;
}

export function isValidNumber(value: number): boolean {
    return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function isValidOptionalNumber(value: number | null): boolean {
    if (value === null) {
        return true;
    }

    return Number.isFinite(value) && value >= 0;
}

export function validateSectionEntries(sectionEntryList: string[]): string | null {
    if (!isValidIdArray(sectionEntryList)) {
        return "Invalid section entry list";
    }
    return null;
}

export function validateUpdateSection(section: UpdateSection): string | null {
    if (!section || typeof section !== "object" || Array.isArray(section)) {
        return "Invalid section";
    }
    if (!isValidString(section.label)) {
        return "Invalid section label";
    }
    if (!GROUP_TYPES.includes(section.group)) {
        return "Invalid group type";
    }
    return null;
}

export function validateCreateSection(section: CreateSection): string | null {
    const validationMessage = validateUpdateSection(section);
    if (validationMessage !== null) {
        return validationMessage;
    }
    if (typeof section.system !== "boolean") {
        return "Invalid system flag";
    }

    if (section.kind === "manual") {
        return null;
    }
    if (section.kind === "smart") {
        if (!section.filter || typeof section.filter !== "object" || Array.isArray(section.filter)) {
            return "Invalid filter";
        }
        if (!section.sort || typeof section.sort !== "object") {
            return "Invalid sort";
        }
        if (section.sort.direction !== "asc" && section.sort.direction !== "desc") {
            return "Invalid sort direction";
        }
        return null;
    }
    return "Invalid section kind";
}

export function validateFranchiseEntries(franchiseEntryList: string[]): string | null {
    if (!isValidIdArray(franchiseEntryList)) {
        return "Invalid franchise entry list";
    }
    return null;
}

export function validateUpdateFranchise(franchise: UpdateFranchise): string | null {
    if (!franchise || typeof franchise !== "object" || Array.isArray(franchise)) {
        return "Invalid franchise";
    }
    if (!isValidString(franchise.title)) {
        return "Invalid franchise title";
    }
    if (!isValidUrl(franchise.coverUrl)) {
        return "Invalid coverUrl";
    }
    return null;
}

export function validateCreateEntry(entry: CreateEntry): string | null {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        return "Invalid entry";
    }
    if (!MEDIA_TYPES.includes(entry.mediaType)) {
        return "Invalid media type";
    }
    if (entry.status !== undefined && !STATUSES.includes(entry.status)) {
        return "Invalid status";
    }
    if (typeof entry.favorite !== "boolean") {
        return "Invalid favorite";
    }
    if (entry.note !== null && !isValidString(entry.note)) {
        return "Invalid note";
    }
    if (!isValidOptionalNumber(entry.score)) {
        return "Invalid score";
    }
    if (!isValidOptionalNumber(entry.progress)) {
        return "Invalid progress";
    }
    if (!isValidString(entry.title)) {
        return "Invalid title";
    }
    if (entry.coverOverride !== null && !isValidUrl(entry.coverOverride)) {
        return "Invalid coverOverride";
    }
    if (!isValidOptionalNumber(entry.totalEpisodesOverride)) {
        return "Invalid totalEpisodesOverride";
    }
    if (!isValidStringArray(entry.tags)) {
        return "Invalid tags";
    }
    return null;
}

export function validateUpdateEntry(entry: UpdateEntry): string | null {
    const validationMessage = validateCreateEntry(entry);
    if (validationMessage !== null) {
        return validationMessage;
    }
    if (!STATUSES.includes(entry.status)) {
        return "Invalid status";
    }

    const t = entry.timestamps;
    if (!t || typeof t !== "object") {
        return "Invalid timestamps";
    }
    if (!isValidNumber(t.added)) return "Invalid timestamps.added";
    if (!isValidNumber(t.updated)) return "Invalid timestamps.updated";
    if (!isValidOptionalNumber(t.firstStarted)) return "Invalid timestamps.firstStarted";
    if (!isValidOptionalNumber(t.lastStarted)) return "Invalid timestamps.lastStarted";
    if (!isValidOptionalNumber(t.firstFinished)) return "Invalid timestamps.firstFinished";
    if (!isValidOptionalNumber(t.lastFinished)) return "Invalid timestamps.lastFinished";
    if (!isValidNumber(t.finishedCount)) return "Invalid timestamps.finishedCount";
    if (!isValidOptionalNumber(t.lastDropped)) return "Invalid timestamps.lastDropped";

    return null;
}

export function validateSettings(settings: Settings): string | null {
    if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
        return "Invalid settings";
    }
    if (!STATUSES.includes(settings.defaultEntryStatus)) {
        return "Invalid defaultEntryStatus";
    }
    if (!settings.defaultSort || typeof settings.defaultSort !== "object") {
        return "Invalid defaultSort";
    }
    if (!isValidString(settings.defaultSort.key)) {
        return "Invalid defaultSort.key";
    }
    if (settings.defaultSort.direction !== "asc" && settings.defaultSort.direction !== "desc") {
        return "Invalid defaultSort.direction";
    }
    if (!["detail", "list", "grid"].includes(settings.defaultViewMode)) {
        return "Invalid defaultViewMode";
    }
    if (!settings.autoBackup || typeof settings.autoBackup !== "object") {
        return "Invalid autoBackup";
    }
    if (typeof settings.autoBackup.enabled !== "boolean") {
        return "Invalid autoBackup.enabled";
    }
    if (!Number.isFinite(settings.autoBackup.intervalHours) || settings.autoBackup.intervalHours <= 0) {
        return "Invalid autoBackup.intervalHours";
    }
    if (!Number.isFinite(settings.anilistRequestsPerMinute) || settings.anilistRequestsPerMinute <= 0) {
        return "Invalid anilistRequestsPerMinute";
    }
    return null;
}

export function validateEntrySource(entrySource: EntrySource): string | null {
    if (entrySource.provider !== "mal" && entrySource.provider !== "anilist" && entrySource.provider !== "legacy") {
        return "Invalid provider";
    }
    if (!isValidString(entrySource.externalId)) {
        return "Invalid externalId";
    }
    if (!isValidNumber(entrySource.fetchedAt)) {
        return "Invalid fetchedAt";
    }
    if (!isValidString(entrySource.englishTitle)) {
        return "Invalid English Title";
    }
    if (!isValidString(entrySource.japaneseTitle)) {
        return "Invalid Japanese Title";
    }
    if (!isValidString(entrySource.synopsis)) {
        return "Invalid Synopsis";
    }
    if (!isValidStringArray(entrySource.studios)) {
        return "Invalid studios list";
    }
    if (!isValidStringArray(entrySource.genres)) {
        return "Invalid genres list";
    }
    if (!isValidUrl(entrySource.coverUrl)) {
        return "Invalid coverUrl";
    }
    if (!isValidOptionalNumber(entrySource.totalEpisodes)) {
        return "Invalid totalEpisodes";
    }
    if (!isValidOptionalNumber(entrySource.communityRating)) {
        return "Invalid communityRating";
    }
    if (!isValidOptionalNumber(entrySource.airedFrom)) {
        return "Invalid airedFrom";
    }
    if (!isValidOptionalNumber(entrySource.airedTo)) {
        return "Invalid airedTo";
    }

    return null;
}
