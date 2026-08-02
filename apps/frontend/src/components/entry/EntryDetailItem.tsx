import { Star } from "lucide-react";
import type { Entry } from "../../types/entry";
import { resolveEntry } from "../../types/entry";
import type { Section } from "../../types/section";
import { MEDIA_ICONS } from "../../types/mediaType";
import type { Status } from "../../types/status";
import { STATUS_LABELS } from "../../types/status";
import { EntryCover } from "../layout/entry/EntryCover";
import { EpisodeProgress } from "../layout/entry/EpisodeProgress";
import { EpisodeStepper } from "../layout/entry/EpisodeStepper";
import { MoveMenu } from "../layout/entry/MoveMenu";
import { MediaTypeMenu } from "../layout/entry/MediaTypeMenu";
import { StatusMenu } from "../layout/entry/StatusMenu";
import { OpenButton } from "../layout/entry/OpenButton";
import { EntryTitle } from "../layout/entry/EntryTitle";
import { EntryText } from "../layout/entry/EntryText";
import { EntryPill } from "../layout/entry/EntryPill";
import { Actions, Card, Field, FieldLabel, Info, Row } from "./EntryDetailItem.styles";
import React from "react";
import { useAdjustEntryProgress, useMoveEntryToSection, useUpdateEntryMediaType, useUpdateEntryStatus } from "../../hooks/useAnime";
import { useOpenMenuTracker } from "../../hooks/useOpenMenuTracker";
import { useEntryPanel } from "../../context/EntryPanelContext";

const STATUS_COLORS: Record<Status, [string, string, string]> = {
	unsorted: ["#9ca3af", "rgba(55,65,81,0.4)", "#374151"],
	backlog: ["#fbbf24", "rgba(120,53,15,0.4)", "#92400e"],
	watching: ["#378ADD", "rgba(30,58,138,0.4)", "#1e40af"],
	on_hold: ["#c084fc", "rgba(88,28,135,0.4)", "#6b21a8"],
	watched: ["#5DCAA5", "rgba(19,78,74,0.4)", "#115e59"],
	dropped: ["#f87171", "rgba(127,29,29,0.4)", "#991b1b"],
};

interface EntryDetailItemProps {
	entry: Entry;
	order?: number;
	sections: Section[];
}

export const EntryDetailItem = React.memo(({ entry, order, sections }: EntryDetailItemProps) => {
	const Icon = MEDIA_ICONS[entry.mediaType];
	const { displayTitle, displayCover, displayTotalEpisodes: total } = resolveEntry(entry);
	const [statusColor, statusBg, statusBorder] = STATUS_COLORS[entry.status];
	const { mutate: adjustProgress } = useAdjustEntryProgress();
	const { mutate: moveEntry } = useMoveEntryToSection();
	const { mutate: updateMediaType } = useUpdateEntryMediaType();
	const { mutate: updateStatus } = useUpdateEntryStatus();
	const { anyOpen: menuOpen, setMenuOpen } = useOpenMenuTracker();
	const { openPanel } = useEntryPanel();

	return (
		<Card>
			<EntryCover src={displayCover ?? undefined} title={displayTitle} onClick={() => openPanel(entry.id)} favorite={entry.favorite} />

			<Info>
				<div>
					<EntryPill color={statusColor} bg={statusBg} border={statusBorder}>
						{STATUS_LABELS[entry.status].toUpperCase()}
					</EntryPill>
				</div>

				<EntryTitle
					onClick={() => openPanel(entry.id)}
					title={`${displayTitle} (${entry.mediaType.toUpperCase()})`}
					subtitle={entry.source?.japaneseTitle}
					englishSubtitle={entry.source?.englishTitle}
				/>

				<Row>
					<EntryText $muted>Added: {new Date(entry.timestamps.added).toLocaleDateString()}</EntryText>
					{entry.source?.airedFrom != null && <EntryText $muted>Released: {new Date(entry.source.airedFrom).toLocaleDateString()}</EntryText>}
					<div>{total != null && <EpisodeProgress current={entry.progress ?? 0} total={total} color={statusColor} />}</div>
				</Row>

				<Row>
					{order != null && <EntryPill>#{order}</EntryPill>}
					{entry.score != null && (
						<EntryPill color="var(--color-accent)" bg="var(--color-accent-dim)" border="var(--color-accent)">
							<Star size={11} fill="var(--color-accent)" />
							{entry.score}
						</EntryPill>
					)}
					{entry.source?.communityRating != null && (
						<EntryPill color="#fbbf24" bg="rgba(120,53,15,0.4)" border="#78350f">
							<Star size={11} fill="#fbbf24" />
							{entry.source.communityRating}
						</EntryPill>
					)}
					<EntryPill>
						<Icon size={12} />
						{entry.mediaType.toUpperCase()}
					</EntryPill>
					{total != null && <EntryPill>{total} ep</EntryPill>}
					{entry.source?.studios[0] && <EntryPill>{entry.source.studios[0]}</EntryPill>}
					{entry.source?.genres.map((g) => (
						<EntryPill key={g} color="#d8b4fe" bg="rgba(88,28,135,0.3)" border="#581c87">
							{g}
						</EntryPill>
					))}
				</Row>

				{entry.source?.synopsis && (
					<Field>
						<FieldLabel>Synopsis</FieldLabel>
						<EntryText $clamp={2}>{entry.source.synopsis}</EntryText>
					</Field>
				)}
				{entry.note && (
					<Field>
						<FieldLabel>Your Note</FieldLabel>
						<EntryText $italic>{entry.note}</EntryText>
					</Field>
				)}

				<Actions $forceOpen={menuOpen}>
					<EpisodeStepper current={entry.progress ?? 0} total={total ?? undefined} onChange={(delta) => adjustProgress({ entry, delta })} />
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
			</Info>
		</Card>
	);
});
