import { Navigate, Route, Routes } from "react-router";
import { Layout } from "./components/layout/Layout";
import { Overview } from "./pages/OverviewPage";
import { FavoritesView } from "./pages/FavoritesPage";
import { SectionView } from "./pages/SectionPage";
import { EntryView } from "./pages/EntryPage";
import { EntriesIndexView } from "./pages/EntryIndexPage";
import { SectionsIndexView } from "./pages/SectionIndexPage";
import { FranchiseIndexView } from "./pages/FranchiseIndexPage";
import { FranchiseView } from "./pages/FranchisePage";
import { SearchView } from "./pages/SearchPage";
import { StatisticsView } from "./pages/StatisticsPage";
import { SourceManagerView } from "./pages/SourceManagerPage";
import { SettingsView } from "./pages/SettingsPage";

function App() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route path="/" element={<Overview />} />
				<Route path="/favorites" element={<FavoritesView />} />

				<Route path="/sections" element={<SectionsIndexView />} />
				<Route path="/sections/:sectionId" element={<SectionView />} />

				<Route path="/anime" element={<EntriesIndexView />} />
				<Route path="/anime/:animeId" element={<EntryView />} />

				<Route path="/franchises" element={<FranchiseIndexView />} />
				<Route path="/franchises/:franchiseId" element={<FranchiseView />} />

				<Route path="/search" element={<SearchView />} />
				<Route path="/statistics" element={<StatisticsView />} />
				<Route path="/source-manager" element={<SourceManagerView />} />
				<Route path="/settings" element={<SettingsView />} />

				<Route path="*" element={<Navigate to="/" replace />} />
			</Route>
		</Routes>
	);
}

export default App;
