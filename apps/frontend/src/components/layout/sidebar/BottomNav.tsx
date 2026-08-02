import styled from "styled-components";
import { Link } from "react-router";
import { Search, BarChart3, RefreshCw, Settings } from "lucide-react";

const Wrap = styled.div`
	margin-top: auto;
	padding: 8px;
	border-top: 1px solid var(--border);
`;

const NavLink = styled(Link)`
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px 10px;
	border-radius: 6px;
	font-size: 16px;
	color: #9ca3af;
	transition:
		background 150ms,
		color 150ms;

	&:hover {
		background: var(--bg-3);
		color: white;
	}
`;

const NAV_ITEMS = [
	{ label: "Search", to: "/search", icon: Search },
	{ label: "Statistics", to: "/statistics", icon: BarChart3 },
	{ label: "Source Manager", to: "/source-manager", icon: RefreshCw },
	{ label: "Settings", to: "/settings", icon: Settings },
];

export const BottomNav = () => (
	<Wrap>
		{NAV_ITEMS.map(({ label, to, icon: Icon }) => (
			<NavLink key={to} to={to}>
				<Icon size={16} />
				<span>{label}</span>
			</NavLink>
		))}
	</Wrap>
);
