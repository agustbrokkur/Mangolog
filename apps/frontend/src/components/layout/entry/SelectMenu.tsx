import { createPortal } from "react-dom";
import { Check, type LucideIcon } from "lucide-react";
import { useAnchoredPanel } from "../../../hooks/useAnchoredPanel";
import { Wrap, TriggerButton, Panel, Option, OptionContent, Dot } from "./SelectMenu.styles";

export interface SelectOption<T extends string> {
	id: T;
	label: string;
	icon?: LucideIcon;
	color?: string;
}

interface SelectMenuProps<T extends string> {
	options: SelectOption<T>[];
	selectedId: T;
	onSelect: (id: T) => void;
	transparent?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export const SelectMenu = <T extends string>({ options, selectedId, onSelect, transparent, onOpenChange }: SelectMenuProps<T>) => {
	const { open, setOpen, anchorRef: wrapRef, panelRef, position } = useAnchoredPanel<HTMLDivElement, HTMLDivElement>(onOpenChange);
	const selected = options.find((o) => o.id === selectedId);
	const TriggerIcon = selected?.icon;

	return (
		<Wrap ref={wrapRef}>
			<TriggerButton $transparent={transparent} onClick={() => setOpen((v) => !v)}>
				{TriggerIcon ? <TriggerIcon size={12} color={selected?.color} /> : selected?.color && <Dot $color={selected.color} />}
				{selected?.label ?? "Select"}
			</TriggerButton>

			{open &&
				createPortal(
					<Panel ref={panelRef} style={{ top: position.top, left: position.left }}>
						{options.map((o) => {
							const checked = o.id === selectedId;
							const OptIcon = o.icon;
							return (
								<Option
									key={o.id}
									$checked={checked}
									onClick={() => {
										if (!checked) onSelect(o.id);
										setOpen(false);
									}}
								>
									<OptionContent>
										{OptIcon ? <OptIcon size={12} color={o.color} /> : o.color && <Dot $color={o.color} />}
										{o.label}
									</OptionContent>
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
