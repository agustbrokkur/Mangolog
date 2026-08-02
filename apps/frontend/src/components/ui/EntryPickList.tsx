// EntryPickList.tsx
import styled from "styled-components";
import { useState } from "react";
import type { Entry } from "../../types/entry";
import { resolveEntry } from "../../types/entry";
import { useEntrySearch } from "../../hooks/useEntrySearch";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { Input } from "../entry/EntryDetailBody.styles";

const List = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	max-height: 320px;
	overflow-y: auto;
	margin-top: 10px;
	border: 1px solid var(--border);
	border-radius: var(--radius);
	padding: 8px;
`;

const Row = styled.button`
	display: flex;
	align-items: center;
	gap: 12px;
	width: 100%;
	padding: 9px 10px;
	border-radius: 6px;
	border: none;
	background: none;
	color: var(--text-dim);
	font-family: inherit;
	font-size: 14px;
	text-align: left;
	cursor: pointer;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	&:hover {
		background: var(--bg-4);
		color: var(--text);
	}
`;

const Cover = styled.img`
	width: 32px;
	height: 32px;
	border-radius: 4px;
	object-fit: cover;
	flex-shrink: 0;
`;

const CoverFallback = styled.div`
	width: 32px;
	height: 32px;
	border-radius: 4px;
	background: var(--bg-4);
	flex-shrink: 0;
`;

const Empty = styled.div`
	padding: 16px 8px;
	font-size: 13px;
	color: var(--text-dimmer);
	text-align: center;
`;

interface EntryPickListProps {
	entries: Entry[];
	onPick: (entry: Entry) => void;
	placeholder?: string;
}

/** Search-and-pick list over a candidate entry pool — the caller decides what "picking" an entry means (add to a pending selection, assign immediately, etc). */
export const EntryPickList = ({ entries, onPick, placeholder = "Search entries..." }: EntryPickListProps) => {
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebouncedValue(query, 150);
	const results = useEntrySearch(entries, debouncedQuery, "quick");

	return (
		<div>
			<Input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} />
			<List>
				{results.length === 0 ? (
					<Empty>No entries found</Empty>
				) : (
					results.slice(0, 50).map((entry) => {
						const { displayTitle, displayCover } = resolveEntry(entry);
						return (
							<Row key={entry.id} type="button" onClick={() => onPick(entry)}>
								{displayCover ? <Cover src={displayCover} loading="lazy" decoding="async" /> : <CoverFallback />}
								{displayTitle}
							</Row>
						);
					})
				)}
			</List>
		</div>
	);
};
