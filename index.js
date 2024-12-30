const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const fs = require("fs-extra");
const path = require("path");
const { validate, beautify, correct } = require("./ds/parsing");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");

  // Create application menu
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "New",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            mainWindow.webContents.send("new-file");
          },
        },
        {
          label: "Open",
          accelerator: "CmdOrCtrl+O",
          click: () => {
            dialog
              .showOpenDialog(mainWindow, {
                properties: ["openFile"],
              })
              .then((result) => {
                if (!result.canceled) {
                  const filePath = result.filePaths[0];
                  const content = fs.readFileSync(filePath, "utf-8");
                  mainWindow.webContents.send("file-opened", {
                    filePath,
                    content,
                  });
                }
              });
          },
        },
        {
          label: "Save",
          accelerator: "CmdOrCtrl+S",
          click: () => {
            mainWindow.webContents.send("save-file");
          },
        },
        {
          label: "Save As",
          accelerator: "CmdOrCtrl+Shift+S",
          click: () => {
            mainWindow.webContents.send("save-file-as");
          },
        },
        {
          label: "render",
          accelerator: "CmdOrCtrl+R",
          click: () => {
            mainWindow.webContents.send("render-file");
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC handlers for file operations
ipcMain.on("save-file", (event, { content, currentFilePath }) => {
  if (currentFilePath) {
    fs.writeFileSync(currentFilePath, content);
    event.reply("file-saved", currentFilePath);
  } else {
    dialog.showSaveDialog(mainWindow).then((result) => {
      if (!result.canceled) {
        fs.writeFileSync(result.filePath, content);
        event.reply("file-saved", result.filePath);
      }
    });
  }
});

ipcMain.on("save-file-as", (event, content) => {
  dialog.showSaveDialog(mainWindow).then((result) => {
    if (!result.canceled) {
      fs.writeFileSync(result.filePath, content);
      event.reply("file-saved", result.filePath);
    }
  });
});
