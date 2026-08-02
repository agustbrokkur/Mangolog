// components/layout/actions/FilterMenu.styles.tsx
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

export const Badge = styled.span`
	font-size: 11px;
	font-weight: 700;
	background: var(--color-brand);
	color: white;
	border-radius: 999px;
	padding: 0 5px;
	min-width: 16px;
	text-align: center;
`;

export const Panel = styled.div`
	position: fixed;
	z-index: 1000;
	width: min(760px, calc(100vw - 32px));
	max-height: min(600px, calc(100vh - 32px));
	overflow-y: auto;
	background: var(--bg-3);
	border: 1px solid var(--border);
	border-radius: var(--radius-lg);
	box-shadow: 0 8px 24px rgb(0 0 0 / 0.4);
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 18px;
`;

export const TopRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 24px;
`;

export const RangeGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
	gap: 16px 24px;
`;

export const Section = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const TagWrap = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
`;

export const Chip = styled.button<{ $checked: boolean; $color?: string }>`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 7px 14px;
	border-radius: 999px;
	border: 1px solid ${({ $checked, $color }) => ($checked ? ($color ?? "var(--color-brand)") : "var(--border)")};
	background: ${({ $checked, $color }) => ($checked ? ($color ?? "var(--color-brand)") : "var(--bg-4)")};
	color: ${({ $checked }) => ($checked ? "white" : "var(--text-dim)")};
	font-size: 14px;
	cursor: pointer;
	white-space: nowrap;
	transition:
		background 0.1s,
		color 0.1s,
		border-color 0.1s;

	&:hover {
		border-color: ${({ $checked, $color }) => ($checked ? ($color ?? "var(--color-brand)") : "var(--border-bright)")};
		color: ${({ $checked }) => ($checked ? "white" : "var(--text)")};
	}
`;

export const SectionLabel = styled.span`
	font-size: 13px;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	color: var(--text-dimmer);
	font-weight: 600;
`;

export const RangeRow = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const RangeInput = styled.input`
	flex: 1;
	min-width: 0;
	height: 38px;
	padding: 0 12px;
	border-radius: 6px;
	border: 1px solid var(--border);
	background: var(--bg-4);
	color: var(--text);
	font-size: 14px;

	&::placeholder {
		color: var(--text-dimmer);
	}
`;

export const RangeSeparator = styled.span`
	color: var(--text-dimmer);
	font-size: 14px;
`;

export const Footer = styled.div`
	display: flex;
	justify-content: flex-end;
	padding-top: 8px;
	border-top: 1px solid var(--border);
`;

export const ClearButton = styled.button`
	font-size: 14px;
	color: var(--text-dim);
	background: none;
	border: none;
	cursor: pointer;

	&:hover {
		color: var(--text);
	}
`;
