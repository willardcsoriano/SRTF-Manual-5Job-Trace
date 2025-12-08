class Process {
    constructor(name, arrivalTime, burstTime) {
        this.name = name;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.startTime = null;
        this.completionTime = null;
        this.waitingTime = 0;
    }
}

// Global variable to hold the processes for persistence and initial table rendering
let initialProcesses = [];

function generateInitialProcesses() {
    const processes = [];
    // Ensure all processes have unique arrival times for a cleaner manual trace
    const arrivalTimes = shuffleArray([0, 1, 2, 3, 4]); 
    // FIXED burst times (as per instructions for manual trace), but randomized for variation
    const fixedBurstTimes = [5, 3, 6, 2, 4]; 
    
    for (let i = 1; i <= 5; i++) {
        const arrivalTime = arrivalTimes[i - 1];
        const burstTime = fixedBurstTimes[i - 1]; // Use fixed/predefined burst times
        processes.push(new Process(`P${i}`, arrivalTime, burstTime));
    }
    // Sort by arrival time for the initial input table display
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
    initialProcesses = processes;
    return processes;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function srtfScheduling(processes) {
    let time = 0;
    let completed = 0;
    const n = processes.length;
    const result = []; 
    
    const runtimeProcesses = processes.map(p => new Process(p.name, p.arrivalTime, p.burstTime));
    
    let lastProcess = null;
    let segmentStart = 0;

    while (completed !== n) {
        let idx = -1;
        let minRemainingTime = Number.MAX_SAFE_INTEGER;

        for (let i = 0; i < n; i++) {
            if (runtimeProcesses[i].arrivalTime <= time && runtimeProcesses[i].remainingTime > 0) {
                if (runtimeProcesses[i].remainingTime < minRemainingTime) {
                    minRemainingTime = runtimeProcesses[i].remainingTime;
                    idx = i;
                }
            }
        }

        const currentProcess = idx !== -1 ? runtimeProcesses[idx].name : 'Idle';

        if (currentProcess !== lastProcess) {
            if (lastProcess !== null) {
                result.push({
                    name: lastProcess,
                    start: segmentStart,
                    end: time
                });
            }
            segmentStart = time;
            lastProcess = currentProcess;
        }

        if (idx !== -1) {
            if (runtimeProcesses[idx].startTime === null) {
                runtimeProcesses[idx].startTime = time;
            }
            runtimeProcesses[idx].remainingTime -= 1;

            if (runtimeProcesses[idx].remainingTime === 0) {
                runtimeProcesses[idx].completionTime = time + 1;
                const tat = runtimeProcesses[idx].completionTime - runtimeProcesses[idx].arrivalTime;
                runtimeProcesses[idx].waitingTime = tat - runtimeProcesses[idx].burstTime;
                completed++;
                
                if (lastProcess !== null) {
                    result.push({
                        name: lastProcess,
                        start: segmentStart,
                        end: time + 1
                    });
                    lastProcess = null; 
                }
            }
        }
        
        time++;
    }
    
    if (lastProcess !== null) {
        result.push({
            name: lastProcess,
            start: segmentStart,
            end: time 
        });
    }

    runtimeProcesses.forEach(runtimeP => {
        const originalP = processes.find(p => p.name === runtimeP.name);
        originalP.completionTime = runtimeP.completionTime;
        originalP.waitingTime = runtimeP.waitingTime;
    });

    return { schedule: result, finalProcesses: processes };
}

function calculateAverageMetrics(processes) {
    const totalWaitingTime = processes.reduce((total, process) => total + process.waitingTime, 0);
    const totalTurnaroundTime = processes.reduce((total, process) => total + (process.completionTime - process.arrivalTime), 0);
    const n = processes.length;
    
    return {
        avgWT: totalWaitingTime / n,
        avgTAT: totalTurnaroundTime / n
    };
}

// Helper function to assign consistent colors using Tailwind classes
function getProcessColor(name) {
    const colorMap = {
        'P1': 'bg-emerald-500', 
        'P2': 'bg-sky-500', 
        'P3': 'bg-amber-500', 
        'P4': 'bg-red-500', 
        'P5': 'bg-purple-500',
        'Idle': 'bg-gray-300'
    };
    return colorMap[name] || 'bg-gray-500';
}

/**
 * Renders the Input Table.
 */
function renderInputTable(processes) {
    const tableClasses = "min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden";
    const headerClasses = "px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
    const cellClasses = "px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center";

    const table = `<table class="${tableClasses}">
        <thead>
            <tr>
                <th class="${headerClasses}">Process</th>
                <th class="${headerClasses}">Arrival Time (AT)</th>
                <th class="${headerClasses}">Burst Time (BT)</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            ${processes.map(process => `
                <tr class="hover:bg-gray-50">
                    <td class="${cellClasses} font-bold ${process.name === 'P1' ? 'text-emerald-600' : 
                                                  process.name === 'P2' ? 'text-sky-600' : 
                                                  process.name === 'P3' ? 'text-amber-600' : 
                                                  process.name === 'P4' ? 'text-red-600' : 
                                                  'text-purple-600'}">${process.name}</td>
                    <td class="${cellClasses}">${process.arrivalTime}</td>
                    <td class="${cellClasses}">${process.burstTime}</td>
                </tr>`).join('')}
        </tbody>
    </table>`;
    
    document.getElementById('process-input-table-container').innerHTML = table;
}

/**
 * Renders the Final Metrics Table (after simulation runs)
 */
function renderFinalMetricsTable(processes) {
    const tableClasses = "min-w-full divide-y divide-gray-200 shadow-lg rounded-lg overflow-hidden mt-4";
    const headerClasses = "px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer transition duration-150 hover:bg-gray-200";
    const cellClasses = "px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-center bg-white";

    const table = document.createElement('table');
    table.className = tableClasses;
    table.id = 'metricsTable';

    table.innerHTML = `
        <thead>
            <tr>
                <th class="${headerClasses}" onclick="sortTable(this, 0)">Process</th>
                <th class="${headerClasses}" onclick="sortTable(this, 1)">AT</th>
                <th class="${headerClasses}" onclick="sortTable(this, 2)">BT</th>
                <th class="${headerClasses}" onclick="sortTable(this, 3)">CT</th>
                <th class="${headerClasses}" onclick="sortTable(this, 4)">TAT</th>
                <th class="${headerClasses}" onclick="sortTable(this, 5)">WT</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            ${processes.map(process => {
                const tat = process.completionTime - process.arrivalTime;
                const wtClass = process.waitingTime < 0 ? 'bg-red-100' : process.waitingTime > 5 ? 'font-semibold text-red-600' : '';
                return `
                    <tr class="hover:bg-blue-50/50">
                        <td class="${cellClasses} font-bold">${process.name}</td>
                        <td class="${cellClasses}">${process.arrivalTime}</td>
                        <td class="${cellClasses}">${process.burstTime}</td>
                        <td class="${cellClasses}">${process.completionTime}</td>
                        <td class="${cellClasses} font-medium text-primary">${tat}</td>
                        <td class="${cellClasses} ${wtClass}">${process.waitingTime}</td>
                    </tr>`;
            }).join('')}
        </tbody>
    `;
    return table;
}

/**
 * Renders the Gantt Chart (Execution Timeline)
 */
function renderGanttChart(schedule) {
    const timelineContainer = document.createElement('div');
    timelineContainer.className = 'flex flex-row overflow-x-auto border border-gray-300 rounded-lg shadow-inner';
    
    const timeTicks = document.createElement('div');
    timeTicks.className = 'flex w-full absolute top-full left-0 mt-1 text-xs text-gray-600 font-mono';
    
    let chartHTML = '';
    let ticksHTML = '';
    let lastTime = 0;

    schedule.forEach(segment => {
        const duration = segment.end - segment.start;
        const colorClass = getProcessColor(segment.name);
        const widthClass = `w-[${duration * 2}rem]`; 

        chartHTML += `
            <div title="${segment.name} (${duration} units)" 
                 class="h-10 ${widthClass} ${colorClass} text-white text-xs font-semibold flex items-center justify-center p-1 border-r border-gray-900/20 shadow-md">
                ${segment.name}
            </div>
        `;

        ticksHTML += `<div style="left: calc(${segment.start * 2}rem - 0.25rem)" class="absolute"><span class="block h-1 w-0.5 bg-gray-500 mb-1"></span>${segment.start}</div>`;
        lastTime = segment.end;
    });

    ticksHTML += `<div style="left: calc(${lastTime * 2}rem - 0.25rem)" class="absolute"><span class="block h-1 w-0.5 bg-gray-500 mb-1"></span>${lastTime}</div>`;


    timelineContainer.innerHTML = chartHTML;

    const wrapper = document.createElement('div');
    wrapper.className = 'relative mt-6';
    wrapper.appendChild(timelineContainer);
    
    const ticksWrapper = document.createElement('div');
    ticksWrapper.className = 'relative h-4 mb-8'; 
    ticksWrapper.innerHTML = ticksHTML;
    wrapper.appendChild(ticksWrapper);

    return wrapper;
}

/**
 * Sorts the metrics table by the given column index.
 */
function sortTable(header, columnIndex) {
    const table = document.getElementById('metricsTable').querySelector('tbody');
    const rows = Array.from(table.rows);
    
    let direction = header.dataset.sort === 'asc' ? 'desc' : 'asc';
    
    document.querySelectorAll('#metricsTable th').forEach(th => th.classList.remove('bg-blue-200'));

    const sortedRows = rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent;
        const bText = b.cells[columnIndex].textContent;
        
        let comparison = 0;
        if (columnIndex > 0) {
            comparison = parseFloat(aText) - parseFloat(bText);
        } else {
            comparison = aText.localeCompare(bText);
        }
        
        return direction === 'asc' ? comparison : -comparison;
    });
    
    header.dataset.sort = direction;
    header.classList.add('bg-blue-200');

    table.innerHTML = '';
    sortedRows.forEach(row => table.appendChild(row));
}

// ----------------------------------------------------
// REMOVE AUTOMATIC INITIALIZATION AND MOVE TO runSimulation
// ----------------------------------------------------

// NOTE: We keep generateInitialProcesses outside to maintain the fixed process set
// between runs, but we remove the rendering call from window.onload

window.onload = function() {
    // Only generate the fixed set of processes when the page loads
    generateInitialProcesses();
    
    // IMPORTANT: The input table will NOT render here, as requested.
    // It will be rendered when runSimulation() is called.
};


window.runSimulation = function() {
    const inputContainer = document.getElementById('process-input-table-container'); // NEW
    const resultDiv = document.getElementById('result');
    const metricsContainer = document.getElementById('metrics-table-container');
    const ganttContainer = document.getElementById('gantt-chart');
    const averagesDiv = document.getElementById('averages');
    
    // 1. Generate the Input Table (NEW STEP)
    renderInputTable(initialProcesses);
    
    // 2. Show the Results Section
    resultDiv.classList.remove('hidden');
    
    // Use the initial, consistent set of processes
    const processesToSimulate = initialProcesses.map(p => new Process(p.name, p.arrivalTime, p.burstTime));
    
    const { schedule, finalProcesses } = srtfScheduling(processesToSimulate);
    const { avgWT, avgTAT } = calculateAverageMetrics(finalProcesses);
    
    // 3. Render Outputs
    ganttContainer.innerHTML = '';
    ganttContainer.appendChild(renderGanttChart(schedule));
    
    metricsContainer.innerHTML = '';
    metricsContainer.appendChild(renderFinalMetricsTable(finalProcesses));
    
    averagesDiv.innerHTML = `
        <p>Average Waiting Time (WT): <span class="text-red-700 font-extrabold">${avgWT.toFixed(2)}</span> time units</p>
        <p>Average Turnaround Time (TAT): <span class="text-primary font-extrabold">${avgTAT.toFixed(2)}</span> time units</p>
    `;
};