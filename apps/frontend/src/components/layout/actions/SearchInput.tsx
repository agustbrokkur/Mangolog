import styled from "styled-components";
import { Search } from "lucide-react";

const Wrap = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	height: 38px;
	padding: 0 14px;
	border-radius: var(--radius);
	border: 1px solid var(--border);
	background: var(--bg-3);
	width: 480px;

	&:focus-within {
		border-color: var(--border-bright);
	}
`;

const Input = styled.input`
	flex: 1;
	min-width: 0;
	border: none;
	background: none;
	color: var(--text);
	font-size: 14px;
	outline: none;

	&::placeholder {
		color: var(--text-dimmer);
	}
`;

interface SearchInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export const SearchInput = ({ value, onChange, placeholder = "Search..." }: SearchInputProps) => (
	<Wrap>
		<Search size={14} color="var(--text-dimmer)" />
		<Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
	</Wrap>
);
