// hooks/useEntryEditor.ts
import { useEffect, useState } from "react";
import { useDeleteEntry, useUpdateEntry, useUpdateEntryFranchise } from "./useAnime";
import { useConfirm } from "./useConfirm";
import type { Entry } from "../types/entry";

const toDateInputValue = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/** Shared edit-form, notes, and delete-confirmation state for an entry — used by both the side panel and the full detail page so they stay in sync. */
export function useEntryEditor(entry: Entry, currentFranchiseTitle: string | null) {
	const { mutate: updateEntryMutate } = useUpdateEntry();
	const { mutate: updateFranchiseMutate } = useUpdateEntryFranchise();
	const { mutate: deleteEntryMutate } = useDeleteEntry();
	const { confirm, confirmUI } = useConfirm();

	const [editing, setEditing] = useState(false);
	const [titleInput, setTitleInput] = useState("");
	const [progressInput, setProgressInput] = useState("");
	const [totalEpisodesInput, setTotalEpisodesInput] = useState("");
	const [ratingInput, setRatingInput] = useState("");
	const [dateAddedInput, setDateAddedInput] = useState("");
	const [coverInput, setCoverInput] = useState("");
	const [franchiseInput, setFranchiseInput] = useState("");
	const [tagsState, setTagsState] = useState<string[]>([]);
	const [tagDraft, setTagDraft] = useState("");

	const [notesEditing, setNotesEditing] = useState(false);
	const [notesValue, setNotesValue] = useState("");

	useEffect(() => {
		setEditing(false);
		setNotesEditing(false);
	}, [entry.id]);

	const openEdit = () => {
		setTitleInput(entry.title);
		setProgressInput(entry.progress != null ? String(entry.progress) : "");
		setTotalEpisodesInput(entry.totalEpisodesOverride != null ? String(entry.totalEpisodesOverride) : "");
		setRatingInput(entry.score != null ? String(entry.score) : "");
		setDateAddedInput(toDateInputValue(entry.timestamps.added));
		setCoverInput(entry.coverOverride ?? "");
		setFranchiseInput(currentFranchiseTitle ?? "");
		setTagsState(entry.tags ?? []);
		setTagDraft("");
		setEditing(true);
	};

	const handleAddTag = () => {
		const t = tagDraft.trim();
		if (!t || tagsState.includes(t)) {
			setTagDraft("");
			return;
		}
		setTagsState([...tagsState, t]);
		setTagDraft("");
	};

	const removeTag = (t: string) => setTagsState(tagsState.filter((existing) => existing !== t));

	const handleSave = () => {
		const progress = progressInput.trim() === "" ? null : Number(progressInput);
		const totalEpisodes = totalEpisodesInput.trim() === "" ? null : Number(totalEpisodesInput);
		const score = ratingInput.trim() === "" ? null : Number(ratingInput);
		const addedMs = dateAddedInput ? new Date(dateAddedInput).getTime() : entry.timestamps.added;

		updateEntryMutate({
			entry,
			patch: {
				title: titleInput.trim() ? titleInput.trim() : entry.title,
				coverOverride: coverInput.trim() ? coverInput.trim() : null,
				progress: progress != null && Number.isFinite(progress) ? Math.max(0, progress) : null,
				totalEpisodesOverride: totalEpisodes != null && Number.isFinite(totalEpisodes) ? Math.max(0, totalEpisodes) : null,
				score: score != null && Number.isFinite(score) ? score : null,
				tags: tagsState,
				timestamps: { ...entry.timestamps, added: addedMs, updated: Date.now() },
			},
		});

		const trimmedFranchise = franchiseInput.trim();
		if (trimmedFranchise !== (currentFranchiseTitle ?? "")) {
			updateFranchiseMutate({ entryId: entry.id, title: trimmedFranchise ? trimmedFranchise : null });
		}

		setEditing(false);
	};

	const startNotesEdit = () => {
		setNotesValue(entry.note ?? "");
		setNotesEditing(true);
	};

	const saveNotes = () => {
		const trimmed = notesValue.trim();
		updateEntryMutate({ entry, patch: { note: trimmed ? trimmed : null } });
		setNotesEditing(false);
	};

	const handleDeleteClick = async (onDeleted: () => void) => {
		const ok = await confirm({
			title: "Delete entry?",
			message: `Are you sure you want to delete "${entry.title}"? This can't be undone.`,
			confirmLabel: "Delete",
			danger: true,
		});
		if (!ok) return;
		deleteEntryMutate(entry.id, { onSuccess: onDeleted });
	};

	return {
		editing,
		setEditing,
		titleInput,
		setTitleInput,
		progressInput,
		setProgressInput,
		totalEpisodesInput,
		setTotalEpisodesInput,
		ratingInput,
		setRatingInput,
		dateAddedInput,
		setDateAddedInput,
		coverInput,
		setCoverInput,
		franchiseInput,
		setFranchiseInput,
		tagsState,
		tagDraft,
		setTagDraft,
		openEdit,
		handleAddTag,
		removeTag,
		handleSave,
		notesEditing,
		setNotesEditing,
		notesValue,
		setNotesValue,
		startNotesEdit,
		saveNotes,
		handleDeleteClick,
		confirmUI,
	};
}
