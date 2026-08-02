import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { FolderCog, Pencil, Trash2, type LucideIcon } from "lucide-react";
import { useAnimu, useCreateSection, useDeleteSection, useReorderSections, useUpdateSection } from "../hooks/useAnime";
import { GROUP_TYPES, GROUP_TYPE_MAPPINGS, GROUP_ICONS, GROUP_COLOR_VARS, type GroupType } from "../types/groupType";
import { sectionEntryIds, sortedSections, type Section } from "../types/section";
import { ActionButton, EditRow, EditLabel, Input } from "../components/entry/EntryDetailBody.styles";
import { AddButton } from "../components/layout/actions/AddButton";
import { FormDialog } from "../components/ui/FormDialog";
import { GroupMenu } from "../components/layout/entry/GroupMenu";
import { useConfirm } from "../hooks/useConfirm";

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

const SectionCount = styled.span`
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

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 32px;
	padding: 20px 24px 24px;
`;

const Group = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const GroupHeading = styled.h2<{ $color: string }>`
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 15px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	color: ${({ $color }) => $color};
`;

const CardsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
	gap: 18px;
`;

const Card = styled.div<{ $color: string }>`
	display: flex;
	align-items: stretch;
	background: var(--bg-3);
	border: 1px solid color-mix(in srgb, ${({ $color }) => $color} 18%, var(--border));
	border-radius: var(--radius-lg);
	overflow: hidden;
`;

const OrderBox = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	flex-shrink: 0;
	background: var(--bg-2);
	border-right: 1px solid var(--border);
`;

const OrderInput = styled.input<{ $color: string }>`
	width: 100%;
	height: 100%;
	padding: 0;
	text-align: center;
	font-size: 13px;
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

const CardMain = styled.div`
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 14px;
	padding: 16px 18px;
`;

const CardLink = styled(Link)`
	display: flex;
	flex-direction: column;
	gap: 8px;
	text-decoration: none;
`;

const CardLabel = styled.span<{ $color: string }>`
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 15px;
	font-weight: 700;
	line-height: 1.3;
	color: ${({ $color }) => $color};

	svg {
		flex-shrink: 0;
	}
`;

const CardCount = styled.span<{ $color: string }>`
	font-size: 24px;
	font-weight: 800;
	color: ${({ $color }) => $color};
`;

const CardActions = styled.div`
	display: flex;
	gap: 10px;

	> button {
		flex: 1;
		justify-content: center;
	}
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

type DialogState = { mode: "create" } | { mode: "rename"; section: Section };

interface SectionCardProps {
	section: Section;
	color: string;
	Icon: LucideIcon;
	index: number;
	groupSize: number;
	onReorder: (newIndex: number) => void;
	onRename: () => void;
	onDelete: () => void;
}

/** Position within its group is edited the same way entry order is on the list view — a numeric input committed on blur/Enter, not drag-and-drop. */
const SectionCard = ({ section, color, Icon, index, groupSize, onReorder, onRename, onDelete }: SectionCardProps) => {
	const [orderValue, setOrderValue] = useState(String(index));
	useEffect(() => setOrderValue(String(index)), [index]);

	const commitOrder = () => {
		const parsed = Number.parseInt(orderValue, 10);
		if (Number.isNaN(parsed) || parsed === index) {
			setOrderValue(String(index));
			return;
		}
		onReorder(Math.max(0, Math.min(parsed, groupSize - 1)));
	};

	return (
		<Card $color={color}>
			<OrderBox>
				<OrderInput
					$color={color}
					type="text"
					inputMode="numeric"
					value={orderValue}
					onChange={(e) => setOrderValue(e.target.value.replace(/[^0-9]/g, ""))}
					onBlur={commitOrder}
					onKeyDown={(e) => {
						if (e.key === "Enter") e.currentTarget.blur();
						if (e.key === "Escape") setOrderValue(String(index));
					}}
				/>
			</OrderBox>
			<CardMain>
				<CardLink to={`/sections/${section.id}`}>
					<CardLabel $color={color}>
						<Icon size={14} />
						{section.label}
					</CardLabel>
					<CardCount $color={color}>{sectionEntryIds(section).length}</CardCount>
				</CardLink>
				<CardActions>
					<ActionButton onClick={onRename}>
						<Pencil size={13} /> Rename
					</ActionButton>
					<ActionButton $danger onClick={onDelete}>
						<Trash2 size={13} /> Delete
					</ActionButton>
				</CardActions>
			</CardMain>
		</Card>
	);
};

export const SectionsIndexView = () => {
	const { data: animu } = useAnimu();
	const sections = useMemo(() => (animu ? sortedSections(animu.sections) : []), [animu]);

	const [dialog, setDialog] = useState<DialogState | null>(null);
	const [labelInput, setLabelInput] = useState("");
	const [groupInput, setGroupInput] = useState<GroupType>("watching");

	const { mutate: createSection } = useCreateSection();
	const { mutate: updateSection } = useUpdateSection();
	const { mutate: deleteSection } = useDeleteSection();
	const { mutate: reorderSectionsMutate } = useReorderSections();
	const { confirm, confirmUI } = useConfirm();

	const handleReorder = (groupType: GroupType, sectionId: string, newIndex: number) => {
		const groupSections = sections.filter((s) => s.group === groupType);
		const currentIndex = groupSections.findIndex((s) => s.id === sectionId);
		if (currentIndex === -1) return;

		const clamped = Math.max(0, Math.min(newIndex, groupSections.length - 1));
		if (clamped === currentIndex) return;

		const reordered = [...groupSections];
		const [moved] = reordered.splice(currentIndex, 1);
		reordered.splice(clamped, 0, moved);

		const fullOrder = GROUP_TYPES.flatMap((g) => (g === groupType ? reordered : sections.filter((s) => s.group === g))).map((s) => s.id);
		reorderSectionsMutate(fullOrder);
	};

	const openCreate = () => {
		setLabelInput("");
		setGroupInput("watching");
		setDialog({ mode: "create" });
	};

	const openRename = (section: Section) => {
		setLabelInput(section.label);
		setGroupInput(section.group);
		setDialog({ mode: "rename", section });
	};

	const handleSubmit = () => {
		const label = labelInput.trim();
		if (!label || !dialog) return;

		if (dialog.mode === "create") {
			createSection({ label, group: groupInput, system: false, kind: "manual" });
		} else {
			updateSection({ sectionId: dialog.section.id, patch: { label, group: groupInput } });
		}
		setDialog(null);
	};

	const handleDelete = async (section: Section) => {
		const ok = await confirm({
			title: "Delete section?",
			message: `Are you sure you want to delete "${section.label}"? Entries in it won't be deleted, just unassigned.`,
			confirmLabel: "Delete",
			danger: true,
		});
		if (ok) deleteSection(section.id);
	};

	return (
		<Wrap>
			<Header>
				<PageHeader>
					<FolderCog size={24} />
					Sections
					<SectionCount>{sections.length}</SectionCount>
				</PageHeader>
				<AddButton onClick={openCreate} />
			</Header>

			{sections.length === 0 ? (
				<EmptyState>
					<EmptyTitle>No sections yet</EmptyTitle>
					<EmptyHint>Create a section to start organizing your entries.</EmptyHint>
				</EmptyState>
			) : (
				<Container>
					{GROUP_TYPES.map((groupType) => {
						const groupSections = sections.filter((s) => s.group === groupType);
						if (groupSections.length === 0) return null;

						const Icon = GROUP_ICONS[groupType];
						const color = GROUP_COLOR_VARS[groupType];

						return (
							<Group key={groupType}>
								<GroupHeading $color={color}>
									<Icon size={16} />
									{GROUP_TYPE_MAPPINGS[groupType]}
								</GroupHeading>

								<CardsGrid>
									{groupSections.map((section, index) => (
										<SectionCard
											key={section.id}
											section={section}
											color={color}
											Icon={Icon}
											index={index}
											groupSize={groupSections.length}
											onReorder={(newIndex) => handleReorder(groupType, section.id, newIndex)}
											onRename={() => openRename(section)}
											onDelete={() => handleDelete(section)}
										/>
									))}
								</CardsGrid>
							</Group>
						);
					})}
				</Container>
			)}

			{dialog && (
				<FormDialog title={dialog.mode === "create" ? "Create Section" : "Rename Section"} confirmLabel="Save" onSubmit={handleSubmit} onCancel={() => setDialog(null)} submitDisabled={!labelInput.trim()}>
					<EditRow>
						<EditLabel>Label</EditLabel>
						<Input type="text" value={labelInput} onChange={(e) => setLabelInput(e.target.value)} placeholder="e.g. Currently Watching" autoFocus />
					</EditRow>
					<EditRow>
						<EditLabel>Group</EditLabel>
						<GroupMenu group={groupInput} onChange={setGroupInput} />
					</EditRow>
				</FormDialog>
			)}

			{confirmUI}
		</Wrap>
	);
};
