import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
	from { opacity: 0; }
	to { opacity: 1; }
`;

const slideUp = keyframes`
	from { transform: translateY(8px); opacity: 0; }
	to { transform: translateY(0); opacity: 1; }
`;

export const Backdrop = styled.div`
	position: fixed;
	inset: 0;
	background: rgb(0 0 0 / 0.6);
	backdrop-filter: blur(4px);
	z-index: 2000;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
	animation: ${fadeIn} 120ms ease;
	text-align: left;
`;

const DIALOG_MAX_WIDTH: Record<"normal" | "wide" | "xl", string> = {
	normal: "420px",
	wide: "560px",
	xl: "min(1400px, 94vw)",
};

export const Dialog = styled.div<{ $wide?: boolean | "xl" }>`
	background: var(--bg-2);
	border: 1px solid var(--border-bright);
	border-radius: var(--radius-lg);
	width: 100%;
	max-width: ${({ $wide }) => DIALOG_MAX_WIDTH[$wide === "xl" ? "xl" : $wide ? "wide" : "normal"]};
	max-height: ${({ $wide }) => ($wide === "xl" ? "90vh" : "none")};
	display: ${({ $wide }) => ($wide === "xl" ? "flex" : "block")};
	flex-direction: column;
	box-shadow: 0 24px 64px rgb(0 0 0 / 0.6);
	animation: ${slideUp} 150ms ease;
	overflow: hidden;
`;

export const Form = styled.form`
	display: flex;
	flex-direction: column;
	min-height: 0;
	flex: 1;
`;

export const Header = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 22px 24px 14px;
`;

export const Title = styled.span`
	font-family: var(--font-display);
	font-size: 19px;
	letter-spacing: 0.5px;
	color: var(--text);
`;

export const Body = styled.div`
	display: flex;
	flex-direction: column;
	gap: 18px;
	padding: 0 24px 22px;
	flex: 1;
	min-height: 0;
	overflow-y: auto;
`;

export const Actions = styled.div`
	display: flex;
	gap: 10px;
	padding: 16px 24px;
	border-top: 1px solid var(--border);
	background: var(--bg-3);
	justify-content: flex-end;
`;

export const CancelButton = styled.button`
	padding: 8px 18px;
	border-radius: var(--radius);
	font-size: 14px;
	font-weight: 600;
	font-family: inherit;
	border: 1px solid var(--border);
	background: none;
	color: var(--text-dim);
	cursor: pointer;
	transition: background 100ms;

	&:hover {
		background: var(--bg-4);
	}
`;

export const ConfirmButton = styled.button`
	padding: 8px 20px;
	border-radius: var(--radius);
	font-size: 14px;
	font-weight: 700;
	font-family: inherit;
	border: none;
	background: var(--color-accent);
	color: white;
	cursor: pointer;
	transition: opacity 150ms;

	&:hover {
		opacity: 0.85;
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`;
