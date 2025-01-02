// import * as d3 from "d3";
const ipcRenderer = window.require("electron").ipcRenderer;


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
    .force("collide", d3.forceCollide(r + 5)) // Prevent nodes from overlapping
    .force("charge", d3.forceManyBody().strength(-800)) // Reduce repulsion strength for better spacing
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(200) // Adjust link distance for better layout
    )
    .on("tick", update);

  simulation.nodes(nodes);
  simulation.force("link").links(links);

  function update() {
    // Clear the canvas before redrawing
    ctx.clearRect(0, 0, width, height);

    // Draw links (with arrows for directionality)
    links.forEach(drawLink);

    // Draw nodes (with IDs inside them)
    nodes.forEach(drawNode);
  }

  function drawNode(d) {
    // Ensure valid positions
    if (isNaN(d.x) || isNaN(d.y)) {
      console.warn(`Skipping node with invalid position: ${d.id}`);
      return;
    }

    // Draw the circular node
    ctx.fillStyle = "#db2777"; // Node color
    ctx.beginPath();
    ctx.arc(d.x, d.y, r, 0, 2 * Math.PI);
    ctx.fill();

    // Draw the node ID inside the circle
    ctx.fillStyle = "#ffffff"; // Text color (white for contrast)
    ctx.font = "14px Arial"; // Font size and style
    ctx.textAlign = "center"; // Center align text horizontally
    ctx.textBaseline = "middle"; // Center align text vertically
    ctx.fillText(d.id, d.x, d.y);
  }

  function drawLink(l) {
    const arrowSize = 40; // Size of the arrowhead
    const angle = Math.atan2(l.target.y - l.source.y, l.target.x - l.source.x);

    // Adjust source and target positions to account for node radius
    const sourceX = l.source.x + r * Math.cos(angle);
    const sourceY = l.source.y + r * Math.sin(angle);
    const targetX = l.target.x - r * Math.cos(angle);
    const targetY = l.target.y - r * Math.sin(angle);

    // Draw the link line
    ctx.beginPath();
    ctx.moveTo(sourceX, sourceY);
    ctx.lineTo(targetX, targetY);
    ctx.strokeStyle = "#2563eb"; // Link color
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw an arrowhead at the end of the link
    const arrowX = targetX - arrowSize * Math.cos(angle);
    const arrowY = targetY - arrowSize * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(
      arrowX + arrowSize * Math.cos(angle - Math.PI / 5),
      arrowY + arrowSize * Math.sin(angle - Math.PI / 5)
    );
    ctx.lineTo(targetX, targetY);
    ctx.lineTo(
      arrowX + arrowSize * Math.cos(angle + Math.PI / 5),
      arrowY + arrowSize * Math.sin(angle + Math.PI / 5)
    );
    ctx.fillStyle = "#2563eb"; // Arrow color (same as link color)
    ctx.fill();
  }

  update();
}
