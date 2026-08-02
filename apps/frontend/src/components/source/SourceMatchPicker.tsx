// SourceMatchPicker.tsx
import styled from "styled-components";
import { useState } from "react";
import { Search, Star } from "lucide-react";
import { FormDialog } from "../ui/FormDialog";
import { Input } from "../entry/EntryDetailBody.styles";
import { useSourceSearch } from "../../hooks/useSources";
import type { EntrySource } from "../../types/entry";
import type { SourceCandidate } from "../../types/source";

const SearchRow = styled.div`
	display: flex;
	gap: 8px;
`;

const SearchButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	padding: 0 16px;
	flex-shrink: 0;
	border-radius: var(--radius);
	font-size: 14px;
	font-weight: 600;
	font-family: inherit;
	border: 1px solid var(--border);
	background: var(--bg-4);
	color: var(--text-dim);
	cursor: pointer;
	transition: background 100ms;

	&:hover {
		background: var(--bg-3);
		color: var(--text);
	}
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
	gap: 12px;
`;

const Card = styled.button<{ $selected: boolean }>`
	display: flex;
	flex-direction: column;
	padding: 0;
	border-radius: var(--radius);
	border: 2px solid ${({ $selected }) => ($selected ? "var(--color-accent)" : "var(--border)")};
	background: ${({ $selected }) => ($selected ? "var(--color-accent-dim)" : "var(--bg-4)")};
	color: var(--text);
	font-family: inherit;
	text-align: left;
	cursor: pointer;
	overflow: hidden;
	transition: border-color 100ms;

	&:hover {
		border-color: var(--color-accent);
	}
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
	background: var(--bg-3);
`;

const CardInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding: 8px;
`;

const CardTitle = styled.span`
	font-size: 13px;
	font-weight: 600;
	line-height: 1.3;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	min-height: 2.6em;
`;

const CardMeta = styled.span`
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 11px;
	color: var(--text-dimmer);
`;

const Empty = styled.div`
	padding: 48px 8px;
	font-size: 14px;
	color: var(--text-dimmer);
	text-align: center;
	grid-column: 1 / -1;
`;

const ResultCount = styled.div`
	font-size: 12px;
	color: var(--text-dimmer);
`;

interface SourceMatchPickerProps {
	entryTitle: string;
	onSelect: (source: EntrySource) => void;
	onClose: () => void;
}

export const SourceMatchPicker = ({ entryTitle, onSelect, onClose }: SourceMatchPickerProps) => {
	const [query, setQuery] = useState(entryTitle);
	// Separate from `query` so editing the search box never fires a request on its own — only
	// pressing the search button (or Enter) commits it, to keep AniList calls deliberate.
	const [searchTerm, setSearchTerm] = useState(entryTitle);
	const [selected, setSelected] = useState<SourceCandidate | null>(null);
	const { data: results, isFetching } = useSourceSearch(searchTerm, searchTerm.trim().length > 1);

	const handleSearch = () => setSearchTerm(query);

	const handleSubmit = () => {
		if (!selected) return;
		const { format: _format, ...source } = selected;
		onSelect(source);
	};

	return (
		<FormDialog title="Fetch source from AniList" confirmLabel="Apply" wide="xl" submitDisabled={!selected} onSubmit={handleSubmit} onCancel={onClose}>
			<SearchRow>
				<Input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={(e) => {
						// Enter here always means "search", never "submit the dialog" — the Apply
						// button (enabled only once a candidate is picked) is the only way to apply.
						if (e.key === "Enter") {
							e.preventDefault();
							handleSearch();
						}
					}}
					placeholder="Search AniList titles..."
					autoFocus
				/>
				<SearchButton type="button" onClick={handleSearch}>
					<Search size={14} /> Search
				</SearchButton>
			</SearchRow>

			{!isFetching && results && results.length > 0 && (
				<ResultCount>
					{results.length} result{results.length === 1 ? "" : "s"}
				</ResultCount>
			)}

			<Grid>
				{isFetching && <Empty>Searching…</Empty>}
				{!isFetching && results?.length === 0 && <Empty>No results</Empty>}
				{!isFetching &&
					results?.map((candidate) => {
						const title = candidate.englishTitle || candidate.japaneseTitle || "Untitled";
						const year = candidate.airedFrom != null ? new Date(candidate.airedFrom).getFullYear() : null;
						return (
							<Card key={candidate.externalId} type="button" $selected={selected?.externalId === candidate.externalId} onClick={() => setSelected(candidate)}>
								{candidate.coverUrl ? <Cover src={candidate.coverUrl} loading="lazy" decoding="async" /> : <CoverFallback />}
								<CardInfo>
									<CardTitle>{title}</CardTitle>
									<CardMeta>
										{candidate.format?.replaceAll("_", " ") ?? "Unknown"}
										{year != null && ` · ${year}`}
									</CardMeta>
									<CardMeta>{candidate.totalEpisodes != null ? `${candidate.totalEpisodes} eps` : "? eps"}</CardMeta>
									{candidate.communityRating != null && (
										<CardMeta>
											<Star size={10} fill="var(--color-gold)" color="var(--color-gold)" /> {candidate.communityRating}
										</CardMeta>
									)}
								</CardInfo>
							</Card>
						);
					})}
			</Grid>
		</FormDialog>
	);
};
