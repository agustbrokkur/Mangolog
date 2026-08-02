import styled from "styled-components";

const Wrap = styled.div<{ $color: string }>`
	display: flex;
	align-items: center;
	gap: 8px;
	flex: 1;
	min-width: 280px;
	font-size: 16px;
	font-weight: 600;
	color: ${({ $color }) => $color};
`;

const Track = styled.div`
	flex: 1;
	height: 6px;
	border-radius: 999px;
	background: #242428;
	overflow: hidden;
`;

const Fill = styled.div<{ $percent: number; $color: string }>`
	height: 100%;
	border-radius: 999px;
	background: ${({ $color }) => $color};
	width: ${({ $percent }) => $percent}%;
`;

export const EpisodeProgress = ({ current, total, color = "#2dd4bf" }: { current: number; total: number; color?: string }) => (
	<Wrap $color={color}>
		<Track>
			<Fill $percent={Math.min(100, (current / total) * 100)} $color={color} />
		</Track>
		<span>
			{current} / {total}
		</span>
	</Wrap>
);
