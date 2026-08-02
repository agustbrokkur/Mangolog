// components/layout/actions/SortMenu/SortMenu.styles.tsx
import styled from "styled-components";

export const Wrap = styled.div`
	position: relative;
`;

export const TriggerButton = styled.button<{ $active: boolean }>`
	display: flex;
	align-items: center;
	gap: 6px;
	height: 38px;
	padding: 0 14px;
	border-radius: var(--radius);
	border: 1px solid ${({ $active }) => ($active ? "var(--color-brand)" : "var(--border)")};
	background: ${({ $active }) => ($active ? "color-mix(in srgb, var(--color-brand) 12%, var(--bg-3))" : "var(--bg-3)")};
	color: ${({ $active }) => ($active ? "var(--color-brand)" : "var(--text-dim)")};
	font-size: 14px;
	cursor: pointer;
	transition:
		background 0.1s,
		color 0.1s,
		border-color 0.1s;
	white-space: nowrap;

	&:hover {
		color: var(--text);
	}
`;

export const Panel = styled.div`
	position: fixed;
	z-index: 1000;
	width: 220px;
	max-height: min(400px, calc(100vh - 32px));
	overflow-y: auto;
	background: var(--bg-3);
	border: 1px solid var(--border);
	border-radius: var(--radius-lg);
	box-shadow: 0 8px 24px rgb(0 0 0 / 0.4);
	padding: 6px;
	display: flex;
	flex-direction: column;
	gap: 2px;
`;

export const Option = styled.button<{ $checked: boolean }>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	width: 100%;
	padding: 8px 10px;
	border-radius: 6px;
	border: none;
	background: ${({ $checked }) => ($checked ? "color-mix(in srgb, var(--color-brand) 12%, transparent)" : "transparent")};
	color: ${({ $checked }) => ($checked ? "var(--color-brand)" : "var(--text-dim)")};
	font-size: 14px;
	text-align: left;
	cursor: pointer;

	&:hover {
		background: ${({ $checked }) => ($checked ? "color-mix(in srgb, var(--color-brand) 18%, transparent)" : "var(--bg-4)")};
		color: ${({ $checked }) => ($checked ? "var(--color-brand)" : "var(--text)")};
	}
`;
