import styled from "styled-components";
import { useMemo } from "react";
import { BarChart3, Building2, CheckCircle2, Heart, Link2, ListVideo, Library, Repeat, Star, Tags } from "lucide-react";
import { useAnimu } from "../hooks/useAnime";
import { computeStatistics } from "../utils/computeStatistics";
import { StatCard } from "../components/statistics/StatCard";
import { ChartCard } from "../components/statistics/ChartCard";
import { DonutBreakdown } from "../components/statistics/DonutBreakdown";
import { ActivityChart } from "../components/statistics/ActivityChart";
import { RankedBarList } from "../components/statistics/RankedBarList";
import { RatingDistributionChart } from "../components/statistics/RatingDistributionChart";

const Wrap = styled.div`
	overflow-y: auto;
`;

const Header = styled.div`
	display: flex;
	flex-direction: column;
	gap: 18px;
	padding: 28px 24px 20px;
	border-bottom: 1px solid var(--border);
`;

const PageHeader = styled.h1`
	display: flex;
	align-items: center;
	gap: 12px;
	font-size: 26px;
	font-weight: 800;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: var(--text);
`;

const EntryCount = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 32px;
	height: 32px;
	padding: 0 10px;
	border-radius: 999px;
	background: var(--bg-4);
	font-size: 16px;
	font-weight: 600;
	letter-spacing: 0;
	text-transform: none;
	color: var(--text-dim);
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 28px;
	padding: 16px 24px 24px;
`;

const OverviewGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(10, minmax(200px, 1fr));
	gap: 14px;
`;

const Group = styled.div`
	display: flex;
	flex-direction: column;
	gap: 14px;
`;

const GroupHeading = styled.h2`
	font-size: 13px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: var(--text-dimmer);
`;

const GroupGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 14px;
`;

const CompositionGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(260px, 380px));
	justify-content: start;
	gap: 14px;
`;

const EmptyState = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10px;
	padding: 80px 24px;
	color: var(--text-dimmer);
	text-align: center;
`;

const EmptyTitle = styled.span`
	font-size: 15px;
	font-weight: 600;
	color: var(--text-dim);
`;

const EmptyHint = styled.span`
	font-size: 13px;
`;

export const StatisticsView = () => {
	const { data: animu } = useAnimu();
	const entries = useMemo(() => animu?.entries ?? {}, [animu]);
	const sections = useMemo(() => animu?.sections ?? {}, [animu]);
	const relations = useMemo(() => animu?.relations ?? [], [animu]);
	const stats = useMemo(() => computeStatistics(entries, sections, relations), [entries, sections, relations]);

	return (
		<Wrap>
			<Header>
				<PageHeader>
					<BarChart3 size={24} />
					Statistics
					<EntryCount>{stats.totalEntries}</EntryCount>
				</PageHeader>
			</Header>

			{stats.totalEntries === 0 ? (
				<EmptyState>
					<EmptyTitle>No entries yet</EmptyTitle>
					<EmptyHint>Add some entries to your library to see your statistics.</EmptyHint>
				</EmptyState>
			) : (
				<Container>
					<OverviewGrid>
						<StatCard icon={Library} label="Total entries" value={stats.totalEntries.toLocaleString()} color="var(--color-blue)" />
						<StatCard icon={ListVideo} label="Episodes watched" value={stats.totalEpisodesWatched.toLocaleString()} color="var(--color-green)" />
						<StatCard icon={Star} label="Average rating" value={stats.averageRating != null ? stats.averageRating.toFixed(1) : "—"} color="var(--color-gold)" />
						<StatCard icon={Heart} label="Favorites" value={stats.favoritesCount.toLocaleString()} color="var(--color-purple)" />
						<StatCard icon={CheckCircle2} label="Rated" value={stats.ratedCount.toLocaleString()} color="var(--color-accent)" />
						<StatCard icon={Tags} label="Genres tracked" value={stats.genreCount.toLocaleString()} color="var(--color-purple)" />
						<StatCard icon={Building2} label="Studios tracked" value={stats.studioCount.toLocaleString()} color="var(--color-blue)" />
						<StatCard icon={Repeat} label="Rewatches" value={stats.totalRewatches.toLocaleString()} color="var(--color-green)" />
						<StatCard icon={Link2} label="Metadata synced" value={`${stats.metadataCoverage}%`} color="var(--color-accent)" />
					</OverviewGrid>

					<Group>
						<GroupHeading>Composition</GroupHeading>
						<CompositionGrid>
							<ChartCard title="Status Breakdown">
								<DonutBreakdown slices={stats.statusBreakdown} />
							</ChartCard>

							<ChartCard title="Media Type">
								<DonutBreakdown slices={stats.mediaTypeBreakdown} />
							</ChartCard>
						</CompositionGrid>

						<ChartCard title="Entries by Section">
							<RankedBarList items={stats.sectionBreakdown} color="var(--color-blue)" emptyLabel="No sections yet." />
						</ChartCard>
					</Group>

					<Group>
						<GroupHeading>Activity</GroupHeading>
						<ChartCard title="Entries Added vs. Finished — Last 12 Months">
							<ActivityChart months={stats.activityOverTime} />
						</ChartCard>
					</Group>

					<Group>
						<GroupHeading>Rankings</GroupHeading>
						<GroupGrid>
							<ChartCard title="Top Genres">
								<RankedBarList items={stats.topGenres} color="var(--color-purple)" emptyLabel="No genre data yet." />
							</ChartCard>

							<ChartCard title="Top Studios">
								<RankedBarList items={stats.topStudios} color="var(--color-blue)" emptyLabel="No studio data yet." />
							</ChartCard>

							<ChartCard title="Top Franchises">
								<RankedBarList items={stats.topFranchises} color="var(--color-gold)" emptyLabel="No linked franchises yet." />
							</ChartCard>

							<ChartCard title="Most Rewatched">
								<RankedBarList items={stats.topRewatches} color="var(--color-green)" emptyLabel="No rewatches yet." />
							</ChartCard>
						</GroupGrid>
					</Group>

					<Group>
						<GroupHeading>Ratings</GroupHeading>
						<ChartCard title="Rating Distribution">
							<RatingDistributionChart buckets={stats.ratingDistribution} />
						</ChartCard>
					</Group>
				</Container>
			)}
		</Wrap>
	);
};
