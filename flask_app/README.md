# تنبّه (Tanbeeh) - Standalone Python Flask Financial Risk Analysis Tool

This folder contains the standalone, production-ready Python Flask implementation of **تنبّه (Tanbeeh)**, a professional Financial Risk Analysis Tool. It computes high-stakes financial vulnerability indicators and generates proactive financial advisory directives.

---

## 📂 Project Structure

To run the application locally, maintain this exact structure:
```bash
/
├── app.py                 # Core Flask backend (risk calculations & routing)
├── README.md              # Installation & execution instructions (this file)
├── templates/
│   └── index.html         # Responsive, Glassmorphic HTML5 UI with RTL/LTR
└── static/
    ├── style.css          # Premium Navy & Peach Glassmorphism CSS system
    └── script.js          # Interactive translation, gauge chart, & API drivers
```

---

## 🛠️ Local Installation & Setup

Follow these steps to set up and run the system on your local machine:

### 1. Prerequisites
Ensure you have **Python 3.8+** installed on your system. You can check your version by running:
```bash
python --version
```

### 2. Set Up a Virtual Environment (Recommended)
Navigate to the project root directory in your terminal and create a virtual environment:
```bash
# On Linux/macOS
python3 -m venv venv
source venv/bin/activate

# On Windows (Command Prompt)
python -m venv venv
venv\Scripts\activate

# On Windows (PowerShell)
.\venv\Scripts\Activate.ps1
```

### 3. Install Dependencies
Install the required lightweight python libraries using `pip`:
```bash
pip install Flask
```

---

## 🚀 Running the Application

Start the local Flask development server by running:
```bash
python app.py
```

### 🌍 Accessing the Dashboard
Once the server starts, you will see output indicating that the service is running. Open your web browser of choice and navigate to:
**[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## 🧠 Calculation Methodology

The system evaluates risk indicators across three weighted vectors:
1. **Expense-to-Income / Debt-to-Income Index (DTI) (40% Weight)**: Measures direct cash outflow overhead against incoming capital margins.
2. **Annual Debt Leverage Ratio (30% Weight)**: Computes gross outstanding liabilities relative to aggregate annual earning potential.
3. **Repayment Record Standing (30% Weight)**: Evaluates repayment performance and penalty modifiers, mapping risk profiles to specific advisory thresholds.
