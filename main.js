import * as d3 from "d3";
import { data } from "./data.js";

const container = document.getElementById("graph-container");
const detailsPanel = document.getElementById("details-panel");

// Config
const margin = { top: 40, right: 40, bottom: 40, left: 60 };
const laneWidth = 60;
const nodeRadius = 6;
const rowHeight = 60;

// Setup SVG with Zoom
const width = container.clientWidth;
const height = window.innerHeight;

const svg = d3.select("#graph-container")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .call(d3.zoom().on("zoom", (event) => {
        graphGroup.attr("transform", event.transform);
    }))
    .append("g");

const graphGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Color Scale
const colorScale = d3.scaleOrdinal()
    .domain([0, 1, 2, 3])
    .range(["#3b82f6", "#8b5cf6", "#10b981", "#ef4444"]); // Blue (Main), Purple (Rev), Green, Red

// Process Data for Layout
// Map commit ID to index for easy lookup
const commitMap = new Map(data.map((d, i) => [d.id, { ...d, index: i }]));

// Helper to get coordinates
function getCoords(commit) {
    return {
        x: commit.lane * laneWidth,
        y: commit.index * rowHeight
    };
}

// Generate Links
const links = [];
data.forEach((commit, i) => {
    const target = getCoords({ lane: commit.lane, index: i });

    commit.parents.forEach(parentId => {
        const parent = commitMap.get(parentId);
        if (!parent) return;

        const source = getCoords(parent);

        links.push({
            source: source,
            target: target,
            color: colorScale(commit.lane) // Use child's lane color
        });
    });
});

// Draw Links (Bezier Curves)
graphGroup.selectAll(".connection-line")
    .data(links)
    .join("path")
    .attr("class", "connection-line")
    .attr("d", d => {
        const s = d.source;
        const t = d.target;
        // Cubic Bezier for smooth "git graph" look
        return `M ${s.x} ${s.y} C ${s.x} ${s.y + rowHeight / 2}, ${t.x} ${t.y - rowHeight / 2}, ${t.x} ${t.y}`;
    })
    .attr("stroke", d => d.color);

// Draw Nodes
const nodes = graphGroup.selectAll(".commit-group")
    .data(data.map((d, i) => ({ ...d, ...getCoords({ lane: d.lane, index: i }) })))
    .join("g")
    .attr("class", "commit-group")
    .attr("transform", d => `translate(${d.x}, ${d.y})`)
    .on("click", (event, d) => showDetails(d));

// Node Circle
nodes.append("circle")
    .attr("class", "commit-node")
    .attr("r", nodeRadius)
    .attr("fill", d => colorScale(d.lane));

// Message Label (Name + Update Message)
nodes.append("text")
    .attr("class", "node-label")
    .attr("x", 15)
    .attr("y", 4)
    .style("font-family", "'Inter', sans-serif")
    .style("font-size", "11px")
    .text(d => `${d.name}: ${d.message}`);

// Issue Tag (if applicable)
nodes.filter(d => d.type === 'issue' || d.issueId)
    .append("rect")
    .attr("x", -10)
    .attr("y", -10)
    .attr("width", 20)
    .attr("height", 20)
    .attr("rx", 4)
    .attr("fill", "transparent")
    .attr("stroke", "#ef4444")
    .attr("stroke-width", 1.5)
    .attr("stroke-dasharray", "2 2");


// Interactivity
function showDetails(data) {
    let typeClass = "tag-task";
    if (data.type === "revision") typeClass = "tag-revision";
    if (data.type === "issue") typeClass = "tag-issue";

    detailsPanel.innerHTML = `
    <div class="detail-card">
      <div style="margin-bottom:8px;">
        <span class="tag ${typeClass}">${data.type.toUpperCase()}</span>
        <span style="font-size:0.8rem; color:#94a3b8;">${data.date}</span>
      </div>
      
      <h3 style="color:#fff; margin-bottom: 4px;">${data.name}</h3>
      <div style="font-size: 0.85rem; color:#60a5fa; margin-bottom: 12px; font-weight:500;">
        ${data.description}
      </div>

      <div style="background:rgba(255,255,255,0.05); padding:8px; border-radius:4px; margin-bottom:12px;">
         <div style="font-size:0.75rem; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px;">Update Reason</div>
         <div style="color:#e2e8f0; font-size:0.95rem;">${data.message}</div>
      </div>

      <p style="font-size:0.85rem; color:#cbd5e1; margin-bottom:0; border-top:1px solid rgba(255,255,255,0.1); padding-top:8px;">
        <strong>ID:</strong> <span style="font-family:monospace;">${data.id}</span><br/>
        <strong>Parents:</strong> <span style="font-family:monospace;">${data.parents.join(", ") || "None"}</span>
        ${data.issueId ? `<br/><strong>Linked Issue:</strong> <span style="color:#fca5a5">${data.issueId}</span>` : ""}
      </p>
    </div>
  `;
}
