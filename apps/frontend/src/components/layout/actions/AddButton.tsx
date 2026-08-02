import styled from "styled-components";
import { Plus } from "lucide-react";

const Btn = styled.button`
	display: flex;
	align-items: center;
	gap: 6px;
	height: 38px;
	padding: 0 16px;
	border-radius: var(--radius);
	border: none;
	background: var(--color-brand);
	color: white;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	transition: opacity 0.1s;

	&:hover {
		opacity: 0.9;
	}
`;

interface AddButtonProps {
	onClick?: () => void;
}

export const AddButton = ({ onClick }: AddButtonProps) => (
	<Btn onClick={onClick}>
		<Plus size={14} />
		Add
	</Btn>
);
