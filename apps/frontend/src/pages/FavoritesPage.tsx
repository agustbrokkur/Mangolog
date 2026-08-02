import styled from "styled-components";
import { useDeferredValue, useMemo, useState } from "react";
import { EntryRenderer, type ViewMode } from "../components/entry/EntryRenderer";
import { useAnimu } from "../hooks/useAnime";
import { Star } from "lucide-react";
import { ViewModeSwitcher } from "../components/layout/actions/ViewModeSwitcher";
import { SearchInput } from "../components/layout/actions/SearchInput";
import { AddButton } from "../components/layout/actions/AddButton";
import type { Entry } from "../types/entry";
import { sortedSections } from "../types/section";
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

const PageHeader = styled.h1`
	display: flex;
	align-items: center;
	gap: 12px;
	font-size: 26px;
	font-weight: 800;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: var(--color-brand);
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

export const FavoritesView = () => {
	const { data: animu } = useAnimu();
	const [viewMode, setViewMode] = useState<ViewMode>("grid");
	const deferredViewMode = useDeferredValue(viewMode);
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState<EntryFilters>(EMPTY_FILTERS);
	const [sort, setSort] = useState<EntrySort>(DEFAULT_SORT);
	const debouncedSearch = useDebouncedValue(search, 200);

	const sections = useMemo(() => (animu ? sortedSections(animu.sections) : []), [animu]);
	const entries = useMemo(() => {
		if (!animu) return [];
		return Object.values(animu.entries).filter((entry): entry is Entry => entry.favorite);
	}, [animu]);

	const searchedEntries = useEntrySearch(entries, debouncedSearch, "quick");

	const deferredFilters = useDeferredValue(filters);
	const deferredSort = useDeferredValue(sort);

	const visibleEntries = useMemo(() => sortEntries(applyEntryFilters(searchedEntries, deferredFilters), deferredSort), [searchedEntries, deferredFilters, deferredSort]);

	const isStale = filters !== deferredFilters || sort !== deferredSort || viewMode !== deferredViewMode;

	return (
		<Wrap>
			<Header>
				<PageHeader>
					<Star size={24} color="var(--color-brand)" />
					Favorites
					<EntryCount>{entries.length}</EntryCount>
				</PageHeader>
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
					<EmptyTitle>No favorites yet</EmptyTitle>
					<EmptyHint>Mark entries as favorite to see them here.</EmptyHint>
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
