import type { Animu } from "../types/animu";
import type { UpdateEntry } from "../types/entry";
import type { CreateSection, UpdateSection } from "../types/section";
import type { UpdateFranchise } from "../types/franchise";

const BASE_API_URL = import.meta.env.VITE_API_URL;

export const getAnimu = async (): Promise<Animu> => {
	const res = await fetch(`${BASE_API_URL}/animu`);

	if (!res.ok) throw new Error("Failed to fetch animu");

	return res.json();
};

export const updateEntry = async (id: string, entry: UpdateEntry): Promise<void> => {
	const res = await fetch(`${BASE_API_URL}/animu/entries/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(entry),
	});

	if (!res.ok) throw new Error("Failed to update entry");
};

export const deleteEntry = async (id: string): Promise<void> => {
	const res = await fetch(`${BASE_API_URL}/animu/entries/${id}`, {
		method: "DELETE",
	});

	if (!res.ok) throw new Error("Failed to delete entry");
};

export const updateEntryFranchise = async (id: string, title: string | null): Promise<void> => {
	const res = await fetch(`${BASE_API_URL}/animu/entries/${id}/franchise`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ title }),
	});

	if (!res.ok) throw new Error("Failed to update entry franchise");
};

export const updateSectionEntries = async (sectionId: string, entryIds: string[]): Promise<string[]> => {
	const res = await fetch(`${BASE_API_URL}/animu/sections/${sectionId}/entries`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ entryIds }),
	});

	if (!res.ok) throw new Error("Failed to update section entries");

	return res.json();
};

export const createSection = async (section: CreateSection): Promise<void> => {
	const res = await fetch(`${BASE_API_URL}/animu/sections`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(section),
	});

	if (!res.ok) throw new Error("Failed to create section");
};

export const updateSection = async (id: string, section: UpdateSection): Promise<void> => {
	const res = await fetch(`${BASE_API_URL}/animu/sections/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(section),
	});

	if (!res.ok) throw new Error("Failed to update section");
};

export const deleteSection = async (id: string): Promise<void> => {
	const res = await fetch(`${BASE_API_URL}/animu/sections/${id}`, {
		method: "DELETE",
	});

	if (!res.ok) throw new Error("Failed to delete section");
};

export const reorderSections = async (sectionIds: string[]): Promise<string[]> => {
	const res = await fetch(`${BASE_API_URL}/animu/sections/reorder`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ sectionIds }),
	});

	if (!res.ok) throw new Error("Failed to reorder sections");

	return res.json();
};

export const updateFranchise = async (id: string, franchise: UpdateFranchise): Promise<void> => {
	const res = await fetch(`${BASE_API_URL}/animu/franchises/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(franchise),
	});

	if (!res.ok) throw new Error("Failed to update franchise");
};

export const deleteFranchise = async (id: string): Promise<void> => {
	const res = await fetch(`${BASE_API_URL}/animu/franchises/${id}`, {
		method: "DELETE",
	});

	if (!res.ok) throw new Error("Failed to delete franchise");
};

export const updateFranchiseEntries = async (franchiseId: string, entryIds: string[]): Promise<string[]> => {
	const res = await fetch(`${BASE_API_URL}/animu/franchises/${franchiseId}/entries`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ entryIds }),
	});

	if (!res.ok) throw new Error("Failed to update franchise entries");

	return res.json();
};
