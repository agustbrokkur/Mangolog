// components/layout/actions/FilterRangeSection.tsx
import { Section, SectionLabel, RangeRow, RangeInput, RangeSeparator } from "./FilterMenu.styles";
import type { DateRange, NumberRange } from "../../../../types/filters";

interface NumberRangeSectionProps {
	label: string;
	range: NumberRange;
	onChange: (patch: Partial<NumberRange>) => void;
	max?: number;
}

export const NumberRangeSection = ({ label, range, onChange, max }: NumberRangeSectionProps) => (
	<Section>
		<SectionLabel>{label}</SectionLabel>
		<RangeRow>
			<RangeInput
				type="number"
				min={0}
				max={max}
				placeholder="Min"
				value={range.min ?? ""}
				onChange={(e) => onChange({ min: e.target.value === "" ? null : Number(e.target.value) })}
			/>
			<RangeSeparator>–</RangeSeparator>
			<RangeInput
				type="number"
				min={0}
				max={max}
				placeholder="Max"
				value={range.max ?? ""}
				onChange={(e) => onChange({ max: e.target.value === "" ? null : Number(e.target.value) })}
			/>
		</RangeRow>
	</Section>
);

const msToDateInput = (ms: number | null) => (ms == null ? "" : new Date(ms).toISOString().slice(0, 10));
const dateInputToMs = (value: string) => (value === "" ? null : new Date(value).getTime());

interface DateRangeSectionProps {
	label: string;
	range: DateRange;
	onChange: (patch: Partial<DateRange>) => void;
}

export const DateRangeSection = ({ label, range, onChange }: DateRangeSectionProps) => (
	<Section>
		<SectionLabel>{label}</SectionLabel>
		<RangeRow>
			<RangeInput type="date" value={msToDateInput(range.from)} onChange={(e) => onChange({ from: dateInputToMs(e.target.value) })} />
			<RangeSeparator>–</RangeSeparator>
			<RangeInput type="date" value={msToDateInput(range.to)} onChange={(e) => onChange({ to: dateInputToMs(e.target.value) })} />
		</RangeRow>
	</Section>
);
