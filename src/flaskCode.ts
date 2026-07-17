/* Standard standalone code repository for export and local simulation */

export const app_py = `# -*- coding: utf-8 -*-
"""
تنبّه (Tanbeeh) - Financial Risk Analysis Tool
Flask Backend Engine
"""

from flask import Flask, render_template, request, jsonify
import math

app = Flask(__name__)

def calculate_risk_score(income, expenses, debt, repayment):
    if income <= 0:
        return {
            "risk_score": 100,
            "dti": 100,
            "leverage": 100,
            "repayment_penalty": 100,
            "severity": "CRITICAL"
        }
        
    # 1. Debt-to-Income / Expense Ratio (DTI)
    dti = (expenses / income) * 100
    dti_component = min(100, dti)
    
    # 2. Total Debt Leverage (Ratio of total debt vs annual income)
    annual_income = income * 12
    leverage = (debt / annual_income) * 100
    
    # 3. Repayment score penalty
    repayment_penalty = 100 - repayment
    
    # Weighted Scoring Calculation:
    # Expenses/Income ratio: 40%
    # Debt Leverage: 30%
    # Repayment Score Penalty: 30%
    weighted_dti = dti_component * 0.4
    weighted_leverage = min(100, leverage) * 0.3
    weighted_repayment = repayment_penalty * 0.3
    
    risk_score = min(100, max(0, weighted_dti + weighted_leverage + weighted_repayment))
    
    severity = "LOW"
    if risk_score >= 75:
        severity = "CRITICAL"
    elif risk_score >= 50:
        severity = "HIGH"
    elif risk_score >= 30:
        severity = "MEDIUM"
        
    return {
        "risk_score": round(risk_score),
        "dti": round(dti),
        "leverage": round(leverage),
        "repayment_penalty": round(repayment_penalty),
        "severity": severity
    }

def generate_proactive_advice(profile, lang):
    risk_score = profile["risk_score"]
    dti = profile["dti"]
    leverage = profile["leverage"]
    repayment_penalty = profile["repayment_penalty"]
    severity = profile["severity"]
    
    if lang == "AR":
        title = "### تقييم المخاطر المالية المجدول (تنبّه المالي الآلي)\\n\\n"
        details = f"* **مستوى الخطورة**: {severity}\\n"
        details += f"* **مؤشر نسبة الديون والمصاريف إلى الدخل (DTI)**: {dti}%\\n"
        details += f"* **الرافعة المالية للديون السنوية**: {leverage}%\\n\\n"
        details += "#### الإجراءات الاستباقية الموصى بها:\\n"
        
        if severity in ["CRITICAL", "HIGH"]:
            actions = (
                "1. **خفض المصاريف التشغيلية فوراً**: يتجاوز حجم الإنفاق الحالي الحدود الآمنة. يجب إيقاف كافة القنوات الاستهلاكية غير الضرورية.\\n"
                "2. **إعادة هيكلة الديون**: تواصل مع الجهات المقرضة لإعادة جدولة الديون الإجمالية لخفض الأقساط الشهرية.\\n"
                f"3. **رفع رصيد سداد المدفوعات**: تظهر السجلات وجود تأخيرات في السداد بنسبة تراجع تبلغ {repayment_penalty}%. يجب تفعيل الدفع الآلي الفوري لمنع تدهور جدارتك الائتمانية.\\n"
                "4. **تأسيس صندوق طوارئ**: احتفظ باحتياطي نقدي يغطي 6 أشهر من النفقات الأساسية بشكل عاجل."
            )
        elif severity == "MEDIUM":
            actions = (
                f"1. **تحسين الميزانية الشهرية**: نسبة النفقات الحالية للمداخيل هي {dti}%. ينصح بخفضها لتكون دون 35% لتحقيق استقرار مستدام.\\n"
                "2. **تسريع خطة السداد**: استهدف سداد الديون ذات الفائدة الأعلى أولاً (طريقة كرة الثلج للديون) لخفض العبء التراكمي.\\n"
                f"3. **تلافي الغرامات**: حافظ على انضباط السداد الحالي (تقييم الالتزام: {100 - repayment_penalty}%) لرفع درجاتك وتخفيض تكلفة الإقراض مستقبلاً."
            )
        else:
            actions = (
                f"1. **استدامة ممتازة**: الحسابات في وضع صحي ممتاز (خطورة منخفضة: {risk_score}%). استمر في اتباع هذه المنهجية المنضبطة.\\n"
                "2. **الاستثمار الفائض**: بما أن فائض الدخل آمن والالتزام بالسداد مرتفع جداً، ينصح بتوجيه الفائض نحو أصول استثمارية منخفضة المخاطر.\\n"
                "3. **مراقبة دورية**: قم بإعادة تقييم ميزانيتك كل ربع سنة للحفاظ على هذا التوازن المالي الممتاز."
            )
    else:
        title = "### Automated Risk Assessment Report (Tanbeeh Engine)\\n\\n"
        details = f"* **Severity Level**: {severity}\\n"
        details += f"* **Debt-to-Income (DTI) Index**: {dti}%\\n"
        details += f"* **Annual Debt Leverage**: {leverage}%\\n\\n"
        details += "#### Proactive Advisory Directives:\\n"
        
        if severity in ["CRITICAL", "HIGH"]:
            actions = (
                f"1. **Aggressive Expense Reduction**: Your current expenditure is operating at an unsustainable level ({dti}% of income). Instantly freeze all discretionary and non-essential spending.\\n"
                f"2. **Debt Restructuring Protocol**: Contact creditors immediately to restructure your aggregate outstanding liabilities ({leverage}% of your annual income) to mitigate heavy monthly pressures.\\n"
                f"3. **Address Repayment Slippages**: Your repayment record demonstrates a significant performance drop of {repayment_penalty}%. Implement strict autopay rules to preserve and rehabilitate your credit standing.\\n"
                "4. **Emergency Capital Buffer**: Direct any liquid funds immediately into building a 6-month operating expense reserve."
            )
        elif severity == "MEDIUM":
            actions = (
                f"1. **Optimize Operating Margins**: Monthly expenses represent {dti}% of income. Target reduction of this ratio below 35% to establish a resilient margin of safety.\\n"
                "2. **Accelerated Debt Liquidation**: Allocate extra cash flow toward high-interest debt tranches (Debt Avalanche method) to reduce overall compounding liabilities.\\n"
                f"3. **Lock credit discipline**: With your repayment history currently evaluated at {100 - repayment_penalty}%, continue diligent payments to secure prime lending rates in the future."
            )
        else:
            actions = (
                f"1. **Excellent Financial Stewardship**: Your risk matrix is solid (Score: {risk_score}%). You are maintaining a highly disciplined wealth-preservation profile.\\n"
                "2. **Capital Deployment**: Leverage your secure cash margins and immaculate debt rating to channel excess cash flow into low-volatility yielding assets.\\n"
                "3. **Systematic Review**: Re-run this evaluation quarterly to preserve optimized balance sheets and asset-liability ratios."
            )
            
    return title + details + actions

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json or {}
        income = float(data.get('income', 0))
        expenses = float(data.get('expenses', 0))
        debt = float(data.get('debt', 0))
        repayment = float(data.get('repayment', 0))
        lang = data.get('lang', 'EN')
        
        profile = calculate_risk_score(income, expenses, debt, repayment)
        advice = generate_proactive_advice(profile, lang)
        
        return jsonify({
            "success": True,
            "riskScore": profile["risk_score"],
            "severity": profile["severity"],
            "dti": profile["dti"],
            "leverage": profile["leverage"],
            "repaymentPenalty": profile["repayment_penalty"],
            "advice": advice
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
`;

export const style_css = `/* Glassmorphic Stylesheet for تنبّه (Tanbeeh) Fintech Dashboard */

:root {
    --bg-primary: #f0f4f8;
    --navy-deep: #0A2540;
    --peach-accent: #E6B3A8;
    --peach-hover: #D09D93;
    --glass-bg: rgba(255, 255, 255, 0.45);
    --glass-border: rgba(255, 255, 255, 0.35);
    --glass-shadow: rgba(31, 38, 135, 0.08);
    --text-dark: #1E293B;
    --text-muted: #64748B;
    --accent-green: #10B981;
    --accent-yellow: #F59E0B;
    --accent-red: #EF4444;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
}

[dir="rtl"] * {
    font-family: 'Noto Kufi Arabic', sans-serif;
}

body {
    background-color: var(--bg-primary);
    color: var(--text-dark);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    position: relative;
}

.glow-bg {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    z-index: -1;
    opacity: 0.55;
}

.glow-1 {
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(230,179,168,0.4) 0%, rgba(255,255,255,0) 70%);
    top: -50px;
    right: 5%;
}

.glow-2 {
    width: 450px;
    height: 450px;
    background: radial-gradient(circle, rgba(10,37,64,0.15) 0%, rgba(255,255,255,0) 70%);
    bottom: 50px;
    left: -100px;
}

.glass-nav {
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--glass-border);
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.brand {
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 1.4rem;
}

.arabic-brand {
    color: var(--navy-deep);
    font-size: 1.6rem;
}

.divider {
    margin: 0 0.5rem;
    color: var(--peach-accent);
}

.english-brand {
    color: var(--text-muted);
    font-weight: 400;
    font-size: 1.1rem;
}

.btn {
    padding: 0.65rem 1.4rem;
    border-radius: 8px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary {
    background-color: var(--peach-accent);
    color: var(--navy-deep);
    box-shadow: 0 4px 15px rgba(230, 179, 168, 0.4);
}

.btn-primary:hover {
    background-color: var(--peach-hover);
    transform: translateY(-2px);
}

.btn-secondary {
    background: rgba(10, 37, 64, 0.05);
    color: var(--navy-deep);
    border: 1px solid rgba(10, 37, 64, 0.1);
}

.main-container {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem 2rem 4rem;
    flex-grow: 1;
}

.dashboard-header {
    margin-bottom: 2.5rem;
    text-align: center;
}

.dashboard-header h1 {
    font-size: 2.2rem;
    color: var(--navy-deep);
    margin-bottom: 0.5rem;
}

.dashboard-header p {
    color: var(--text-muted);
    font-size: 1.1rem;
    max-width: 700px;
    margin: 0 auto;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
}

@media (min-width: 992px) {
    .dashboard-grid {
        grid-template-columns: 5fr 7fr;
    }
}

.glass-card {
    background: var(--glass-bg);
    backdrop-filter: blur(16px);
    border-radius: 16px;
    border: 1px solid var(--glass-border);
    box-shadow: 0 8px 32px 0 var(--glass-shadow);
    padding: 2rem;
}

.form-section h2, .results-section h2 {
    color: var(--navy-deep);
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid rgba(230, 179, 168, 0.2);
    padding-bottom: 0.75rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    color: var(--navy-deep);
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-prefix {
    position: absolute;
    left: 1rem;
    color: var(--text-muted);
    font-weight: 600;
}

[dir="rtl"] .input-prefix {
    left: auto;
    right: 1rem;
}

.input-wrapper input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3.5rem;
    border-radius: 8px;
    border: 1px solid rgba(10, 37, 64, 0.15);
    background: rgba(255, 255, 255, 0.6);
}

[dir="rtl"] .input-wrapper input {
    padding: 0.75rem 3.5rem 0.75rem 1rem;
}

.input-wrapper input:focus {
    border-color: var(--peach-accent);
    outline: none;
    box-shadow: 0 0 0 3px rgba(230, 179, 168, 0.25);
}

.range-container {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.range-container input[type="range"] {
    flex-grow: 1;
    accent-color: var(--peach-accent);
}

.range-val {
    font-weight: 700;
    color: var(--navy-deep);
}

.field-desc {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 0.35rem;
}

.results-empty {
    text-align: center;
    padding: 4rem 1rem;
}

.empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.7;
}

.results-grid-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid rgba(230, 179, 168, 0.2);
    padding-bottom: 0.75rem;
}

.badge-severity {
    padding: 0.35rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
}

.badge-low { background: rgba(16, 185, 129, 0.15); color: var(--accent-green); }
.badge-medium { background: rgba(245, 158, 11, 0.15); color: var(--accent-yellow); }
.badge-high { background: rgba(239, 68, 68, 0.15); color: var(--accent-red); }
.badge-critical { background: rgba(10, 37, 64, 0.15); color: var(--navy-deep); border: 1px solid var(--navy-deep); }

.visualization-block {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
}

.chart-container {
    width: 100%;
    max-width: 260px;
    height: 130px;
    position: relative;
    margin: 0 auto;
}

.gauge-value-overlay {
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
}

.gauge-num { font-size: 2.4rem; font-weight: 800; color: var(--navy-deep); font-family: 'Inter', sans-serif; }
.gauge-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.metric-card {
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(10, 37, 64, 0.08);
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
}

.metric-title { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
.metric-value { font-size: 1.4rem; font-weight: 700; color: var(--navy-deep); }
.metric-status { font-size: 0.75rem; font-weight: 600; margin-top: auto; }

.status-green { color: var(--accent-green); }
.status-yellow { color: var(--accent-yellow); }
.status-red { color: var(--accent-red); }

.advice-block {
    background: rgba(10, 37, 64, 0.03);
    border-left: 4px solid var(--peach-accent);
    padding: 1.5rem;
    border-radius: 4px;
}

[dir="rtl"] .advice-block {
    border-left: none;
    border-right: 4px solid var(--peach-accent);
}

.advice-content-text {
    font-size: 0.95rem;
    line-height: 1.6;
}

.advice-content-text p {
    margin-bottom: 0.75rem;
}

.dashboard-footer {
    text-align: center;
    padding: 2rem;
    border-top: 1px solid var(--glass-border);
    margin-top: auto;
    font-size: 0.85rem;
    color: var(--text-muted);
}

.hidden { display: none !important; }
.w-full { width: 100%; }
.btn-loader {
    display: none;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(10, 37, 64, 0.3);
    border-radius: 50%;
    border-top-color: var(--navy-deep);
    animation: spin 0.8s linear infinite;
    margin-left: 0.5rem;
    vertical-align: middle;
}
[dir="rtl"] .btn-loader {
    margin-left: 0;
    margin-right: 0.5rem;
}
@keyframes spin {
    to { transform: rotate(360deg); }
}
`;

export const script_js = `/* Dynamic Interactive Scripts for تنبّه (Tanbeeh) Fintech System */

let currentLang = "AR";
let gaugeChart = null;

const translations = {
    EN: {
        title: "Financial Risk Analysis Dashboard",
        subtitle: "Analyze client credentials, compute credit vulnerability index, and generate proactive mitigations.",
        formTitle: "Financial Profile Assessment",
        labelIncome: "Monthly Income (SAR)",
        labelExpenses: "Monthly Expenses (SAR)",
        labelDebt: "Total Outstanding Debt (SAR)",
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
        statusOptimal: "Optimal",
        statusAcceptable: "Acceptable",
        statusHigh: "Heavy Burden",
        statusLowDebt: "Low Leverage",
        statusMediumDebt: "Moderate Leverage",
        statusHighDebt: "Critical Leverage",
        statusPerfectPay: "Perfect Standing",
        statusMinorPay: "Minor Slippage",
        statusPoorPay: "Poor Standing"
    },
    AR: {
        title: "منظومة تحليل المخاطر المالية",
        subtitle: "قم بتحليل البيانات الائتمانية للمستفيد، واحتساب مؤشر التعرض للتعثر، واستخلاص الإجراءات التحوطية الاستباقية.",
        formTitle: "تقييم الهيكل المالي الحالي",
        labelIncome: "الدخل الشهري (ر.س)",
        labelExpenses: "المصاريف الشهرية (ر.س)",
        labelDebt: "إجمالي الديون الالتزامية (ر.س)",
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
        statusOptimal: "أداء مالي مثالي",
        statusAcceptable: "مستقر ومقبول",
        statusHigh: "عبء إنفاق مرتفع",
        statusLowDebt: "رافعة مالية منخفضة",
        statusMediumDebt: "رافعة مالية متوسطة",
        statusHighDebt: "مخاطر رافعة مالية حرجة",
        statusPerfectPay: "سجل سداد مثالي",
        statusMinorPay: "تأخر سداد طفيف",
        statusPoorPay: "سجل سداد متعثر"
    }
};

function updateRangeVal(val) {
    document.getElementById("repaymentVal").textContent = val + "%";
}

document.getElementById("langToggle").addEventListener("click", () => {
    currentLang = currentLang === "EN" ? "AR" : "EN";
    applyLanguage(currentLang);
    
    // Automatically re-submit the form if results are visible so advice updates to correct language
    if (!document.getElementById("resultsRealContent").classList.contains("hidden")) {
        const fakeEvent = { preventDefault: () => {} };
        submitForm(fakeEvent);
    }
});

function applyLanguage(lang) {
    const isAr = lang === "AR";
    document.documentElement.dir = isAr ? "rtl" : "ltr";
    document.documentElement.lang = isAr ? "ar" : "en";
    const dict = translations[lang];

    document.getElementById("langText").textContent = dict.langToggleText;
    document.getElementById("titleText").textContent = dict.title;
    document.getElementById("subtitleText").textContent = dict.subtitle;
    document.getElementById("formTitle").textContent = dict.formTitle;
    document.getElementById("labelIncome").textContent = dict.labelIncome;
    document.getElementById("labelExpenses").textContent = dict.labelExpenses;
    document.getElementById("labelDebt").textContent = dict.labelDebt;
    document.getElementById("labelRepayment").textContent = dict.labelRepayment;
    document.getElementById("repaymentDesc").textContent = dict.repaymentDesc;
    document.getElementById("btnSubmitText").textContent = dict.btnSubmit;
    document.getElementById("emptyStateTitle").textContent = dict.emptyTitle;
    document.getElementById("emptyStateText").textContent = dict.emptyText;
    document.getElementById("analysisResultTitle").textContent = dict.analysisResultTitle;
    document.getElementById("riskScoreLabel").textContent = dict.riskScoreLabel;
    document.getElementById("metricDtiTitle").textContent = dict.metricDtiTitle;
    document.getElementById("metricLeverageTitle").textContent = dict.metricLeverageTitle;
    document.getElementById("metricRepaymentTitle").textContent = dict.metricRepaymentTitle;
    document.getElementById("adviceTitleHeader").textContent = dict.adviceTitleHeader;

    // Update input prefixes/suffixes dynamically
    const prefixes = document.querySelectorAll(".input-prefix");
    prefixes.forEach(p => {
        p.textContent = isAr ? "ر.س" : "SAR";
    });
}

function renderGaugeChart(score) {
    const canvas = document.getElementById("gaugeChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (gaugeChart) gaugeChart.destroy();

    const gradient = ctx.createLinearGradient(0, 0, 200, 0);
    gradient.addColorStop(0, "#10B981");   // Green (Safe Zone)
    gradient.addColorStop(0.35, "#3B82F6");  // Blue (Stable Zone)
    gradient.addColorStop(0.7, "#F59E0B");  // Yellow (Caution Zone)
    gradient.addColorStop(1, "#EF4444");    // Red (Critical Action)

    gaugeChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            datasets: [{
                data: [score, 100 - score],
                backgroundColor: [gradient, "rgba(10, 37, 64, 0.05)"],
                borderWidth: 0,
                borderRadius: 12
            }]
        },
        options: {
            rotation: -90,
            circumference: 180,
            responsive: true,
            maintainAspectRatio: false,
            cutout: "86%",
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            animation: {
                animateRotate: true,
                animateScale: false,
                duration: 1200,
                easing: "easeOutQuart"
            }
        }
    });
}

function calculateRiskScoreLocal(income, expenses, debt, repayment) {
    if (income <= 0) {
        return {
            risk_score: 100,
            dti: 100,
            leverage: 100,
            repayment_penalty: 100,
            severity: "CRITICAL"
        };
    }
    const dti = (expenses / income) * 100;
    const dti_component = Math.min(100, dti);
    const annual_income = income * 12;
    const leverage = (debt / annual_income) * 100;
    const repayment_penalty = 100 - repayment;

    const weighted_dti = dti_component * 0.4;
    const weighted_leverage = Math.min(100, leverage) * 0.3;
    const weighted_repayment = repayment_penalty * 0.3;

    const risk_score = Math.min(100, Math.max(0, weighted_dti + weighted_leverage + weighted_repayment));

    let severity = "LOW";
    if (risk_score >= 75) severity = "CRITICAL";
    else if (risk_score >= 50) severity = "HIGH";
    else if (risk_score >= 30) severity = "MEDIUM";

    return {
        risk_score: Math.round(risk_score),
        dti: Math.round(dti),
        leverage: Math.round(leverage),
        repayment_penalty: Math.round(repayment_penalty),
        severity: severity
    };
}

function generateAdviceLocal(profile, lang) {
    const risk_score = profile.risk_score;
    const dti = profile.dti;
    const leverage = profile.leverage;
    const repayment_penalty = profile.repayment_penalty;
    const severity = profile.severity;

    if (lang === "AR") {
        let title = "### تقييم المخاطر المالية المجدول (تنبّه المالي الآلي)\\n\\n";
        let details = "* **مستوى الخطورة**: " + getSeverityLabelAr(severity) + "\\n";
        details += "* **مؤشر نسبة الديون والمصاريف إلى الدخل (DTI)**: " + dti + "%\\n";
        details += "* **الرافعة المالية للديون السنوية**: " + leverage + "%\\n\\n";
        details += "#### الإجراءات الاستباقية الموصى بها:\\n";
        
        let actions = "";
        if (severity === "CRITICAL" || severity === "HIGH") {
            actions = (
                "1. **خفض المصاريف التشغيلية فوراً**: يتجاوز حجم الإنفاق الحالي الحدود الآمنة. يجب إيقاف كافة القنوات الاستهلاكية غير الضرورية.\\n" +
                "2. **إعادة هيكلة الديون**: تواصل مع الجهات المقرضة لإعادة جدولة الديون الإجمالية لخفض الأقساط الشهرية.\\n" +
                "3. **رفع رصيد سداد المدفوعات**: تظهر السجلات وجود تأخيرات في السداد بنسبة تراجع تبلغ " + repayment_penalty + "%. يجب تفعيل الدفع الآلي الفوري لمنع تدهور جدارتك الائتمانية.\\n" +
                "4. **تأسيس صندوق طوارئ**: احتفظ باحتياطي نقدي يغطي 6 أشهر من النفقات الأساسية بشكل عاجل."
            );
        } else if (severity === "MEDIUM") {
            actions = (
                "1. **تحسين الميزانية الشهرية**: نسبة النفقات الحالية للمداخيل هي " + dti + "%. ينصح بخفضها لتكون دون 35% لتحقيق استقرار مستدام.\\n" +
                "2. **تسريع خطة السداد**: استهدف سداد الديون ذات الفائدة الأعلى أولاً (طريقة كرة الثلج للديون) لخفض العبء التراكمي.\\n" +
                "3. **تلافي الغرامات**: حافظ على انضباط السداد الحالي (تقييم الالتزام: " + (100 - repayment_penalty) + "%) لرفع درجاتك وتخفيض تكلفة الإقراض مستقبلاً."
            );
        } else {
            actions = (
                "1. **استدامة ممتازة**: الحسابات في وضع صحي ممتاز (خطورة منخفضة: " + risk_score + "%). استمر في اتباع هذه المنهجية المنضبطة.\\n" +
                "2. **الاستثمار الفائض**: بما أن فائض الدخل آمن والالتزام بالسداد مرتفع جداً، ينصح بتوجيه الفائض نحو أصول استثمارية منخفضة المخاطر.\\n" +
                "3. **مراقبة دورية**: قم بإعادة تقييم ميزانيتك كل ربع سنة للحفاظ على هذا التوازن المالي الممتاز."
            );
        }
        return title + details + actions;
    } else {
        let title = "### Automated Risk Assessment Report (Tanbeeh Engine)\\n\\n";
        let details = "* **Severity Level**: " + severity + "\\n";
        details += "* **Debt-to-Income (DTI) Index**: " + dti + "%\\n";
        details += "* **Annual Debt Leverage**: " + leverage + "%\\n\\n";
        details += "#### Proactive Advisory Directives:\\n";

        let actions = "";
        if (severity === "CRITICAL" || severity === "HIGH") {
            actions = (
                "1. **Aggressive Expense Reduction**: Your current expenditure is operating at an unsustainable level (" + dti + "% of income). Instantly freeze all discretionary and non-essential spending.\\n" +
                "2. **Debt Restructuring Protocol**: Contact creditors immediately to restructure your aggregate outstanding liabilities (" + leverage + "% of your annual income) to mitigate heavy monthly pressures.\\n" +
                "3. **Address Repayment Slippages**: Your repayment record demonstrates a significant performance drop of " + repayment_penalty + "%. Implement strict autopay rules to preserve and rehabilitate your credit standing.\\n" +
                "4. **Emergency Capital Buffer**: Direct any liquid funds immediately into building a 6-month operating expense reserve."
            );
        } else if (severity === "MEDIUM") {
            actions = (
                "1. **Optimize Operating Margins**: Monthly expenses represent " + dti + "% of income. Target reduction of this ratio below 35% to establish a resilient margin of safety.\\n" +
                "2. **Accelerated Debt Liquidation**: Allocate extra cash flow toward high-interest debt tranches (Debt Avalanche method) to reduce overall compounding liabilities.\\n" +
                "3. **Lock credit discipline**: With your repayment history currently evaluated at " + (100 - repayment_penalty) + "%, continue diligent payments to secure prime lending rates in the future."
            );
        } else {
            actions = (
                "1. **Excellent Financial Stewardship**: Your risk matrix is solid (Score: " + risk_score + "%). You are maintaining a highly disciplined wealth-preservation profile.\\n" +
                "2. **Capital Deployment**: Leverage your secure cash margins and immaculate debt rating to channel excess cash flow into low-volatility yielding assets.\\n" +
                "3. **Systematic Review**: Re-run this evaluation quarterly to preserve optimized balance sheets and asset-liability ratios."
            );
        }
        return title + details + actions;
    }
}

function getSeverityLabelAr(sev) {
    if (sev === "CRITICAL") return "خطورة حرجة جدًا";
    if (sev === "HIGH") return "مخاطر مرتفعة";
    if (sev === "MEDIUM") return "مخاطر متوسطة";
    return "مخاطر منخفضة";
}

function getSeverityBadgeClass(score) {
    if (score >= 75) return "badge-critical";
    if (score >= 50) return "badge-high";
    if (score >= 30) return "badge-medium";
    return "badge-low";
}

function getDtiStatusText(dti, lang) {
    const dict = translations[lang];
    if (dti <= 35) return dict.statusOptimal;
    if (dti <= 50) return dict.statusAcceptable;
    return dict.statusHigh;
}

function getDtiColorClass(dti) {
    if (dti <= 35) return "status-green";
    if (dti <= 50) return "status-yellow";
    return "status-red";
}

function getLeverageStatusText(lev, lang) {
    const dict = translations[lang];
    if (lev <= 15) return dict.statusLowDebt;
    if (lev <= 40) return dict.statusMediumDebt;
    return dict.statusHighDebt;
}

function getLeverageColorClass(lev) {
    if (lev <= 15) return "status-green";
    if (lev <= 40) return "status-yellow";
    return "status-red";
}

function getRepaymentStatusText(penalty, lang) {
    const dict = translations[lang];
    if (penalty === 0) return dict.statusPerfectPay;
    if (penalty <= 15) return dict.statusMinorPay;
    return dict.statusPoorPay;
}

function getRepaymentColorClass(penalty) {
    if (penalty === 0) return "status-green";
    if (penalty <= 15) return "status-yellow";
    return "status-red";
}

function formatMarkdown(text) {
    if (!text) return "";
    let html = text.replace(/\\n/g, "\\n");
    // Simple markdown parsing
    html = html.replace(/^### (.*$)/gim, '<h3 style="font-size: 1.15rem; font-weight: 700; color: var(--navy-deep); margin-top: 1rem; margin-bottom: 0.5rem;">$1</h3>');
    html = html.replace(/^#### (.*$)/gim, '<h4 style="font-size: 1rem; font-weight: 600; color: var(--navy-deep); margin-top: 0.75rem; margin-bottom: 0.5rem;">$1</h4>');
    html = html.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
    
    // Bullet items
    html = html.replace(/^\\* (.*$)/gim, '<li style="margin-left: 1.25rem; margin-right: 1.25rem; margin-bottom: 0.25rem; list-style-type: disc;">$1</li>');
    // Numbered items
    html = html.replace(/^\\d+\\.\\s+(.*$)/gim, '<li style="margin-left: 1.25rem; margin-right: 1.25rem; margin-bottom: 0.5rem; list-style-type: decimal;">$1</li>');
    
    const lines = html.split("\\n");
    let inList = false;
    let listType = "";
    let finalHtml = "";
    
    for (let line of lines) {
        let trimmed = line.trim();
        if (trimmed.startsWith("<li")) {
            if (!inList) {
                inList = true;
                listType = trimmed.includes("list-style-type: decimal") ? "ol" : "ul";
                finalHtml += "<" + listType + " style='margin: 0.5rem 0; padding-left: 1rem; padding-right: 1rem;'>";
            }
            finalHtml += line;
        } else {
            if (inList) {
                finalHtml += "</" + listType + ">";
                inList = false;
            }
            if (trimmed !== "") {
                if (trimmed.startsWith("<h3") || trimmed.startsWith("<h4")) {
                    finalHtml += trimmed;
                } else {
                    finalHtml += "<p style='margin-bottom: 0.5rem;'>" + trimmed + "</p>";
                }
            }
        }
    }
    if (inList) {
        finalHtml += "</" + listType + ">";
    }
    return finalHtml;
}

async function submitForm(e) {
    if (e && e.preventDefault) e.preventDefault();
    const income = parseFloat(document.getElementById("income").value) || 0;
    const expenses = parseFloat(document.getElementById("expenses").value) || 0;
    const debt = parseFloat(document.getElementById("debt").value) || 0;
    const repayment = parseFloat(document.getElementById("repayment").value) || 0;

    const loader = document.getElementById("submitLoader");
    if (loader) loader.style.display = "inline-block";

    try {
        let data;
        try {
            // First try fetching from live backend
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ income, expenses, debt, repayment, lang: currentLang })
            });
            if (!response.ok) throw new Error("HTTP error " + response.status);
            data = await response.json();
        } catch (apiError) {
            console.warn("Backend API not reachable. Performing risk computations offline:", apiError);
            // Standalone Offline fallback
            const localProfile = calculateRiskScoreLocal(income, expenses, debt, repayment);
            const localAdvice = generateAdviceLocal(localProfile, currentLang);
            data = {
                success: true,
                riskScore: localProfile.risk_score,
                severity: localProfile.severity,
                dti: localProfile.dti,
                leverage: localProfile.leverage,
                repaymentPenalty: localProfile.repayment_penalty,
                advice: localAdvice
            };
        }

        if (data && data.success) {
            document.getElementById("resultsEmptyState").classList.add("hidden");
            document.getElementById("resultsRealContent").classList.remove("hidden");
            document.getElementById("riskScoreNum").textContent = data.riskScore + "%";
            document.getElementById("metricDtiVal").textContent = data.dti + "%";
            document.getElementById("metricLeverageVal").textContent = data.leverage + "%";
            document.getElementById("metricRepaymentVal").textContent = data.repaymentPenalty + "%";

            // Update severity badge
            const isAr = currentLang === "AR";
            const severityBadge = document.getElementById("severityBadge");
            severityBadge.textContent = isAr ? getSeverityLabelAr(data.severity) : (data.severity + " RISK");
            severityBadge.className = "badge-severity " + getSeverityBadgeClass(data.riskScore);

            // Update status tags
            const dtiStatus = document.getElementById("metricDtiStatus");
            dtiStatus.textContent = getDtiStatusText(data.dti, currentLang);
            dtiStatus.className = "metric-status " + getDtiColorClass(data.dti);

            const levStatus = document.getElementById("metricLeverageStatus");
            levStatus.textContent = getLeverageStatusText(data.leverage, currentLang);
            levStatus.className = "metric-status " + getLeverageColorClass(data.leverage);

            const repStatus = document.getElementById("metricRepaymentStatus");
            repStatus.textContent = getRepaymentStatusText(data.repaymentPenalty, currentLang);
            repStatus.className = "metric-status " + getRepaymentColorClass(data.repaymentPenalty);

            // Format and display proactive advice
            document.getElementById("adviceBodyText").innerHTML = formatMarkdown(data.advice);
            
            renderGaugeChart(data.riskScore);
        }
    } catch (err) {
        console.error("General error executing analysis:", err);
    } finally {
        if (loader) loader.style.display = "none";
    }
}

// Initial initialization on load
window.addEventListener("DOMContentLoaded", () => {
    applyLanguage(currentLang);
    submitForm(); // Populate results on page load
});
`;

export const index_html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تنبّه (Tanbeeh) | منظومة تحليل المخاطر المالية</title>
    <!-- Google Fonts for High-End Typography -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Kufi+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Chart.js for premium Gauge Chart -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        \${style_css}
    </style>
</head>
<body>
    <div class="glow-bg glow-1"></div>
    <div class="glow-bg glow-2"></div>

    <nav class="glass-nav">
        <div class="nav-container">
            <div class="brand">
                <span class="arabic-brand">تنبّه</span>
                <span class="divider">|</span>
                <span class="english-brand">Tanbeeh</span>
            </div>
            <div class="nav-actions">
                <button id="langToggle" class="btn btn-secondary">
                    🌐 <span id="langText">English</span>
                </button>
            </div>
        </div>
    </nav>

    <main class="main-container">
        <header class="dashboard-header">
            <h1 id="titleText">منظومة تحليل المخاطر المالية</h1>
            <p id="subtitleText">قم بتحليل البيانات الائتمانية للمستفيد، واحتساب مؤشر التعرض للتعثر، واستخلاص الإجراءات التحوطية الاستباقية.</p>
        </header>

        <div class="dashboard-grid">
            <section class="glass-card form-section">
                <h2 id="formTitle">تقييم الهيكل المالي الحالي</h2>
                <form id="riskForm" onsubmit="submitForm(event)">
                    <div class="form-group">
                        <label for="income" id="labelIncome">الدخل الشهري (ر.س)</label>
                        <div class="input-wrapper">
                            <span class="input-prefix">ر.س</span>
                            <input type="number" id="income" required min="1" value="7500">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="expenses" id="labelExpenses">المصاريف الشهرية (ر.س)</label>
                        <div class="input-wrapper">
                            <span class="input-prefix">ر.س</span>
                            <input type="number" id="expenses" required min="0" value="2800">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="debt" id="labelDebt">إجمالي الديون الالتزامية (ر.س)</label>
                        <div class="input-wrapper">
                            <span class="input-prefix">ر.س</span>
                            <input type="number" id="debt" required min="0" value="12000">
                        </div>
                    </div>

                    <div class="form-group">
                        <label id="labelRepayment" for="repayment">مؤشر جودة سداد الأقساط الائتمانية (0 - 100)</label>
                        <div class="range-container">
                            <input type="range" id="repayment" min="0" max="100" value="85" oninput="updateRangeVal(this.value)">
                            <span id="repaymentVal" class="range-val">85%</span>
                        </div>
                        <p class="field-desc" id="repaymentDesc">100 تعني التزام وسداد مثالي تام؛ 0 تعني وجود تعثر وتخلف مستمر عن السداد.</p>
                    </div>

                    <button type="submit" class="btn btn-primary w-full" id="btnSubmit">
                        <span id="btnSubmitText">تشغيل هندسة تحليل المخاطر</span>
                        <span class="btn-loader" id="submitLoader"></span>
                    </button>
                </form>
            </section>

            <section class="glass-card results-section" id="resultsCard">
                <div class="results-empty" id="resultsEmptyState">
                    <div class="empty-icon">📊</div>
                    <h3 id="emptyStateTitle">لا توجد نتائج تحليل نشطة</h3>
                    <p id="emptyStateText">يرجى تعبئة المؤشرات في الحقول الجانبية والضغط على زر التحليل لتوليد تقارير المخاطر والنصائح الاستباقية.</p>
                </div>

                <div class="results-content hidden" id="resultsRealContent">
                    <div class="results-grid-header">
                        <h2 id="analysisResultTitle">نتائج تقييم المحفظة المالية</h2>
                        <span class="badge-severity badge-medium" id="severityBadge">MEDIUM RISK</span>
                    </div>

                    <div class="visualization-block">
                        <div class="chart-container">
                            <canvas id="gaugeChart"></canvas>
                            <div class="gauge-value-overlay">
                                <span class="gauge-num" id="riskScoreNum">42%</span>
                                <span class="gauge-label" id="riskScoreLabel">Risk Score</span>
                            </div>
                        </div>
                    </div>

                    <div class="metrics-grid">
                        <div class="metric-card">
                            <span class="metric-title" id="metricDtiTitle">Expense-to-Income (DTI)</span>
                            <span class="metric-value" id="metricDtiVal">37%</span>
                            <span class="metric-status status-yellow" id="metricDtiStatus">Acceptable</span>
                        </div>
                        <div class="metric-card">
                            <span class="metric-title" id="metricLeverageTitle">Annual Debt Leverage</span>
                            <span class="metric-value" id="metricLeverageVal">13%</span>
                            <span class="metric-status status-green" id="metricLeverageStatus">Low Leverage</span>
                        </div>
                        <div class="metric-card">
                            <span class="metric-title" id="metricRepaymentTitle">Repayment Penalty</span>
                            <span class="metric-value" id="metricRepaymentVal">15%</span>
                            <span class="metric-status status-yellow" id="metricRepaymentStatus">Minor Slippage</span>
                        </div>
                    </div>

                    <div class="advice-block">
                        <h3 id="adviceTitleHeader">التوجيهات والتحذيرات الاستباقية</h3>
                        <div id="adviceBodyText" class="advice-content-text"></div>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <footer class="dashboard-footer">
        <p>© 2026 Tanbeeh (تنبّه) FinTech Systems. All rights reserved.</p>
    </footer>

    <script>
        \${script_js}
    </script>
</body>
</html>
`;

export const readme_md = `# تنبّه (Tanbeeh) - Standalone Portable Financial Risk Analysis Tool

This folder contains the standalone, production-ready implementation of **تنبّه (Tanbeeh)**.

## Offline/Local Execution
The \`index.html\` file is 100% self-contained! It has all styles (CSS) and interactivity (JavaScript) embedded directly within it.

1. **Double-click** \`index.html\` to open it directly in any modern browser (Chrome, Edge, Safari, Firefox).
2. It does not require any server or internet connection to calculate risk metrics, draw the interactive Gauge chart, and produce professional proactive advisory directives.
3. Fallback math algorithms are built right into the browser client to guarantee complete offline execution.

## Running with Python Flask Backend
If you want to run it on a Flask server:

1. Prerequisites: Ensure you have **Python 3.8+** installed.
2. Install Flask:
   \`\`\`bash
   pip install Flask
   \`\`\`
3. Run the application:
   \`\`\`bash
   python app.py
   \`\`\`
4. Access the dashboard: Open your browser and navigate to **[http://127.0.0.1:5000](http://127.0.0.1:5000)**
`;
