// SourceManagerPage.tsx
import styled, { css, keyframes } from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Ban, ChevronDown, RefreshCw, Satellite } from "lucide-react";
import { useAnimu } from "../hooks/useAnime";
import { useApplyEntrySource, useBatchJob, useCancelBatchJob, useStartBatchFetch } from "../hooks/useSources";
import { needsSourceFetch, resolveEntry, type Entry } from "../types/entry";
import { MEDIA_ICONS, MEDIA_TYPE_LABELS } from "../types/mediaType";
import { GROUP_COLOR_VARS, GROUP_ICONS, GROUP_TYPES, GROUP_TYPE_MAPPINGS, type GroupType } from "../types/groupType";
import { sectionEntryIds, sortedSections, type Section } from "../types/section";
import type { SourceJob, SourceJobOutcome } from "../types/sourceJob";
import { ActionButton, Input } from "../components/entry/EntryDetailBody.styles";
import { SourceMatchPicker } from "../components/source/SourceMatchPicker";

const Wrap = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 100%;
`;

const Header = styled.div`
	position: sticky;
	top: 0;
	z-index: 10;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 12px;
	padding: 18px 24px;
	border-bottom: 1px solid var(--border);
	background: var(--bg-2);
`;

const HeaderLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 14px;
`;

const PageHeader = styled.h1`
	display: flex;
	align-items: center;
	gap: 12px;
	font-size: 22px;
	font-weight: 800;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: var(--text);
`;

const spin = `
	@keyframes source-manager-spin { to { transform: rotate(360deg); } }
`;

const Spinner = styled.span`
	${spin}
	display: inline-block;
	width: 11px;
	height: 11px;
	border: 2px solid color-mix(in srgb, var(--color-brand) 30%, transparent);
	border-top-color: var(--color-brand);
	border-radius: 50%;
	animation: source-manager-spin 0.7s linear infinite;
	flex-shrink: 0;
`;

const LiveBadge = styled.span`
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 12px;
	font-weight: 600;
	color: var(--color-brand);
	padding: 3px 10px;
	border-radius: 999px;
	border: 1px solid var(--color-brand);
	background: var(--color-brand-dim);
	white-space: nowrap;
`;

const HeaderActions = styled.div`
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
`;

const StatsBar = styled.div`
	display: flex;
	border-bottom: 1px solid var(--border);
	background: var(--bg-2);
`;

const Stat = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 3px;
	padding: 12px 8px;
	border-right: 1px solid var(--border);

	&:last-child {
		border-right: none;
	}
`;

const StatValue = styled.span<{ $color?: string }>`
	font-size: 22px;
	font-weight: 800;
	line-height: 1;
	color: ${({ $color }) => $color ?? "var(--text)"};
`;

const StatLabel = styled.span`
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.05em;
	text-transform: uppercase;
	color: var(--text-dimmer);
`;

const LostNotice = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 8px 24px;
	font-size: 12px;
	color: #f87171;
	background: rgba(248, 113, 113, 0.1);
	border-bottom: 1px solid rgba(248, 113, 113, 0.3);
`;

const LostNoticeDismiss = styled.button`
	background: none;
	border: none;
	color: inherit;
	font-size: 12px;
	font-weight: 700;
	cursor: pointer;
	padding: 0;

	&:hover {
		opacity: 0.8;
	}
`;

const FilterRow = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 12px 24px;
	border-bottom: 1px solid var(--border);
	flex-wrap: wrap;
`;

const FilterPills = styled.div`
	display: flex;
	gap: 6px;
	flex-wrap: wrap;
`;

const FilterPill = styled.button<{ $active: boolean }>`
	padding: 4px 12px;
	border-radius: 999px;
	font-size: 12px;
	font-weight: 600;
	font-family: inherit;
	border: 1px solid ${({ $active }) => ($active ? "var(--border-bright)" : "var(--border)")};
	background: ${({ $active }) => ($active ? "var(--bg-4)" : "none")};
	color: ${({ $active }) => ($active ? "var(--text)" : "var(--text-dimmer)")};
	cursor: pointer;

	&:hover {
		background: var(--bg-3);
		color: var(--text);
	}
`;

const SearchInputWrap = styled.div`
	flex: 1;
	min-width: 200px;
`;

const Body = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding: 20px 24px 48px;
`;

const Empty = styled.div`
	padding: 48px 0;
	text-align: center;
	color: var(--text-dimmer);
	font-size: 14px;
`;

// ── Group-type block (e.g. "In Progress", "Watched") — the sidebar's own grouping ──

const GroupBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const GroupBlockHeader = styled.div`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 10px;
	row-gap: 6px;
`;

const GroupBlockCollapse = styled.button<{ $collapsed: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	background: none;
	border: none;
	color: var(--text-dimmer);
	cursor: pointer;
	padding: 0;
	transform: rotate(${({ $collapsed }) => ($collapsed ? "-90deg" : "0deg")});
	transition: transform 150ms;

	&:hover {
		color: var(--text);
	}
`;

const GroupBlockLabel = styled.span<{ $color: string }>`
	font-size: 17px;
	font-weight: 800;
	letter-spacing: 0.03em;
	text-transform: uppercase;
	color: ${({ $color }) => $color};
`;

const GroupBlockCount = styled.span`
	font-size: 12px;
	color: var(--text-dimmer);
	margin-right: auto;
`;

const GroupBlockBody = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding-left: 22px;
`;

// ── Individual section card (e.g. "Watching", "Watched Films") ──

const SectionCard = styled.div`
	border: 1px solid var(--border);
	border-radius: var(--radius-lg);
	overflow: hidden;
	background: var(--bg-3);
`;

const SectionCardHeader = styled.div`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 8px;
	row-gap: 6px;
	padding: 10px 16px;
	background: var(--bg-4);
	border-bottom: 1px solid var(--border);
`;

const SectionCollapse = styled.button<{ $collapsed: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	background: none;
	border: none;
	color: var(--text-dimmer);
	cursor: pointer;
	padding: 0;
	transform: rotate(${({ $collapsed }) => ($collapsed ? "-90deg" : "0deg")});
	transition: transform 150ms;

	&:hover {
		color: var(--text);
	}
`;

const SectionDot = styled.span<{ $color: string }>`
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: ${({ $color }) => $color};
	flex-shrink: 0;
`;

const SectionLabel = styled.span<{ $color: string }>`
	font-size: 14px;
	font-weight: 700;
	letter-spacing: 0.03em;
	color: ${({ $color }) => $color};
`;

const SectionCount = styled.span`
	font-size: 12px;
	color: var(--text-dimmer);
	margin-right: auto;
`;

// ── Entry card grid ──

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
	gap: 14px;
	padding: 16px;
`;

const cardPulse = keyframes`
	0%, 100% { box-shadow: 0 0 0 2px var(--color-brand-dim); }
	50% { box-shadow: 0 0 0 5px var(--color-brand-dim); }
`;

const Card = styled.div<{ $active?: "fetching" | "queued" }>`
	display: flex;
	flex-direction: column;
	border: 1px solid var(--border);
	border-radius: var(--radius);
	background: var(--bg-2);
	overflow: hidden;
	transition:
		border-color 150ms,
		background 150ms;

	&:hover {
		border-color: var(--border-bright);
	}

	${({ $active }) =>
		$active === "fetching" &&
		css`
			border-color: var(--color-brand);
			animation: ${cardPulse} 1.3s ease-in-out infinite;
		`}

	${({ $active }) =>
		$active === "queued" &&
		css`
			border-color: var(--color-brand);
			border-style: dashed;
			background: var(--color-brand-dim);
		`}
`;

const Cover = styled.img`
	width: 100%;
	aspect-ratio: 2 / 3;
	object-fit: cover;
	display: block;
`;

const CoverFallback = styled.div`
	width: 100%;
	aspect-ratio: 2 / 3;
	background: var(--bg-4);
`;

const CardBody = styled.div`
	display: flex;
	flex-direction: column;
	gap: 7px;
	padding: 10px;
`;

const CardTitle = styled.span`
	font-size: 13px;
	font-weight: 600;
	line-height: 1.3;
	color: var(--text);
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	min-height: 2.6em;
`;

const CardMeta = styled.span`
	display: flex;
	align-items: center;
	gap: 5px;
	font-size: 11px;
	color: var(--text-dimmer);
`;

const StatusBadge = styled.span<{ $color: string; $bg: string }>`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 5px;
	font-size: 11px;
	font-weight: 700;
	padding: 4px 8px;
	border-radius: 999px;
	color: ${({ $color }) => $color};
	background: ${({ $bg }) => $bg};
	text-align: center;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const CardFetchButton = styled(ActionButton)`
	width: 100%;
	justify-content: center;
`;

const formatDate = (ms: number) => new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

type SourceFilter = "all" | "needs" | "anilist" | "legacy";

const SOURCE_FILTERS: { key: SourceFilter; label: string }[] = [
	{ key: "all", label: "All" },
	{ key: "needs", label: "Needs Fetch" },
	{ key: "anilist", label: "AniList" },
	{ key: "legacy", label: "MAL / Legacy" },
];

function matchesSourceFilter(entry: Entry, filter: SourceFilter): boolean {
	if (filter === "all") return true;
	if (filter === "needs") return needsSourceFetch(entry);
	if (filter === "anilist") return entry.source?.provider === "anilist";
	return entry.source?.provider === "mal" || entry.source?.provider === "legacy";
}

type RowState = { kind: "fetching" | "queued" | SourceJobOutcome | "has-source" | "no-source"; message?: string };

function rowState(entry: Entry, job: SourceJob | undefined, jobTargets: Set<string> | null): RowState {
	if (job) {
		if (job.current?.entryId === entry.id) return { kind: "fetching" };
		const logEntry = job.log.find((l) => l.entryId === entry.id);
		if (logEntry) return { kind: logEntry.outcome, message: logEntry.message };
		if (job.jobStatus === "running") {
			const inScope = jobTargets === null || jobTargets.has(entry.id);
			const matchesMode = job.mode === "all" || needsSourceFetch(entry);
			if (inScope && matchesMode) return { kind: "queued" };
		}
	}
	return entry.source ? { kind: "has-source" } : { kind: "no-source" };
}

const ROW_STATE_STYLE: Record<RowState["kind"], { color: string; bg: string }> = {
	fetching: { color: "var(--color-brand)", bg: "var(--color-brand-dim)" },
	queued: { color: "var(--text-dimmer)", bg: "var(--bg-4)" },
	updated: { color: "var(--color-accent)", bg: "var(--color-accent-dim)" },
	skipped: { color: "var(--text-dimmer)", bg: "var(--bg-4)" },
	error: { color: "#f87171", bg: "rgba(248, 113, 113, 0.12)" },
	"has-source": { color: "var(--text-dim)", bg: "var(--bg-4)" },
	"no-source": { color: "var(--text-dimmer)", bg: "var(--bg-4)" },
};

function rowStateLabel(entry: Entry, state: RowState): string {
	switch (state.kind) {
		case "fetching":
			return "Fetching…";
		case "queued":
			return "Queued";
		case "updated":
			return "Updated";
		case "skipped":
			return state.message ?? "Skipped";
		case "error":
			return "Error";
		case "has-source":
			return entry.source ? `${entry.source.provider} · ${formatDate(entry.source.fetchedAt)}` : "";
		case "no-source":
			return "No source";
	}
}

export const SourceManagerView = () => {
	const { data: animu } = useAnimu();
	const entries = useMemo(() => (animu ? Object.values(animu.entries) : []), [animu]);
	const entryById = useMemo(() => new Map(entries.map((e) => [e.id, e])), [entries]);
	const sections = useMemo(() => (animu ? sortedSections(animu.sections) : []), [animu]);

	const sectionsByGroup = useMemo(() => {
		const map = new Map<GroupType, Section[]>(GROUP_TYPES.map((gt) => [gt, []]));
		for (const section of sections) map.get(section.group)?.push(section);
		return map;
	}, [sections]);

	const unsectionedIds = useMemo(() => {
		const sectioned = new Set<string>();
		for (const section of sections) for (const id of sectionEntryIds(section)) sectioned.add(id);
		return entries.filter((e) => !sectioned.has(e.id)).map((e) => e.id);
	}, [sections, entries]);

	// Full library, top-to-bottom in the same order the page displays it — used by the page-level
	// Fetch All/Missing buttons so batches process in visual order rather than storage order.
	const allOrderedEntryIds = useMemo(() => {
		const ids: string[] = [];
		for (const groupType of GROUP_TYPES) {
			for (const section of sectionsByGroup.get(groupType) ?? []) ids.push(...sectionEntryIds(section));
		}
		ids.push(...unsectionedIds);
		return ids;
	}, [sectionsByGroup, unsectionedIds]);

	const [query, setQuery] = useState("");
	const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
	const [collapsedGroups, setCollapsedGroups] = useState<Partial<Record<GroupType, boolean>>>({});
	const [collapsedSections, setCollapsedSections] = useState<Partial<Record<string, boolean>>>({});
	const [unsectionedCollapsed, setUnsectionedCollapsed] = useState(false);
	const [pickerEntry, setPickerEntry] = useState<Entry | null>(null);

	const [jobId, setJobId] = useState<string | null>(null);
	const [jobLostNotice, setJobLostNotice] = useState(false);
	const { mutate: startBatch, isPending: isStarting } = useStartBatchFetch();
	const { mutate: cancelBatch, isPending: isCancelling } = useCancelBatchJob();
	const { data: job, isError: jobLost } = useBatchJob(jobId);
	const { mutate: applySource } = useApplyEntrySource();
	const jobTargets = useMemo(() => (job?.entryIds ? new Set(job.entryIds) : null), [job?.entryIds]);

	const queryClient = useQueryClient();
	useEffect(() => {
		if (job && job.jobStatus !== "running") queryClient.invalidateQueries({ queryKey: ["animu"] });
	}, [job?.jobStatus, queryClient]);

	// Jobs live in server memory only — a dev-server restart (or any process restart) mid-run makes the
	// jobId permanently 404. Drop it so the UI doesn't sit stuck with disabled buttons and a stale live badge.
	useEffect(() => {
		if (!jobLost) return;
		setJobId(null);
		setJobLostNotice(true);
	}, [jobLost]);

	const jobRunning = job?.jobStatus === "running";

	const lowerQuery = query.trim().toLowerCase();
	const resolveIds = (ids: string[]): Entry[] => {
		const list: Entry[] = [];
		for (const id of ids) {
			const entry = entryById.get(id);
			if (!entry) continue;
			if (!matchesSourceFilter(entry, sourceFilter)) continue;
			if (lowerQuery && !resolveEntry(entry).displayTitle.toLowerCase().includes(lowerQuery)) continue;
			list.push(entry);
		}
		return list;
	};

	const stats = useMemo(() => {
		const needsFetch = entries.filter(needsSourceFetch).length;
		const anilist = entries.filter((e) => e.source?.provider === "anilist").length;
		const legacy = entries.filter((e) => e.source?.provider === "mal" || e.source?.provider === "legacy").length;
		return { needsFetch, anilist, legacy };
	}, [entries]);

	const toggleGroup = (group: GroupType) => setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
	const toggleSection = (sectionId: string) => setCollapsedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));

	const handleStart = (mode: "all" | "missing", entryIds: string[] | null = null) => {
		setJobLostNotice(false);
		startBatch({ mode, entryIds }, { onSuccess: ({ jobId }) => setJobId(jobId) });
	};

	const renderCard = (entry: Entry) => {
		const { displayTitle, displayCover } = resolveEntry(entry);
		const Icon = MEDIA_ICONS[entry.mediaType];
		const state = rowState(entry, job, jobTargets);
		const style = ROW_STATE_STYLE[state.kind];

		return (
			<Card key={entry.id} $active={state.kind === "fetching" || state.kind === "queued" ? state.kind : undefined}>
				{displayCover ? <Cover src={displayCover} loading="lazy" decoding="async" /> : <CoverFallback />}
				<CardBody>
					<CardTitle>{displayTitle}</CardTitle>
					<CardMeta>
						<Icon size={11} /> {MEDIA_TYPE_LABELS[entry.mediaType]}
					</CardMeta>
					<StatusBadge $color={style.color} $bg={style.bg}>
						{state.kind === "fetching" && <Spinner />}
						{rowStateLabel(entry, state)}
					</StatusBadge>
					<CardFetchButton onClick={() => setPickerEntry(entry)}>
						<RefreshCw size={13} /> Manual
					</CardFetchButton>
				</CardBody>
			</Card>
		);
	};

	const unsectionedEntries = resolveIds(unsectionedIds);

	const groupBlocks = GROUP_TYPES.map((groupType) => {
		const groupSections = sectionsByGroup.get(groupType) ?? [];
		const sectionRows = groupSections.map((section) => ({ section, entries: resolveIds(sectionEntryIds(section)) })).filter((row) => row.entries.length > 0);
		return { groupType, sectionRows };
	}).filter((block) => block.sectionRows.length > 0);

	const nothingToShow = groupBlocks.length === 0 && unsectionedEntries.length === 0;

	return (
		<Wrap>
			<Header>
				<HeaderLeft>
					<PageHeader>
						<Satellite size={20} />
						Source Manager
					</PageHeader>
					{jobRunning && (
						<LiveBadge>
							<Spinner /> {job.total - job.processed} in queue
						</LiveBadge>
					)}
				</HeaderLeft>
				<HeaderActions>
					<ActionButton onClick={() => handleStart("all", allOrderedEntryIds)} disabled={isStarting || jobRunning}>
						<RefreshCw size={13} /> Fetch All
					</ActionButton>
					<ActionButton onClick={() => handleStart("missing", allOrderedEntryIds)} disabled={isStarting || jobRunning}>
						<RefreshCw size={13} /> Fetch Missing
					</ActionButton>
					{jobRunning && (
						<ActionButton $danger onClick={() => cancelBatch(job.id)} disabled={isCancelling}>
							<Ban size={13} /> Cancel
						</ActionButton>
					)}
				</HeaderActions>
			</Header>

			{jobLostNotice && (
				<LostNotice>
					<span>Lost track of the last fetch job (the server likely restarted mid-run). Anything already fetched was saved — just start again for the rest.</span>
					<LostNoticeDismiss type="button" onClick={() => setJobLostNotice(false)}>
						Dismiss
					</LostNoticeDismiss>
				</LostNotice>
			)}

			<StatsBar>
				<Stat>
					<StatValue $color="var(--text-dimmer)">{stats.needsFetch}</StatValue>
					<StatLabel>Needs Fetch</StatLabel>
				</Stat>
				<Stat>
					<StatValue $color="var(--color-accent)">{stats.anilist}</StatValue>
					<StatLabel>AniList</StatLabel>
				</Stat>
				<Stat>
					<StatValue $color="var(--color-gold)">{stats.legacy}</StatValue>
					<StatLabel>MAL / Legacy</StatLabel>
				</Stat>
				<Stat>
					<StatValue $color="var(--color-brand)">{jobRunning ? job.total - job.processed : "—"}</StatValue>
					<StatLabel>In queue</StatLabel>
				</Stat>
			</StatsBar>

			<FilterRow>
				<FilterPills>
					{SOURCE_FILTERS.map(({ key, label }) => (
						<FilterPill key={key} type="button" $active={sourceFilter === key} onClick={() => setSourceFilter(key)}>
							{label}
						</FilterPill>
					))}
				</FilterPills>
				<SearchInputWrap>
					<Input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your library..." />
				</SearchInputWrap>
			</FilterRow>

			<Body>
				{groupBlocks.map(({ groupType, sectionRows }) => {
					const groupIsCollapsed = !!collapsedGroups[groupType];
					const groupEntryIds = sectionRows.flatMap((row) => row.entries.map((e) => e.id));
					const groupMissingCount = groupEntryIds.filter((id) => needsSourceFetch(entryById.get(id)!)).length;
					const color = GROUP_COLOR_VARS[groupType];
					const GroupIcon = GROUP_ICONS[groupType];

					return (
						<GroupBlock key={groupType}>
							<GroupBlockHeader>
								<GroupBlockCollapse type="button" $collapsed={groupIsCollapsed} onClick={() => toggleGroup(groupType)}>
									<ChevronDown size={16} />
								</GroupBlockCollapse>
								<GroupIcon size={16} color={color} />
								<GroupBlockLabel $color={color}>{GROUP_TYPE_MAPPINGS[groupType]}</GroupBlockLabel>
								<GroupBlockCount>{groupEntryIds.length} shown</GroupBlockCount>
								<ActionButton onClick={() => handleStart("all", groupEntryIds)} disabled={isStarting || jobRunning}>
									<RefreshCw size={12} /> Fetch All
								</ActionButton>
								{groupMissingCount > 0 && (
									<ActionButton onClick={() => handleStart("missing", groupEntryIds)} disabled={isStarting || jobRunning}>
										<RefreshCw size={12} /> Fetch {groupMissingCount} Missing
									</ActionButton>
								)}
							</GroupBlockHeader>

							{!groupIsCollapsed && (
								<GroupBlockBody>
									{sectionRows.map(({ section, entries: sectionEntries }) => {
										const sectionIsCollapsed = !!collapsedSections[section.id];
										const sectionIds = sectionEntries.map((e) => e.id);
										const missingCount = sectionEntries.filter(needsSourceFetch).length;

										return (
											<SectionCard key={section.id}>
												<SectionCardHeader>
													<SectionCollapse type="button" $collapsed={sectionIsCollapsed} onClick={() => toggleSection(section.id)}>
														<ChevronDown size={14} />
													</SectionCollapse>
													<SectionDot $color={color} />
													<SectionLabel $color={color}>{section.label}</SectionLabel>
													<SectionCount>{sectionEntries.length} shown</SectionCount>
													<ActionButton onClick={() => handleStart("all", sectionIds)} disabled={isStarting || jobRunning}>
														<RefreshCw size={12} /> Fetch All
													</ActionButton>
													{missingCount > 0 && (
														<ActionButton onClick={() => handleStart("missing", sectionIds)} disabled={isStarting || jobRunning}>
															<RefreshCw size={12} /> Fetch {missingCount} Missing
														</ActionButton>
													)}
												</SectionCardHeader>

												{!sectionIsCollapsed && <Grid>{sectionEntries.map(renderCard)}</Grid>}
											</SectionCard>
										);
									})}
								</GroupBlockBody>
							)}
						</GroupBlock>
					);
				})}

				{unsectionedEntries.length > 0 &&
					(() => {
						const unsectionedFilteredIds = unsectionedEntries.map((e) => e.id);
						const missingCount = unsectionedEntries.filter(needsSourceFetch).length;

						return (
							<SectionCard>
								<SectionCardHeader>
									<SectionCollapse type="button" $collapsed={unsectionedCollapsed} onClick={() => setUnsectionedCollapsed((prev) => !prev)}>
										<ChevronDown size={14} />
									</SectionCollapse>
									<SectionDot $color="var(--text-dimmer)" />
									<SectionLabel $color="var(--text-dimmer)">Unsectioned</SectionLabel>
									<SectionCount>{unsectionedEntries.length} shown</SectionCount>
									<ActionButton onClick={() => handleStart("all", unsectionedFilteredIds)} disabled={isStarting || jobRunning}>
										<RefreshCw size={12} /> Fetch All
									</ActionButton>
									{missingCount > 0 && (
										<ActionButton onClick={() => handleStart("missing", unsectionedFilteredIds)} disabled={isStarting || jobRunning}>
											<RefreshCw size={12} /> Fetch {missingCount} Missing
										</ActionButton>
									)}
								</SectionCardHeader>

								{!unsectionedCollapsed && <Grid>{unsectionedEntries.map(renderCard)}</Grid>}
							</SectionCard>
						);
					})()}

				{nothingToShow && <Empty>No entries match these filters.</Empty>}
			</Body>

			{pickerEntry && (
				<SourceMatchPicker
					entryTitle={resolveEntry(pickerEntry).displayTitle}
					onClose={() => setPickerEntry(null)}
					onSelect={(source) => {
						applySource({ entryId: pickerEntry.id, source });
						setPickerEntry(null);
					}}
				/>
			)}
		</Wrap>
	);
};
