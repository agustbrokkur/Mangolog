import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
	from { opacity: 0; }
	to { opacity: 1; }
`;

export const Backdrop = styled.div`
	position: fixed;
	inset: 0;
	background: rgb(0 0 0 / 0.75);
	backdrop-filter: blur(4px);
	z-index: 3000;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
	animation: ${fadeIn} 120ms ease;
	cursor: zoom-out;
`;

export const ImageBox = styled.div<{ $width: number }>`
	position: relative;
	/* Never taller than 90vh — covers are always 2:3, so cap width at the value that keeps height in bounds. */
	width: min(${({ $width }) => $width}px, 90vw, calc(90vh * 2 / 3));
	cursor: default;
`;

export const Img = styled.img`
	display: block;
	width: 100%;
	aspect-ratio: 2 / 3;
	object-fit: cover;
	border-radius: var(--radius-lg);
	background: var(--bg-4);
	border: 1px solid var(--border-bright);
	box-shadow: 0 24px 64px rgb(0 0 0 / 0.6);
`;

export const CloseButton = styled.button`
	position: absolute;
	top: -14px;
	right: -14px;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--bg-2);
	border: 1px solid var(--border-bright);
	color: var(--text);
	cursor: pointer;
	transition: background 100ms;

	&:hover {
		background: var(--bg-4);
	}
`;

export const ResizeHandle = styled.div`
	position: absolute;
	bottom: -6px;
	right: -6px;
	width: 20px;
	height: 20px;
	border-radius: 5px;
	background: var(--bg-2);
	border: 1px solid var(--border-bright);
	cursor: nwse-resize;
	transition: background 100ms;

	&:hover {
		background: var(--color-brand);
	}
`;
