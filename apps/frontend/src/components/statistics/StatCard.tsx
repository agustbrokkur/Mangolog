// components/statistics/StatCard.tsx
import styled from "styled-components";
import type { LucideIcon } from "lucide-react";

const Card = styled.div`
	display: flex;
	align-items: center;
	gap: 14px;
	padding: 18px 20px;
	background: var(--bg-3);
	border: 1px solid var(--border);
	border-radius: var(--radius-lg);
`;

const IconWrap = styled.div<{ $color: string }>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	flex-shrink: 0;
	border-radius: var(--radius);
	background: color-mix(in srgb, ${({ $color }) => $color} 16%, transparent);
	color: ${({ $color }) => $color};
`;

const Body = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
`;

const Value = styled.span`
	font-size: 24px;
	font-weight: 700;
	font-variant-numeric: proportional-nums;
	color: var(--text);
`;

const Label = styled.span`
	font-size: 13px;
	color: var(--text-dim);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

interface StatCardProps {
	icon: LucideIcon;
	label: string;
	value: string;
	color: string;
}

export const StatCard = ({ icon: Icon, label, value, color }: StatCardProps) => (
	<Card>
		<IconWrap $color={color}>
			<Icon size={18} />
		</IconWrap>
		<Body>
			<Value>{value}</Value>
			<Label>{label}</Label>
		</Body>
	</Card>
);
