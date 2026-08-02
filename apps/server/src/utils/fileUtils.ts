import fs from "fs";
import type { Animu } from "../models/animu.model";
import { DEFAULT_SETTINGS, type Settings } from "../models/settings.model.ts";

const DATA_FILE = "./src/database/animu.json";
const SETTINGS_FILE = "./src/database/settings.json";

export function readAnimuData(): Animu {
    const data: Animu = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    // Entries written before `tags`/`totalEpisodesOverride` existed on the model are missing them
    // entirely (undefined, not null) — validation rejects undefined, so any update on an unmigrated
    // entry would fail. Backfilling here self-heals the file the next time each entry is saved.
    for (const entry of Object.values(data.entries)) {
        entry.tags ??= [];
        entry.totalEpisodesOverride ??= null;
    }
    return data;
}

export function writeAnimuData(data: Animu): void {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function readSettings(): Settings {
    if (!fs.existsSync(SETTINGS_FILE)) {
        writeSettings(DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
    }
    // Merge over DEFAULT_SETTINGS so settings.json files written before a new field existed still parse.
    return { ...DEFAULT_SETTINGS, ...JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8")) };
}

export function writeSettings(settings: Settings): void {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
}
