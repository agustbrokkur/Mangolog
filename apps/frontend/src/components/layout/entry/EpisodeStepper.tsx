import styled from "styled-components";
import { Minus, Plus } from "lucide-react";

const Wrap = styled.div<{ $transparent?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 4px;
	border-radius: 6px;
	padding: 4px 6px;

	${({ $transparent }) =>
		$transparent
			? `
        background: rgb(255 255 255 / 0.12);
        border: none;
      `
			: `
        background: var(--bg-2);
        border: 1px solid var(--border);
      `}
`;

const Btn = styled.button`
	padding: 4px;
	color: var(--text-dim);
	background: none;
	border: none;
	cursor: pointer;

	&:hover {
		color: var(--text);
	}
`;

const Count = styled.span`
	font-size: 14px;
	font-weight: 600;
	color: var(--text);
	min-width: 40px;
	text-align: center;
`;

interface EpisodeStepperProps {
	current: number;
	total?: number;
	onChange?: (delta: number) => void;
	transparent?: boolean;
}

export const EpisodeStepper = ({ current, total, onChange, transparent }: EpisodeStepperProps) => (
	<Wrap $transparent={transparent}>
		<Btn onClick={() => onChange?.(-1)}>
			<Minus size={13} />
		</Btn>
		<Count>
			{current} / {total ?? "?"}
		</Count>
		<Btn onClick={() => onChange?.(1)}>
			<Plus size={13} />
		</Btn>
	</Wrap>
);
