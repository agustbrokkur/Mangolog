import styled from "styled-components";
import type { LucideIcon } from "lucide-react";

const Btn = styled.button`
	display: flex;
	align-items: center;
	gap: 6px;
	height: 38px;
	padding: 0 14px;
	border-radius: var(--radius);
	border: 1px solid var(--border);
	background: var(--bg-3);
	color: var(--text-dim);
	font-size: 14px;
	cursor: pointer;
	transition:
		background 0.1s,
		color 0.1s,
		border-color 0.1s;
	white-space: nowrap;

	&:hover {
		background: var(--bg-4);
		color: var(--text);
		border-color: var(--border-bright);
	}
`;

interface ToolbarButtonProps {
	icon: LucideIcon;
	label: string;
	onClick?: () => void;
}

export const ToolbarButton = ({ icon: Icon, label, onClick }: ToolbarButtonProps) => (
	<Btn onClick={onClick}>
		<Icon size={14} />
		{label}
	</Btn>
);
