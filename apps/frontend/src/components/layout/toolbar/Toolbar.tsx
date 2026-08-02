import { Breadcrumb } from "./Breadcrumb";
import styled from "styled-components";

const Wrap = styled.div`
	display: flex;
	align-items: center;
	min-height: 60px;
	height: 60px;
	padding: 0 24px;
	overflow-y: auto;
	border-bottom: 1px solid var(--border);
	background: var(--bg-2);
`;

export const Toolbar = () => {
	return (
		<Wrap>
			<Breadcrumb />
		</Wrap>
	);
};
