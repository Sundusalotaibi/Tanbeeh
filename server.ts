import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily to avoid crashing on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Financial Risk Calculation helper
function calculateRiskScore(income: number, expenses: number, debt: number, repayment: number) {
  if (income <= 0) {
    return {
      riskScore: 100,
      dti: 100,
      leverage: 100,
      repaymentPenalty: 100,
      severity: "CRITICAL"
    };
  }

  // 1. Debt-to-Income/Expense ratio (DTI)
  const dti = (expenses / income) * 100;
  const dtiComponent = Math.min(100, dti);

  // 2. Debt Leverage ratio (Total debt vs annual income)
  const annualIncome = income * 12;
  const leverage = (debt / annualIncome) * 100;

  // 3. Repayment score penalty (where 100 is best, 0 is worst)
  const repaymentPenalty = 100 - repayment;

  // Weighted calculation:
  // - Expenses-to-Income ratio: 40% weight
  // - Total Debt Leverage: 30% weight
  // - Repayment Record Penalty: 30% weight
  const weightedDTI = dtiComponent * 0.4;
  const weightedLeverage = Math.min(100, leverage) * 0.3;
  const weightedRepayment = repaymentPenalty * 0.3;

  const riskScore = Math.min(100, Math.max(0, weightedDTI + weightedLeverage + weightedRepayment));
  
  let severity = "LOW";
  if (riskScore >= 75) {
    severity = "CRITICAL";
  } else if (riskScore >= 50) {
    severity = "HIGH";
  } else if (riskScore >= 30) {
    severity = "MEDIUM";
  }

  return {
    riskScore: Math.round(riskScore),
    dti: Math.round(dti),
    leverage: Math.round(leverage),
    repaymentPenalty: Math.round(repaymentPenalty),
    severity
  };
}

// Local rule-based fallback advice generator
function getFallbackAdvice(profile: any, lang: "AR" | "EN") {
  const { riskScore, dti, leverage, repaymentPenalty, severity } = profile;
  
  if (lang === "AR") {
    let text = `### تقييم المخاطر المالية المجدول (تنبّه المالي الآلي)\n\n`;
    text += `* **مستوى الخطورة**: ${severity === "CRITICAL" ? "حرجة جدًا" : severity === "HIGH" ? "مرتفعة" : severity === "MEDIUM" ? "متوسطة" : "منخفضة"}\n`;
    text += `* **مؤشر نسبة الديون والمصاريف إلى الدخل (DTI)**: ${dti}%\n`;
    text += `* **الرافعة المالية للديون السنوية**: ${leverage}%\n\n`;
    text += `#### الإجراءات الاستباقية الموصى بها:\n`;

    if (severity === "CRITICAL" || severity === "HIGH") {
      text += `1. **خفض المصاريف التشغيلية فوراً**: يتجاوز حجم الإنفاق الحالي الحدود الآمنة. يجب إيقاف كافة القنوات الاستهلاكية غير الضرورية.\n`;
      text += `2. **إعادة هيكلة الديون**: تواصل مع الجهات المقرضة لإعادة جدولة الديون الإجمالية (${leverage}% من الدخل السنوي) لخفض الأقساط الشهرية.\n`;
      text += `3. **رفع رصيد سداد المدفوعات**: تظهر السجلات وجود تأخيرات في السداد بنسبة تراجع تبلغ ${repaymentPenalty}%. يجب تفعيل الدفع الآلي الفوري لمنع تدهور جدارتك الائتمانية.\n`;
      text += `4. **تأسيس صندوق طوارئ**: احتفظ باحتياطي نقدي يغطي 6 أشهر على الأقل من النفقات الأساسية بشكل عاجل.\n`;
    } else if (severity === "MEDIUM") {
      text += `1. **تحسين الميزانية الشهرية**: نسبة النفقات الحالية للمداخيل هي ${dti}%. ينصح بخفضها لتكون دون 35% لتحقيق استقرار مستدام.\n`;
      text += `2. **تسريع خطة السداد**: استهدف سداد الديون ذات الفائدة الأعلى أولاً (طريقة كرة الثلج للديون) لخفض العبء التراكمي.\n`;
      text += `3. **تلافي الغرامات**: حافظ على انضباط السداد الحالي (تقييم الالتزام: ${100 - repaymentPenalty}%) لرفع درجاتك وتخفيض تكلفة الإقراض مستقبلاً.\n`;
    } else {
      text += `1. **استدامة ممتازة**: الحسابات في وضع صحي ممتاز (خطورة منخفضة: ${riskScore}%). استمر في اتباع هذه المنهجية المنضبطة.\n`;
      text += `2. **الاستثمار الفائض**: بما أن فائض الدخل آمن والالتزام بالسداد مرتفع جداً، ينصح بتوجيه الفائض نحو أصول استثمارية منخفضة المخاطر.\n`;
      text += `3. **مراقبة دورية**: قم بإعادة تقييم ميزانيتك كل ربع سنة للحفاظ على هذا التوازن المالي الممتاز.\n`;
    }
    return text;
  } else {
    let text = `### Automated Risk Assessment Report (Tanbeeh Engine)\n\n`;
    text += `* **Severity Level**: ${severity}\n`;
    text += `* **Debt-to-Income (DTI) Index**: ${dti}%\n`;
    text += `* **Annual Debt Leverage**: ${leverage}%\n\n`;
    text += `#### Proactive Advisory Directives:\n`;

    if (severity === "CRITICAL" || severity === "HIGH") {
      text += `1. **Aggressive Expense Reduction**: Your current expenditure is operating at an unsustainable level (${dti}% of income). Instantly freeze all discretionary and non-essential spending.\n`;
      text += `2. **Debt Restructuring Protocol**: Contact creditors immediately to restructure your aggregate outstanding liabilities (${leverage}% of your annual income) to mitigate heavy monthly pressures.\n`;
      text += `3. **Address Repayment Slippages**: Your repayment record demonstrates a significant performance drop of ${repaymentPenalty}%. Implement strict autopay rules to preserve and rehabilitate your credit standing.\n`;
      text += `4. **Emergency Capital Buffer**: Direct any liquid funds immediately into building a 6-month operating expense reserve.\n`;
    } else if (severity === "MEDIUM") {
      text += `1. **Optimize Operating Margins**: Monthly expenses represent ${dti}% of income. Target reduction of this ratio below 35% to establish a resilient margin of safety.\n`;
      text += `2. **Accelerated Debt Liquidation**: Allocate extra cash flow toward high-interest debt tranches (Debt Avalanche method) to reduce overall compounding liabilities.\n`;
      text += `3. **Lock credit discipline**: With your repayment history currently evaluated at ${100 - repaymentPenalty}%, continue diligent payments to secure prime lending rates in the future.\n`;
    } else {
      text += `1. **Excellent Financial Stewardship**: Your risk matrix is solid (Score: ${riskScore}%). You are maintaining a highly disciplined wealth-preservation profile.\n`;
      text += `2. **Capital Deployment**: Leverage your secure cash margins and immaculate debt rating to channel excess cash flow into low-volatility yielding assets.\n`;
      text += `3. **Systematic Review**: Re-run this evaluation quarterly to preserve optimized balance sheets and asset-liability ratios.\n`;
    }
    return text;
  }
}

// API Routes
app.post("/api/analyze-risk", async (req, res) => {
  try {
    const { income, expenses, debt, repayment, lang = "EN" } = req.body;

    const numIncome = parseFloat(income) || 0;
    const numExpenses = parseFloat(expenses) || 0;
    const numDebt = parseFloat(debt) || 0;
    const numRepayment = parseFloat(repayment) || 0;

    const components = calculateRiskScore(numIncome, numExpenses, numDebt, numRepayment);
    const { riskScore, dti, leverage, repaymentPenalty, severity } = components;

    let advice = "";
    const ai = getGeminiClient();

    if (ai) {
      try {
        const systemInstruction = lang === "AR"
          ? "أنت محلل ومستشار مالي أول وخبير مخاطر ائتمانية في منصة 'تنبّه' (Tanbeeh) للتحليل الائتماني والمالي. قدم تقرير استشارات مخاطر مالية متكامل، دقيق للغاية، واحترافي رفيع المستوى باللغة العربية بالكامل وبصيغة الـ Markdown.\n\n" +
            "قسّم التقرير بوضوح مستخدماً تنسيق العناوين (Markdown) إلى الأقسام التالية بالتحديد:\n" +
            "1) مراجعة شاملة للهيكل المالي الحالي للعميل وقدراته الائتمانية.\n" +
            "2) تحليل دقيق للثغرات الائتمانية، نسبة عبء الإنفاق، ومؤشر الالتزام.\n" +
            "3) توصيات وإجراءات استباقية وقائية عملية وملموسة لحماية المحفظة وتخفيض مؤشر المخاطر.\n\n" +
            "تنبيه حاسم لا يقبل الاستثناء: يجب أن تكون جميع العناوين والنقاط والمصطلحات والعبارات مكتوبة باللغة العربية الفصحى الراقية فقط. يُمنع تماماً استخدام أي كلمات أو مسميات أو تسميات رئيسية أو فرعية باللغة الإنجليزية في نص التقرير الاستشاري."
          : "You are a Senior Financial Risk Analyst and Credit Advisor for the 'Tanbeeh' (تنبّه) fintech system. Provide a highly professional, clinical, and expert risk assessment report. Structure the report beautifully in Markdown with clear sections: 1) Executive Portfolio Analysis, 2) Critical Structural Vulnerabilities (with metrics), and 3) Practical, Step-by-Step Proactive Safeguards. Be extremely concise, authoritative, and clinical.";

        const contents = lang === "AR"
          ? `المعطيات المالية والمقاييس المحتسبة للعميل:
- الدخل الشهري المستقر: ${numIncome} ريال سعودي (ر.س)
- المصاريف التشغيلية الشهرية: ${numExpenses} ريال سعودي (ر.س)
- إجمالي الالتزامات والديون المستحقة: ${numDebt} ريال سعودي (ر.س)
- مؤشر الالتزام وسداد الأقساط: ${numRepayment}/100 (حيث 100 هو سداد كامل مثالي، و0 هو تعثر مستمر)
- مؤشر الخطورة المالي المحتسب: ${riskScore}%
- نسبة عبء الدين للدخل الحالي (DTI): ${dti}%
- نسبة الديون الإجمالية إلى الدخل السنوي (الرافعة المالية): ${leverage}%
- مستوى الخطورة الكلي العام: ${severity === "CRITICAL" ? "تعثر حرج وعالي الخطورة" : severity === "HIGH" ? "مخاطر ائتمانية مرتفعة" : severity === "MEDIUM" ? "مخاطر متوسطة" : "مخاطر منخفضة"}

بناءً على هذه المعايير، قم بصياغة تقرير استشاري مالي تحليلي متكامل وشامل باللغة العربية الفصحى الراقية مع التركيز التام على إرشادات الحماية والاستقرار المالي.`
          : `Client Portfolio Parameters:
- Monthly Income: ${numIncome} SAR
- Monthly Expenses: ${numExpenses} SAR
- Total Outstanding Debt: ${numDebt} SAR
- Repayment Performance Score: ${numRepayment}/100 (where 100 is ideal, 0 is defaulting)
- Evaluated Risk Score: ${riskScore}%
- Debt-to-Income (DTI) Ratio: ${dti}%
- Total Debt-to-Annual Income Ratio: ${leverage}%
- Overall Severity Level: ${severity}

Please formulate the actionable risk advisory report in English.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents,
          config: {
            systemInstruction,
            temperature: 0.3,
          },
        });

        advice = response.text || getFallbackAdvice(components, lang);
      } catch (aiError) {
        console.error("AI Generation Error, running fallback system logic:", aiError);
        advice = getFallbackAdvice(components, lang);
      }
    } else {
      // No API Key or client failed to initialize, run fallback
      advice = getFallbackAdvice(components, lang);
    }

    res.json({
      success: true,
      riskScore,
      severity,
      dti,
      leverage,
      repaymentPenalty,
      advice,
    });
  } catch (error: any) {
    console.error("Endpoint Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve Vite middleware in development or build outputs in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Tanbeeh Backend] Server active on port ${PORT}`);
  });
}

startServer();
