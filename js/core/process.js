// js/core/process.js

export class Process {
    constructor(name, arrivalTime, burstTime) {
        this.name = name;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;

        // runtime values
        this.remainingTime = burstTime;
        this.startTime = null;
        this.completionTime = null;
        this.waitingTime = 0;
    }

    clone() {
        return new Process(this.name, this.arrivalTime, this.burstTime);
    }
}

/**
 * Deep clone an array of Process objects.
 */
export function cloneProcessList(processes) {
    return processes.map(p => p.clone());
}
