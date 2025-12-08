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


/**
 * Orchestrates a full simulation run:
 *  1. Render input table
 *  2. Run SRTF
 *  3. Render Gantt chart
 *  4. Render metrics table
 *  5. Show average WT/TAT
 */
function runSimulation() {
    const inputContainer   = document.getElementById("process-input-table-container");
    const resultSection    = document.getElementById("result");
    const ganttContainer   = document.getElementById("gantt-chart");
    const metricsContainer = document.getElementById("metrics-table-container");
    const averagesDiv      = document.getElementById("averages");

    if (!initialProcesses || initialProcesses.length === 0) {
        // Fallback in case something went wrong
        initialProcesses = generateInitialProcesses();
    }

    // 1. Render the input table
    renderInputTable(inputContainer, initialProcesses);

    // 2. Run SRTF on a fresh copy (core does its own cloning)
    const { schedule, finalProcesses } = runSRTF(initialProcesses);

    // 3. Show result section
    resultSection.classList.remove("hidden");

    // 4. Render Gantt chart
    renderGanttChart(ganttContainer, schedule);

    // 5. Render metrics table with sorting callback
    renderMetricsTable(metricsContainer, finalProcesses, (colIndex) => {
        sortMetricsTable(colIndex);
    });

    // 6. Compute and render averages
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

// Initialize once DOM is ready
window.addEventListener("DOMContentLoaded", () => {
    initialProcesses = generateInitialProcesses();

    const runButton = document.getElementById("run-button");
    if (runButton) {
        runButton.addEventListener("click", runSimulation);
    }
});

 
// Expose for the existing inline onclick="runSimulation()" in the HTML
window.runSimulation = runSimulation;
