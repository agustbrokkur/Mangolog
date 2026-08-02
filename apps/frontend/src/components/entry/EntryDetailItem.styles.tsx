import styled from "styled-components";

export const Card = styled.div`
	display: flex;
	gap: 16px;
	padding: 12px;
	background: var(--bg-3);
	border: 1px solid var(--border);
	border-radius: var(--radius-lg);
	transition: border-color 150ms, background 150ms;
	&:hover {
		border-color: var(--border-bright);
	}
	&:hover .cover img {
		transform: scale(1.05);
	}
`;

export const Info = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	flex: 1;
	min-width: 0;
	text-align: left;
`;

export const Row = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 6px;
`;

export const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2px;
`;

export const FieldLabel = styled.span`
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.5px;
	text-transform: uppercase;
	color: var(--text-dimmer);
`;

export const Actions = styled.div<{ $forceOpen?: boolean }>`
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: auto;
	padding-top: 8px;
	border-top: 1px solid var(--border);
	opacity: ${({ $forceOpen }) => ($forceOpen ? 1 : 0)};
	pointer-events: ${({ $forceOpen }) => ($forceOpen ? "auto" : "none")};
	transition: opacity 150ms;
	${Card}:hover & {
		opacity: 1;
		pointer-events: auto;
	}
`;
