import styled from "styled-components";
import { Link } from "react-router";

export const Wrap = styled.div`
	overflow-y: auto;
`;

export const Container = styled.div`
	max-width: 1400px;
	padding: 32px 40px 56px;
	display: flex;
	flex-direction: column;
	gap: 28px;
	text-align: left;
`;

export const BackLink = styled(Link)`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	width: fit-content;
	font-size: 13px;
	font-weight: 600;
	color: var(--text-dim);
	transition: color 100ms;

	&:hover {
		color: var(--text);
	}
`;

export const FranchiseSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 14px;
	padding-top: 12px;
	border-top: 1px solid var(--border);
`;

export const FranchiseHeading = styled.h3`
	font-family: var(--font-display);
	font-size: 20px;
	letter-spacing: 0.5px;
	color: var(--text);
`;

export const FranchiseGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
	gap: 16px;
`;

export const NotFound = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	color: var(--text-dimmer);
	font-size: 14px;
`;
