// js/ui/sort.js

/**
 * Sort rows of the metrics table by a column index.
 * @param {number} colIndex
 */
export function sortMetricsTable(colIndex) {
    const tbody = document.querySelector("#metrics-table tbody");
    const rows = Array.from(tbody.rows);

    let currentSort = tbody.dataset.sortCol == colIndex
        ? tbody.dataset.sortDir
        : null;

    const newDir = currentSort === "asc" ? "desc" : "asc";

    const sorted = rows.sort((a, b) => {
        const aVal = a.cells[colIndex].textContent.trim();
        const bVal = b.cells[colIndex].textContent.trim();

        // numeric compare except for Process column (index 0)
        const cmp = colIndex === 0
            ? aVal.localeCompare(bVal)
            : Number(aVal) - Number(bVal);

        return newDir === "asc" ? cmp : -cmp;
    });

    tbody.innerHTML = "";
    sorted.forEach(r => tbody.appendChild(r));

    tbody.dataset.sortCol = colIndex;
    tbody.dataset.sortDir = newDir;
}
