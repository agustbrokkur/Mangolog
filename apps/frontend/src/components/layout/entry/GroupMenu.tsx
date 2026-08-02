import { GROUP_TYPES, GROUP_TYPE_MAPPINGS, GROUP_COLOR_VARS, GROUP_ICONS, type GroupType } from "../../../types/groupType";
import { SelectMenu, type SelectOption } from "./SelectMenu";

const OPTIONS: SelectOption<GroupType>[] = GROUP_TYPES.map((group) => ({
	id: group,
	label: GROUP_TYPE_MAPPINGS[group],
	icon: GROUP_ICONS[group],
	color: GROUP_COLOR_VARS[group],
}));

interface GroupMenuProps {
	group: GroupType;
	onChange: (group: GroupType) => void;
	transparent?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export const GroupMenu = ({ group, onChange, transparent, onOpenChange }: GroupMenuProps) => (
	<SelectMenu options={OPTIONS} selectedId={group} onSelect={onChange} transparent={transparent} onOpenChange={onOpenChange} />
);
