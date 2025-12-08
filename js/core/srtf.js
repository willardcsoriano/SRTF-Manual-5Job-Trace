// js/core/srtf.js

import { cloneProcessList } from "./process.js";

/**
 * Run SRTF Scheduling on a list of processes.
 * @param {Process[]} processes - Base processes (not mutated)
 * @returns {Object} { schedule: [...], finalProcesses: [...] }
 */
export function runSRTF(processes) {
    const runtime = cloneProcessList(processes);
    const n = runtime.length;

    let time = 0;
    let completed = 0;

    let lastProcess = null;
    let segmentStart = 0;
    const schedule = [];

    while (completed < n) {
        let idx = -1;
        let minRemaining = Number.MAX_SAFE_INTEGER;

        // Find runnable process with the shortest remaining burst time
        for (let i = 0; i < n; i++) {
            if (runtime[i].arrivalTime <= time && runtime[i].remainingTime > 0) {
                if (runtime[i].remainingTime < minRemaining) {
                    minRemaining = runtime[i].remainingTime;
                    idx = i;
                }
            }
        }

        const runningName = idx >= 0 ? runtime[idx].name : "Idle";

        // If CPU changes process → close previous segment
        if (runningName !== lastProcess) {
            if (lastProcess !== null) {
                schedule.push({
                    name: lastProcess,
                    start: segmentStart,
                    end: time
                });
            }
            segmentStart = time;
            lastProcess = runningName;
        }

        // Idle time → just advance time
        if (idx === -1) {
            time++;
            continue;
        }

        // Process executes 1 time unit
        let p = runtime[idx];
        if (p.startTime === null) p.startTime = time;

        p.remainingTime--;

        // If finished
        if (p.remainingTime === 0) {
            p.completionTime = time + 1;

            const tat = p.completionTime - p.arrivalTime;
            p.waitingTime = tat - p.burstTime;

            completed++;

            // Close this segment immediately
            schedule.push({
                name: p.name,
                start: segmentStart,
                end: time + 1
            });

            lastProcess = null;
        }

        time++;
    }

    // Copy final properties back into originals
    const finalList = cloneProcessList(processes);
    runtime.forEach(r => {
        const orig = finalList.find(p => p.name === r.name);
        orig.completionTime = r.completionTime;
        orig.waitingTime = r.waitingTime;
    });

    return {
        schedule,
        finalProcesses: finalList
    };
}
