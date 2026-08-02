// components/statistics/ChartCard.tsx
import styled from "styled-components";
import type { ReactNode } from "react";

const Card = styled.div`
	display: flex;
	flex-direction: column;
	gap: 14px;
	padding: 20px;
	background: var(--bg-3);
	border: 1px solid var(--border);
	border-radius: var(--radius-lg);
	min-width: 0;
`;

const Title = styled.h2`
	font-size: 14px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	color: var(--text-dim);
`;

interface ChartCardProps {
	title: string;
	children: ReactNode;
}

export const ChartCard = ({ title, children }: ChartCardProps) => (
	<Card>
		<Title>{title}</Title>
		{children}
	</Card>
);
