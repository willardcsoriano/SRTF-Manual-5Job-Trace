# SRTF Manual Trace (5 Jobs)

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://willardcsoriano.github.io/SRTF-Manual-5Job-Trace/)
[![Status](https://img.shields.io/badge/status-active-blue?style=for-the-badge)]()
[![License](https://img.shields.io/badge/license-educational-purple?style=for-the-badge)]()

A clean, interactive web tool designed to simulate and manually verify the **Shortest-Remaining-Time-First (SRTF)** CPU scheduling algorithm.  
This project is built with a **fully modular ES-module architecture**, making the core logic, UI rendering, and app flow maintainable and scalable.

---

## 🌐 Live Demo

👉 **Try it here:**  
### 🔗 https://willardcsoriano.github.io/SRTF-Manual-5Job-Trace/

Runs entirely in the browser — no install needed.

---

## 🎯 Purpose

This tool was created for **Modeling and Simulation Theory – ASS2.1 (Manual SRTF)** to help students:

- Understand preemptive shortest-job scheduling  
- Validate manual SRTF computations  
- Observe real-time CPU timeline execution  
- Analyze turnaround and waiting times

---

## 🚀 Features

### ✔ Full SRTF Scheduling Simulation
- Preemptive shortest remaining time  
- Automatically detects and handles preemptions  
- CPU timeline updates dynamically  

### ✔ Rich Visualization
- **Gantt chart** with color-coded process segments  
- **Process Input Table** (AT, BT)  
- **Final Metrics Table** (AT, BT, CT, TAT, WT)  
- Sortable columns  
- Average WT and TAT summary  

### ✔ Modular Architecture (ES Modules)
```

js/
├── app.js        # Main controller
├── core/         # Pure scheduling logic
│    ├── process.js
│    ├── utils.js
│    ├── srtf.js
│    └── metrics.js
└── ui/           # Rendering components
├── inputTable.js
├── metricsTable.js
├── gantt.js
└── sort.js

```

### ✔ Modern UI/UX
- TailwindCSS styling  
- Responsive layout  
- MathJax for algorithm notation  

---

## 🧠 Algorithm Explanation: SRTF

SRTF (Shortest Remaining Time First) is a **preemptive version of SJF**.

### **Key Principle**
At any time *t*, the CPU selects the process with the **smallest remaining burst time**.

### **When Preemption Happens**
If a new process arrives with a burst time **shorter than the remaining time** of the currently running process:

```

if BT_new < remaining_time_current:
preempt current
run new process

```

### **Performance Metrics**
For each process P:

```

Turnaround Time (TAT) = Completion Time - Arrival Time
Waiting Time (WT) = TAT - Burst Time

````

This tool computes all metrics automatically.

---

## 📸 Screenshots (Preview)

<img width="1295" height="573" alt="image" src="https://github.com/user-attachments/assets/2bbe108f-b987-4400-b867-b16d4675b244" />


### Input & Instructions Section
<img width="1211" height="483" alt="image" src="https://github.com/user-attachments/assets/231f0d01-1805-4a2c-8f7c-23e6ffd50cb8" />

### Gantt Chart
<img width="1209" height="281" alt="image" src="https://github.com/user-attachments/assets/983ae7cb-cab1-4d80-a690-0a0973eeccc4" />

### Final Metrics Table
<img width="1205" height="351" alt="image" src="https://github.com/user-attachments/assets/dad5d8fe-f183-47e1-9acc-b8cb15aef422" />

---

## 🛠️ Setup for Local Development

Because this project uses **ES Modules**, you must run it from a local server.

### Option 1 — VS Code Live Server (Recommended)
1. Open folder in VS Code  
2. Right-click `index.html` → **Open with Live Server**

### Option 2 — Python
```bash
python -m http.server 3000
````

Visit:

```
http://localhost:3000/
```

### Option 3 — Node http-server

```bash
npm install -g http-server
http-server .
```

---

## 📂 Folder Structure

```
SRTF-Manual-5Job-Trace/
│ index.html
│ favicon.png
│ styles.css
│ README.md
│
└── js/
    ├── app.js
    ├── core/
    │    process.js
    │    utils.js
    │    srtf.js
    │    metrics.js
    │
    └── ui/
         inputTable.js
         metricsTable.js
         gantt.js
         sort.js
```

---

## 🧪 How to Use

1. Open the Live Demo (or run locally)
2. Click **Run Simulation & Generate Trace**
3. View:

   * Input Process Table
   * Gantt Chart
   * Final Metrics Table
   * Average WT & TAT

Arrival times are randomized for each session to encourage manual re-validation.

---

## 🤝 Contributing

Contributions are welcome! You can help by:

* Improving UI/UX
* Adding new scheduling algorithms (FCFS, RR, Priority, etc.)
* Adding export options (CSV, PDF, PNG)
* Improving visualizations
* Adding unit tests for srtf.js

---

## 📄 License

This project is for **educational use**.
You may reuse parts for your own coursework or teaching.

---
