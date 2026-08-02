// EntryListItem.tsx
import styled from "styled-components";
import { Star } from "lucide-react";
import type { Entry } from "../../types/entry";
import { resolveEntry } from "../../types/entry";
import type { Section } from "../../types/section";
import { STATUS_COLORS, STATUS_LABELS } from "../../types/status";
import { MEDIA_ICONS, MEDIA_TYPE_LABELS } from "../../types/mediaType";
import { EpisodeStepper } from "../layout/entry/EpisodeStepper";
import { MoveMenu } from "../layout/entry/MoveMenu";
import { MediaTypeMenu } from "../layout/entry/MediaTypeMenu";
import { StatusMenu } from "../layout/entry/StatusMenu";
import { OpenButton } from "../layout/entry/OpenButton";
import { EntryCoverCompact } from "../layout/entry/EntryCoverCompact";
import React, { useEffect, useState } from "react";
import { useAdjustEntryProgress, useMoveEntryToSection, useUpdateEntryMediaType, useUpdateEntryStatus } from "../../hooks/useAnime";
import { useOpenMenuTracker } from "../../hooks/useOpenMenuTracker";
import { useEntryPanel } from "../../context/EntryPanelContext";

/** Baseline compact card height (a minimum, not a cap — long titles grow it) — used by grids that estimate row heights, e.g. the Overview page's 2-row clip. */
export const COMPACT_ENTRY_HEIGHT = 104;

const Card = styled.div<{ $color: string; $compact: boolean }>`
	position: relative;
	display: flex;
	background: var(--bg-3);
	border: 1px solid color-mix(in srgb, ${({ $color }) => $color} 30%, var(--border));
	border-left: 4px solid ${({ $color }) => $color};
	border-radius: var(--radius-lg);
	overflow: hidden;
	transition:
		border-color 150ms,
		background 150ms;
	min-height: ${({ $compact }) => ($compact ? COMPACT_ENTRY_HEIGHT : 150)}px;

	&:hover {
		border-color: ${({ $color }) => $color};
		background: color-mix(in srgb, ${({ $color }) => $color} 8%, var(--bg-3));
	}
`;

/** Full-bleed invisible button behind the content — only used in compact mode, where there are no other interactive children to conflict with. */
const CardButton = styled.button`
	position: absolute;
	inset: 0;
	z-index: 0;
	background: none;
	border: none;
	padding: 0;
	cursor: pointer;
`;

const OrderColumn = styled.div<{ $color: string }>`
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	width: 52px;
	background: var(--bg-2);
	border-right: 1px solid var(--border);
	transition: border-color 150ms;

	&:focus-within {
		border-right-color: ${({ $color }) => $color};
	}
`;

const OrderInput = styled.input<{ $color: string }>`
	width: 100%;
	height: 100%;
	padding: 0;
	text-align: center;
	font-size: 16px;
	font-weight: 700;
	font-family: inherit;
	color: var(--text-dim);
	background: transparent;
	border: none;
	transition:
		color 150ms,
		background 150ms;

	&:hover {
		color: var(--text);
		background: var(--bg-4);
	}

	&:focus {
		outline: none;
		color: var(--text);
		background: color-mix(in srgb, ${({ $color }) => $color} 22%, var(--bg-2));
	}
`;

const Content = styled.div<{ $compact: boolean }>`
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	flex: 1;
	min-width: 0;
	gap: ${({ $compact }) => ($compact ? "10px" : "16px")};
	padding: ${({ $compact }) => ($compact ? "10px 12px" : "16px 18px")};
	${({ $compact }) => $compact && "pointer-events: none;"}
`;

const CoverWrap = styled.div<{ $compact: boolean }>`
	flex-shrink: 0;
	height: ${({ $compact }) => ($compact ? "56px" : "108px")};
`;

const Info = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 5px;
	flex: 1;
	min-width: 0;
	text-align: left;
`;

const Title = styled.button<{ $compact: boolean }>`
	font-weight: 600;
	color: var(--text);
	text-align: left;
	text-decoration: none;
	background: none;
	border: none;
	padding: 0;
	font-family: inherit;
	cursor: pointer;
	font-size: ${({ $compact }) => ($compact ? "13px" : "17px")};

	&:hover {
		color: var(--color-brand);
	}
`;

const Note = styled.span<{ $compact: boolean }>`
	font-size: ${({ $compact }) => ($compact ? "12px" : "15px")};
	color: var(--text-dimmer);
	text-align: left;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
`;

const SubTitleRow = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1px;
`;

const SubTitleText = styled.span<{ $dim?: boolean }>`
	font-size: 12px;
	color: ${({ $dim }) => ($dim ? "var(--text-dimmer)" : "var(--text-dim)")};
`;

const BadgeRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 10px;
	font-size: 12px;
`;

const StatusText = styled.span<{ $color: string }>`
	display: flex;
	align-items: center;
	gap: 5px;
	font-weight: 600;
	color: ${({ $color }) => $color};

	&::before {
		content: "";
		width: 6px;
		height: 6px;
		border-radius: 999px;
		background: ${({ $color }) => $color};
	}
`;

const MediaTypeText = styled.span`
	display: flex;
	align-items: center;
	gap: 4px;
	color: var(--text-dim);
`;

const DatesRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	font-size: 12px;
	color: var(--text-dimmer);
	font-family: var(--font-mono);
`;

const Meta = styled.div<{ $compact: boolean }>`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 8px;
	font-size: ${({ $compact }) => ($compact ? "11px" : "13px")};
`;

const Rating = styled.span<{ $color: string }>`
	display: flex;
	align-items: center;
	gap: 3px;
	color: ${({ $color }) => $color};
	font-weight: 600;
`;

const EpisodeText = styled.span<{ $color: string }>`
	color: ${({ $color }) => $color};
	font-weight: 600;
	white-space: nowrap;
`;

const ProgressTrack = styled.div<{ $compact: boolean }>`
	position: relative;
	flex-shrink: 0;
	width: ${({ $compact }) => ($compact ? "80px" : "144px")};
	height: 5px;
	border-radius: 999px;
	background: var(--bg-4);
	overflow: hidden;
`;

const ProgressFill = styled.div<{ $color: string }>`
	height: 100%;
	border-radius: 999px;
	background: ${({ $color }) => $color};
	width: var(--percent, 0%);
`;

const Actions = styled.div<{ $forceOpen?: boolean }>`
	position: relative;
	z-index: 2;
	display: flex;
	align-items: center;
	gap: 6px;
	flex-shrink: 0;
	opacity: ${({ $forceOpen }) => ($forceOpen ? 1 : 0)};
	pointer-events: ${({ $forceOpen }) => ($forceOpen ? "auto" : "none")};
	transition: opacity 150ms;

	${Card}:hover & {
		opacity: 1;
		pointer-events: auto;
	}
`;

interface Props {
	entry: Entry;
	order?: number;
	sections: Section[];
	/** Small, no hover actions, whole card navigates — used on the Overview page. Defaults to the full-width row used in List View elsewhere. */
	compact?: boolean;
	/** Commits a new 0-based position for this entry within its section's custom order. Only relevant (and only rendered) in the non-compact row. */
	onReorder?: (newIndex: number) => void;
}

const formatDate = (ms: number) => new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

export const EntryListItem = React.memo(({ entry, order, sections, compact = false, onReorder }: Props) => {
	const { displayTitle, displayCover, displayTotalEpisodes: total } = resolveEntry(entry);
	const current = entry.progress ?? 0;
	const percent = total ? Math.min(100, (current / total) * 100) : 0;
	const color = STATUS_COLORS[entry.status];
	const ratingValue = entry.score ?? entry.source?.communityRating ?? null;
	const ratingColor = entry.score != null ? "var(--color-accent)" : "#fbbf24";
	const altTitle = entry.source?.englishTitle && entry.source.englishTitle !== displayTitle ? entry.source.englishTitle : null;
	const MediaIcon = MEDIA_ICONS[entry.mediaType];
	const { mutate: adjustProgress } = useAdjustEntryProgress();
	const { mutate: moveEntry } = useMoveEntryToSection();
	const { mutate: updateMediaType } = useUpdateEntryMediaType();
	const { mutate: updateStatus } = useUpdateEntryStatus();
	const { anyOpen: menuOpen, setMenuOpen } = useOpenMenuTracker();
	const { openPanel } = useEntryPanel();

	const [orderValue, setOrderValue] = useState(order != null ? String(order) : "");
	useEffect(() => {
		if (order != null) setOrderValue(String(order));
	}, [order]);

	const commitOrder = () => {
		if (order == null || !onReorder) return;
		const parsed = Number.parseInt(orderValue, 10);
		if (Number.isNaN(parsed) || parsed === order) {
			setOrderValue(String(order));
			return;
		}
		onReorder(parsed);
	};

	return (
		<Card $color={color} $compact={compact}>
			{compact && <CardButton onClick={() => openPanel(entry.id)} />}

			{!compact && order != null && (
				<OrderColumn $color={color}>
					<OrderInput
						$color={color}
						type="text"
						inputMode="numeric"
						value={orderValue}
						onChange={(e) => setOrderValue(e.target.value.replace(/[^0-9]/g, ""))}
						onBlur={commitOrder}
						onKeyDown={(e) => {
							if (e.key === "Enter") e.currentTarget.blur();
							if (e.key === "Escape") setOrderValue(String(order));
						}}
					/>
				</OrderColumn>
			)}

			<Content $compact={compact}>
				<CoverWrap $compact={compact}>
					<EntryCoverCompact src={displayCover ?? undefined} onClick={() => openPanel(entry.id)} favorite={entry.favorite} />
				</CoverWrap>

				<Info>
					<Title onClick={() => openPanel(entry.id)} $compact={compact}>
						{displayTitle}
					</Title>

					{!compact && (altTitle || entry.source?.japaneseTitle) && (
						<SubTitleRow>
							{altTitle && <SubTitleText>{altTitle}</SubTitleText>}
							{entry.source?.japaneseTitle && <SubTitleText $dim>{entry.source.japaneseTitle}</SubTitleText>}
						</SubTitleRow>
					)}

					{!compact && (
						<BadgeRow>
							<StatusText $color={color}>{STATUS_LABELS[entry.status]}</StatusText>
							<MediaTypeText>
								<MediaIcon size={13} /> {MEDIA_TYPE_LABELS[entry.mediaType]}
							</MediaTypeText>
						</BadgeRow>
					)}

					{compact && entry.note ? (
						<Note $compact={compact}>{entry.note}</Note>
					) : (
						<Meta $compact={compact}>
							{ratingValue != null && (
								<Rating $color={ratingColor}>
									<Star size={compact ? 11 : 13} fill={ratingColor} />
									{ratingValue}
								</Rating>
							)}
							{total != null && (
								<>
									<EpisodeText $color={color}>
										EP {current} / {total}
									</EpisodeText>
									<ProgressTrack $compact={compact}>
										<ProgressFill $color={color} style={{ "--percent": `${percent}%` } as React.CSSProperties} />
									</ProgressTrack>
								</>
							)}
						</Meta>
					)}

					{!compact && (
						<DatesRow>
							{entry.source?.airedFrom != null && <span>Released {formatDate(entry.source.airedFrom)}</span>}
							<span>Added {formatDate(entry.timestamps.added)}</span>
						</DatesRow>
					)}

					{!compact && entry.note && <Note $compact={compact}>{entry.note}</Note>}
				</Info>

				{!compact && (
					<Actions $forceOpen={menuOpen}>
						<EpisodeStepper current={current} total={total ?? undefined} onChange={(delta) => adjustProgress({ entry, delta })} />
						<MediaTypeMenu mediaType={entry.mediaType} onChange={(mediaType) => updateMediaType({ entry, mediaType })} onOpenChange={(open) => setMenuOpen("mediaType", open)} />
						<StatusMenu status={entry.status} onChange={(status) => updateStatus({ entry, status })} onOpenChange={(open) => setMenuOpen("status", open)} />
						<MoveMenu
							sections={sections}
							entryId={entry.id}
							onMove={(sectionId) => moveEntry({ entryId: entry.id, targetSectionId: sectionId, sections })}
							onOpenChange={(open) => setMenuOpen("move", open)}
						/>
						<OpenButton to={`/anime/${entry.id}`} />
					</Actions>
				)}
			</Content>
		</Card>
	);
});
