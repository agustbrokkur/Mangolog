import styled from "styled-components";

export const Wrap = styled.div`
	position: relative;
`;

export const TriggerButton = styled.button<{ $transparent?: boolean }>`
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 12px;
	font-weight: 600;
	padding: 6px 8px;
	border-radius: var(--radius);
	cursor: pointer;
	transition:
		background 150ms,
		border-color 150ms,
		color 150ms;

	${({ $transparent }) =>
		$transparent
			? `
				background: rgb(255 255 255 / 0.12);
				border: none;
				color: white;
				&:hover { background: rgb(255 255 255 / 0.2); }
			`
			: `
				background: var(--bg-2);
				border: 1px solid var(--border);
				color: var(--text-dim);
				&:hover { border-color: var(--border-bright); color: var(--text); }
			`}
`;

export const Panel = styled.div`
	position: fixed;
	z-index: 2100;
	width: 180px;
	max-height: min(320px, calc(100vh - 32px));
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
	font-size: 13px;
	text-align: left;
	cursor: pointer;

	&:hover {
		background: ${({ $checked }) => ($checked ? "color-mix(in srgb, var(--color-brand) 18%, transparent)" : "var(--bg-4)")};
		color: ${({ $checked }) => ($checked ? "var(--color-brand)" : "var(--text)")};
	}
`;

export const OptionContent = styled.span`
	display: flex;
	align-items: center;
	gap: 6px;
`;

export const Dot = styled.span<{ $color: string }>`
	width: 8px;
	height: 8px;
	border-radius: 999px;
	background: ${({ $color }) => $color};
	flex-shrink: 0;
`;
