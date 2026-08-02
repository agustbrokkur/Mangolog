import styled from "styled-components";
import { Outlet } from "react-router";
import { Sidebar } from "./sidebar/Sidebar";
import { Toolbar } from "./toolbar/Toolbar";
import { EntryPanelProvider } from "../../context/EntryPanelContext";
import { EntryDetailPanel } from "../entry/EntryDetailPanel";

const Container = styled.div`
	display: flex;
	height: 100vh;
	overflow: hidden;
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	min-width: 0;
`;

const Main = styled.main`
	flex: 1;
	min-height: 0;
	overflow-y: auto;
`;

export const Layout = () => {
	return (
		<EntryPanelProvider>
			<Container>
				<Sidebar />
				<Content>
					<Toolbar />
					<Main>
						<Outlet />
					</Main>
				</Content>
			</Container>
			<EntryDetailPanel />
		</EntryPanelProvider>
	);
};
