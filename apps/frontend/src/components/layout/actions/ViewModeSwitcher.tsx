import styled from "styled-components";
import { type ViewMode, VIEW_MODES } from "../../entry/EntryRenderer";
import { ViewModeButton } from "./ViewModeButton";

const Switcher = styled.div`
	display: flex;
	border: 1px solid var(--border);
	border-radius: var(--radius);
`;

interface ViewModeSwitcherProps {
	viewMode: ViewMode;
	onViewModeChange: (newViewMode: ViewMode) => void;
}

export const ViewModeSwitcher = ({ viewMode, onViewModeChange }: ViewModeSwitcherProps) => {
	return (
		<Switcher>
			{VIEW_MODES.map((mode) => (
				<ViewModeButton key={mode} currentViewMode={viewMode} viewMode={mode} onViewModeChange={onViewModeChange} />
			))}
		</Switcher>
	);
};
