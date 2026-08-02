// components/statistics/RankedBarList.tsx
import styled from "styled-components";
import type { RankedCount } from "../../utils/computeStatistics";

const List = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

const Row = styled.div`
	display: grid;
	grid-template-columns: 96px 1fr 32px;
	align-items: center;
	gap: 10px;
`;

const RowLabel = styled.span`
	font-size: 13px;
	color: var(--text-dim);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const Track = styled.div`
	height: 16px;
	background: var(--bg-4);
	border-radius: 4px;
	overflow: hidden;
`;

const Fill = styled.div<{ $pct: number; $color: string }>`
	height: 100%;
	width: ${({ $pct }) => $pct}%;
	background: ${({ $color }) => $color};
	border-radius: 4px;
`;

const RowValue = styled.span`
	font-size: 13px;
	font-variant-numeric: tabular-nums;
	color: var(--text);
	font-weight: 600;
	text-align: right;
`;

const Empty = styled.p`
	font-size: 13px;
	color: var(--text-dimmer);
	padding: 8px 0;
`;

interface RankedBarListProps {
	items: RankedCount[];
	color: string;
	emptyLabel: string;
}

export const RankedBarList = ({ items, color, emptyLabel }: RankedBarListProps) => {
	if (items.length === 0) return <Empty>{emptyLabel}</Empty>;

	const max = Math.max(...items.map((i) => i.count));

	return (
		<List>
			{items.map((item) => (
				<Row key={item.label}>
					<RowLabel title={item.label}>{item.label}</RowLabel>
					<Track>
						<Fill $pct={max > 0 ? (item.count / max) * 100 : 0} $color={item.color ?? color} />
					</Track>
					<RowValue>{item.count}</RowValue>
				</Row>
			))}
		</List>
	);
};
