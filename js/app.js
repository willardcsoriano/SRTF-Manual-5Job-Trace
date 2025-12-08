// js/app.js
import { generateInitialProcesses } from "./core/utils.js";
import { runSRTF } from "./core/srtf.js";
import { calculateAverages } from "./core/metrics.js";

import { renderInputTable } from "./ui/inputTable.js";
import { renderMetricsTable } from "./ui/metricsTable.js";
import { renderGanttChart } from "./ui/gantt.js";
import { sortMetricsTable } from "./ui/sort.js";

let initialProcesses = [];

console.log("app.js loaded!");

// Helper: deep clone array of Process objects using the built-in clone()
function cloneProcessArray(list) {
    return list.map(p => p.clone());
}

/**
 * Full simulation workflow:
 *  1) Regenerate fresh processes
 *  2) Render input table
 *  3) Run SRTF (on cloned data)
 *  4) Render Gantt chart + Metrics
 *  5) Show averages
 */
function runSimulation() {
    console.log("Running simulation...");

    // 1. Always regenerate NEW processes for each click
    initialProcesses = generateInitialProcesses();

    const inputContainer   = document.getElementById("process-input-table-container");
    const resultSection    = document.getElementById("result");
    const ganttContainer   = document.getElementById("gantt-chart");
    const metricsContainer = document.getElementById("metrics-table-container");
    const averagesDiv      = document.getElementById("averages");

    // 2. Render fresh input table
    renderInputTable(inputContainer, initialProcesses);

    // 3. Run SRTF on a *separate cloned array* (prevents mutation issues)
    const processesForSimulation = cloneProcessArray(initialProcesses);
    const { schedule, finalProcesses } = runSRTF(processesForSimulation);

    // 4. Make result section visible
    resultSection.classList.remove("hidden");

    // Clear previous output
    ganttContainer.innerHTML = "";
    metricsContainer.innerHTML = "";
    averagesDiv.innerHTML = "";

    // Render Gantt chart
    renderGanttChart(ganttContainer, schedule);

    // Render metrics table + sorting callback
    renderMetricsTable(metricsContainer, finalProcesses, (colIndex) => {
        sortMetricsTable(colIndex);
    });

    // 5. Compute averages
    const { avgWT, avgTAT } = calculateAverages(finalProcesses);

    averagesDiv.innerHTML = `
        <p>Average Waiting Time (WT): 
            <span class="text-red-700 font-extrabold">${avgWT.toFixed(2)}</span> time units
        </p>
        <p>Average Turnaround Time (TAT): 
            <span class="text-primary font-extrabold">${avgTAT.toFixed(2)}</span> time units
        </p>
    `;
}

// Attach button listener AFTER DOM loads
window.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded.");

    const runButton = document.getElementById("run-button");
    if (runButton) {
        runButton.addEventListener("click", runSimulation);
    }
});

// Expose for debugging or inline HTML calls (if ever needed)
window.runSimulation = runSimulation;
