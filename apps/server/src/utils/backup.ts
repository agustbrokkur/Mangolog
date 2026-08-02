import fs from "fs";
import { readSettings } from "./fileUtils.ts";

const DATA_FILE = "./src/database/animu.json";
const BACKUP_DIR = "./src/database/backups"
const BACKUP_FILENAME = /^animu-\d{12}\.json$/;

export type BackupInfo = { filename: string; createdAt: number; sizeBytes: number };

export function createBackup(): string {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 12);
    const backupPath = `${BACKUP_DIR}/animu-${timestamp}.json`;

    fs.copyFileSync(DATA_FILE, backupPath);
    return backupPath;
}

export function listBackups(): BackupInfo[] {
    if (!fs.existsSync(BACKUP_DIR)) {
        return [];
    }

    return fs.readdirSync(BACKUP_DIR)
        .filter((filename) => BACKUP_FILENAME.test(filename))
        .map((filename) => {
            const stat = fs.statSync(`${BACKUP_DIR}/${filename}`);
            return { filename, createdAt: stat.mtimeMs, sizeBytes: stat.size };
        })
        .sort((a, b) => b.createdAt - a.createdAt);
}

// Restoring is destructive to the current animu.json, so a safety backup of the current
// state is always taken first — restoring never has a one-way-door outcome.
export function restoreBackup(filename: string): void {
    if (!BACKUP_FILENAME.test(filename)) {
        throw new Error(`Invalid backup filename "${filename}"`);
    }

    const backupPath = `${BACKUP_DIR}/${filename}`;
    if (!fs.existsSync(backupPath)) {
        throw new Error(`Backup "${filename}" not found`);
    }

    createBackup();
    fs.copyFileSync(backupPath, DATA_FILE);
}

export function checkAutoBackup(): void {
    const { autoBackup } = readSettings();
    if (!autoBackup.enabled) return;

    const backups = listBackups();
    const newest = backups[0];
    const dueAt = (newest?.createdAt ?? 0) + autoBackup.intervalHours * 60 * 60 * 1000;

    if (Date.now() >= dueAt) {
        createBackup();
    }
}