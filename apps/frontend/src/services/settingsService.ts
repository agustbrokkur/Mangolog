import type { Backup, ImportRow, Settings } from "../types/settings";

const BASE_API_URL = import.meta.env.VITE_API_URL;

export const getSettings = async (): Promise<Settings> => {
	const res = await fetch(`${BASE_API_URL}/settings`);

	if (!res.ok) throw new Error("Failed to fetch settings");

	return res.json();
};

export const updateSettings = async (settings: Settings): Promise<Settings> => {
	const res = await fetch(`${BASE_API_URL}/settings`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(settings),
	});

	if (!res.ok) throw new Error("Failed to update settings");

	return res.json();
};

export const getBackups = async (): Promise<Backup[]> => {
	const res = await fetch(`${BASE_API_URL}/animu/backups`);

	if (!res.ok) throw new Error("Failed to fetch backups");

	return res.json();
};

export const createBackup = async (): Promise<void> => {
	const res = await fetch(`${BASE_API_URL}/animu/backups`, { method: "POST" });

	if (!res.ok) throw new Error("Failed to create backup");
};

export const restoreBackup = async (filename: string): Promise<void> => {
	const res = await fetch(`${BASE_API_URL}/animu/backups/${filename}/restore`, { method: "POST" });

	if (!res.ok) throw new Error("Failed to restore backup");
};

export const exportLog = async (): Promise<string> => {
	const res = await fetch(`${BASE_API_URL}/animu/export`);

	if (!res.ok) throw new Error("Failed to export library");

	return res.text();
};

export const previewImport = async (text: string): Promise<ImportRow[]> => {
	const res = await fetch(`${BASE_API_URL}/animu/import/preview`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ text }),
	});

	if (!res.ok) throw new Error("Failed to preview import");

	return res.json();
};

export const commitImport = async (rows: ImportRow[]): Promise<void> => {
	const res = await fetch(`${BASE_API_URL}/animu/import/commit`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(rows),
	});

	if (!res.ok) throw new Error("Failed to commit import");
};
