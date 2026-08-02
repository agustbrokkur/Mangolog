import styled from "styled-components";

export const EntryText = styled.p<{ $muted?: boolean; $italic?: boolean; $clamp?: number }>`
	font-size: 16px;
	color: ${({ $muted }) => ($muted ? "#6b6b6f" : "#9ca3af")};
	font-style: ${({ $italic }) => ($italic ? "italic" : "normal")};
	line-height: 1.6;
	${({ $clamp }) =>
		$clamp &&
		`
    display: -webkit-box;
    -webkit-line-clamp: ${$clamp};
    -webkit-box-orient: vertical;
    overflow: hidden;
  `}
`;
