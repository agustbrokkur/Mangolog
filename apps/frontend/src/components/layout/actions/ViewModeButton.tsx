import styled from "styled-components";
import { type ViewMode } from "../../entry/EntryRenderer";
import { Grid2X2, LayoutList, Rows4 } from "lucide-react";

const Button = styled.button<{ $selected: boolean }>`
	color: var(--text-dimmer);
	background: none;
	width: 38px;
	height: 38px;
	cursor: pointer;
	border: none;
	transition:
		background 0.1s,
		color 0.1s;

	&:not(:first-child) {
		border-left: none;
	}

	&:first-child {
		border-top-left-radius: 8px;
		border-bottom-left-radius: 8px;
	}
	&:last-child {
		border-top-right-radius: 8px;
		border-bottom-right-radius: 8px;
	}

	&:hover {
		background-color: var(--bg-3);
		color: var(--text);
	}

	${({ $selected }) =>
		$selected &&
		`
        background-color: var(--bg-4);
        color: var(--text);
    `}
`;

const ViewModeIcon = {
	detail: LayoutList,
	list: Rows4,
	grid: Grid2X2,
};

interface ViewModeButtonProps {
	currentViewMode: ViewMode;
	viewMode: ViewMode;
	onViewModeChange: (newViewMode: ViewMode) => void;
}

export const ViewModeButton = ({ currentViewMode, viewMode, onViewModeChange }: ViewModeButtonProps) => {
	const ViewComponent = ViewModeIcon[viewMode];
	const capitalizedTitle = viewMode.charAt(0).toLocaleUpperCase() + viewMode.slice(1);

	return (
		<Button title={capitalizedTitle} key={viewMode} onClick={() => onViewModeChange(viewMode)} $selected={viewMode === currentViewMode}>
			<ViewComponent size={16} />
		</Button>
	);
};
