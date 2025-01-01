const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const fs = require("fs-extra");
const path = require("path");
const { validate, beautify, correct } = require("./ds/parsing");
const { getGraph } = require("./Graph.js");
const { XML2JSObject, XML2JSON } = require("./JsonConversion.js");

let mainWindow;
let secondWindow;
let thirdWindow;
let algoWindow;
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
        {
          label: "jsonConversion",
          accelerator: "CmdOrCtrl+J",
          click: () => {
            mainWindow.webContents.send("json-conversion");
          },
        },
      ],
    },
    {
      label: "Algorithms",
      submenu: [
        {
          label: "Most Influential",
          click: () => {
            mainWindow.webContents.send("algorithms", "Most-influential");
          },
        },
        {
          label: "Most Active",
          click: () => {
            mainWindow.webContents.send("algorithms", "Most-active");
          },
        },
        {
          label: "Mutual Friends",
          click: () => {
            mainWindow.webContents.send("algorithms", "Mutual-friends");
          },
        },
        {
          label: "Suggest Users",
          click: () => {
            mainWindow.webContents.send("algorithms", "Suggest-users");
          },
        },
        {
          label: "Search Word",
          click: () => {
            mainWindow.webContents.send("algorithms", "Search-word");
          },
        },
        {
          label: "Search a Topic",
          click: () => {
            mainWindow.webContents.send("algorithms", "Search-topic");
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

ipcMain.on("render-file", (event, { content, currentFilePath }) => {
  const graph = getGraph(XML2JSObject(content));
  // Create a list of nodes
  const nodes = Object.keys(graph).map((node) => ({ id: node }));

  // Create links from adjacency list
  const links = [];
  for (const [source, targets] of Object.entries(graph)) {
    targets.forEach((target) => {
      links.push({ source, target });
    });
  }

  const graphData = { nodes, links };
  // console.log(graphData);

  secondWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  secondWindow.loadFile("./graph.html");

  // Wait until the second window finishes loading
  secondWindow.webContents.once("did-finish-load", () => {
    // console.log("Sending graph data:", graphData); // Log data before sending
    secondWindow.webContents.send("graph-data", graphData);
  });
});

ipcMain.on("json-conversion", (event, { content, currentFilePath }) => {
  const jsonContent = XML2JSON(content);
  thirdWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  thirdWindow.loadFile("./jsonDisplay.html");
  // console.log("Sending JSON content:", jsonContent);
  thirdWindow.webContents.once("did-finish-load", () => {
    // console.log("Sending graph data:", graphData); // Log data before sending
    thirdWindow.webContents.send("json-converted", jsonContent);
  });
});

ipcMain.on("algorithms", (event, { content, currentFilePath, type }) => {
  const graph = getGraph(XML2JSObject(content));
  const xmlObject = XML2JSObject(content);
  console.log("algo");
  algoWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  console.log("Type of algorithm:", type);
  algoWindow.loadFile("./algo.html");
  algoWindow.webContents.once("did-finish-load", () => {
    algoWindow.webContents.send("algorithms", xmlObject, graph, type);
  });
});

// ipcMain.on("Most-active", (event, { content, currentFilePath }) => {

// });
// ipcMain.on("Mutual-friends", (event, type, { content, currentFilePath }) => {

// });
// ipcMain.on("Suggest-users", (event, type, { content, currentFilePath }) => {});
// ipcMain.on("Search-word", (event, type, { content, currentFilePath }) => {});
// ipcMain.on("Search-topic", (event, type, { content, currentFilePath }) => {});
