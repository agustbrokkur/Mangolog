import { MEDIA_TYPES, MEDIA_ICONS, MEDIA_TYPE_COLORS, MEDIA_TYPE_LABELS, type MediaType } from "../../../types/mediaType";
import { SelectMenu, type SelectOption } from "./SelectMenu";

const OPTIONS: SelectOption<MediaType>[] = MEDIA_TYPES.map((type) => ({
	id: type,
	label: MEDIA_TYPE_LABELS[type],
	icon: MEDIA_ICONS[type],
	color: MEDIA_TYPE_COLORS[type],
}));

interface MediaTypeMenuProps {
	mediaType: MediaType;
	onChange: (mediaType: MediaType) => void;
	transparent?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export const MediaTypeMenu = ({ mediaType, onChange, transparent, onOpenChange }: MediaTypeMenuProps) => (
	<SelectMenu options={OPTIONS} selectedId={mediaType} onSelect={onChange} transparent={transparent} onOpenChange={onOpenChange} />
);
