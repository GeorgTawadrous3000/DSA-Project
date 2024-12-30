// import * as d3 from "d3";

const { ipcRenderer } = require("electron");

// Listen for graph data sent from the main process
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded"); // Debugging log
  ipcRenderer.on("graph-data", (_event, graphData) => {
    renderGraph(graphData);
  });
});

// Function to render a force-directed graph using D3.js
function renderGraph(graph) {
  console.log("Rendering graph with data:", graph); // Debugging log
  const { nodes, links } = graph;

  const canvas = d3.select("#network"),
    width = canvas.attr("width"),
    height = canvas.attr("height"),
    r = 40,
    ctx = canvas.node().getContext("2d");

  const simulation = d3
    .forceSimulation(nodes)
    .force("x", d3.forceX(width / 2))
    .force("y", d3.forceY(height / 2))
    .force("collide", d3.forceCollide(r + 5))
    .force("charge", d3.forceManyBody().strength(-1600))
    .force(
      "link",
      d3.forceLink().id((d) => d.id)
    )
    .on("tick", update);

  simulation.nodes(nodes);
  simulation.force("link").links(links);

  function update() {
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.strokeStyle = "#2563eb";
    links.forEach(drawLink);
    ctx.stroke();

    ctx.beginPath();
    graph.nodes.forEach(drawNode);
    ctx.fill();
  }

  function drawNode(d) {
    ctx.fillStyle = "#db2777";
    ctx.moveTo(d.x, d.y);
    ctx.arc(d.x, d.y, r, 0, 2 * Math.PI);
    //   ctx.fillStyle = "steelblue";
    //   ctx.fill();
    //   ctx.stroke();
  }

  function drawLink(l) {
    ctx.moveTo(l.source.x, l.source.y);
    ctx.lineTo(l.target.x, l.target.y);
  }

  update();
}
