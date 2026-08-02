export type Franchise = {
	id: string;
	title: string;
	coverUrl: string | null;
	entryIds: string[];
};

export type UpdateFranchise = Pick<Franchise, "title" | "coverUrl">;
