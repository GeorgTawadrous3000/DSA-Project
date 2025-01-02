let currentFilePath = null;
let isModified = false;
const path = require('path');
import { correct, validate, beautify } from './ds/parsing.js';

document.addEventListener("DOMContentLoaded", () => {
  const textArea = document.getElementById("editor");
  const lineNumbers = document.getElementById("line-numbers");
  const titleBar = document.querySelector("title");

  // Line number generation
  function updateLineNumbers(errorLines = []) {
  const lines = textArea.value.split("\n").length;
  lineNumbers.innerHTML = Array(lines)
    .fill("")
    .map((_, i) => {
      const lineNumber = i + 1;
      const className = errorLines.includes(lineNumber) ? "error-line" : "";
      return `<span class="${className}">${lineNumber}</span>`;
    })
    .join("");
}


  // Update title and modification status
  function updateTitle() {
    const fileName = currentFilePath
      ? path.basename(currentFilePath)
      : "Untitled";
      console.log(fileName)
      document.querySelector('title').innerHTML = `${fileName}${isModified ? " *" : ""}`;
  }

  textArea.addEventListener("input", () => {
    
    updateLineNumbers(validate(textArea.value)[1]);

    // Mark as modified if content changes
    if (!isModified) {
      isModified = true;
      updateTitle();
    }
  });

  textArea.addEventListener("scroll", () => {
    lineNumbers.scrollTop = textArea.scrollTop;
  });

  // Initial line numbers
  updateLineNumbers(validate(textArea.value)[1]);

  // IPC communication for file operations
  const ipcRenderer = window.require("electron").ipcRenderer;

  // New file handler
  ipcRenderer.on("new-file", () => {
    // Check if current file is modified
    if (isModified) {
      const response = window.confirm(
        "Do you want to save changes to the current file?"
      );
      if (response) {
        ipcRenderer.send("save-file", {
          content: textArea.value,
          currentFilePath,
        });
      }
    }

    // Reset for new file
    textArea.value = "";
    currentFilePath = null;
    isModified = false;
    updateLineNumbers(validate(textArea.value)[1]);
    updateTitle();
  });

  ipcRenderer.on("file-opened", (event, { filePath, content }) => {
    textArea.value = content;
    currentFilePath = filePath;
    isModified = false;
    updateLineNumbers(validate(textArea.value)[1]);
    updateTitle();
  });

  function modifyCode(content) {
    let arr = validate(content);
    let isValidated = arr[0];
    let corrected = null;
    if (isValidated) {
      corrected = content;
    } else {
      corrected = correct(content);
    }
    const beautified = beautify(corrected);
    console.log(beautified);
    return beautified;
    // return content+"format invalid";
  }

  ipcRenderer.on("save-file", () => {
    textArea.value = modifyCode(textArea.value);
    ipcRenderer.send("save-file", {
      content: textArea.value,
      currentFilePath,
    });
    updateTitle();
  });

  ipcRenderer.on("render-file", () => {
    textArea.value = modifyCode(textArea.value);
    ipcRenderer.send("render-file", {
      content: textArea.value,
      currentFilePath,
    });
  });

  ipcRenderer.on("save-file-as", () => {
    textArea.value = modifyCode(textArea.value);
    ipcRenderer.send("save-file-as", textArea.value);
  });

  ipcRenderer.on("file-saved", (event, filePath) => {
    currentFilePath = filePath;
    isModified = false;
    updateTitle();
  });





  ipcRenderer.on('minify', () => {
    ipcRenderer.send('minify', textArea.value);
  });

  ipcRenderer.on('minifiedFile', (event, update) => {
    alert("file minified successfuly");
    textArea.value = update["content"];
    updateLineNumbers(validate(textArea.value)[1]);

    currentFilePath = update["path"];
    isModified = false;
    updateTitle();
  });




  ipcRenderer.on('compress', () => {
    ipcRenderer.send('compress', textArea.value);
  });

  ipcRenderer.on('compressed', (event, update) => {
    alert("file compressed successfuly");
    textArea.value = update["content"];
    updateLineNumbers(validate(textArea.value)[1]);

    currentFilePath = update["path"];
    isModified = false;
    updateTitle();
  });




  ipcRenderer.on('decompress', () => {
    ipcRenderer.send('decompress', textArea.value);
  });

  ipcRenderer.on('decompressed', (event, update) => {
    alert("file decompressed successfuly");
    textArea.value = update["content"];
    updateLineNumbers(validate(textArea.value)[1]);

    currentFilePath = update["path"];
    isModified = false;
    updateTitle();
  });




  ipcRenderer.on("json-conversion", () => {
    textArea.value = modifyCode(textArea.value);
    ipcRenderer.send("json-conversion", {
      content: textArea.value,
      currentFilePath,
    });
  });

  ipcRenderer.on("algorithms", (event, type) => {
    textArea.value = modifyCode(textArea.value);
    ipcRenderer.send("algorithms", {
      content: textArea.value,
      currentFilePath,
      type,
    });
  });



});
