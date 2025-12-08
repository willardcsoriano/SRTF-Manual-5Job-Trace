// js/ui/gantt.js

/**
 * Maps process names to Tailwind background colors.
 */
function getColor(name) {
    const map = {
        "P1": "bg-emerald-500",
        "P2": "bg-sky-500",
        "P3": "bg-amber-500",
        "P4": "bg-red-500",
        "P5": "bg-purple-500",
        "Idle": "bg-gray-300"
    };
    return map[name] || "bg-gray-500";
}

/**
 * Render Gantt chart from schedule segments.
 * @param {HTMLElement} container
 * @param {Array<{name:string,start:number,end:number}>} schedule
 */
export function renderGanttChart(container, schedule) {
    const totalTime = schedule[schedule.length - 1].end;

    const wrapper = document.createElement("div");
    wrapper.className = "relative mt-6";

    const barRow = document.createElement("div");
    barRow.className = "flex flex-row border border-gray-300 rounded-lg shadow-inner w-full";

    let ticks = "";
    let lastTime = 0;

    schedule.forEach(seg => {
        const duration = seg.end - seg.start;
        const percent = (duration / totalTime) * 100;

        const block = `
            <div class="h-10 flex-grow-0 flex-shrink-0 basis-[${percent}%]
                        ${getColor(seg.name)} text-white text-xs font-semibold 
                        flex items-center justify-center border-r border-gray-900/20 shadow-md">
                ${seg.name}
            </div>
        `;
        barRow.insertAdjacentHTML("beforeend", block);

        ticks += `
            <div style="left: calc(${(seg.start / totalTime) * 100}% - 0.25rem);"
                 class="absolute text-xs text-gray-600">
                <div class="h-1 w-0.5 bg-gray-600 mb-1"></div>${seg.start}
            </div>
        `;

        lastTime = seg.end;
    });

    // Final tick
    ticks += `
        <div style="left: calc(100% - 0.25rem);"
             class="absolute text-xs text-gray-600">
            <div class="h-1 w-0.5 bg-gray-600 mb-1"></div>${lastTime}
        </div>
    `;

    const tickRow = document.createElement("div");
    tickRow.className = "relative h-4 mt-1 mb-6";
    tickRow.innerHTML = ticks;

    wrapper.appendChild(barRow);
    wrapper.appendChild(tickRow);

    container.innerHTML = "";
    container.appendChild(wrapper);
}
