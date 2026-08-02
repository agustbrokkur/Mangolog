import styled from "styled-components";
import { Link, NavLink } from "react-router";
import { useMemo } from "react";
import { GROUP_TYPES, GROUP_ICONS, GROUP_TYPE_MAPPINGS, GROUP_COLOR_VARS, type GroupType } from "../../../types/groupType";
import { useAnimu } from "../../../hooks/useAnime";
import { sectionEntryIds, sortedSections } from "../../../types/section";
import { CircleSmallIcon, FolderCog, FolderOpen, Library, LayoutDashboard, Star } from "lucide-react";

interface Grouping {
	name: string;
	type: GroupType;
	count: number;
	path: string;
}

const Body = styled.div`
	flex: 1;
	min-height: 0;
	overflow-y: auto;
	padding: 12px 8px;
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

const GroupBlock = styled.div<{ $color: string }>`
	flex-shrink: 0;
	border-radius: 10px;
	background: color-mix(in srgb, ${({ $color }) => $color} 6%, transparent);
	border: 1px solid color-mix(in srgb, ${({ $color }) => $color} 18%, transparent);
	overflow: hidden;
`;

const GroupHeader = styled.div<{ $color: string }>`
	display: flex;
	align-items: center;
	gap: 8px;
	color: ${({ $color }) => $color};
	font-size: 16px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	padding: 10px 12px 6px;
`;

const SectionList = styled.div`
	display: flex;
	flex-direction: column;
	padding: 0 6px 6px;
`;

const SectionLink = styled(Link)<{ $color: string }>`
	display: flex;
	align-items: center;
	justify-content: space-around;
	gap: 8px;
	color: #d1d5db;
	padding: 7px 10px;
	border-radius: 6px;
	text-decoration: none;
	transition:
		background 150ms,
		color 150ms,
		transform 150ms;

	&:hover {
		color: white;
		background: color-mix(in srgb, ${({ $color }) => $color} 25%, transparent);
		transform: translateX(2px);
	}
`;

const SectionName = styled.span`
	display: flex;
	align-items: center;
	font-size: 15px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	width: 100%;
	min-width: 0;
	text-align: start;
	line-height: 1.6;
`;

const NavGroup = styled.div`
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	gap: 2px;
	padding: 6px;
	border-radius: 10px;
	background: color-mix(in srgb, var(--color-brand) 6%, transparent);
	border: 1px solid color-mix(in srgb, var(--color-brand) 18%, transparent);
`;

const NavItem = styled(NavLink)`
	display: flex;
	align-items: center;
	gap: 8px;
	color: #d1d5db;
	font-size: 15px;
	padding: 7px 10px;
	border-radius: 6px;
	text-decoration: none;
	transition:
		background 150ms,
		color 150ms;

	&:hover {
		color: white;
		background: color-mix(in srgb, var(--color-brand) 25%, transparent);
	}

	&.active {
		color: var(--color-brand);
		background: color-mix(in srgb, var(--color-brand) 16%, transparent);
	}
`;

const SectionCount = styled.span<{ $color: string }>`
	font-size: 15px;
	font-weight: 600;
	color: #6b6b6f;
	font-variant-numeric: tabular-nums;
	transition: color 150ms;
	margin-left: auto;

	${SectionLink}:hover & {
		color: ${({ $color }) => $color};
	}
`;

export const SidebarBody = () => {
	const { data: animu, isLoading } = useAnimu();

	const grouping = useMemo<Grouping[]>(() => {
		if (!animu) return [];

		return sortedSections(animu.sections).map((section) => ({
			name: section.label,
			type: section.group,
			count: sectionEntryIds(section).length,
			path: `/sections/${section.id}`,
		}));
	}, [animu, isLoading]);

	return (
		<Body>
			<NavGroup>
				<NavItem to="/" end>
					<LayoutDashboard size={14} />
					<span>Dashboard</span>
				</NavItem>
				<NavItem to="/anime" end>
					<Library size={14} />
					<span>Library</span>
				</NavItem>
				<NavItem to="/favorites">
					<Star size={14} />
					<span>Favorites</span>
				</NavItem>
				<NavItem to="/sections" end>
					<FolderCog size={14} />
					<span>Sections</span>
				</NavItem>
				<NavItem to="/franchises" end>
					<FolderOpen size={14} />
					<span>Franchises</span>
				</NavItem>
			</NavGroup>

			{GROUP_TYPES.map((groupType) => {
				const Icon = GROUP_ICONS[groupType];
				const color = GROUP_COLOR_VARS[groupType];
				const sections = grouping.filter((group) => group.type === groupType);

				return (
					<GroupBlock key={groupType} $color={color}>
						<GroupHeader $color={color}>
							<Icon size={14} color={color} />
							<span>{GROUP_TYPE_MAPPINGS[groupType]}</span>
						</GroupHeader>

						<SectionList>
							{sections.map((section) => (
								<SectionLink key={section.path} to={section.path} $color={color} title={section.name}>
									<CircleSmallIcon size={14} color={color} style={{ marginRight: "4px" }} />
									<SectionName>{section.name}</SectionName>
									<SectionCount $color={color}>{section.count}</SectionCount>
								</SectionLink>
							))}
						</SectionList>
					</GroupBlock>
				);
			})}
		</Body>
	);
};
