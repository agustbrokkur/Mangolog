import styled from "styled-components";
import { Link } from "react-router";
import { ExternalLink } from "lucide-react";

const Btn = styled(Link)<{ $transparent?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4px;
	font-size: 12px;
	font-weight: 600;
	padding: 6px 8px;
	border-radius: 6px;
	transition:
		background 150ms,
		opacity 150ms;

	${({ $transparent }) =>
		$transparent
			? `
        background: rgb(255 255 255 / 0.12);
        color: white;
        &:hover { background: rgb(255 255 255 / 0.2); }
      `
			: `
        background: var(--color-brand);
        color: white;
        &:hover { opacity: 0.9; }
      `}
`;

interface OpenButtonProps {
	to: string;
	transparent?: boolean;
}

export const OpenButton = ({ to, transparent }: OpenButtonProps) => (
	<Btn to={to} $transparent={transparent}>
		Open <ExternalLink size={12} />
	</Btn>
);
