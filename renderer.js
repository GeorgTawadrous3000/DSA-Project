let currentFilePath = null;
let isModified = false;
const { correct, validate, beautify } = require("./ds/parsing");
document.addEventListener("DOMContentLoaded", () => {
  const textArea = document.getElementById("editor");
  const lineNumbers = document.getElementById("line-numbers");
  const titleBar = document.querySelector("title");

  // Line number generation
  function updateLineNumbers() {
    const lines = textArea.value.split("\n").length;
    lineNumbers.innerHTML = Array(lines)
      .fill("<span></span>")
      .map((_, i) => `<span>${i + 1}</span>`)
      .join("");
  }

  // Update title and modification status
  function updateTitle() {
    const fileName = currentFilePath
      ? path.basename(currentFilePath)
      : "Untitled";
    document.title = `${fileName}${isModified ? " *" : ""}`;
  }

  textArea.addEventListener("input", () => {
    updateLineNumbers();

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
  updateLineNumbers();

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
    updateLineNumbers();
    updateTitle();
  });

  ipcRenderer.on("file-opened", (event, { filePath, content }) => {
    textArea.value = content;
    currentFilePath = filePath;
    isModified = false;
    updateLineNumbers();
    updateTitle();
  });

  function modifyCode(content) {
    if (!validate(content)) {
      const corrected = beautify(correct(content));
      console.log(corrected);
      return corrected;
    }
    return content;
  }

  ipcRenderer.on("save-file", () => {
    textArea.value = modifyCode(textArea.value);
    ipcRenderer.send("save-file", {
      content: textArea.value,
      currentFilePath,
    });
  });

  ipcRenderer.on("render-file", () => {
    textArea.value = modifyCode(textArea.value);
    ipcRenderer.send("render-file", {
      content: textArea.value,
      currentFilePath,
    });
  });

  ipcRenderer.on("json-conversion", () => {
    textArea.value = modifyCode(textArea.value);
    ipcRenderer.send("json-conversion", {
      content: textArea.value,
      currentFilePath,
    });
  });

  ipcRenderer.on("algorithms", type, () => {
    textArea.value = modifyCode(textArea.value);
    ipcRenderer.send("algorithms", {
      content: textArea.value,
      currentFilePath,
      type,
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
});
