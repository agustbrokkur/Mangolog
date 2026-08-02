import { useMemo } from "react";
import styled from "styled-components";
import { Link } from "react-router";
import { LayoutDashboard, ChevronRight } from "lucide-react";
import { useAnimu } from "../../hooks/useAnime";
import { sectionEntryIds, sortedSections } from "../../types/section";
import type { Entry } from "../../types/entry";
import { type Status, ENTRY_STATUSES, STATUS_COLORS, STATUS_LABELS } from "../../types/status";
import { GROUP_ICONS, GROUP_COLOR_VARS } from "../../types/groupType";
import { EntryListItem, COMPACT_ENTRY_HEIGHT } from "../entry/EntryListItem";

const ROW_CAP = 18;
const ROW_GAP = 10;
const OVERVIEW_STATUS_ORDER: Status[] = ["watched", "watching", "backlog", "on_hold", "dropped", "unsorted"];

const Wrap = styled.div`
	overflow-y: auto;
`;

const Header = styled.div`
	display: flex;
	flex-direction: column;
	gap: 14px;
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

const StatusPills = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
`;

const StatusPill = styled.div<{ $color: string }>`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 4px;
	min-width: 108px;
	padding: 12px 20px;
	border-radius: var(--radius-lg);
	background: color-mix(in srgb, ${({ $color }) => $color} 10%, var(--bg-3));
	border: 1px solid color-mix(in srgb, ${({ $color }) => $color} 45%, transparent);
`;

const StatusPillValue = styled.span<{ $color: string }>`
	font-size: 26px;
	font-weight: 800;
	line-height: 1;
	color: ${({ $color }) => $color};
`;

const StatusPillLabel = styled.span<{ $color: string }>`
	font-size: 12px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	color: ${({ $color }) => $color};
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 28px;
	padding: 20px 24px 24px;
`;

const GroupHeading = styled.h2`
	font-size: 13px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: var(--text-dimmer);
	margin-bottom: 10px;
`;

const SectionsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
	gap: 10px;
`;

const SectionTile = styled(Link)<{ $color: string }>`
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 12px 14px;
	background: var(--bg-3);
	border: 1px solid color-mix(in srgb, ${({ $color }) => $color} 18%, var(--border));
	border-radius: var(--radius-lg);
	text-decoration: none;
	transition:
		border-color 150ms,
		background 150ms;

	&:hover {
		border-color: ${({ $color }) => $color};
		background: color-mix(in srgb, ${({ $color }) => $color} 8%, var(--bg-3));
	}
`;

const SectionTileLabel = styled.span<{ $color: string }>`
	display: flex;
	align-items: flex-start;
	gap: 6px;
	font-size: 13px;
	color: var(--text-dim);
	text-align: left;

	svg {
		flex-shrink: 0;
		margin-top: 2px;
		color: ${({ $color }) => $color};
	}
`;

const SectionTileCount = styled.span<{ $color: string }>`
	font-size: 22px;
	font-weight: 700;
	color: ${({ $color }) => $color};
`;

const Group = styled.div`
	display: flex;
	flex-direction: column;
	gap: 14px;
`;

const RowHeader = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

const RowTitle = styled.span<{ $color: string }>`
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 15px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	color: ${({ $color }) => $color};

	svg {
		flex-shrink: 0;
	}
`;

const RowCount = styled.span`
	font-size: 12px;
	font-weight: 600;
	color: var(--text-dim);
	background: var(--bg-4);
	padding: 2px 8px;
	border-radius: 999px;
`;

const SeeAll = styled(Link)`
	display: flex;
	align-items: center;
	gap: 2px;
	margin-left: auto;
	font-size: 13px;
	color: var(--text-dim);
	text-decoration: none;
	transition: color 150ms;

	&:hover {
		color: var(--text);
	}
`;

const RowGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
	gap: ${ROW_GAP}px;
	max-height: calc(${COMPACT_ENTRY_HEIGHT}px * 2 + ${ROW_GAP}px);
	overflow: hidden;
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

export const AnimuList = () => {
	const { data: animu, isLoading, isError } = useAnimu();

	const entries = useMemo(() => animu?.entries ?? {}, [animu]);
	const sections = useMemo(() => (animu ? sortedSections(animu.sections) : []), [animu]);
	const totalEntries = useMemo(() => Object.keys(entries).length, [entries]);

	const statusCounts = useMemo(() => {
		const counts = new Map(ENTRY_STATUSES.map((status) => [status, 0]));
		for (const entry of Object.values(entries)) {
			counts.set(entry.status, (counts.get(entry.status) ?? 0) + 1);
		}
		return counts;
	}, [entries]);

	const rows = useMemo(
		() =>
			sections
				.map((section) => {
					const memberIds = sectionEntryIds(section);
					const rowEntries = memberIds
						.slice(0, ROW_CAP)
						.map((id) => entries[id])
						.filter((e): e is Entry => e != null);
					return { section, memberIds, rowEntries };
				})
				.filter((row) => row.memberIds.length > 0),
		[sections, entries],
	);

	if (isLoading) {
		return (
			<Wrap>
				<EmptyState>
					<EmptyTitle>Loading your library…</EmptyTitle>
				</EmptyState>
			</Wrap>
		);
	}

	if (isError) {
		return (
			<Wrap>
				<EmptyState>
					<EmptyTitle>Something went wrong</EmptyTitle>
					<EmptyHint>Couldn't load your library. Try refreshing the page.</EmptyHint>
				</EmptyState>
			</Wrap>
		);
	}

	return (
		<Wrap>
			<Header>
				<PageHeader>
					<LayoutDashboard size={24} />
					Overview
					<EntryCount>{totalEntries}</EntryCount>
				</PageHeader>

				<StatusPills>
					{OVERVIEW_STATUS_ORDER.map((status) => (
						<StatusPill key={status} $color={STATUS_COLORS[status]}>
							<StatusPillValue $color={STATUS_COLORS[status]}>{statusCounts.get(status) ?? 0}</StatusPillValue>
							<StatusPillLabel $color={STATUS_COLORS[status]}>{STATUS_LABELS[status]}</StatusPillLabel>
						</StatusPill>
					))}
				</StatusPills>
			</Header>

			{totalEntries === 0 ? (
				<EmptyState>
					<EmptyTitle>No entries yet</EmptyTitle>
					<EmptyHint>Add some entries to your library to see them here.</EmptyHint>
				</EmptyState>
			) : (
				<Container>
					<Group>
						<GroupHeading>All Sections</GroupHeading>
						<SectionsGrid>
							{sections.map((section) => {
								const Icon = GROUP_ICONS[section.group];
								const color = GROUP_COLOR_VARS[section.group];
								return (
									<SectionTile key={section.id} to={`/sections/${section.id}`} $color={color}>
										<SectionTileLabel $color={color}>
											<Icon size={13} />
											{section.label}
										</SectionTileLabel>
										<SectionTileCount $color={color}>{sectionEntryIds(section).length}</SectionTileCount>
									</SectionTile>
								);
							})}
						</SectionsGrid>
					</Group>

					{rows.map(({ section, memberIds, rowEntries }) => {
						const Icon = GROUP_ICONS[section.group];
						const color = GROUP_COLOR_VARS[section.group];
						return (
							<Group key={section.id}>
								<RowHeader>
									<RowTitle $color={color}>
										<Icon size={16} />
										{section.label}
									</RowTitle>
									<RowCount>{memberIds.length}</RowCount>
									<SeeAll to={`/sections/${section.id}`}>
										See all
										<ChevronRight size={14} />
									</SeeAll>
								</RowHeader>

								<RowGrid>
									{rowEntries.map((entry) => (
										<EntryListItem key={entry.id} entry={entry} sections={sections} compact />
									))}
								</RowGrid>
							</Group>
						);
					})}
				</Container>
			)}
		</Wrap>
	);
};
