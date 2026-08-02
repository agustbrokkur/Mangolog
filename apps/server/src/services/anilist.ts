import type { MediaType } from "../models/animu.model.ts";
import type { EntrySource } from "../models/entry.model.ts";
import { readSettings } from "../utils/fileUtils.ts";

const ANILIST_ENDPOINT = "https://graphql.anilist.co";

type AniListDate = { year: number | null; month: number | null; day: number | null };

type AniListMedia = {
    id: number;
    title: { romaji: string | null; english: string | null; native: string | null };
    format: string | null;
    episodes: number | null;
    coverImage: { extraLarge: string | null; large: string | null } | null;
    studios: { nodes: { name: string }[] } | null;
    genres: string[] | null;
    averageScore: number | null;
    startDate: AniListDate | null;
    endDate: AniListDate | null;
    description: string | null;
};

export type SourceCandidate = EntrySource & { format: string | null };

/** Every field but the AniList-only `format` badge — the shape actually persisted onto an entry. */
export function toEntrySource(candidate: SourceCandidate): EntrySource {
    const { format: _format, ...source } = candidate;
    return source;
}

const SEARCH_QUERY = `
query ($search: String) {
    Page(perPage: 40) {
        media(search: $search, type: ANIME, sort: SEARCH_MATCH) {
            id
            title { romaji english native }
            format
            episodes
            coverImage { extraLarge large }
            studios(isMain: true) { nodes { name } }
            genres
            averageScore
            startDate { year month day }
            endDate { year month day }
            description(asHtml: false)
        }
    }
}`;

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Every AniList call funnels through this one promise chain so manual search and batch jobs
// share a single throttle and never combine into a burst against AniList's rate limit.
let queue: Promise<void> = Promise.resolve();
let lastCallAt = 0;

function enqueue<T>(task: () => Promise<T>): Promise<T> {
    const run = queue.then(async () => {
        const intervalMs = 60000 / Math.max(1, readSettings().anilistRequestsPerMinute);
        const wait = lastCallAt + intervalMs - Date.now();
        if (wait > 0) await sleep(wait);
        lastCallAt = Date.now();
        return task();
    });
    queue = run.then(
        () => undefined,
        () => undefined, // keep the chain alive even if a task throws
    );
    return run;
}

async function request<T>(query: string, variables: Record<string, unknown>, attempt = 0): Promise<T> {
    const res = await fetch(ANILIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ query, variables }),
    });

    if (res.status === 429 && attempt < 1) {
        const retryAfterSeconds = Number(res.headers.get("retry-after")) || 60;
        await sleep(retryAfterSeconds * 1000);
        return request<T>(query, variables, attempt + 1);
    }

    if (!res.ok) {
        throw new Error(`AniList request failed with status ${res.status}`);
    }

    // Back off further if we're about to exhaust the current rate-limit window.
    const remaining = Number(res.headers.get("x-ratelimit-remaining"));
    if (Number.isFinite(remaining) && remaining <= 1) {
        await sleep((60000 / Math.max(1, readSettings().anilistRequestsPerMinute)) * 5);
    }

    const json = (await res.json()) as { data: T; errors?: { message: string }[] };
    if (json.errors) {
        throw new Error(json.errors[0]?.message ?? "AniList GraphQL error");
    }
    return json.data;
}

function stripHtml(text: string): string {
    return text.replace(/<[^>]*>/g, "").trim();
}

function toEpoch(date: AniListDate | null): number | null {
    if (!date || date.year == null) return null;
    return Date.UTC(date.year, (date.month ?? 1) - 1, date.day ?? 1);
}

function mapToCandidate(media: AniListMedia): SourceCandidate {
    return {
        provider: "anilist",
        externalId: String(media.id),
        fetchedAt: Date.now(),
        englishTitle: media.title.english ?? media.title.romaji ?? "",
        japaneseTitle: media.title.native ?? "",
        synopsis: stripHtml(media.description ?? ""),
        studios: media.studios?.nodes.map((n) => n.name) ?? [],
        genres: media.genres ?? [],
        coverUrl: media.coverImage?.extraLarge ?? media.coverImage?.large ?? null,
        totalEpisodes: media.episodes ?? null,
        communityRating: media.averageScore != null ? media.averageScore / 10 : null,
        airedFrom: toEpoch(media.startDate),
        airedTo: toEpoch(media.endDate),
        format: media.format ?? null,
    };
}

export async function searchAnilist(query: string): Promise<SourceCandidate[]> {
    if (!query.trim()) return [];
    const data = await enqueue(() => request<{ Page: { media: AniListMedia[] } }>(SEARCH_QUERY, { search: query }));
    return data.Page.media.map(mapToCandidate);
}

const FORMATS_BY_MEDIA_TYPE: Record<MediaType, string[]> = {
    tv: ["TV", "TV_SHORT"],
    movie: ["MOVIE"],
    ova: ["OVA", "ONA"],
    special: ["SPECIAL", "MUSIC"],
    other: [],
};

/** Never returns null when `candidates` is non-empty — AniList's own SEARCH_MATCH ranking is the fallback, we just prefer a format-matching result first. */
export function pickBestMatch(candidates: SourceCandidate[], mediaType: MediaType): SourceCandidate | null {
    if (candidates.length === 0) return null;

    const preferredFormats = FORMATS_BY_MEDIA_TYPE[mediaType];
    if (preferredFormats.length > 0) {
        const formatMatch = candidates.find((c) => c.format != null && preferredFormats.includes(c.format));
        if (formatMatch) return formatMatch;
    }

    return candidates[0];
}
