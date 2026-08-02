import { ENTRY_STATUSES, STATUS_COLORS, STATUS_LABELS, type Status } from "../../../types/status";
import { SelectMenu, type SelectOption } from "./SelectMenu";

const OPTIONS: SelectOption<Status>[] = ENTRY_STATUSES.map((status) => ({
	id: status,
	label: STATUS_LABELS[status],
	color: STATUS_COLORS[status],
}));

interface StatusMenuProps {
	status: Status;
	onChange: (status: Status) => void;
	transparent?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export const StatusMenu = ({ status, onChange, transparent, onOpenChange }: StatusMenuProps) => (
	<SelectMenu options={OPTIONS} selectedId={status} onSelect={onChange} transparent={transparent} onOpenChange={onOpenChange} />
);
