import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
	from { opacity: 0; }
	to { opacity: 1; }
`;

const slideIn = keyframes`
	from { transform: translateX(100%); }
	to { transform: translateX(0); }
`;

export const Backdrop = styled.div`
	position: fixed;
	inset: 0;
	background: rgb(0 0 0 / 0.35);
	z-index: 1000;
	animation: ${fadeIn} 150ms ease;
`;

export const PanelWrap = styled.div<{ $width: number }>`
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	width: ${({ $width }) => $width}px;
	background: var(--bg-2);
	border-left: 1px solid var(--border-bright);
	z-index: 1001;
	display: flex;
	flex-direction: column;
	box-shadow: -8px 0 32px rgb(0 0 0 / 0.5);
	animation: ${slideIn} 220ms cubic-bezier(0.22, 1, 0.36, 1);
	overflow: hidden;
	/* #root sets text-align: center globally (leftover from the Vite template) — every text element here needs it undone. */
	text-align: left;
`;

export const ResizeHandle = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 6px;
	height: 100%;
	cursor: ew-resize;
	z-index: 10;
	background: transparent;
	transition: background 150ms;

	&:hover,
	&:active {
		background: color-mix(in srgb, var(--color-brand) 25%, transparent);
	}
`;

export const Toolbar = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 14px;
	border-bottom: 1px solid var(--border);
	flex-shrink: 0;
	background: var(--bg-3);
`;

export const ToolbarButton = styled.button<{ $variant?: "expand" | "close" }>`
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 7px 14px;
	border-radius: var(--radius);
	font-size: 14px;
	font-weight: 600;
	font-family: inherit;
	border: 1px solid var(--border);
	background: none;
	color: var(--text-dim);
	cursor: pointer;
	transition:
		background 100ms,
		color 100ms,
		border-color 100ms;

	&:hover {
		background: var(--bg-4);
		color: var(--text);
		${({ $variant }) =>
			$variant === "expand" &&
			`
				color: var(--color-blue);
				border-color: var(--color-blue);
			`}
		${({ $variant }) =>
			$variant === "close" &&
			`
				color: var(--color-brand);
				border-color: var(--color-brand);
			`}
	}
`;

export const Content = styled.div`
	flex: 1;
	overflow-y: auto;
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 18px;
`;
