import styled from "styled-components";

const Main = styled.button`
	display: block;
	background: none;
	border: none;
	padding: 0;
	font: inherit;
	text-align: left;
	cursor: pointer;
	font-size: 18px;
	font-weight: 600;
	color: white;
	&:hover {
		color: var(--color-brand, #e8473f);
	}
`;

const Sub = styled.p`
	font-size: 12px;
	color: #6b6b6f;
	margin-top: 2px;
`;

export const EntryTitle = ({ onClick, title, subtitle, englishSubtitle }: { onClick: () => void; title: string; subtitle?: string; englishSubtitle?: string }) => (
	<div>
		<Main onClick={onClick}>{title}</Main>
		{subtitle && (
			<Sub>
				{subtitle} ({englishSubtitle})
			</Sub>
		)}
	</div>
);
