// js/core/metrics.js

/**
 * Calculate average WT & TAT for a list of completed processes.
 */
export function calculateAverages(processes) {
    const n = processes.length;

    const totalWT = processes.reduce((sum, p) => sum + p.waitingTime, 0);
    const totalTAT = processes.reduce((sum, p) => sum + (p.completionTime - p.arrivalTime), 0);

    return {
        avgWT: totalWT / n,
        avgTAT: totalTAT / n
    };
}
