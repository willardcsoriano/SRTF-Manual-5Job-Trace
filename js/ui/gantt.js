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
    const wrapper = document.createElement("div");
    wrapper.className = "relative mt-6";

    const barRow = document.createElement("div");
    barRow.className = "flex flex-row overflow-x-auto border border-gray-300 rounded-lg shadow-inner";

    let ticks = "";
    let lastTime = 0;

    schedule.forEach(seg => {
        const duration = seg.end - seg.start;
        const width = `w-[${duration * 2}rem]`;

        const block = `
            <div class="h-10 ${width} ${getColor(seg.name)} text-white
                        text-xs font-semibold flex items-center justify-center
                        border-r border-gray-900/20 shadow-md">
                ${seg.name}
            </div>
        `;
        barRow.insertAdjacentHTML("beforeend", block);

        ticks += `
            <div style="left: calc(${seg.start * 2}rem - 0.25rem);"
                 class="absolute text-xs text-gray-600">
                <div class="h-1 w-0.5 bg-gray-600 mb-1"></div>${seg.start}
            </div>
        `;

        lastTime = seg.end;
    });

    ticks += `
        <div style="left: calc(${lastTime * 2}rem - 0.25rem);"
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
