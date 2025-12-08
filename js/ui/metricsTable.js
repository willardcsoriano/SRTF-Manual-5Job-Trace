// js/ui/metricsTable.js

/**
 * Builds the final metrics table for display.
 * Sorting is handled externally (via sort.js).
 *
 * @param {HTMLElement} container
 * @param {Process[]} processes
 * @param {Function} onSortClick - Callback(columnIndex)
 */
export function renderMetricsTable(container, processes, onSortClick) {
    const table = document.createElement("table");
    table.className = "min-w-full divide-y divide-gray-200 shadow-lg rounded-lg overflow-hidden mt-4";
    table.id = "metrics-table";

    table.innerHTML = `
        <thead>
            <tr>
                ${["Process", "AT", "BT", "CT", "TAT", "WT"].map((header, idx) => `
                    <th 
                        class="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition"
                        data-col="${idx}"
                    >
                        ${header}
                    </th>
                `).join("")}
            </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
            ${processes.map(p => {
                const tat = p.completionTime - p.arrivalTime;
                return `
                    <tr class="hover:bg-blue-50">
                        <td class="px-4 py-3 text-center font-bold">${p.name}</td>
                        <td class="px-4 py-3 text-center">${p.arrivalTime}</td>
                        <td class="px-4 py-3 text-center">${p.burstTime}</td>
                        <td class="px-4 py-3 text-center">${p.completionTime}</td>
                        <td class="px-4 py-3 text-center text-primary font-semibold">${tat}</td>
                        <td class="px-4 py-3 text-center">${p.waitingTime}</td>
                    </tr>
                `;
            }).join("")}
        </tbody>
    `;

    // Attach click events to headers
    table.querySelectorAll("th").forEach(th => {
        th.addEventListener("click", () => {
            onSortClick(Number(th.dataset.col));
        });
    });

    container.innerHTML = "";
    container.appendChild(table);
}
