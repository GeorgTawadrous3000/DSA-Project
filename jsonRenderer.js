const { ipcRenderer } = require("electron");

// Listen for graph data sent from the main process
document.addEventListener("DOMContentLoaded", () => {
  //   console.log("DOMContentLoaded"); // Debugging log
  console.log("Hello");
  ipcRenderer.on("json-converted", (_event, jsonContent) => {
    // console.log("Received JSON content:", jsonContent); // Log received data
    document.getElementById("json-content").textContent = jsonContent;
  });
});