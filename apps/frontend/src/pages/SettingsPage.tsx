import styled from "styled-components";
import { useRef, useState, type ChangeEvent } from "react";
import { Settings as SettingsIcon, Download, Upload } from "lucide-react";
import { useSettings, useUpdateSettings, useBackups, useCreateBackup, useRestoreBackup, usePreviewImport, useCommitImport } from "../hooks/useSettings";
import { exportLog } from "../services/settingsService";
import type { Backup, ImportRow, Settings } from "../types/settings";
import { StatusMenu } from "../components/layout/entry/StatusMenu";
import { SortMenu } from "../components/layout/actions/SortMenu/SortMenu";
import { ViewModeSwitcher } from "../components/layout/actions/ViewModeSwitcher";
import { ActionButton, Input } from "../components/entry/EntryDetailBody.styles";
import { useConfirm } from "../hooks/useConfirm";

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

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 24px;
	padding: 20px 24px 24px;
	max-width: 720px;
`;

const Section = styled.section`
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 20px;
	background: var(--bg-3);
	border: 1px solid var(--border);
	border-radius: var(--radius-lg);
`;

const SectionTitle = styled.h2`
	font-size: 14px;
	font-weight: 700;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: var(--text);
`;

const Row = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
`;

const FieldGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2px;
`;

const FieldLabel = styled.span`
	font-size: 13px;
	font-weight: 600;
	color: var(--text-dim);
`;

const FieldHint = styled.span`
	font-size: 12px;
	color: var(--text-dimmer);
`;

const ControlRow = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
`;

const ToggleButton = styled.button<{ $on: boolean }>`
	position: relative;
	width: 38px;
	height: 22px;
	flex-shrink: 0;
	border-radius: 999px;
	border: 1px solid var(--border);
	background: ${({ $on }) => ($on ? "var(--color-brand)" : "var(--bg-4)")};
	cursor: pointer;
	transition: background 150ms;

	&::after {
		content: "";
		position: absolute;
		top: 2px;
		left: ${({ $on }) => ($on ? "18px" : "2px")};
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: white;
		transition: left 150ms;
	}
`;

const IntervalInput = styled(Input)`
	width: 64px;
	text-align: center;
`;

const BackupList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const BackupRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 10px 12px;
	border-radius: var(--radius);
	background: var(--bg-2);
	border: 1px solid var(--border);
`;

const BackupMeta = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2px;
`;

const BackupName = styled.span`
	font-family: var(--font-mono);
	font-size: 13px;
	color: var(--text);
`;

const BackupDate = styled.span`
	font-size: 12px;
	color: var(--text-dimmer);
`;

const HiddenFileInput = styled.input`
	display: none;
`;

const PreviewTable = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	max-height: 420px;
	overflow-y: auto;
`;

const PreviewRow = styled.div`
	display: grid;
	grid-template-columns: 2fr 130px 70px 2fr 70px;
	gap: 8px;
	align-items: center;
	padding: 8px;
	border-radius: var(--radius);
	background: var(--bg-2);
	border: 1px solid var(--border);
`;

const MatchTag = styled.span<{ $matched: boolean }>`
	font-size: 11px;
	font-weight: 700;
	text-align: center;
	padding: 4px 6px;
	border-radius: 999px;
	color: ${({ $matched }) => ($matched ? "var(--color-accent)" : "var(--color-brand)")};
	background: ${({ $matched }) => ($matched ? "var(--color-accent-dim)" : "var(--color-brand-dim)")};
`;

const patchSettings = (settings: Settings, patch: Partial<Settings>): Settings => ({ ...settings, ...patch });

export const SettingsView = () => {
	const { data: settings } = useSettings();
	const { mutate: updateSettings } = useUpdateSettings();
	const { data: backups } = useBackups();
	const { mutate: createBackup, isPending: isBackingUp } = useCreateBackup();
	const { mutate: restoreBackup } = useRestoreBackup();
	const { mutateAsync: previewImport, isPending: isPreviewing } = usePreviewImport();
	const { mutate: commitImport, isPending: isCommitting } = useCommitImport();
	const { confirm, confirmUI } = useConfirm();

	const [previewRows, setPreviewRows] = useState<ImportRow[] | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	if (!settings) return null;

	const applyPatch = (patch: Partial<Settings>) => updateSettings(patchSettings(settings, patch));

	const handleExport = async () => {
		const text = await exportLog();
		const blob = new Blob([text], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = "animulog-export.txt";
		anchor.click();
		URL.revokeObjectURL(url);
	};

	const handleFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = "";
		if (!file) return;

		const text = await file.text();
		const rows = await previewImport(text);
		setPreviewRows(rows);
	};

	const updatePreviewRow = (index: number, patch: Partial<ImportRow>) => {
		setPreviewRows((rows) => rows?.map((row, i) => (i === index ? { ...row, ...patch } : row)) ?? rows);
	};

	const handleCommit = () => {
		if (!previewRows) return;
		commitImport(previewRows, { onSuccess: () => setPreviewRows(null) });
	};

	const handleRestore = async (backup: Backup) => {
		const ok = await confirm({
			title: "Restore backup?",
			message: `This replaces your current library with "${backup.filename}". A safety backup of the current state is taken first.`,
			confirmLabel: "Restore",
			danger: true,
		});
		if (ok) restoreBackup(backup.filename);
	};

	return (
		<Wrap>
			<Header>
				<PageHeader>
					<SettingsIcon size={24} />
					Settings
				</PageHeader>
			</Header>

			<Container>
				<Section>
					<SectionTitle>Library Defaults</SectionTitle>
					<Row>
						<FieldLabel>Default status for new entries</FieldLabel>
						<StatusMenu status={settings.defaultEntryStatus} onChange={(status) => applyPatch({ defaultEntryStatus: status })} />
					</Row>
					<Row>
						<FieldLabel>Default sort</FieldLabel>
						<SortMenu sort={settings.defaultSort} onChange={(sort) => applyPatch({ defaultSort: sort })} />
					</Row>
					<Row>
						<FieldLabel>Default view mode</FieldLabel>
						<ViewModeSwitcher viewMode={settings.defaultViewMode} onViewModeChange={(viewMode) => applyPatch({ defaultViewMode: viewMode })} />
					</Row>
				</Section>

				<Section>
					<SectionTitle>Source Fetching</SectionTitle>
					<Row>
						<FieldGroup>
							<FieldLabel>AniList requests per minute</FieldLabel>
							<FieldHint>Throttles both manual search and batch source fetching. AniList's normal limit is 90/min, currently degraded to 30/min — keep this under that.</FieldHint>
						</FieldGroup>
						<ControlRow>
							<IntervalInput
								type="number"
								min={1}
								value={settings.anilistRequestsPerMinute}
								onChange={(e) => applyPatch({ anilistRequestsPerMinute: Math.max(1, Number(e.target.value) || 1) })}
							/>
							<FieldHint>req/min</FieldHint>
						</ControlRow>
					</Row>
				</Section>

				<Section>
					<SectionTitle>Backups</SectionTitle>
					<Row>
						<FieldGroup>
							<FieldLabel>Auto-backup</FieldLabel>
							<FieldHint>Checked hourly; creates a backup once the interval below has elapsed.</FieldHint>
						</FieldGroup>
						<ControlRow>
							<IntervalInput
								type="number"
								min={1}
								disabled={!settings.autoBackup.enabled}
								value={settings.autoBackup.intervalHours}
								onChange={(e) => applyPatch({ autoBackup: { ...settings.autoBackup, intervalHours: Math.max(1, Number(e.target.value) || 1) } })}
							/>
							<FieldHint>hours</FieldHint>
							<ToggleButton $on={settings.autoBackup.enabled} onClick={() => applyPatch({ autoBackup: { ...settings.autoBackup, enabled: !settings.autoBackup.enabled } })} />
						</ControlRow>
					</Row>

					<ControlRow>
						<ActionButton onClick={() => createBackup()} disabled={isBackingUp}>
							Back up now
						</ActionButton>
					</ControlRow>

					<BackupList>
						{backups?.length === 0 && <FieldHint>No backups yet.</FieldHint>}
						{backups?.map((backup) => (
							<BackupRow key={backup.filename}>
								<BackupMeta>
									<BackupName>{backup.filename}</BackupName>
									<BackupDate>
										{new Date(backup.createdAt).toLocaleString()} · {(backup.sizeBytes / 1024).toFixed(1)} KB
									</BackupDate>
								</BackupMeta>
								<ActionButton onClick={() => handleRestore(backup)}>Restore</ActionButton>
							</BackupRow>
						))}
					</BackupList>
				</Section>

				<Section>
					<SectionTitle>Import / Export</SectionTitle>
					<FieldHint>
						A lightweight, human-readable text log — title, status, media type, progress, note and favorite only. For full-fidelity restore, use a backup above instead.
					</FieldHint>

					<ControlRow>
						<ActionButton onClick={handleExport}>
							<Download size={13} /> Export library
						</ActionButton>
						<ActionButton onClick={() => fileInputRef.current?.click()} disabled={isPreviewing}>
							<Upload size={13} /> Import from file
						</ActionButton>
						<HiddenFileInput ref={fileInputRef} type="file" accept=".txt,text/plain" onChange={handleFileSelected} />
					</ControlRow>

					{isPreviewing && <FieldHint>Parsing…</FieldHint>}

					{previewRows && (
						<>
							<FieldHint>
								{previewRows.length} rows parsed — review before committing. "Update" rows match an existing entry by title; "New" rows will be created.
							</FieldHint>
							<PreviewTable>
								{previewRows.map((row, index) => (
									<PreviewRow key={index}>
										<Input value={row.title} onChange={(e) => updatePreviewRow(index, { title: e.target.value })} />
										<StatusMenu status={row.status} onChange={(status) => updatePreviewRow(index, { status })} />
										<Input
											type="number"
											value={row.progress ?? ""}
											onChange={(e) => updatePreviewRow(index, { progress: e.target.value === "" ? null : Number(e.target.value) })}
										/>
										<Input value={row.note ?? ""} placeholder="Note" onChange={(e) => updatePreviewRow(index, { note: e.target.value || null })} />
										<MatchTag $matched={!!row.matchedEntryId}>{row.matchedEntryId ? "Update" : "New"}</MatchTag>
									</PreviewRow>
								))}
							</PreviewTable>
							<ControlRow>
								<ActionButton onClick={handleCommit} disabled={isCommitting}>
									Commit {previewRows.length} rows
								</ActionButton>
								<ActionButton onClick={() => setPreviewRows(null)}>Cancel</ActionButton>
							</ControlRow>
						</>
					)}
				</Section>
			</Container>

			{confirmUI}
		</Wrap>
	);
};
