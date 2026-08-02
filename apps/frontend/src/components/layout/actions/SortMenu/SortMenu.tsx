// components/layout/actions/SortMenu/SortMenu.tsx
import { createPortal } from "react-dom";
import { ArrowUp, ArrowDown } from "lucide-react";
import { SORT_OPTIONS, SORT_DEFAULT_DIRECTION, DEFAULT_SORT, type EntrySort, type SortKey } from "../../../../types/sort";
import { useAnchoredPanel } from "../../../../hooks/useAnchoredPanel";
import { Wrap, TriggerButton, Panel, Option } from "./SortMenu.styles";

interface SortMenuProps {
	sort: EntrySort;
	onChange: (sort: EntrySort) => void;
}

export const SortMenu = ({ sort, onChange }: SortMenuProps) => {
	const { open, setOpen, anchorRef: wrapRef, panelRef, position } = useAnchoredPanel<HTMLDivElement, HTMLDivElement>();

	const activeLabel = SORT_OPTIONS.find((o) => o.key === sort.key)?.label ?? DEFAULT_SORT.key;
	const DirectionIcon = sort.direction === "asc" ? ArrowUp : ArrowDown;
	const isDefault = sort.key === DEFAULT_SORT.key && sort.direction === DEFAULT_SORT.direction;

	const handleSelect = (key: SortKey) => {
		if (key === sort.key) {
			onChange({ key, direction: sort.direction === "asc" ? "desc" : "asc" });
			return;
		}
		onChange({ key, direction: SORT_DEFAULT_DIRECTION[key] });
	};

	return (
		<Wrap ref={wrapRef}>
			<TriggerButton $active={!isDefault} onClick={() => setOpen((v) => !v)}>
				<DirectionIcon size={14} />
				{activeLabel}
			</TriggerButton>

			{open &&
				createPortal(
					<Panel ref={panelRef} style={{ top: position.top, left: position.left }}>
						{SORT_OPTIONS.map(({ key, label }) => {
							const checked = sort.key === key;
							return (
								<Option key={key} $checked={checked} onClick={() => handleSelect(key)}>
									{label}
									{checked && <DirectionIcon size={14} />}
								</Option>
							);
						})}
					</Panel>,
					document.body,
				)}
		</Wrap>
	);
};
