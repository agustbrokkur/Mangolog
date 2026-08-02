// EntryDetailBody.tsx
import { useState } from "react";
import { FolderOpen, Pencil, Plus, RefreshCw, Star, Trash2, X } from "lucide-react";
import { useAdjustEntryProgress, useAnimu, useMoveEntryToSection, useUpdateEntryMediaType, useUpdateEntryStatus } from "../../hooks/useAnime";
import { useApplyEntrySource } from "../../hooks/useSources";
import { useEntryEditor } from "../../hooks/useEntryEditor";
import { resolveEntry, type Entry } from "../../types/entry";
import type { Section } from "../../types/section";
import type { Status } from "../../types/status";
import { STATUS_LABELS } from "../../types/status";
import { MEDIA_ICONS, MEDIA_TYPE_LABELS } from "../../types/mediaType";
import { EpisodeStepper } from "../layout/entry/EpisodeStepper";
import { MediaTypeMenu } from "../layout/entry/MediaTypeMenu";
import { StatusMenu } from "../layout/entry/StatusMenu";
import { MoveMenu } from "../layout/entry/MoveMenu";
import { SourceMatchPicker } from "../source/SourceMatchPicker";
import { ImageLightbox } from "../ui/ImageLightbox";
import {
	ActionButton,
	ActionsRow,
	AddedDate,
	AltTitle,
	CancelButton,
	Cover,
	CoverWrap,
	DateHint,
	EditActions,
	EditLabel,
	EditPanel,
	EditRow,
	EditToggleButton,
	EpisodeRow,
	EpisodeSep,
	FieldLabel,
	FranchiseLine,
	Input,
	JpTitle,
	MetaCol,
	NoteDisplay,
	NoteEdit,
	NoteEmpty,
	NotesBlock,
	NoteTextarea,
	ProgressBar,
	ProgressFill,
	ProgressLabel,
	ProgressWrap,
	ReleaseDate,
	SaveButton,
	SectionBadge,
	StatBox,
	StatGrid,
	StatLabel,
	StatValue,
	SynopsisBlock,
	SynopsisText,
	Tag,
	TagChip,
	TagChips,
	TagInputRow,
	TagRow,
	Title,
	Top,
} from "./EntryDetailBody.styles";

const STATUS_COLORS: Record<Status, string> = {
	unsorted: "#9ca3af",
	backlog: "#fbbf24",
	watching: "#378ADD",
	on_hold: "#c084fc",
	watched: "#5DCAA5",
	dropped: "#f87171",
};

const formatAddedDate = (ms: number) => new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
const formatDMY = (ms: number) => new Date(ms).toLocaleDateString();
const formatLongDate = (ms: number) => new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

interface EntryDetailBodyProps {
	entry: Entry;
	sections: Section[];
	onDeleted: () => void;
	/** Bigger cover/title/stat-grid for the full detail page; the side panel stays compact. */
	large?: boolean;
}

export const EntryDetailBody = ({ entry, sections, onDeleted, large }: EntryDetailBodyProps) => {
	const { data: animu } = useAnimu();
	const { mutate: moveEntry } = useMoveEntryToSection();
	const { mutate: adjustProgress } = useAdjustEntryProgress();
	const { mutate: updateMediaType } = useUpdateEntryMediaType();
	const { mutate: updateStatus } = useUpdateEntryStatus();
	const { mutate: applySource } = useApplyEntrySource();
	const [pickingSource, setPickingSource] = useState(false);
	const [lightboxOpen, setLightboxOpen] = useState(false);

	const currentFranchiseTitle = animu ? (Object.values(animu.franchises).find((f) => f.entryIds.includes(entry.id))?.title ?? null) : null;

	const editor = useEntryEditor(entry, currentFranchiseTitle);

	const { displayTitle, displayCover, displayTotalEpisodes: total } = resolveEntry(entry);
	const statusColor = STATUS_COLORS[entry.status];
	const Icon = MEDIA_ICONS[entry.mediaType];
	const year = entry.source?.airedFrom != null ? new Date(entry.source.airedFrom).getFullYear() : null;
	const current = entry.progress ?? 0;
	const percent = total ? Math.min(100, (current / total) * 100) : 0;
	const altTitle = entry.source?.englishTitle && entry.source.englishTitle !== displayTitle ? entry.source.englishTitle : null;

	return (
		<>
			<Top $large={large}>
				<CoverWrap>
					<Cover $clickable={!!displayCover} onClick={() => displayCover && setLightboxOpen(true)}>
						{displayCover && <img src={displayCover} alt={displayTitle} />}
					</Cover>
				</CoverWrap>

				<MetaCol $large={large}>
					<SectionBadge $color={statusColor} $large={large}>
						{STATUS_LABELS[entry.status]}
					</SectionBadge>

					<Title $large={large}>{displayTitle}</Title>

					{currentFranchiseTitle && (
						<FranchiseLine $large={large}>
							<FolderOpen size={13} /> {currentFranchiseTitle}
						</FranchiseLine>
					)}

					<AddedDate $large={large}>Added {formatAddedDate(entry.timestamps.added)}</AddedDate>

					{entry.source?.airedFrom != null && <ReleaseDate $large={large}>Released: {formatLongDate(entry.source.airedFrom)}</ReleaseDate>}

					{altTitle && <AltTitle $large={large}>{altTitle}</AltTitle>}
					{entry.source?.japaneseTitle && <JpTitle $large={large}>{entry.source.japaneseTitle}</JpTitle>}

					{total != null && (
						<ProgressWrap>
							<ProgressBar $large={large}>
								<ProgressFill $percent={percent} $color={statusColor} />
							</ProgressBar>
							<ProgressLabel $large={large}>
								{current} / {total}
							</ProgressLabel>
						</ProgressWrap>
					)}

					{entry.tags && entry.tags.length > 0 && (
						<TagRow>
							{entry.tags.map((t) => (
								<Tag key={t} $color="var(--color-accent)" $bg="var(--color-accent-dim)" $large={large}>
									{t}
								</Tag>
							))}
						</TagRow>
					)}

					{entry.source?.genres && entry.source.genres.length > 0 && (
						<TagRow>
							{entry.source.genres.map((g) => (
								<Tag key={g} $color="var(--color-purple)" $bg="var(--color-purple-dim)" $large={large}>
									{g}
								</Tag>
							))}
						</TagRow>
					)}

					<StatGrid $large={large}>
						<StatBox $large={large}>
							<StatLabel $large={large}>Your Score</StatLabel>
							<StatValue $color="var(--color-accent)" $muted={entry.score == null} $large={large}>
								{entry.score != null ? (
									<>
										<Star size={12} fill="var(--color-accent)" /> {entry.score}
									</>
								) : (
									"—"
								)}
							</StatValue>
						</StatBox>
						<StatBox $large={large}>
							<StatLabel $large={large}>Community Score</StatLabel>
							<StatValue $color="var(--color-gold)" $muted={entry.source?.communityRating == null} $large={large}>
								{entry.source?.communityRating != null ? (
									<>
										<Star size={12} fill="var(--color-gold)" /> {entry.source.communityRating}
									</>
								) : (
									"—"
								)}
							</StatValue>
						</StatBox>
						<StatBox $large={large}>
							<StatLabel $large={large}>Episodes</StatLabel>
							<StatValue $large={large}>
								{current} / {total ?? "?"}
							</StatValue>
						</StatBox>
						<StatBox $large={large}>
							<StatLabel $large={large}>Status</StatLabel>
							<StatValue $large={large}>{STATUS_LABELS[entry.status]}</StatValue>
						</StatBox>
						<StatBox $large={large}>
							<StatLabel $large={large}>Year</StatLabel>
							<StatValue $muted={year == null} $large={large}>
								{year ?? "—"}
							</StatValue>
						</StatBox>
						<StatBox $large={large}>
							<StatLabel $large={large}>Type</StatLabel>
							<StatValue $large={large}>
								<Icon size={12} /> {MEDIA_TYPE_LABELS[entry.mediaType]}
							</StatValue>
						</StatBox>
						<StatBox $span2={!large} $large={large}>
							<StatLabel $large={large}>Studio</StatLabel>
							<StatValue $muted={!entry.source?.studios[0]} $large={large}>
								{entry.source?.studios[0] ?? "—"}
							</StatValue>
						</StatBox>
					</StatGrid>
				</MetaCol>
			</Top>

			{entry.source?.synopsis && (
				<SynopsisBlock>
					<FieldLabel $large={large}>Synopsis</FieldLabel>
					<SynopsisText $large={large}>{entry.source.synopsis}</SynopsisText>
				</SynopsisBlock>
			)}

			<NotesBlock>
				<FieldLabel $large={large}>Your Notes</FieldLabel>
				{editor.notesEditing ? (
					<NoteEdit>
						<NoteTextarea
							$large={large}
							autoFocus
							rows={3}
							value={editor.notesValue}
							onChange={(e) => editor.setNotesValue(e.target.value)}
							placeholder="Add your notes..."
						/>
						<EditActions>
							<SaveButton $large={large} onClick={editor.saveNotes}>
								Save
							</SaveButton>
							<CancelButton $large={large} onClick={() => editor.setNotesEditing(false)}>
								Cancel
							</CancelButton>
						</EditActions>
					</NoteEdit>
				) : (
					<NoteDisplay $large={large} onClick={editor.startNotesEdit}>
						{entry.note ? <p>{entry.note}</p> : <NoteEmpty $large={large}>Click to add notes...</NoteEmpty>}
					</NoteDisplay>
				)}
			</NotesBlock>

			{!editor.editing ? (
				<EditToggleButton $large={large} onClick={editor.openEdit}>
					<Pencil size={13} /> Edit entry details
				</EditToggleButton>
			) : (
				<EditPanel $large={large}>
					<FieldLabel $large={large}>Edit Entry</FieldLabel>

					<EditRow>
						<EditLabel $large={large}>Title</EditLabel>
						<Input $large={large} type="text" value={editor.titleInput} onChange={(e) => editor.setTitleInput(e.target.value)} placeholder={displayTitle} />
					</EditRow>

					<EditRow>
						<EditLabel $large={large}>Episode Progress</EditLabel>
						<EpisodeRow>
							<Input
								$large={large}
								type="number"
								min={0}
								value={editor.progressInput}
								onChange={(e) => editor.setProgressInput(e.target.value)}
								placeholder="Current"
							/>
							<EpisodeSep>/</EpisodeSep>
							<Input
								$large={large}
								type="number"
								min={0}
								value={editor.totalEpisodesInput}
								onChange={(e) => editor.setTotalEpisodesInput(e.target.value)}
								placeholder={entry.source?.totalEpisodes != null ? String(entry.source.totalEpisodes) : "Total"}
							/>
						</EpisodeRow>
					</EditRow>

					<EditRow>
						<EditLabel $large={large}>Your Rating (1-10)</EditLabel>
						<Input
							$large={large}
							type="number"
							min={1}
							max={10}
							step={0.5}
							style={{ width: 100 }}
							value={editor.ratingInput}
							onChange={(e) => editor.setRatingInput(e.target.value)}
							placeholder="e.g. 8.5"
						/>
					</EditRow>

					<EditRow>
						<EditLabel $large={large}>Date Added</EditLabel>
						<Input $large={large} type="date" value={editor.dateAddedInput} onChange={(e) => editor.setDateAddedInput(e.target.value)} />
						<DateHint $large={large}>Currently: {formatDMY(entry.timestamps.added)}</DateHint>
					</EditRow>

					<EditRow>
						<EditLabel $large={large}>Custom Cover Image URL</EditLabel>
						<Input $large={large} type="text" value={editor.coverInput} onChange={(e) => editor.setCoverInput(e.target.value)} placeholder="https://..." />
					</EditRow>

					<EditRow>
						<EditLabel $large={large}>Franchise / Series Group</EditLabel>
						<Input
							$large={large}
							type="text"
							value={editor.franchiseInput}
							onChange={(e) => editor.setFranchiseInput(e.target.value)}
							placeholder="e.g. Fate, Monogatari, Initial D..."
						/>
					</EditRow>

					<EditRow>
						<EditLabel $large={large}>Tags</EditLabel>
						<TagInputRow>
							<Input
								$large={large}
								type="text"
								value={editor.tagDraft}
								onChange={(e) => editor.setTagDraft(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										editor.handleAddTag();
									}
								}}
								placeholder="Type a tag and press Enter..."
							/>
							<CancelButton $large={large} onClick={editor.handleAddTag}>
								<Plus size={13} /> Add
							</CancelButton>
						</TagInputRow>
						{editor.tagsState.length > 0 && (
							<TagChips>
								{editor.tagsState.map((t) => (
									<TagChip key={t} $large={large}>
										{t}
										<button onClick={() => editor.removeTag(t)}>
											<X size={11} />
										</button>
									</TagChip>
								))}
							</TagChips>
						)}
					</EditRow>

					<EditActions>
						<SaveButton $large={large} onClick={editor.handleSave}>
							Save changes
						</SaveButton>
						<CancelButton $large={large} onClick={() => editor.setEditing(false)}>
							Cancel
						</CancelButton>
					</EditActions>
				</EditPanel>
			)}

			<ActionsRow $large={large}>
				<EpisodeStepper current={current} total={total ?? undefined} onChange={(delta) => adjustProgress({ entry, delta })} />
				<MediaTypeMenu mediaType={entry.mediaType} onChange={(mediaType) => updateMediaType({ entry, mediaType })} />
				<StatusMenu status={entry.status} onChange={(status) => updateStatus({ entry, status })} />
				<MoveMenu sections={sections} entryId={entry.id} onMove={(sectionId) => moveEntry({ entryId: entry.id, targetSectionId: sectionId, sections })} />
				<ActionButton $large={large} onClick={() => setPickingSource(true)}>
					<RefreshCw size={13} /> Refetch Source
				</ActionButton>
				<ActionButton $danger $large={large} onClick={() => editor.handleDeleteClick(onDeleted)}>
					<Trash2 size={13} /> Delete
				</ActionButton>
			</ActionsRow>

			{pickingSource && (
				<SourceMatchPicker
					entryTitle={displayTitle}
					onClose={() => setPickingSource(false)}
					onSelect={(source) => {
						applySource({ entryId: entry.id, source });
						setPickingSource(false);
					}}
				/>
			)}

			{lightboxOpen && displayCover && <ImageLightbox src={displayCover} alt={displayTitle} onClose={() => setLightboxOpen(false)} />}

			{editor.confirmUI}
		</>
	);
};
