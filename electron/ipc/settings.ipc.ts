import { ipcMain } from "electron";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import {
  settingsRepository,
  type SettingsPayload,
} from "../database/settings.repository";
import { database } from "../database/database";

function decodeDataUrl(dataUrl: string): { buffer: Buffer; extension: string } {
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);

  if (!match) {
    throw new Error("Invalid logo data.");
  }

  const mimeType = match[1];
  const base64 = match[2];
  const extension = mimeType === "image/jpeg" ? ".jpg" : ".png";

  return {
    buffer: Buffer.from(base64, "base64"),
    extension,
  };
}

export function registerSettingsIpc(): void {
  ipcMain.handle("settings:get", async () => {
    return settingsRepository.getSettings();
  });

  ipcMain.handle("settings:save", async (_event, payload: SettingsPayload) => {
    return settingsRepository.saveSettings(payload);
  });

  ipcMain.handle(
    "settings:save-logo",
    async (_event, payload: { fileName: string; dataUrl: string }) => {
      const paths = database.getStoragePaths();
      const { buffer, extension } = decodeDataUrl(payload.dataUrl);
      await mkdir(paths.logosDir, { recursive: true });
      const safeFileName = payload.fileName
        .replace(/[\\/:*?"<>|]/g, "_")
        .replace(/\.[^.]+$/, "");
      const filePath = path.join(paths.logosDir, `${safeFileName}${extension}`);
      await writeFile(filePath, buffer);
      return `file://${filePath}`;
    },
  );
}
