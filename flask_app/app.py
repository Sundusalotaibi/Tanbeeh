# -*- coding: utf-8 -*-
"""
تنبّه (Tanbeeh) - Financial Risk Analysis Tool
Flask Backend Engine
"""

from flask import Flask, render_code, render_template, request, jsonify
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
        title = "### تقييم المخاطر المالية المجدول (تنبّه المالي الآلي)\n\n"
        details = f"* **مستوى الخطورة**: {severity}\n"
        details += f"* **مؤشر نسبة الديون والمصاريف إلى الدخل (DTI)**: {dti}%\n"
        details += f"* **الرافعة المالية للديون السنوية**: {leverage}%\n\n"
        details += "#### الإجراءات الاستباقية الموصى بها:\n"
        
        if severity in ["CRITICAL", "HIGH"]:
            actions = (
                "1. **خفض المصاريف التشغيلية فوراً**: يتجاوز حجم الإنفاق الحالي الحدود الآمنة. يجب إيقاف كافة القنوات الاستهلاكية غير الضرورية.\n"
                "2. **إعادة هيكلة الديون**: تواصل مع الجهات المقرضة لإعادة جدولة الديون الإجمالية لخفض الأقساط الشهرية.\n"
                f"3. **رفع رصيد سداد المدفوعات**: تظهر السجلات وجود تأخيرات في السداد بنسبة تراجع تبلغ {repayment_penalty}%. يجب تفعيل الدفع الآلي الفوري لمنع تدهور جدارتك الائتمانية.\n"
                "4. **تأسيس صندوق طوارئ**: احتفظ باحتياطي نقدي يغطي 6 أشهر من النفقات الأساسية بشكل عاجل."
            )
        elif severity == "MEDIUM":
            actions = (
                f"1. **تحسين الميزانية الشهرية**: نسبة النفقات الحالية للمداخيل هي {dti}%. ينصح بخفضها لتكون دون 35% لتحقيق استقرار مستدام.\n"
                "2. **تسريع خطة السداد**: استهدف سداد الديون ذات الفائدة الأعلى أولاً (طريقة كرة الثلج للديون) لخفض العبء التراكمي.\n"
                f"3. **تلافي الغرامات**: حافظ على انضباط السداد الحالي (تقييم الالتزام: {100 - repayment_penalty}%) لرفع درجاتك وتخفيض تكلفة الإقراض مستقبلاً."
            )
        else:
            actions = (
                f"1. **استدامة ممتازة**: الحسابات في وضع صحي ممتاز (خطورة منخفضة: {risk_score}%). استمر في اتباع هذه المنهجية المنضبطة.\n"
                "2. **الاستثمار الفائض**: بما أن فائض الدخل آمن والالتزام بالسداد مرتفع جداً، ينصح بتوجيه الفائض نحو أصول استثمارية منخفضة المخاطر.\n"
                "3. **مراقبة دورية**: قم بإعادة تقييم ميزانيتك كل ربع سنة للحفاظ على هذا التوازن المالي الممتاز."
            )
    else:
        title = "### Automated Risk Assessment Report (Tanbeeh Engine)\n\n"
        details = f"* **Severity Level**: {severity}\n"
        details += f"* **Debt-to-Income (DTI) Index**: {dti}%\n"
        details += f"* **Annual Debt Leverage**: {leverage}%\n\n"
        details += "#### Proactive Advisory Directives:\n"
        
        if severity in ["CRITICAL", "HIGH"]:
            actions = (
                f"1. **Aggressive Expense Reduction**: Your current expenditure is operating at an unsustainable level ({dti}% of income). Instantly freeze all discretionary and non-essential spending.\n"
                f"2. **Debt Restructuring Protocol**: Contact creditors immediately to restructure your aggregate outstanding liabilities ({leverage}% of your annual income) to mitigate heavy monthly pressures.\n"
                f"3. **Address Repayment Slippages**: Your repayment record demonstrates a significant performance drop of {repayment_penalty}%. Implement strict autopay rules to preserve and rehabilitate your credit standing.\n"
                "4. **Emergency Capital Buffer**: Direct any liquid funds immediately into building a 6-month operating expense reserve."
            )
        elif severity == "MEDIUM":
            actions = (
                f"1. **Optimize Operating Margins**: Monthly expenses represent {dti}% of income. Target reduction of this ratio below 35% to establish a resilient margin of safety.\n"
                "2. **Accelerated Debt Liquidation**: Allocate extra cash flow toward high-interest debt tranches (Debt Avalanche method) to reduce overall compounding liabilities.\n"
                f"3. **Lock credit discipline**: With your repayment history currently evaluated at {100 - repayment_penalty}%, continue diligent payments to secure prime lending rates in the future."
            )
        else:
            actions = (
                f"1. **Excellent Financial Stewardship**: Your risk matrix is solid (Score: {risk_score}%). You are maintaining a highly disciplined wealth-preservation profile.\n"
                "2. **Capital Deployment**: Leverage your secure cash margins and immaculate debt rating to channel excess cash flow into low-volatility yielding assets.\n"
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
    # Binds to port 5000 for local runs
    app.run(host='0.0.0.0', port=5000, debug=True)
