const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const fs = require('fs-extra');
const path = require('path');
const {minifyXML, encodeXMLTags, decodeXMLTags} = require("./compression.js")

let mainWindow;
let fourthWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  // Create application menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('new-file');
          }
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            dialog.showOpenDialog(mainWindow, {
              properties: ['openFile']
            }).then(result => {
              if (!result.canceled) {
                const filePath = result.filePaths[0];
                const content = fs.readFileSync(filePath, 'utf-8');
                mainWindow.webContents.send('file-opened', { filePath, content });
              }
            });
          }
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('save-file');
          }
        },
        {
          label: 'Save As',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => {
            mainWindow.webContents.send('save-file-as');
          }
        },
        {
          label: 'Minify',
          accelerator: 'CmdOrCtrl+Shift+M',
          click: () => {
            mainWindow.webContents.send('minify');
          }
        },
        {
          label: 'Compress',
          accelerator: 'CmdOrCtrl+Shift+P',
          click: () => {
            mainWindow.webContents.send('compress');
          }
        },
        {
          label: 'Decompress',
          accelerator: 'CmdOrCtrl+Shift+D',
          click: () => {
            mainWindow.webContents.send('decompress');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for file operations
ipcMain.on('save-file', (event, { content, currentFilePath }) => {
  if (currentFilePath) {
    fs.writeFileSync(currentFilePath, content);
    event.reply('file-saved', currentFilePath);
  } else {
    dialog.showSaveDialog(mainWindow).then(result => {
      if (!result.canceled) {
        fs.writeFileSync(result.filePath, content);
        event.reply('file-saved', result.filePath);
      }
    });
  }
});

ipcMain.on('save-file-as', (event, content) => {
  dialog.showSaveDialog(mainWindow).then(result => {
    if (!result.canceled) {
      fs.writeFileSync(result.filePath, content);
      event.reply('file-saved', result.filePath);
    }
  });
});

ipcMain.on('minify', (event, content) => {
  const minified = minifyXML(content);
  dialog.showSaveDialog(mainWindow).then(result => {
    if (!result.canceled) {
      fs.writeFileSync(result.filePath, minified);
      let sentMap = {"content": minified,
                    "path": result.filePath};
      event.reply('minifiedFile', sentMap);
    }
  });
});

ipcMain.on('compress', (event, content) => {
  const {encodedContent,tagsArray} = encodeXMLTags(content);
  dialog.showSaveDialog(mainWindow).then(result => {
    if (!result.canceled) {
      fs.writeFileSync(result.filePath, encodedContent);
      fs.writeFileSync(result.filePath.replace(".txt","EncMap.json").replace(".xml","EncMap.json"),
                  JSON.stringify(tagsArray, null, 2));
      let sentMap = {"content": encodedContent,
                    "path": result.filePath};
      event.reply('compressed', sentMap);
    }
  });
});

ipcMain.on('decompress', (event, content) => {

  let encodingTags = "";
  dialog.showOpenDialog(mainWindow, {
    properties: ['openFile']
  })
  .then(result => {
    if (!result.canceled) {
      encodingTags = result.filePaths[0];
    }
  })
  .then( (result) => {
    const decodedContent = decodeXMLTags(content, encodingTags);
    dialog.showSaveDialog(mainWindow).then(result => {
      if (!result.canceled) {
        fs.writeFileSync(result.filePath, decodedContent);
        let sentMap = {"content": decodedContent,
                      "path": result.filePath};
        event.reply('decompressed', sentMap);
      }
    });
  })
});

