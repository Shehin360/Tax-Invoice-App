import { ipcMain } from "electron";
import {
  settingsRepository,
  type SettingsPayload,
} from "../database/settings.repository";

export function registerSettingsIpc(): void {
  ipcMain.handle("settings:get", async () => {
    return settingsRepository.getSettings();
  });

  ipcMain.handle("settings:save", async (_event, payload: SettingsPayload) => {
    return settingsRepository.saveSettings(payload);
  });
}
