// components/statistics/ChartTooltip.tsx
import styled from "styled-components";

export const TooltipBox = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding: 8px 12px;
	background: var(--bg-4);
	border: 1px solid var(--border-bright);
	border-radius: var(--radius);
	box-shadow: 0 8px 24px rgb(0 0 0 / 0.4);
	font-size: 13px;
`;

export const TooltipTitle = styled.span`
	font-weight: 600;
	color: var(--text);
`;

export const TooltipRow = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
	color: var(--text-dim);
`;

export const TooltipSwatch = styled.span<{ $color: string }>`
	width: 8px;
	height: 8px;
	border-radius: 2px;
	background: ${({ $color }) => $color};
	flex-shrink: 0;
`;
