import {
  app,
  BrowserWindow,
  Menu,
  type MenuItemConstructorOptions,
} from "electron";
import path from "path";
import isDev from "electron-is-dev";

import { database } from "./database/database";
import { registerCustomerIpc } from "./ipc/customer.ipc";
import { registerInvoiceIpc } from "./ipc/invoice.ipc";
import { registerPdfIpc } from "./ipc/pdf.ipc";
import { registerProductIpc } from "./ipc/product.ipc";
import { registerSettingsIpc } from "./ipc/settings.ipc";
import { ipcMain } from "electron";

let mainWindow: BrowserWindow | null = null;

async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      preload: path.join(__dirname, "../preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, "../assets/icon.png"),
  });

  const startUrl = isDev
    ? "http://localhost:4200"
    : `file://${path.join(__dirname, "../../dist/tax-invoice-manager/index.html")}`;

  await mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function buildApplicationMenu(): void {
  const template: MenuItemConstructorOptions[] = [
    {
      label: "File",
      submenu: [
        {
          label: "Exit",
          accelerator: "CmdOrCtrl+Q",
          click: () => app.quit(),
        },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

async function bootstrap(): Promise<void> {
  await database.initialize();
  registerInvoiceIpc();
  registerCustomerIpc();
  registerProductIpc();
  registerSettingsIpc();
  registerPdfIpc();
  ipcMain.handle("get-app-version", () => app.getVersion());
  ipcMain.handle("get-app-name", () => "Tax Invoice Manager");
  buildApplicationMenu();
  await createWindow();
}

app.whenReady().then(() => {
  bootstrap().catch((error) => {
    console.error("Failed to start application", error);
    app.quit();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow().catch((error) => console.error(error));
  }
});
