import styled from "styled-components";

export const Top = styled.div<{ $large?: boolean }>`
	display: flex;
	gap: ${({ $large }) => ($large ? "24px" : "16px")};
	align-items: flex-start;
`;

export const CoverWrap = styled.div`
	width: 240px;
	flex-shrink: 0;
`;

export const Cover = styled.div<{ $clickable?: boolean }>`
	width: 100%;
	aspect-ratio: 2 / 3;
	border-radius: var(--radius);
	overflow: hidden;
	background: var(--bg-4);
	border: 1px solid var(--border);
	cursor: ${({ $clickable }) => ($clickable ? "zoom-in" : "default")};
	transition: opacity 100ms;

	${({ $clickable }) =>
		$clickable &&
		`&:hover {
			opacity: 0.85;
		}`}

	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

export const MetaCol = styled.div<{ $large?: boolean }>`
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: ${({ $large }) => ($large ? "12px" : "8px")};
`;

export const SectionBadge = styled.div<{ $color: string; $large?: boolean }>`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	font-size: ${({ $large }) => ($large ? "13px" : "12px")};
	font-weight: 700;
	letter-spacing: 1px;
	text-transform: uppercase;
	color: ${({ $color }) => $color};
	padding: ${({ $large }) => ($large ? "5px 10px" : "4px 8px")};
	border-radius: 20px;
	border: 1px solid color-mix(in srgb, ${({ $color }) => $color} 35%, transparent);
	background: color-mix(in srgb, ${({ $color }) => $color} 10%, transparent);
	width: fit-content;
`;

export const Title = styled.h2<{ $large?: boolean }>`
	font-family: var(--font-display);
	font-size: ${({ $large }) => ($large ? "40px" : "27px")};
	letter-spacing: 1px;
	color: var(--text);
	line-height: 1.15;
	word-break: break-word;
`;

export const FranchiseLine = styled.p<{ $large?: boolean }>`
	display: flex;
	align-items: center;
	gap: 5px;
	font-size: ${({ $large }) => ($large ? "17px" : "14px")};
	color: var(--color-accent);
	font-weight: 600;
`;

export const AltTitle = styled.p<{ $large?: boolean }>`
	font-size: ${({ $large }) => ($large ? "17px" : "14px")};
	color: var(--text-dim);
`;

export const JpTitle = styled.p<{ $large?: boolean }>`
	font-size: ${({ $large }) => ($large ? "15px" : "12px")};
	color: var(--text-dimmer);
`;

export const AddedDate = styled.p<{ $large?: boolean }>`
	font-family: var(--font-mono);
	font-size: ${({ $large }) => ($large ? "14px" : "12px")};
	color: var(--text-dimmer);
`;

export const ReleaseDate = styled.p<{ $large?: boolean }>`
	font-family: var(--font-mono);
	font-size: ${({ $large }) => ($large ? "14px" : "12px")};
	color: var(--text-dimmer);
`;

export const ProgressWrap = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

export const ProgressBar = styled.div<{ $large?: boolean }>`
	height: ${({ $large }) => ($large ? "5px" : "3px")};
	background: var(--bg-4);
	border-radius: 2px;
	overflow: hidden;
`;

export const ProgressFill = styled.div<{ $percent: number; $color: string }>`
	height: 100%;
	width: ${({ $percent }) => $percent}%;
	background: ${({ $color }) => $color};
	border-radius: 2px;
	transition: width 300ms ease;
`;

export const ProgressLabel = styled.span<{ $large?: boolean }>`
	font-family: var(--font-mono);
	font-size: ${({ $large }) => ($large ? "14px" : "12px")};
	color: var(--text-dimmer);
`;

export const TagRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
`;

export const Tag = styled.span<{ $color: string; $bg: string; $large?: boolean }>`
	font-size: ${({ $large }) => ($large ? "13px" : "11px")};
	font-weight: 700;
	padding: ${({ $large }) => ($large ? "3px 9px" : "2px 7px")};
	border-radius: 20px;
	border: 1px solid ${({ $color }) => $color};
	color: ${({ $color }) => $color};
	background: ${({ $bg }) => $bg};
`;

export const StatGrid = styled.div<{ $large?: boolean }>`
	display: grid;
	grid-template-columns: repeat(${({ $large }) => ($large ? 4 : 2)}, 1fr);
	gap: ${({ $large }) => ($large ? "10px" : "6px")};
`;

export const StatBox = styled.div<{ $span2?: boolean; $large?: boolean }>`
	display: flex;
	flex-direction: column;
	gap: ${({ $large }) => ($large ? "4px" : "2px")};
	padding: ${({ $large }) => ($large ? "10px 12px" : "7px 9px")};
	border-radius: var(--radius);
	background: var(--bg-3);
	border: 1px solid var(--border);
	${({ $span2 }) => $span2 && "grid-column: 1 / -1;"}
`;

export const StatLabel = styled.span<{ $large?: boolean }>`
	font-size: ${({ $large }) => ($large ? "12px" : "10px")};
	font-weight: 700;
	letter-spacing: 1px;
	text-transform: uppercase;
	color: var(--text-dimmer);
`;

export const StatValue = styled.span<{ $color?: string; $muted?: boolean; $large?: boolean }>`
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: ${({ $large }) => ($large ? "18px" : "14px")};
	font-weight: 600;
	color: ${({ $color, $muted }) => ($muted ? "var(--text-dimmer)" : ($color ?? "var(--text)"))};
`;

export const FieldLabel = styled.div<{ $large?: boolean }>`
	font-size: ${({ $large }) => ($large ? "16px" : "13px")};
	font-weight: 700;
	letter-spacing: 1.2px;
	text-transform: uppercase;
	color: var(--text-dimmer);
`;

export const SynopsisBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const SynopsisText = styled.p<{ $large?: boolean }>`
	font-size: ${({ $large }) => ($large ? "17px" : "14px")};
	color: var(--text-dim);
	line-height: 1.65;
	max-width: "none";
`;

export const NotesBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const NoteDisplay = styled.div<{ $large?: boolean }>`
	cursor: pointer;
	padding: ${({ $large }) => ($large ? "14px 16px" : "10px 12px")};
	border-radius: var(--radius);
	border: 1px solid var(--border);
	background: var(--bg-3);
	min-height: 40px;
	transition: border-color 150ms;

	p {
		font-size: ${({ $large }) => ($large ? "16px" : "14px")};
		color: var(--text-dim);
		line-height: 1.5;
	}

	&:hover {
		border-color: var(--border-bright);
	}
`;

export const NoteEmpty = styled.span<{ $large?: boolean }>`
	font-size: ${({ $large }) => ($large ? "15px" : "13px")};
	color: var(--text-dimmer);
	font-style: italic;
`;

export const NoteEdit = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const NoteTextarea = styled.textarea<{ $large?: boolean }>`
	width: 100%;
	font-family: inherit;
	font-size: ${({ $large }) => ($large ? "16px" : "14px")};
	background: var(--bg-3);
	border: 1px solid var(--border);
	color: var(--text);
	border-radius: var(--radius);
	padding: 8px 12px;
	resize: vertical;
	min-height: 64px;
	outline: none;
	transition: border-color 150ms;

	&:focus {
		border-color: var(--color-brand);
	}
`;

export const EditToggleButton = styled.button<{ $large?: boolean }>`
	display: flex;
	align-items: center;
	gap: 6px;
	width: fit-content;
	padding: ${({ $large }) => ($large ? "10px 18px" : "8px 14px")};
	border-radius: var(--radius);
	font-size: ${({ $large }) => ($large ? "15px" : "13px")};
	font-weight: 600;
	font-family: inherit;
	border: 1px solid var(--border);
	background: none;
	color: var(--text-dim);
	cursor: pointer;
	transition:
		background 100ms,
		color 100ms;

	&:hover {
		background: var(--bg-4);
		color: var(--text);
	}
`;

export const EditPanel = styled.div<{ $large?: boolean }>`
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding: ${({ $large }) => ($large ? "20px" : "16px")};
	border-radius: var(--radius-lg);
	border: 1px solid var(--border-bright);
	background: var(--bg-3);
`;

export const EditRow = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const EditLabel = styled.label<{ $large?: boolean }>`
	font-size: ${({ $large }) => ($large ? "13px" : "11px")};
	font-weight: 700;
	letter-spacing: 1px;
	text-transform: uppercase;
	color: var(--text-dimmer);
`;

export const Input = styled.input<{ $large?: boolean }>`
	width: 100%;
	font-family: inherit;
	background: var(--bg-2);
	border: 1px solid var(--border);
	color: var(--text);
	border-radius: var(--radius);
	padding: ${({ $large }) => ($large ? "10px 14px" : "8px 12px")};
	font-size: ${({ $large }) => ($large ? "16px" : "14px")};
	outline: none;
	transition: border-color 150ms;

	&:focus {
		border-color: var(--color-brand);
	}

	&:disabled {
		color: var(--text-dimmer);
		cursor: not-allowed;
	}

	&::-webkit-calendar-picker-indicator {
		filter: invert(0.6);
	}
`;

export const EpisodeRow = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const EpisodeSep = styled.span`
	color: var(--text-dimmer);
`;

export const DateHint = styled.span<{ $large?: boolean }>`
	display: block;
	margin-top: 4px;
	font-size: ${({ $large }) => ($large ? "13px" : "12px")};
	font-family: var(--font-mono);
	color: var(--text-dimmer);
`;

export const TagInputRow = styled.div`
	display: flex;
	gap: 6px;

	> input {
		flex: 1;
	}
`;

export const TagChips = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
	margin-top: 2px;
`;

export const TagChip = styled.span<{ $large?: boolean }>`
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-size: ${({ $large }) => ($large ? "14px" : "12px")};
	font-weight: 600;
	padding: ${({ $large }) => ($large ? "4px 10px" : "3px 8px")};
	border-radius: 20px;
	background: var(--color-accent-dim);
	border: 1px solid var(--color-accent);
	color: var(--color-accent);

	button {
		display: flex;
		font-size: 11px;
		color: inherit;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		line-height: 1;
		opacity: 0.7;
		transition: opacity 100ms;

		&:hover {
			opacity: 1;
		}
	}
`;

export const EditActions = styled.div`
	display: flex;
	gap: 8px;
	padding-top: 4px;
`;

export const SaveButton = styled.button<{ $large?: boolean }>`
	padding: ${({ $large }) => ($large ? "10px 22px" : "8px 18px")};
	background: var(--color-brand);
	color: white;
	border-radius: var(--radius);
	font-size: ${({ $large }) => ($large ? "16px" : "14px")};
	font-weight: 600;
	font-family: inherit;
	border: none;
	cursor: pointer;
	transition: opacity 150ms;

	&:hover {
		opacity: 0.85;
	}
`;

export const CancelButton = styled.button<{ $large?: boolean }>`
	padding: ${({ $large }) => ($large ? "10px 18px" : "8px 14px")};
	color: var(--text-dim);
	border-radius: var(--radius);
	font-size: ${({ $large }) => ($large ? "16px" : "14px")};
	font-family: inherit;
	border: 1px solid var(--border);
	background: none;
	cursor: pointer;
	transition: background 100ms;

	&:hover {
		background: var(--bg-4);
	}
`;

export const ActionsRow = styled.div<{ $large?: boolean }>`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: ${({ $large }) => ($large ? "14px" : "8px")};
	padding-top: ${({ $large }) => ($large ? "18px" : "4px")};
	border-top: 1px solid var(--border);

	/* Groups the editing controls at the start and pushes the destructive action to the far end. */
	> *:last-child {
		margin-left: auto;
	}
`;

export const ActionButton = styled.button<{ $danger?: boolean; $large?: boolean }>`
	display: flex;
	align-items: center;
	gap: 6px;
	padding: ${({ $large }) => ($large ? "11px 18px" : "9px 14px")};
	border-radius: var(--radius);
	font-size: ${({ $large }) => ($large ? "15px" : "13px")};
	font-weight: 600;
	cursor: pointer;
	font-family: inherit;
	transition:
		background 100ms,
		color 100ms,
		border-color 100ms;

	${({ $danger }) =>
		$danger
			? `
				border: 1px solid var(--color-brand);
				background: var(--color-brand-dim);
				color: var(--color-brand);

				&:hover {
					background: var(--color-brand);
					color: white;
				}
			`
			: `
				border: 1px solid var(--border);
				background: none;
				color: var(--text-dim);

				&:hover {
					background: var(--bg-4);
					color: var(--text);
				}
			`}
`;
