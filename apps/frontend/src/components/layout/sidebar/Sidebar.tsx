import { Aside } from "../../ui/Aside";
import { SidebarHeader } from "./SidebarHeader";
import { BottomNav } from "./BottomNav";
import { SidebarBody } from "./SidebarBody";

export const Sidebar = () => {
	return (
		<Aside>
			<SidebarHeader />
			<SidebarBody />
			<BottomNav />
		</Aside>
	);
};
