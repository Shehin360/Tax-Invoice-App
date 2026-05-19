const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

// Create Application Window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, "../assets/icon.png"),
  });

  const startUrl = isDev
    ? "http://localhost:4200"
    : `file://${path.join(__dirname, "../dist/tax-invoice-manager/index.html")}`;

  mainWindow.loadURL(startUrl);

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// App Event Listeners
app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Application Menu
const template = [
  {
    label: "File",
    submenu: [
      {
        label: "Exit",
        accelerator: "CmdOrCtrl+Q",
        click: () => {
          app.quit();
        },
      },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
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
  {
    label: "Help",
    submenu: [
      {
        label: "About Tax Invoice Manager",
        click: () => {
          // About dialog
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// IPC Handlers
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

ipcMain.handle("get-app-name", () => {
  return "Tax Invoice Manager";
});
