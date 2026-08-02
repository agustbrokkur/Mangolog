import styled from "styled-components";
import type { ReactNode } from "react";

const Wrap = styled.span<{ $color: string; $bg: string; $border: string }>`
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-size: 16px;
	padding: 2px 8px;
	border-radius: 999px;
	color: ${({ $color }) => $color};
	background: ${({ $bg }) => $bg};
	border: 1px solid ${({ $border }) => $border};
`;

interface EntryPillProps {
	children: ReactNode;
	color?: string;
	bg?: string;
	border?: string;
}

export const EntryPill = ({ children, color = "#d1d5db", bg = "#242428", border = "#2a2a2e" }: EntryPillProps) => (
	<Wrap $color={color} $bg={bg} $border={border}>
		{children}
	</Wrap>
);
