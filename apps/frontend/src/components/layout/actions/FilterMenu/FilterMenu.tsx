// components/layout/actions/FilterMenu.tsx
import { useMemo } from "react";
import { createPortal } from "react-dom";
import { Filter, Check } from "lucide-react";
import { MEDIA_TYPES, MEDIA_ICONS } from "../../../../types/mediaType";
import { ENTRY_STATUSES, STATUS_LABELS, STATUS_COLORS } from "../../../../types/status";
import { EMPTY_FILTERS, isDateRangeActive, isRangeActive, type EntryFilters, type NumberRange, type DateRange } from "../../../../types/filters";
import type { Entry } from "../../../../types/entry";
import { useAnchoredPanel } from "../../../../hooks/useAnchoredPanel";
import { FilterChipSection } from "./FilterChipSection";
import { NumberRangeSection, DateRangeSection } from "./FilterRangeSection";
import { Wrap, TriggerButton, Badge, Panel, TopRow, RangeGrid, Section, SectionLabel, TagWrap, Chip, Footer, ClearButton } from "./FilterMenu.styles";

interface FilterMenuProps {
	entries: Entry[];
	filters: EntryFilters;
	onChange: (filters: EntryFilters) => void;
}

const NUMBER_RANGES: { key: "episodeRange" | "scoreRange"; label: string; max?: number }[] = [
	{ key: "episodeRange", label: "Episodes" },
	{ key: "scoreRange", label: "Rating", max: 10 },
];

const DATE_RANGES: { key: "airedRange" | "startedRange" | "finishedRange" | "droppedRange"; label: string }[] = [
	{ key: "airedRange", label: "Aired" },
	{ key: "startedRange", label: "Started" },
	{ key: "finishedRange", label: "Finished" },
	{ key: "droppedRange", label: "Dropped" },
];

export const FilterMenu = ({ entries, filters, onChange }: FilterMenuProps) => {
	const { open, setOpen, anchorRef: wrapRef, panelRef, position } = useAnchoredPanel<HTMLDivElement, HTMLDivElement>();

	const availableGenres = useMemo(() => {
		const set = new Set<string>();
		entries.forEach((e) => e.source?.genres.forEach((g) => set.add(g)));
		return Array.from(set).sort();
	}, [entries]);

	const availableStudios = useMemo(() => {
		const set = new Set<string>();
		entries.forEach((e) => e.source?.studios.forEach((s) => set.add(s)));
		return Array.from(set).sort();
	}, [entries]);

	const availableTags = useMemo(() => {
		const set = new Set<string>();
		entries.forEach((e) => e.tags?.forEach((t) => set.add(t)));
		return Array.from(set).sort();
	}, [entries]);

	const activeCount =
		filters.mediaTypes.length +
		filters.statuses.length +
		filters.genres.length +
		filters.studios.length +
		filters.tags.length +
		(filters.favoriteOnly ? 1 : 0) +
		(isRangeActive(filters.episodeRange) ? 1 : 0) +
		(isRangeActive(filters.scoreRange) ? 1 : 0) +
		(isDateRangeActive(filters.airedRange) ? 1 : 0) +
		(isDateRangeActive(filters.startedRange) ? 1 : 0) +
		(isDateRangeActive(filters.finishedRange) ? 1 : 0) +
		(isDateRangeActive(filters.droppedRange) ? 1 : 0);

	const toggleMediaType = (value: (typeof filters.mediaTypes)[number]) => {
		const next = filters.mediaTypes.includes(value) ? filters.mediaTypes.filter((v) => v !== value) : [...filters.mediaTypes, value];
		onChange({ ...filters, mediaTypes: next });
	};

	const toggleStatus = (value: (typeof filters.statuses)[number]) => {
		const next = filters.statuses.includes(value) ? filters.statuses.filter((v) => v !== value) : [...filters.statuses, value];
		onChange({ ...filters, statuses: next });
	};

	const toggleGenre = (value: string) => {
		const next = filters.genres.includes(value) ? filters.genres.filter((v) => v !== value) : [...filters.genres, value];
		onChange({ ...filters, genres: next });
	};

	const toggleStudio = (value: string) => {
		const next = filters.studios.includes(value) ? filters.studios.filter((v) => v !== value) : [...filters.studios, value];
		onChange({ ...filters, studios: next });
	};

	const toggleTag = (value: string) => {
		const next = filters.tags.includes(value) ? filters.tags.filter((v) => v !== value) : [...filters.tags, value];
		onChange({ ...filters, tags: next });
	};

	const setNumberRange = (key: "episodeRange" | "scoreRange", patch: Partial<NumberRange>) => {
		onChange({ ...filters, [key]: { ...filters[key], ...patch } });
	};

	const setDateRange = (key: "airedRange" | "startedRange" | "finishedRange" | "droppedRange", patch: Partial<DateRange>) => {
		onChange({ ...filters, [key]: { ...filters[key], ...patch } });
	};

	return (
		<Wrap ref={wrapRef}>
			<TriggerButton $active={activeCount > 0} onClick={() => setOpen((v) => !v)}>
				<Filter size={14} />
				Filter
				{activeCount > 0 && <Badge>{activeCount}</Badge>}
			</TriggerButton>

			{open &&
				createPortal(
					<Panel ref={panelRef} style={{ top: position.top, left: position.left }}>
						<TopRow>
							<FilterChipSection
								label="Media Type"
								items={MEDIA_TYPES}
								isChecked={(type) => filters.mediaTypes.includes(type)}
								onToggle={toggleMediaType}
								renderLabel={(type) => {
									const Icon = MEDIA_ICONS[type];
									return (
										<>
											<Icon size={13} />
											{type.toUpperCase()}
										</>
									);
								}}
							/>

							<FilterChipSection
								label="Status"
								items={ENTRY_STATUSES}
								isChecked={(status) => filters.statuses.includes(status)}
								onToggle={toggleStatus}
								renderLabel={(status) => STATUS_LABELS[status]}
								colorFor={(status) => STATUS_COLORS[status]}
							/>

							<Section>
								<SectionLabel>Favorites</SectionLabel>
								<TagWrap>
									<Chip $checked={filters.favoriteOnly} onClick={() => onChange({ ...filters, favoriteOnly: !filters.favoriteOnly })}>
										{filters.favoriteOnly && <Check size={11} />}
										Favorites only
									</Chip>
								</TagWrap>
							</Section>
						</TopRow>

						<RangeGrid>
							{NUMBER_RANGES.map(({ key, label, max }) => (
								<NumberRangeSection key={key} label={label} range={filters[key]} max={max} onChange={(patch) => setNumberRange(key, patch)} />
							))}

							{DATE_RANGES.map(({ key, label }) => (
								<DateRangeSection key={key} label={label} range={filters[key]} onChange={(patch) => setDateRange(key, patch)} />
							))}
						</RangeGrid>

						<FilterChipSection label="Genre" items={availableGenres} isChecked={(genre) => filters.genres.includes(genre)} onToggle={toggleGenre} renderLabel={(genre) => genre} />

						<FilterChipSection
							label="Studio"
							items={availableStudios}
							isChecked={(studio) => filters.studios.includes(studio)}
							onToggle={toggleStudio}
							renderLabel={(studio) => studio}
						/>

						<FilterChipSection label="Tags" items={availableTags} isChecked={(tag) => filters.tags.includes(tag)} onToggle={toggleTag} renderLabel={(tag) => tag} />

						<Footer>
							<ClearButton onClick={() => onChange(EMPTY_FILTERS)}>Clear all</ClearButton>
						</Footer>
					</Panel>,
					document.body,
				)}
		</Wrap>
	);
};
