// js/core/utils.js

import { Process } from "./process.js";

/**
 * Shuffle array in-place.
 */
export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Generate the five default processes with fixed BT and shuffled AT.
 */
export function generateInitialProcesses() {
    const arrivalTimes = shuffle([0, 1, 2, 3, 4]);
    const burstTimes = [5, 3, 6, 2, 4];

    const list = [];

    for (let i = 0; i < 5; i++) {
        list.push(new Process(`P${i + 1}`, arrivalTimes[i], burstTimes[i]));
    }

    // Sort by arrival time for nicer table display
    return list.sort((a, b) => a.arrivalTime - b.arrivalTime);
}
