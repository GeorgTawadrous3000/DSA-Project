let currentFilePath = null;
let isModified = false;

document.addEventListener('DOMContentLoaded', () => {
  const textArea = document.getElementById('editor');
  const lineNumbers = document.getElementById('line-numbers');
  const titleBar = document.querySelector('title');

  // Line number generation
  function updateLineNumbers() {
    const lines = textArea.value.split('\n').length;
    lineNumbers.innerHTML = Array(lines)
      .fill('<span></span>')
      .map((_, i) => `<span>${i + 1}</span>`)
      .join('');
  }

  // Update title and modification status
  function updateTitle() {
    const fileName = currentFilePath 
      ? path.basename(currentFilePath) 
      : 'Untitled';
    document.title = `${fileName}${isModified ? ' *' : ''}`;
  }

  textArea.addEventListener('input', () => {
    updateLineNumbers();
    
    // Mark as modified if content changes
    if (!isModified) {
      isModified = true;
      updateTitle();
    }
  });

  textArea.addEventListener('scroll', () => {
    lineNumbers.scrollTop = textArea.scrollTop;
  });

  // Initial line numbers
  updateLineNumbers();

  // IPC communication for file operations
  const ipcRenderer = window.require('electron').ipcRenderer;

  // New file handler
  ipcRenderer.on('new-file', () => {
    // Check if current file is modified
    if (isModified) {
      const response = window.confirm('Do you want to save changes to the current file?');
      if (response) {
        ipcRenderer.send('save-file', { 
          content: textArea.value, 
          currentFilePath 
        });
      }
    }

    // Reset for new file
    textArea.value = '';
    currentFilePath = null;
    isModified = false;
    updateLineNumbers();
    updateTitle();
  });

  ipcRenderer.on('file-opened', (event, { filePath, content }) => {
    textArea.value = content;
    currentFilePath = filePath;
    isModified = false;
    updateLineNumbers();
    updateTitle();
  });

  ipcRenderer.on('save-file', () => {
    ipcRenderer.send('save-file', { 
      content: textArea.value, 
      currentFilePath 
    });
  });

  ipcRenderer.on('save-file-as', () => {
    ipcRenderer.send('save-file-as', textArea.value);
  });

  ipcRenderer.on('file-saved', (event, filePath) => {
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
    updateLineNumbers();

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
    updateLineNumbers();

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
    updateLineNumbers();

    currentFilePath = update["path"];
    isModified = false;
    updateTitle();
  });


});