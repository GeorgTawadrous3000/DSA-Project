// Listen for graph data sent from the main process
window.electronAPI.onGraphData((graphData) => {
  console.log("Received graph data:", graphData);
  renderGraph(graphData); // Call function to render the graph with D3.js
});

document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.on("graph-data", () => {
    renderGraph(graphData);
  });
});

// Function to render a force-directed graph using D3.js
function renderGraph(data) {
  const width = 800;
  const height = 600;

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const simulation = d3
    .forceSimulation(data.nodes)
    .force(
      "link",
      d3.forceLink(data.links).id((d) => d.id)
    )
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg
    .append("g")
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("stroke-width", 2)
    .attr("stroke", "#999");

  const node = svg
    .append("g")
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("r", 10)
    .attr("fill", "#69b3a2");

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  });
}
