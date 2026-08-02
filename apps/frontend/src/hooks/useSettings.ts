import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	commitImport,
	createBackup,
	getBackups,
	getSettings,
	previewImport,
	restoreBackup,
	updateSettings,
} from "../services/settingsService";
import type { ImportRow, Settings } from "../types/settings";

export const useSettings = () => {
	return useQuery({
		queryKey: ["settings"],
		queryFn: getSettings,
	});
};

export const useUpdateSettings = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (settings: Settings) => updateSettings(settings),
		onSuccess: (settings) => queryClient.setQueryData(["settings"], settings),
	});
};

export const useBackups = () => {
	return useQuery({
		queryKey: ["backups"],
		queryFn: getBackups,
	});
};

export const useCreateBackup = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createBackup,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["backups"] }),
	});
};

export const useRestoreBackup = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (filename: string) => restoreBackup(filename),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["backups"] });
			queryClient.invalidateQueries({ queryKey: ["animu"] });
		},
	});
};

export const usePreviewImport = () => {
	return useMutation({
		mutationFn: (text: string) => previewImport(text),
	});
};

export const useCommitImport = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (rows: ImportRow[]) => commitImport(rows),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["animu"] }),
	});
};
