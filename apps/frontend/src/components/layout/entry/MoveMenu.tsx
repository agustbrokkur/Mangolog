import { createPortal } from "react-dom";
import { ArrowLeftRight, Check } from "lucide-react";
import type { Section } from "../../../types/section";
import { isManualSection } from "../../../types/section";
import { useAnchoredPanel } from "../../../hooks/useAnchoredPanel";
import { Wrap, TriggerButton, Panel, Option } from "./SelectMenu.styles";

interface MoveMenuProps {
	sections: Section[];
	entryId: string;
	onMove: (sectionId: string) => void;
	transparent?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export const MoveMenu = ({ sections, entryId, onMove, transparent, onOpenChange }: MoveMenuProps) => {
	const { open, setOpen, anchorRef: wrapRef, panelRef, position } = useAnchoredPanel<HTMLDivElement, HTMLDivElement>(onOpenChange);
	// Smart sections derive membership from a filter, not direct assignment — only manual sections are movable targets.
	const manualSections = sections.filter(isManualSection);
	const currentSectionId = manualSections.find((s) => s.entryIds.includes(entryId))?.id;

	if (manualSections.length === 0) return null;

	return (
		<Wrap ref={wrapRef}>
			<TriggerButton $transparent={transparent} onClick={() => setOpen((v) => !v)}>
				<ArrowLeftRight size={12} /> Move
			</TriggerButton>

			{open &&
				createPortal(
					<Panel ref={panelRef} style={{ top: position.top, left: position.left }}>
						{manualSections.map((s) => {
							const checked = s.id === currentSectionId;
							return (
								<Option
									key={s.id}
									$checked={checked}
									onClick={() => {
										if (!checked) onMove(s.id);
										setOpen(false);
									}}
								>
									{s.label}
									{checked && <Check size={13} />}
								</Option>
							);
						})}
					</Panel>,
					document.body,
				)}
		</Wrap>
	);
};
