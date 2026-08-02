// components/statistics/RatingDistributionChart.tsx
import styled from "styled-components";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { RatingBucket } from "../../utils/computeStatistics";
import { TooltipBox, TooltipTitle } from "./ChartTooltip";

const RATING_COLOR = "var(--color-gold)";

const ChartWrap = styled.div`
	width: 100%;
	height: 200px;
`;

const axisTick = { fill: "var(--text-dimmer)", fontSize: 12 };
const labelStyle = { fill: "var(--text-dim)", fontSize: 12 };

interface RatingDistributionChartProps {
	buckets: RatingBucket[];
}

export const RatingDistributionChart = ({ buckets }: RatingDistributionChartProps) => (
	<ChartWrap>
		<ResponsiveContainer width="100%" height="100%">
			<BarChart data={buckets} margin={{ top: 16, right: 8, left: -20, bottom: 0 }}>
				<CartesianGrid vertical={false} stroke="var(--border)" />
				<XAxis dataKey="rating" tick={axisTick} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
				<YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} width={28} />
				<Tooltip
					cursor={{ fill: "var(--bg-4)" }}
					content={({ active, payload, label }) => {
						if (!active || !payload?.length) return null;
						return (
							<TooltipBox>
								<TooltipTitle>Rating {label}</TooltipTitle>
								{payload[0].value} {payload[0].value === 1 ? "entry" : "entries"}
							</TooltipBox>
						);
					}}
				/>
				<Bar dataKey="count" fill={RATING_COLOR} radius={[4, 4, 0, 0]} maxBarSize={28}>
					<LabelList dataKey="count" position="top" style={labelStyle} formatter={(value) => (typeof value === "number" && value > 0 ? value : "")} />
					{buckets.map((bucket) => (
						<Cell key={bucket.rating} fillOpacity={bucket.count > 0 ? 1 : 0.25} />
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	</ChartWrap>
);
