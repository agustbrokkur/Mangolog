import styled from "styled-components";
import { useDeferredValue, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { EntryRenderer, type ViewMode } from "../components/entry/EntryRenderer";
import { useAnimu } from "../hooks/useAnime";
import { ViewModeSwitcher } from "../components/layout/actions/ViewModeSwitcher";
import { SearchInput } from "../components/layout/actions/SearchInput";
import { useEntrySearch } from "../hooks/useEntrySearch";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { type EntryFilters, EMPTY_FILTERS } from "../types/filters";
import { applyEntryFilters } from "../utils/applyEntryFilters";
import { FilterMenu } from "../components/layout/actions/FilterMenu/FilterMenu";
import { SortMenu } from "../components/layout/actions/SortMenu/SortMenu";
import { type EntrySort, DEFAULT_SORT } from "../types/sort";
import { sortEntries } from "../utils/sortEntries";
import { sortedSections } from "../types/section";

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

const PageHeader = styled.h1`
	display: flex;
	align-items: center;
	gap: 12px;
	font-size: 26px;
	font-weight: 800;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: var(--text);
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

export const SearchView = () => {
	const { data: animu } = useAnimu();
	const [viewMode, setViewMode] = useState<ViewMode>("grid");
	const deferredViewMode = useDeferredValue(viewMode);
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState<EntryFilters>(EMPTY_FILTERS);
	const [sort, setSort] = useState<EntrySort>(DEFAULT_SORT);
	const debouncedSearch = useDebouncedValue(search, 200);

	const entries = useMemo(() => Object.values(animu?.entries ?? {}), [animu]);
	const sections = useMemo(() => (animu ? sortedSections(animu.sections) : []), [animu]);

	const searchedEntries = useEntrySearch(entries, debouncedSearch, "full");

	const deferredFilters = useDeferredValue(filters);
	const deferredSort = useDeferredValue(sort);

	const visibleEntries = useMemo(() => sortEntries(applyEntryFilters(searchedEntries, deferredFilters), deferredSort), [searchedEntries, deferredFilters, deferredSort]);

	const isStale = filters !== deferredFilters || sort !== deferredSort || viewMode !== deferredViewMode;

	return (
		<Wrap>
			<Header>
				<PageHeader>
					<Search size={24} />
					Search
					<EntryCount>{visibleEntries.length}</EntryCount>
				</PageHeader>
				<SectionBody>
					<SectionBodyGroup>
						<SearchInput value={search} onChange={setSearch} placeholder="Search your entire library..." />
						<FilterMenu entries={entries} filters={filters} onChange={setFilters} />
						<SortMenu sort={sort} onChange={setSort} />
					</SectionBodyGroup>
					<SectionBodyGroup>
						<ViewModeSwitcher viewMode={viewMode} onViewModeChange={setViewMode} />
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
						<EntryRenderer key={entry.id} entry={entry} viewMode={deferredViewMode} sections={sections} />
					))}
				</Container>
			)}
		</Wrap>
	);
};
