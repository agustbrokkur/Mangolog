// components/statistics/DonutBreakdown.tsx
import styled from "styled-components";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { StatBreakdownSlice } from "../../utils/computeStatistics";
import { TooltipBox, TooltipRow, TooltipSwatch, TooltipTitle } from "./ChartTooltip";

const Layout = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

const ChartWrap = styled.div`
	width: 140px;
	height: 140px;
	flex-shrink: 0;
`;

const Legend = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	flex: 1;
	min-width: 0;
`;

const LegendRow = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 13px;
`;

const LegendSwatch = styled.span<{ $color: string }>`
	width: 10px;
	height: 10px;
	border-radius: 3px;
	background: ${({ $color }) => $color};
	flex-shrink: 0;
`;

const LegendLabel = styled.span`
	color: var(--text-dim);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const LegendCount = styled.span`
	margin-left: auto;
	padding-left: 8px;
	font-variant-numeric: tabular-nums;
	color: var(--text);
	font-weight: 600;
`;

interface DonutBreakdownProps {
	slices: StatBreakdownSlice[];
}

export const DonutBreakdown = ({ slices }: DonutBreakdownProps) => {
	const total = slices.reduce((sum, s) => sum + s.count, 0);
	const visible = slices.filter((s) => s.count > 0);

	return (
		<Layout>
			<ChartWrap>
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie data={visible.length > 0 ? visible : slices} dataKey="count" nameKey="label" innerRadius="62%" outerRadius="100%" paddingAngle={visible.length > 1 ? 2 : 0} stroke="var(--bg-3)" strokeWidth={2}>
							{(visible.length > 0 ? visible : slices).map((slice) => (
								<Cell key={slice.key} fill={visible.length > 0 ? slice.color : "var(--bg-4)"} />
							))}
						</Pie>
						<Tooltip
							content={({ active, payload }) => {
								if (!active || !payload?.length) return null;
								const slice = payload[0].payload as StatBreakdownSlice;
								const pct = total > 0 ? Math.round((slice.count / total) * 100) : 0;
								return (
									<TooltipBox>
										<TooltipTitle>{slice.label}</TooltipTitle>
										<TooltipRow>
											<TooltipSwatch $color={slice.color} />
											{slice.count} ({pct}%)
										</TooltipRow>
									</TooltipBox>
								);
							}}
						/>
					</PieChart>
				</ResponsiveContainer>
			</ChartWrap>
			<Legend>
				{slices.map((slice) => (
					<LegendRow key={slice.key}>
						<LegendSwatch $color={slice.color} />
						<LegendLabel>{slice.label}</LegendLabel>
						<LegendCount>{slice.count}</LegendCount>
					</LegendRow>
				))}
			</Legend>
		</Layout>
	);
};
