// components/layout/actions/FilterChipSection.tsx
import type { ReactNode } from "react";
import { Section, SectionLabel, TagWrap, Chip } from "./FilterMenu.styles";

interface FilterChipSectionProps<T> {
	label: string;
	items: T[];
	isChecked: (item: T) => boolean;
	onToggle: (item: T) => void;
	renderLabel: (item: T) => ReactNode;
	colorFor?: (item: T) => string | undefined;
	keyFor?: (item: T) => string;
}

export function FilterChipSection<T>({ label, items, isChecked, onToggle, renderLabel, colorFor, keyFor }: FilterChipSectionProps<T>) {
	if (items.length === 0) return null;

	return (
		<Section>
			<SectionLabel>{label}</SectionLabel>
			<TagWrap>
				{items.map((item) => {
					const checked = isChecked(item);
					return (
						<Chip key={keyFor ? keyFor(item) : String(item)} $checked={checked} $color={colorFor?.(item)} onClick={() => onToggle(item)}>
							{renderLabel(item)}
						</Chip>
					);
				})}
			</TagWrap>
		</Section>
	);
}
