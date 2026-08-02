// components/statistics/ActivityChart.tsx
import styled from "styled-components";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ActivityMonth } from "../../utils/computeStatistics";
import { TooltipBox, TooltipRow, TooltipSwatch, TooltipTitle } from "./ChartTooltip";

const ADDED_COLOR = "var(--color-blue)";
const FINISHED_COLOR = "var(--color-accent)";

const ChartWrap = styled.div`
	width: 100%;
	height: 220px;
`;

const axisTick = { fill: "var(--text-dimmer)", fontSize: 12 };

interface ActivityChartProps {
	months: ActivityMonth[];
}

export const ActivityChart = ({ months }: ActivityChartProps) => (
	<ChartWrap>
		<ResponsiveContainer width="100%" height="100%">
			<AreaChart data={months} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
				<defs>
					<linearGradient id="activityAdded" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor={ADDED_COLOR} stopOpacity={0.28} />
						<stop offset="100%" stopColor={ADDED_COLOR} stopOpacity={0} />
					</linearGradient>
					<linearGradient id="activityFinished" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor={FINISHED_COLOR} stopOpacity={0.28} />
						<stop offset="100%" stopColor={FINISHED_COLOR} stopOpacity={0} />
					</linearGradient>
				</defs>
				<CartesianGrid vertical={false} stroke="var(--border)" />
				<XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: "var(--border)" }} tickLine={false} minTickGap={20} />
				<YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} width={28} />
				<Tooltip
					content={({ active, payload, label }) => {
						if (!active || !payload?.length) return null;
						return (
							<TooltipBox>
								<TooltipTitle>{label}</TooltipTitle>
								{payload.map((entry) => (
									<TooltipRow key={entry.dataKey as string}>
										<TooltipSwatch $color={entry.color ?? "var(--text-dim)"} />
										{entry.name}: {entry.value}
									</TooltipRow>
								))}
							</TooltipBox>
						);
					}}
				/>
				<Legend
					iconType="circle"
					iconSize={8}
					wrapperStyle={{ fontSize: 13, color: "var(--text-dim)" }}
					formatter={(value) => <span style={{ color: "var(--text-dim)" }}>{value}</span>}
				/>
				<Area type="monotone" dataKey="added" name="Added" stroke={ADDED_COLOR} strokeWidth={2} fill="url(#activityAdded)" dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--bg-3)" }} />
				<Area type="monotone" dataKey="finished" name="Finished" stroke={FINISHED_COLOR} strokeWidth={2} fill="url(#activityFinished)" dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--bg-3)" }} />
			</AreaChart>
		</ResponsiveContainer>
	</ChartWrap>
);
