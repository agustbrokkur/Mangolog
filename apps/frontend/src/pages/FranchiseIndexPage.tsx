import styled from "styled-components";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { FolderOpen, Pencil, Trash2, X } from "lucide-react";
import { useAnimu, useDeleteFranchise, useUpdateEntryFranchise, useUpdateFranchise } from "../hooks/useAnime";
import type { Franchise } from "../types/franchise";
import type { Entry } from "../types/entry";
import { resolveEntry } from "../types/entry";
import { ActionButton, EditRow, EditLabel, Input, TagChip, TagChips } from "../components/entry/EntryDetailBody.styles";
import { FormDialog } from "../components/ui/FormDialog";
import { EntryPickList } from "../components/ui/EntryPickList";
import { AddButton } from "../components/layout/actions/AddButton";
import { useConfirm } from "../hooks/useConfirm";

const Wrap = styled.div`
	overflow-y: auto;
`;

const Header = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
	padding: 28px 24px 20px;
	border-bottom: 1px solid var(--border);
`;

const HeaderTop = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 18px;
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

const FranchiseCount = styled.span`
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

const HeaderHint = styled.span`
	font-size: 13px;
	color: var(--text-dimmer);
`;

const CardsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 14px;
	padding: 20px 24px 24px;
`;

const Card = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 14px 16px;
	background: var(--bg-3);
	border: 1px solid var(--border);
	border-radius: var(--radius-lg);
`;

const CardLink = styled(Link)`
	display: flex;
	align-items: center;
	gap: 12px;
	text-decoration: none;
`;

const Cover = styled.img`
	width: 44px;
	height: 44px;
	border-radius: var(--radius);
	object-fit: cover;
	flex-shrink: 0;
`;

const CoverFallback = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 44px;
	height: 44px;
	border-radius: var(--radius);
	background: var(--bg-4);
	color: var(--color-brand);
	flex-shrink: 0;
`;

const CardBody = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
`;

const CardTitle = styled.span`
	font-size: 15px;
	font-weight: 700;
	color: var(--text);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const CardCount = styled.span`
	font-size: 13px;
	color: var(--text-dim);
`;

const CardActions = styled.div`
	display: flex;
	gap: 8px;
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
	max-width: 420px;
`;

export const FranchiseIndexView = () => {
	const { data: animu } = useAnimu();
	const franchises = useMemo(() => (animu ? Object.values(animu.franchises).sort((a, b) => a.title.localeCompare(b.title)) : []), [animu]);

	const [renaming, setRenaming] = useState<Franchise | null>(null);
	const [titleInput, setTitleInput] = useState("");
	const [coverInput, setCoverInput] = useState("");

	const [creating, setCreating] = useState(false);
	const [createTitleInput, setCreateTitleInput] = useState("");
	const [selectedEntries, setSelectedEntries] = useState<Entry[]>([]);

	const { mutate: updateFranchise } = useUpdateFranchise();
	const { mutate: deleteFranchise } = useDeleteFranchise();
	const { mutate: assignEntryFranchise } = useUpdateEntryFranchise();
	const { confirm, confirmUI } = useConfirm();

	const openRename = (franchise: Franchise) => {
		setTitleInput(franchise.title);
		setCoverInput(franchise.coverUrl ?? "");
		setRenaming(franchise);
	};

	const handleSubmit = () => {
		const title = titleInput.trim();
		if (!title || !renaming) return;

		updateFranchise({ franchiseId: renaming.id, patch: { title, coverUrl: coverInput.trim() ? coverInput.trim() : null } });
		setRenaming(null);
	};

	const openCreate = () => {
		setCreateTitleInput("");
		setSelectedEntries([]);
		setCreating(true);
	};

	const pickCandidate = (entry: Entry) => {
		setSelectedEntries((prev) => (prev.some((e) => e.id === entry.id) ? prev : [...prev, entry]));
	};

	const removeSelected = (entryId: string) => setSelectedEntries((prev) => prev.filter((e) => e.id !== entryId));

	const candidateEntries = useMemo(() => {
		if (!animu) return [];
		const selectedIds = new Set(selectedEntries.map((e) => e.id));
		return Object.values(animu.entries).filter((e) => !selectedIds.has(e.id));
	}, [animu, selectedEntries]);

	const handleCreateSubmit = () => {
		const title = createTitleInput.trim();
		if (!title || selectedEntries.length === 0) return;

		for (const entry of selectedEntries) assignEntryFranchise({ entryId: entry.id, title });
		setCreating(false);
	};

	const handleDelete = async (franchise: Franchise) => {
		const ok = await confirm({
			title: "Delete franchise?",
			message: `Are you sure you want to delete "${franchise.title}"? Entries in it won't be deleted, just unassigned.`,
			confirmLabel: "Delete",
			danger: true,
		});
		if (ok) deleteFranchise(franchise.id);
	};

	return (
		<Wrap>
			<Header>
				<HeaderTop>
					<PageHeader>
						<FolderOpen size={24} />
						Franchises
						<FranchiseCount>{franchises.length}</FranchiseCount>
					</PageHeader>
					<AddButton onClick={openCreate} />
				</HeaderTop>
				<HeaderHint>Group entries into a franchise here, or set an entry's "Franchise / Series Group" field from its edit panel to add it to one.</HeaderHint>
			</Header>

			{franchises.length === 0 ? (
				<EmptyState>
					<EmptyTitle>No franchises yet</EmptyTitle>
					<EmptyHint>Create one from a group of entries, or set the "Franchise / Series Group" field on an entry's edit panel.</EmptyHint>
				</EmptyState>
			) : (
				<CardsGrid>
					{franchises.map((franchise) => (
						<Card key={franchise.id}>
							<CardLink to={`/franchises/${franchise.id}`}>
								{franchise.coverUrl ? (
									<Cover src={franchise.coverUrl} loading="lazy" decoding="async" />
								) : (
									<CoverFallback>
										<FolderOpen size={18} />
									</CoverFallback>
								)}
								<CardBody>
									<CardTitle>{franchise.title}</CardTitle>
									<CardCount>{franchise.entryIds.length} entries</CardCount>
								</CardBody>
							</CardLink>
							<CardActions>
								<ActionButton onClick={() => openRename(franchise)}>
									<Pencil size={13} /> Rename
								</ActionButton>
								<ActionButton $danger onClick={() => handleDelete(franchise)}>
									<Trash2 size={13} /> Delete
								</ActionButton>
							</CardActions>
						</Card>
					))}
				</CardsGrid>
			)}

			{renaming && (
				<FormDialog title="Edit Franchise" confirmLabel="Save" onSubmit={handleSubmit} onCancel={() => setRenaming(null)} submitDisabled={!titleInput.trim()}>
					<EditRow>
						<EditLabel>Title</EditLabel>
						<Input type="text" value={titleInput} onChange={(e) => setTitleInput(e.target.value)} placeholder="e.g. Fate, Monogatari, Initial D..." autoFocus />
					</EditRow>
					<EditRow>
						<EditLabel>Cover URL</EditLabel>
						<Input type="text" value={coverInput} onChange={(e) => setCoverInput(e.target.value)} placeholder="https://..." />
					</EditRow>
				</FormDialog>
			)}

			{creating && (
				<FormDialog title="Create Franchise" confirmLabel="Create" wide onSubmit={handleCreateSubmit} onCancel={() => setCreating(false)} submitDisabled={!createTitleInput.trim() || selectedEntries.length === 0}>
					<EditRow>
						<EditLabel>Title</EditLabel>
						<Input type="text" value={createTitleInput} onChange={(e) => setCreateTitleInput(e.target.value)} placeholder="e.g. Fate, Monogatari, Initial D..." autoFocus />
					</EditRow>
					<EditRow>
						<EditLabel>Entries</EditLabel>
						{selectedEntries.length > 0 && (
							<TagChips>
								{selectedEntries.map((entry) => (
									<TagChip key={entry.id}>
										{resolveEntry(entry).displayTitle}
										<button type="button" onClick={() => removeSelected(entry.id)}>
											<X size={11} />
										</button>
									</TagChip>
								))}
							</TagChips>
						)}
						<EntryPickList entries={candidateEntries} onPick={pickCandidate} />
					</EditRow>
				</FormDialog>
			)}

			{confirmUI}
		</Wrap>
	);
};
