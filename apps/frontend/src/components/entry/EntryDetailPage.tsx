// EntryDetailPage.tsx
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useAnimu } from "../../hooks/useAnime";
import type { Entry } from "../../types/entry";
import type { Section } from "../../types/section";
import { EntryDetailBody } from "./EntryDetailBody";
import { EntryGridItem } from "./EntryGridItem";
import { BackLink, Container, FranchiseGrid, FranchiseHeading, FranchiseSection, Wrap } from "./EntryDetailPage.styles";

interface EntryDetailPageProps {
	entry: Entry;
	sections: Section[];
}

export const EntryDetailPage = ({ entry, sections }: EntryDetailPageProps) => {
	const { data: animu } = useAnimu();
	const navigate = useNavigate();

	const franchise = animu ? Object.values(animu.franchises).find((f) => f.entryIds.includes(entry.id)) : undefined;
	const relatedEntries = franchise
		? franchise.entryIds
				.filter((id) => id !== entry.id)
				.map((id) => animu?.entries[id])
				.filter((e): e is Entry => e != null)
		: [];

	return (
		<Wrap>
			<Container>
				<BackLink to="/anime">
					<ArrowLeft size={14} /> Back to Library
				</BackLink>

				<EntryDetailBody entry={entry} sections={sections} onDeleted={() => navigate("/anime")} large />

				{franchise && relatedEntries.length > 0 && (
					<FranchiseSection>
						<FranchiseHeading>More from {franchise.title}</FranchiseHeading>
						<FranchiseGrid>
							{relatedEntries.map((related) => (
								<EntryGridItem key={related.id} entry={related} sections={sections} />
							))}
						</FranchiseGrid>
					</FranchiseSection>
				)}
			</Container>
		</Wrap>
	);
};
