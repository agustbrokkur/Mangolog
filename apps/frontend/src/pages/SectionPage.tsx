import styled from "styled-components";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { EntryRenderer, type ViewMode } from "../components/entry/EntryRenderer";
import { useAnimu, useReorderSectionEntries } from "../hooks/useAnime";
import { useSettings } from "../hooks/useSettings";
import { GROUP_COLOR_VARS, GROUP_ICONS } from "../types/groupType";
import { ViewModeSwitcher } from "../components/layout/actions/ViewModeSwitcher";
import { SearchInput } from "../components/layout/actions/SearchInput";
import { AddButton } from "../components/layout/actions/AddButton";
import type { Entry } from "../types/entry";
import { isManualSection, sectionEntryIds, sortedSections } from "../types/section";
import { useParams } from "react-router";
import { useEntrySearch } from "../hooks/useEntrySearch";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { type EntryFilters, EMPTY_FILTERS } from "../types/filters";
import { applyEntryFilters } from "../utils/applyEntryFilters";
import { FilterMenu } from "../components/layout/actions/FilterMenu/FilterMenu";
import { SortMenu } from "../components/layout/actions/SortMenu/SortMenu";
import { type EntrySort, DEFAULT_SORT } from "../types/sort";
import { sortEntries } from "../utils/sortEntries";

const Wrap = styled.div`
	overflow-y: auto;
`;

const Header = styled.div`
	display: flex;
	flex-direction: column;
	gap: 18px;
	padding: 28px 24px 20px;
	border-bottom: 1px solid var(--border);
`;

const SectionHeader = styled.h1<{ $color: string }>`
	display: flex;
	align-items: center;
	gap: 12px;
	font-size: 26px;
	font-weight: 800;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: ${({ $color }) => $color};
`;

const EntryCount = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 32px;
	height: 32px;
	padding: 0 10px;
	border-radius: 999px;
	background: var(--bg-4);
	font-size: 16px;
	font-weight: 600;
	letter-spacing: 0;
	text-transform: none;
	color: var(--text-dim);
`;

const SectionBody = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	width: 100%;
`;

const SectionBodyGroup = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
`;

/**
 * `content-visibility: auto` lets the browser skip layout/paint for offscreen
 * children. `contain-intrinsic-size` gives it a placeholder height so the
 * scrollbar stays stable. This is cheap virtualization without a dependency.
 */
const Container = styled.div<{ $viewMode: ViewMode }>`
	display: ${({ $viewMode }) => ($viewMode === "grid" ? "grid" : "flex")};
	${({ $viewMode }) =>
		$viewMode === "grid"
			? `
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 14px;
      `
			: `
        flex-direction: column;
        gap: 12px;
      `}
	padding: 16px 24px 24px;

	> * {
		content-visibility: auto;
		contain-intrinsic-size: auto ${({ $viewMode }) => ($viewMode === "grid" ? "320px" : "150px")};
	}
`;

const EmptyState = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10px;
	padding: 80px 24px;
	color: var(--text-dimmer);
	text-align: center;
`;

const EmptyTitle = styled.span`
	font-size: 15px;
	font-weight: 600;
	color: var(--text-dim);
`;

const EmptyHint = styled.span`
	font-size: 13px;
`;

export const SectionView = () => {
	const { sectionId } = useParams();
	const { data: animu } = useAnimu();
	const { data: settings } = useSettings();
	const [viewMode, setViewMode] = useState<ViewMode>("grid");
	const deferredViewMode = useDeferredValue(viewMode);
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState<EntryFilters>(EMPTY_FILTERS);
	const [sort, setSort] = useState<EntrySort>(DEFAULT_SORT);
	const debouncedSearch = useDebouncedValue(search, 200);

	// Settings arrive async, after the initial render, so the defaults are applied once via this guard
	// rather than as the useState initial value.
	const appliedDefaults = useRef(false);
	useEffect(() => {
		if (!settings || appliedDefaults.current) return;
		setSort(settings.defaultSort);
		setViewMode(settings.defaultViewMode);
		appliedDefaults.current = true;
	}, [settings]);

	const section = sectionId ? animu?.sections[sectionId] : undefined;
	const sections = useMemo(() => (animu ? sortedSections(animu.sections) : []), [animu]);
	const memberIds = useMemo(() => (section ? sectionEntryIds(section) : []), [section]);
	const entries = useMemo(() => {
		if (!animu) return [];
		return memberIds.map((id) => animu.entries[id]).filter((e): e is Entry => e != null);
	}, [memberIds, animu]);
	const entryOrder = useMemo(() => new Map(memberIds.map((id, index) => [id, index])), [memberIds]);

	const reorderMutation = useReorderSectionEntries();
	const handleReorder = useCallback(
		(entryId: string, newIndex: number) => {
			if (!section || !isManualSection(section)) return;
			const currentIndex = memberIds.indexOf(entryId);
			if (currentIndex === -1) return;

			const clamped = Math.max(0, Math.min(newIndex, memberIds.length - 1));
			if (clamped === currentIndex) return;

			const next = [...memberIds];
			next.splice(currentIndex, 1);
			next.splice(clamped, 0, entryId);
			reorderMutation.mutate({ sectionId: section.id, entryIds: next });
		},
		[section, memberIds, reorderMutation],
	);

	const searchedEntries = useEntrySearch(entries, debouncedSearch, "quick");

	const deferredFilters = useDeferredValue(filters);
	const deferredSort = useDeferredValue(sort);

	const visibleEntries = useMemo(() => sortEntries(applyEntryFilters(searchedEntries, deferredFilters), deferredSort), [searchedEntries, deferredFilters, deferredSort]);

	const isStale = filters !== deferredFilters || sort !== deferredSort || viewMode !== deferredViewMode;

	if (!section) return null;

	const GroupIcon = GROUP_ICONS[section.group];
	const groupColor = GROUP_COLOR_VARS[section.group];

	return (
		<Wrap>
			<Header>
				<SectionHeader $color={groupColor}>
					<GroupIcon size={24} color={groupColor} />
					{section.label}
					<EntryCount>{memberIds.length}</EntryCount>
				</SectionHeader>
				<SectionBody>
					<SectionBodyGroup>
						<SearchInput value={search} onChange={setSearch} />
						<FilterMenu entries={entries} filters={filters} onChange={setFilters} />
						<SortMenu sort={sort} onChange={setSort} />
					</SectionBodyGroup>
					<SectionBodyGroup>
						<ViewModeSwitcher viewMode={viewMode} onViewModeChange={setViewMode} />
						<AddButton />
					</SectionBodyGroup>
				</SectionBody>
			</Header>

			{visibleEntries.length === 0 ? (
				<EmptyState>
					<EmptyTitle>No entries found</EmptyTitle>
					<EmptyHint>Try a different search term or adjust your filters.</EmptyHint>
				</EmptyState>
			) : (
				<Container $viewMode={deferredViewMode} style={{ opacity: isStale ? 0.6 : 1 }}>
					{visibleEntries.map((entry) => (
						<EntryRenderer key={entry.id} entry={entry} viewMode={deferredViewMode} order={entryOrder.get(entry.id)} sections={sections} onReorder={handleReorder} />
					))}
				</Container>
			)}
		</Wrap>
	);
};
