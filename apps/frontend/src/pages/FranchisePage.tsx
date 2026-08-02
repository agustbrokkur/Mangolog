import styled from "styled-components";
import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { useParams } from "react-router";
import { FolderOpen } from "lucide-react";
import { EntryRenderer, type ViewMode } from "../components/entry/EntryRenderer";
import { useAnimu, useReorderFranchiseEntries, useUpdateEntryFranchise } from "../hooks/useAnime";
import { ViewModeSwitcher } from "../components/layout/actions/ViewModeSwitcher";
import { AddButton } from "../components/layout/actions/AddButton";
import { FormDialog } from "../components/ui/FormDialog";
import { EntryPickList } from "../components/ui/EntryPickList";
import type { Entry } from "../types/entry";
import { sortedSections } from "../types/section";

const Wrap = styled.div`
	overflow-y: auto;
`;

const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 18px;
	padding: 28px 24px 20px;
	border-bottom: 1px solid var(--border);
`;

const TitleGroup = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

const HeaderActions = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
`;

const FranchiseHeader = styled.h1`
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

export const FranchiseView = () => {
	const { franchiseId } = useParams();
	const { data: animu } = useAnimu();
	const [viewMode, setViewMode] = useState<ViewMode>("list");
	const deferredViewMode = useDeferredValue(viewMode);
	const [adding, setAdding] = useState(false);

	const franchise = franchiseId ? animu?.franchises[franchiseId] : undefined;
	const sections = useMemo(() => (animu ? sortedSections(animu.sections) : []), [animu]);
	const memberIds = useMemo(() => franchise?.entryIds ?? [], [franchise]);
	const entries = useMemo(() => {
		if (!animu) return [];
		return memberIds.map((id) => animu.entries[id]).filter((e): e is Entry => e != null);
	}, [memberIds, animu]);
	const entryOrder = useMemo(() => new Map(memberIds.map((id, index) => [id, index])), [memberIds]);
	const candidateEntries = useMemo(() => {
		if (!animu) return [];
		const memberSet = new Set(memberIds);
		return Object.values(animu.entries).filter((e) => !memberSet.has(e.id));
	}, [animu, memberIds]);

	const { mutate: assignEntryFranchise } = useUpdateEntryFranchise();
	const reorderMutation = useReorderFranchiseEntries();
	const handleReorder = useCallback(
		(entryId: string, newIndex: number) => {
			if (!franchise) return;
			const currentIndex = memberIds.indexOf(entryId);
			if (currentIndex === -1) return;

			const clamped = Math.max(0, Math.min(newIndex, memberIds.length - 1));
			if (clamped === currentIndex) return;

			const next = [...memberIds];
			next.splice(currentIndex, 1);
			next.splice(clamped, 0, entryId);
			reorderMutation.mutate({ franchiseId: franchise.id, entryIds: next });
		},
		[franchise, memberIds, reorderMutation],
	);

	if (!franchise) return null;

	return (
		<Wrap>
			<Header>
				<TitleGroup>
					<FranchiseHeader>
						<FolderOpen size={24} color="var(--color-brand)" />
						{franchise.title}
						<EntryCount>{memberIds.length}</EntryCount>
					</FranchiseHeader>
				</TitleGroup>
				<HeaderActions>
					<ViewModeSwitcher viewMode={viewMode} onViewModeChange={setViewMode} />
					<AddButton onClick={() => setAdding(true)} />
				</HeaderActions>
			</Header>

			{entries.length === 0 ? (
				<EmptyState>
					<EmptyTitle>No entries in this franchise</EmptyTitle>
					<EmptyHint>Add entries above, or assign them to it from their own edit panel.</EmptyHint>
				</EmptyState>
			) : (
				<Container $viewMode={deferredViewMode}>
					{entries.map((entry) => (
						<EntryRenderer key={entry.id} entry={entry} viewMode={deferredViewMode} order={entryOrder.get(entry.id)} sections={sections} onReorder={handleReorder} />
					))}
				</Container>
			)}

			{adding && (
				<FormDialog title="Add Entries" confirmLabel="Done" cancelLabel="Close" wide onSubmit={() => setAdding(false)} onCancel={() => setAdding(false)}>
					<EntryPickList entries={candidateEntries} onPick={(entry) => assignEntryFranchise({ entryId: entry.id, title: franchise.title })} />
				</FormDialog>
			)}
		</Wrap>
	);
};
