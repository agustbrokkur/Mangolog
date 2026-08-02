import styled from "styled-components";
import { type ReactNode } from "react";

const StyledAside = styled.aside`
	width: 240px;
	min-width: 240px;
	height: 100%;
	min-height: 0;
	border-right: 1px solid var(--border);
	display: flex;
	flex-direction: column;
	overflow: hidden;
	background: var(--bg-2);
`;

interface AsideProps {
	children: ReactNode;
}

export const Aside = ({ children }: AsideProps) => <StyledAside>{children}</StyledAside>;
