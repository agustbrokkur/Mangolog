import { Link, useLocation, useParams } from "react-router";
import styled from "styled-components";
import { ChevronRight } from "lucide-react";
import { useAnimu } from "../../../hooks/useAnime";
import { resolveEntry } from "../../../types/entry";
import { sectionEntryIds } from "../../../types/section";

const Nav = styled.nav`
	display: flex;
	align-items: center;
	gap: 6px;
	min-width: 0;
	font-size: 15px;
`;

const Crumb = styled.span`
	display: flex;
	align-items: center;
	gap: 6px;
	min-width: 0;
`;

const CrumbLink = styled(Link)`
	color: var(--text-dim);
	text-decoration: none;
	white-space: nowrap;
	transition: color 0.1s;

	&:hover {
		color: var(--text);
	}
`;

const CrumbCurrent = styled.span`
	color: var(--text);
	font-weight: 600;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const Separator = styled(ChevronRight)`
	color: var(--text-dimmer);
	flex-shrink: 0;
`;

export const Breadcrumb = () => {
	const { animeId, sectionId, franchiseId } = useParams();
	const { pathname } = useLocation();
	const { data: animu } = useAnimu();

	const entryItem = animeId ? animu?.entries[animeId] : undefined;

	const sectionItem = sectionId
		? animu?.sections[sectionId]
		: animeId
			? Object.values(animu?.sections ?? {}).find((s) => sectionEntryIds(s).includes(animeId))
			: undefined;

	const franchiseItem = franchiseId ? animu?.franchises[franchiseId] : undefined;

	const crumbs = [{ label: "Overview", path: "/" }];

	if (entryItem) {
		crumbs.push({ label: sectionItem?.label ?? "N/A", path: `/sections/${sectionItem?.id ?? "N/A"}` });
		crumbs.push({ label: resolveEntry(entryItem).displayTitle, path: `/anime/${entryItem.id}` });
	} else if (sectionItem) {
		crumbs.push({ label: sectionItem.label, path: `/sections/${sectionItem.id}` });
	} else if (franchiseItem) {
		crumbs.push({ label: "Franchises", path: "/franchises" });
		crumbs.push({ label: franchiseItem.title, path: `/franchises/${franchiseItem.id}` });
	} else if (pathname === "/anime") {
		crumbs.push({ label: "Library", path: "/anime" });
	} else if (pathname === "/sections") {
		crumbs.push({ label: "Sections", path: "/sections" });
	} else if (pathname === "/franchises") {
		crumbs.push({ label: "Franchises", path: "/franchises" });
	}

	return (
		<Nav>
			{crumbs.map((crumb, i) => (
				<Crumb key={crumb.path}>
					{i > 0 && <Separator size={14} />}
					{i === crumbs.length - 1 ? <CrumbCurrent>{crumb.label}</CrumbCurrent> : <CrumbLink to={crumb.path}>{crumb.label}</CrumbLink>}
				</Crumb>
			))}
		</Nav>
	);
};
