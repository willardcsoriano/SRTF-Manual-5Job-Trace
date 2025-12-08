// js/ui/inputTable.js

/**
 * Renders the table that displays the initial process inputs.
 * @param {HTMLElement} container - The DOM element to fill.
 * @param {Process[]} processes 
 */
export function renderInputTable(container, processes) {
    const table = `
        <table class="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
            <thead>
                <tr>
                    <th class="px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">Process</th>
                    <th class="px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">Arrival Time (AT)</th>
                    <th class="px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">Burst Time (BT)</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${processes.map(p => `
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-center font-bold text-gray-800">${p.name}</td>
                        <td class="px-6 py-4 text-center text-gray-700">${p.arrivalTime}</td>
                        <td class="px-6 py-4 text-center text-gray-700">${p.burstTime}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;

    container.innerHTML = table;
}
