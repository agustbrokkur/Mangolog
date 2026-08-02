import { useParams } from "react-router";
import { EntryDetailPage } from "../components/entry/EntryDetailPage";
import { NotFound } from "../components/entry/EntryDetailPage.styles";
import { useAnimu } from "../hooks/useAnime";
import { resolveEntry } from "../types/entry";
import { sortedSections } from "../types/section";

export const EntryView = () => {
	const { animeId } = useParams();
	const { data: animu, isLoading, isError } = useAnimu();

	if (isLoading) return <NotFound>Loading Animu...</NotFound>;
	if (isError) return <NotFound>Something went wrong with Animu</NotFound>;

	const byId = animeId ? animu?.entries[animeId] : undefined;
	const byTitle = animeId && !byId ? Object.values(animu?.entries ?? {}).find((x) => resolveEntry(x).displayTitle === animeId) : undefined;
	const animeData = byId ?? byTitle ?? null;

	if (!animeData) return <NotFound>Entry not found</NotFound>;

	return <EntryDetailPage entry={animeData} sections={animu ? sortedSections(animu.sections) : []} />;
};
