export type EntryId = string & { readonly __brand: "Entry" };
export type SectionId = string & { readonly __brand: "Section" };
export type FranchiseId = string & { readonly __brand: "Franchise" };

// No I, L, O, U — avoids visual confusion with 1/0.
const CROCKFORD_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function randomSuffix(length = 16): string {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);

    let result = "";
    for (const byte of bytes) {
        // 32 divides 256 evenly, so `& 31` stays uniform; `%` would not for a non-power-of-two alphabet.
        result += CROCKFORD_ALPHABET[byte & 31];
    }
    return result;
}

export function newEntryId(): EntryId {
    return `ent_${randomSuffix()}` as EntryId;
}

export function newSectionId(): SectionId {
    return `sec_${randomSuffix()}` as SectionId;
}

export function newFranchiseId(): FranchiseId {
    return `fr_${randomSuffix()}` as FranchiseId;
}

export function systemSectionId(slug: string): SectionId {
    return `sec_sys_${slug}` as SectionId;
}

export function franchiseIdFor(seedEntryId: EntryId): FranchiseId {
    return `fr_of_${seedEntryId}` as FranchiseId;
}

export function asEntryId(raw: string): EntryId {
    return raw as EntryId;
}

export function asSectionId(raw: string): SectionId {
    return raw as SectionId;
}

export function asFranchiseId(raw: string): FranchiseId {
    return raw as FranchiseId;
}
