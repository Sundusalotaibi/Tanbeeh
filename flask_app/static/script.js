/* Dynamic Interactive Scripts for تنبّه (Tanbeeh) Fintech System */

let currentLang = "EN"; // Default language
let gaugeChart = null;

// Translation dictionary
const translations = {
    EN: {
        title: "Financial Risk Analysis Tool",
        subtitle: "Analyze client credentials, compute credit vulnerability index, and generate proactive mitigations.",
        formTitle: "Financial Profile Assessment",
        labelIncome: "Monthly Income ($)",
        placeholderIncome: "e.g. 8000",
        labelExpenses: "Monthly Expenses ($)",
        placeholderExpenses: "e.g. 3000",
        labelDebt: "Total Outstanding Debt ($)",
        placeholderDebt: "e.g. 15000",
        labelRepayment: "Repayment History Score (0 - 100)",
        repaymentDesc: "100 represents immaculate history; 0 represents continuous defaults.",
        btnSubmit: "Execute Risk Analysis",
        emptyTitle: "No Active Analysis",
        emptyText: "Fill out the parameters on the left and execute the financial risk analysis to generate insights.",
        analysisResultTitle: "Portfolio Evaluation Results",
        riskScoreLabel: "Risk Score",
        metricDtiTitle: "Expense-to-Income (DTI)",
        metricLeverageTitle: "Annual Debt Leverage",
        metricRepaymentTitle: "Repayment Penalty",
        adviceTitleHeader: "Proactive Advisories",
        langToggleText: "العربية",
        lowRisk: "LOW RISK",
        mediumRisk: "MEDIUM RISK",
        highRisk: "HIGH RISK",
        criticalRisk: "CRITICAL RISK",
        statusAcceptable: "Acceptable",
        statusOptimal: "Optimal",
        statusHigh: "Heavy Burden",
        statusLowDebt: "Low Leverage",
        statusMediumDebt: "Manageable Debt",
        statusHighDebt: "Severe Leverage",
        statusPerfectPay: "Perfect Standing",
        statusMinorPay: "Minor Slippage",
        statusPoorPay: "High Risk Defaults"
    },
    AR: {
        title: "منظومة تحليل المخاطر المالية",
        subtitle: "قم بتحليل البيانات الائتمانية للمستفيد، واحتساب مؤشر التعرض للتعثر، واستخلاص الإجراءات التحوطية الاستباقية.",
        formTitle: "تقييم الهيكل المالي الحالي",
        labelIncome: "الدخل الشهري ($)",
        placeholderIncome: "مثال: 8000",
        labelExpenses: "المصاريف الشهرية ($)",
        placeholderExpenses: "مثال: 3000",
        labelDebt: "إجمالي الديون الالتزامية ($)",
        placeholderDebt: "مثال: 15000",
        labelRepayment: "مؤشر جودة سداد الأقساط الائتمانية (0 - 100)",
        repaymentDesc: "100 تعني التزام وسداد مثالي تام؛ 0 تعني وجود تعثر وتخلف مستمر عن السداد.",
        btnSubmit: "تشغيل هندسة تحليل المخاطر",
        emptyTitle: "لا توجد نتائج تحليل نشطة",
        emptyText: "يرجى تعبئة المؤشرات في الحقول الجانبية والضغط على زر التحليل لتوليد تقارير المخاطر والنصائح الاستباقية.",
        analysisResultTitle: "نتائج تقييم المحفظة المالية",
        riskScoreLabel: "مؤشر المخاطر",
        metricDtiTitle: "المصاريف للدخل (DTI)",
        metricLeverageTitle: "الرافعة السنوية للديون",
        metricRepaymentTitle: "تراجع جودة السداد",
        adviceTitleHeader: "التوجيهات والتحذيرات الاستباقية",
        langToggleText: "English",
        lowRisk: "مخاطر منخفضة",
        mediumRisk: "مخاطر متوسطة",
        highRisk: "مخاطر مرتفعة",
        criticalRisk: "خطورة حرجة جدًا",
        statusAcceptable: "مستقر ومقبول",
        statusOptimal: "أداء مالي مثالي",
        statusHigh: "عبء إنفاق مرتفع",
        statusLowDebt: "رافعة ديون آمنة",
        statusMediumDebt: "ديون تحت السيطرة",
        statusHighDebt: "رافعة ديون خطيرة",
        statusPerfectPay: "سجل التزام مثالي",
        statusMinorPay: "تأخير طفيف هامشي",
        statusPoorPay: "معدل تعثر مقلق"
    }
};

// UI Range feedback
function updateRangeVal(val) {
    document.getElementById("repaymentVal").textContent = val + "%";
}

// Language Switcher Logic
const langToggleBtn = document.getElementById("langToggle");
langToggleBtn.addEventListener("click", () => {
    currentLang = currentLang === "EN" ? "AR" : "EN";
    applyLanguage(currentLang);
});

function applyLanguage(lang) {
    const isAr = lang === "AR";
    document.documentElement.dir = isAr ? "rtl" : "ltr";
    document.documentElement.lang = isAr ? "ar" : "en";

    const dict = translations[lang];

    // Main Headers & Navigation
    document.getElementById("langText").textContent = dict.langToggleText;
    document.getElementById("titleText").textContent = dict.title;
    document.getElementById("subtitleText").textContent = dict.subtitle;

    // Form Section
    document.getElementById("formTitle").textContent = dict.formTitle;
    document.getElementById("labelIncome").textContent = dict.labelIncome;
    document.getElementById("income").placeholder = dict.placeholderIncome;
    document.getElementById("labelExpenses").textContent = dict.labelExpenses;
    document.getElementById("expenses").placeholder = dict.placeholderExpenses;
    document.getElementById("labelDebt").textContent = dict.labelDebt;
    document.getElementById("debt").placeholder = dict.placeholderDebt;
    document.getElementById("labelRepayment").textContent = dict.labelRepayment;
    document.getElementById("repaymentDesc").textContent = dict.repaymentDesc;
    document.getElementById("btnSubmitText").textContent = dict.btnSubmit;

    // Empty Results State
    document.getElementById("emptyStateTitle").textContent = dict.emptyTitle;
    document.getElementById("emptyStateText").textContent = dict.emptyText;

    // Real Results Panel Elements (if active)
    document.getElementById("analysisResultTitle").textContent = dict.analysisResultTitle;
    document.getElementById("riskScoreLabel").textContent = dict.riskScoreLabel;
    document.getElementById("metricDtiTitle").textContent = dict.metricDtiTitle;
    document.getElementById("metricLeverageTitle").textContent = dict.metricLeverageTitle;
    document.getElementById("metricRepaymentTitle").textContent = dict.metricRepaymentTitle;
    document.getElementById("adviceTitleHeader").textContent = dict.adviceTitleHeader;

    // Re-trigger visual updates if result content is visible
    if (!document.getElementById("resultsRealContent").classList.contains("hidden")) {
        updateResultsUIVisuals();
    }
}

// Track current computed data for translation on-the-fly
let lastResultData = null;

function updateResultsUIVisuals() {
    if (!lastResultData) return;

    const dict = translations[currentLang];
    const { riskScore, severity, dti, leverage, repaymentPenalty, advice } = lastResultData;

    // Update numbers
    document.getElementById("riskScoreNum").textContent = riskScore + "%";
    document.getElementById("metricDtiVal").textContent = dti + "%";
    document.getElementById("metricLeverageVal").textContent = leverage + "%";
    document.getElementById("metricRepaymentVal").textContent = repaymentPenalty + "%";

    // Update Severity Badge text & color classes
    const badge = document.getElementById("severityBadge");
    badge.className = "badge-severity"; // reset
    
    if (riskScore >= 75) {
        badge.textContent = dict.criticalRisk;
        badge.classList.add("badge-critical");
    } else if (riskScore >= 50) {
        badge.textContent = dict.highRisk;
        badge.classList.add("badge-high");
    } else if (riskScore >= 30) {
        badge.textContent = dict.mediumRisk;
        badge.classList.add("badge-medium");
    } else {
        badge.textContent = dict.lowRisk;
        badge.classList.add("badge-low");
    }

    // Dynamic metrics statuses
    const dtiStatusEl = document.getElementById("metricDtiStatus");
    dtiStatusEl.className = "metric-status";
    if (dti <= 35) {
        dtiStatusEl.textContent = dict.statusOptimal;
        dtiStatusEl.style.color = "var(--accent-green)";
    } else if (dti <= 50) {
        dtiStatusEl.textContent = dict.statusAcceptable;
        dtiStatusEl.style.color = "var(--accent-yellow)";
    } else {
        dtiStatusEl.textContent = dict.statusHigh;
        dtiStatusEl.style.color = "var(--accent-red)";
    }

    const levStatusEl = document.getElementById("metricLeverageStatus");
    levStatusEl.className = "metric-status";
    if (leverage <= 15) {
        levStatusEl.textContent = dict.statusLowDebt;
        levStatusEl.style.color = "var(--accent-green)";
    } else if (leverage <= 40) {
        levStatusEl.textContent = dict.statusMediumDebt;
        levStatusEl.style.color = "var(--accent-yellow)";
    } else {
        levStatusEl.textContent = dict.statusHighDebt;
        levStatusEl.style.color = "var(--accent-red)";
    }

    const payStatusEl = document.getElementById("metricRepaymentStatus");
    payStatusEl.className = "metric-status";
    if (repaymentPenalty === 0) {
        payStatusEl.textContent = dict.statusPerfectPay;
        payStatusEl.style.color = "var(--accent-green)";
    } else if (repaymentPenalty <= 15) {
        payStatusEl.textContent = dict.statusMinorPay;
        payStatusEl.style.color = "var(--accent-yellow)";
    } else {
        payStatusEl.textContent = dict.statusPoorPay;
        payStatusEl.style.color = "var(--accent-red)";
    }

    // Advisory advice (we request backend to translate, or use raw string if matches local)
    document.getElementById("adviceBodyText").textContent = advice;

    // Render Chart.js Gauge
    renderGaugeChart(riskScore);
}

// Chart.js Gauge chart builder
function renderGaugeChart(score) {
    const ctx = document.getElementById("gaugeChart").getContext("2d");

    if (gaugeChart) {
        gaugeChart.destroy();
    }

    let color = "var(--accent-green)";
    if (score >= 75) {
        color = "var(--accent-red)";
    } else if (score >= 50) {
        color = "var(--accent-yellow)";
    } else if (score >= 30) {
        color = "var(--navy-deep)";
    }

    gaugeChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            datasets: [{
                data: [score, 100 - score],
                backgroundColor: [color, "rgba(0,0,0,0.06)"],
                borderWidth: 0,
                circumference: 180,
                rotation: 270,
                cutout: "82%"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                animateRotate: true,
                animateScale: false,
                duration: 1000,
                easing: "easeOutQuart"
            },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        }
    });
}

// Async form submission logic
async function submitForm(e) {
    e.preventDefault();

    const income = document.getElementById("income").value;
    const expenses = document.getElementById("expenses").value;
    const debt = document.getElementById("debt").value;
    const repayment = document.getElementById("repayment").value;

    const loader = document.getElementById("submitLoader");
    const btnText = document.getElementById("btnSubmitText");
    const submitBtn = document.getElementById("btnSubmit");

    // Show loading spinner
    loader.style.display = "inline-block";
    submitBtn.disabled = true;

    try {
        // Send to Flask API (/api/analyze) or Express API (/api/analyze-risk) depending on the live environment
        // The scripts are identical. We'll use a local relative path:
        const endpoint = window.location.origin.includes("5000") || window.location.origin.includes("localhost:5000")
            ? "/api/analyze"
            : "/api/analyze-risk";

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                income: parseFloat(income),
                expenses: parseFloat(expenses),
                debt: parseFloat(debt),
                repayment: parseFloat(repayment),
                lang: currentLang
            })
        });

        const data = await response.json();

        if (data.success) {
            lastResultData = data;

            // Remove empty state and show results cards
            document.getElementById("resultsEmptyState").classList.add("hidden");
            document.getElementById("resultsRealContent").classList.remove("hidden");

            // Update DOM element values
            updateResultsUIVisuals();
            
            // Scroll to results on small screen
            document.getElementById("resultsCard").scrollIntoView({ behavior: "smooth" });
        } else {
            alert("Analysis failed: " + (data.error || "Unknown server error"));
        }
    } catch (err) {
        console.error("Communication error:", err);
        alert("Server communication error. Please ensure the backend server is active.");
    } finally {
        loader.style.display = "none";
        submitBtn.disabled = false;
    }
}

// Initial language sync
document.addEventListener("DOMContentLoaded", () => {
    applyLanguage(currentLang);
});
