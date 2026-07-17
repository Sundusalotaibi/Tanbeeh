/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  CreditCard, 
  RefreshCw, 
  Globe, 
  Download, 
  Copy, 
  Check, 
  Cpu, 
  BookOpen,
  FileCode,
  AlertTriangle,
  Percent,
  ArrowUpRight,
  TrendingDown
} from "lucide-react";
import * as flaskFiles from "./flaskCode";

// Bilingual translations mapping
const EN = {
  appName: "تنبّه",
  appSubBrand: "Tanbeeh",
  tagline: "High-End Financial Risk Analytics",
  headerTitle: "Financial Risk Analysis Engine",
  headerSubtitle: "Evaluate client debt-leverage profiles, audit credit repayment margins, and generate premium AI safeguarding advice.",
  langName: "العربية",
  formTitle: "Financial Parameter Console",
  incomeLabel: "Monthly Capital Earning (SAR)",
  expensesLabel: "Monthly Operating Outflow (SAR)",
  debtLabel: "Aggregate Outstanding Liabilities (SAR)",
  repaymentLabel: "Repayment Integrity Index (0-100)",
  repaymentHelper: "100 represents pristine credit; 0 represents continuous delinquencies.",
  btnAnalyze: "Compute Portfolio Risk Score",
  btnGenerating: "Synthesizing AI Advice...",
  riskScoreLabel: "Fintech Risk Metric",
  dtiLabel: "Operating Burden (DTI)",
  leverageLabel: "Annual Debt Leverage",
  repaymentPenaltyLabel: "Payment Penalty Rate",
  adviceHeading: "Clinical Proactive Advisory Directive",
  codeHubTitle: "Local Python Flask Code Hub",
  codeHubSubtitle: "View, copy, or download the exact Python Flask files generated for your local computer setup.",
  downloadBtn: "Download File",
  copyBtn: "Copy Code",
  copySuccess: "Code copied to clipboard!",
  statusOptimal: "Optimal Efficiency",
  statusAcceptable: "Within Safety Margin",
  statusHigh: "Sustained Operational Risk",
  statusLowDebt: "Minimal Leverage",
  statusMediumDebt: "Standard Debt Load",
  statusHighDebt: "Critical Leverage Threshold",
  statusPerfectPay: "Perfect Standing",
  statusMinorPay: "Slight Under-performance",
  statusPoorPay: "Severe Delinquency Pattern",
  activeAnalysis: "Active Portfolio Analysis",
  noAnalysis: "Awaiting Portfolio Input",
  noAnalysisDesc: "Adjust the parameter levers on the left, then click 'Compute Portfolio Risk Score' to activate the assessment matrix.",
  premiumAIBtn: "Synthesize Premium AI Advisory Report",
  severityLow: "Low Risk Profile",
  severityMedium: "Moderate Risk Profile",
  severityHigh: "High Credit Vulnerability",
  severityCritical: "Critical Default Danger",
};

const AR = {
  appName: "تنبّه",
  appSubBrand: "Tanbeeh",
  tagline: "تحليل مخاطر الائتمان المتطور",
  headerTitle: "منصة تحليل المخاطر المالية والائتمانية",
  headerSubtitle: "تقييم نسب المديونية، تدقيق ملاءة السداد، ومحاكاة المخاطر للحسابات الائتمانية باستخدام محرك الذكاء الاصطناعي الاستباقي.",
  langName: "English",
  formTitle: "مدخلات الهيكل المالي للعميل",
  incomeLabel: "الدخل المالي الشهري (ر.س)",
  expensesLabel: "المصاريف التشغيلية الشهرية (ر.س)",
  debtLabel: "إجمالي الالتزامات والديون (ر.س)",
  repaymentLabel: "مؤشر الالتزام وسداد الأقساط (0-100)",
  repaymentHelper: "100 تعني التزام وسداد مثالي تام؛ 0 تعني وجود تعثر وتخلف مستمر عن السداد.",
  btnAnalyze: "احتساب وتوليد تقرير المخاطر",
  btnGenerating: "جاري توليد التقرير بالذكاء الاصطناعي...",
  riskScoreLabel: "مؤشر الخطورة الكلي",
  dtiLabel: "نسبة المصاريف للدخل (DTI)",
  leverageLabel: "معدل المديونية السنوية",
  repaymentPenaltyLabel: "معدل التخلف عن السداد",
  adviceHeading: "التوجيهات والتحذيرات الاستباقية الفورية",
  codeHubTitle: "مركز كود Python Flask المحلي",
  codeHubSubtitle: "تصفح وانسخ أو قم بتحميل ملفات بايثون فلاسك التي تم إنشاؤها خصيصاً لتشغيل التطبيق محلياً على جهازك.",
  downloadBtn: "تحميل الملف",
  copyBtn: "نسخ الكود",
  copySuccess: "تم نسخ الكود بنجاح!",
  statusOptimal: "أداء مالي مثالي",
  statusAcceptable: "مستقر ومقبول",
  statusHigh: "عبء إنفاق مرتفع",
  statusLowDebt: "رافعة ديون آمنة",
  statusMediumDebt: "ديون تحت السيطرة",
  statusHighDebt: "رافعة ديون خطيرة",
  statusPerfectPay: "سجل التزام مثالي",
  statusMinorPay: "تأخير طفيف هامشي",
  statusPoorPay: "معدل تعثر مقلق",
  activeAnalysis: "نتائج تقييم المحفظة المالية النشطة",
  noAnalysis: "في انتظار مدخلات المحفظة",
  noAnalysisDesc: "قم بتعديل مؤشرات الالتزام والدخل على اليسار ثم اضغط على 'احتساب وتوليد تقرير المخاطر' لعرض مصفوفة الأداء الائتماني.",
  premiumAIBtn: "توليد تقرير الاستشارة المدعوم بالذكاء الاصطناعي",
  severityLow: "مخاطر منخفضة",
  severityMedium: "مخاطر متوسطة",
  severityHigh: "مخاطر اائتمانية مرتفعة",
  severityCritical: "تعثر حرج وعالي الخطورة",
};

// Actionable Advice list formatter component to parse and render AI/fallback recommendations
const ActionableAdviceList = ({ advice, lang }: { advice: string; lang: string }) => {
  if (!advice) return null;

  // Split into lines
  const lines = advice.split("\n");
  const items: { type: "header" | "bullet" | "text"; content: string; key: number }[] = [];
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    // Header check
    if (trimmed.startsWith("#")) {
      const content = trimmed.replace(/^#+\s*/, "");
      items.push({ type: "header", content, key: index });
    }
    // Bullet / List check
    else if (trimmed.startsWith("*") || trimmed.startsWith("-") || trimmed.startsWith("•") || /^\d+\.\s*/.test(trimmed)) {
      const content = trimmed.replace(/^(\*|-|•|\d+\.)\s*/, "");
      items.push({ type: "bullet", content, key: index });
    }
    // General text
    else {
      items.push({ type: "text", content: trimmed, key: index });
    }
  });

  const cleanMarkdown = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");
  };

  return (
    <div className="space-y-3.5">
      {items.map((item) => {
        if (item.type === "header") {
          return (
            <h4 key={item.key} className="text-xs font-black uppercase tracking-wider text-[#0A2540] mt-6 first:mt-0 border-b border-[#0A2540]/10 pb-2 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-[#E6B3A8] rounded-full inline-block"></span>
              {cleanMarkdown(item.content)}
            </h4>
          );
        } else if (item.type === "bullet") {
          return (
            <div key={item.key} className="flex gap-3 bg-[#F4F7F9]/50 hover:bg-[#F4F7F9] p-4 rounded-xl border border-[#0A2540]/5 transition-all duration-200 group">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5 group-hover:scale-105 transition-all">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <p className="text-sm text-[#0A2540]/80 leading-relaxed font-medium">
                {item.content.includes("**") ? (
                  (() => {
                    const parts = item.content.split("**");
                    return parts.map((part, pIdx) => {
                      if (pIdx % 2 === 1) {
                        return <strong key={pIdx} className="font-bold text-[#0A2540]">{part}</strong>;
                      }
                      return part;
                    });
                  })()
                ) : (
                  cleanMarkdown(item.content)
                )}
              </p>
            </div>
          );
        } else {
          return (
            <p key={item.key} className="text-sm text-[#0A2540]/70 leading-relaxed font-medium bg-[#F4F7F9]/30 px-3 py-2 rounded-lg border border-[#0A2540]/5">
              {cleanMarkdown(item.content)}
            </p>
          );
        }
      })}
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<"EN" | "AR">("AR");
  const t = lang === "EN" ? EN : AR;

  // Form states
  const [income, setIncome] = useState<number>(7500);
  const [expenses, setExpenses] = useState<number>(2800);
  const [debt, setDebt] = useState<number>(12000);
  const [repayment, setRepayment] = useState<number>(85);

  // Results state
  const [results, setResults] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [useAI, setUseAI] = useState<boolean>(true);

  // File Viewer states
  const [activeFile, setActiveFile] = useState<string>("app.py");
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  // On initial load, execute a baseline calculation to make the app immediate and functional
  useEffect(() => {
    handleCalculation();
  }, [lang]);

  const handleCalculation = async () => {
    setLoading(true);
    try {
      // Fetch dynamic analytics from the server API, which uses Gemini if available
      const response = await fetch("/api/analyze-risk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          income,
          expenses,
          debt,
          repayment,
          lang
        })
      });

      const data = await response.json();
      if (data.success) {
        setResults(data);
      } else {
        console.error("Calculation API returned failure:", data.error);
        runFallbackCalculations();
      }
    } catch (err) {
      console.error("Failed to connect to full-stack calculation server:", err);
      runFallbackCalculations();
    } finally {
      setLoading(false);
    }
  };

  const runFallbackCalculations = () => {
    // Math logic matching the server's backend calculations
    if (income <= 0) {
      setResults({
        riskScore: 100,
        severity: "CRITICAL",
        dti: 100,
        leverage: 100,
        repaymentPenalty: 100,
        advice: lang === "AR" 
          ? "### تنبيه عاجل\nالدخل المدخل غير كافٍ لإتمام عملية التقييم المالي. يرجى تعديل قيمة الدخل الشهري لتكون أكبر من صفر."
          : "### Critical Evaluation Halt\nThe monthly income entered is insufficient. Please adjust the capital parameter to be greater than zero."
      });
      return;
    }

    const dti = Math.round((expenses / income) * 100);
    const leverage = Math.round((debt / (income * 12)) * 100);
    const repaymentPenalty = 100 - repayment;

    const weightedDTI = Math.min(100, dti) * 0.4;
    const weightedLeverage = Math.min(100, leverage) * 0.3;
    const weightedRepayment = repaymentPenalty * 0.3;

    const score = Math.min(100, Math.max(0, weightedDTI + weightedLeverage + weightedRepayment));
    const roundedScore = Math.round(score);

    let severity = "LOW";
    if (roundedScore >= 75) severity = "CRITICAL";
    else if (roundedScore >= 50) severity = "HIGH";
    else if (roundedScore >= 30) severity = "MEDIUM";

    // Generate bilingual fallback text
    let fallbackText = "";
    if (lang === "AR") {
      fallbackText = `### تقييم المخاطر المالية المجدول (تنبّه المالي الآلي)\n\n`;
      fallbackText += `* **مستوى الخطورة**: ${severity === "CRITICAL" ? "حرجة جدًا" : severity === "HIGH" ? "مرتفعة" : severity === "MEDIUM" ? "متوسطة" : "منخفضة"}\n`;
      fallbackText += `* **مؤشر نسبة الديون والمصاريف إلى الدخل (DTI)**: ${dti}%\n`;
      fallbackText += `* **الرافعة المالية للديون السنوية**: ${leverage}%\n\n`;
      fallbackText += `#### الإجراءات الاستباقية الموصى بها:\n`;

      if (severity === "CRITICAL" || severity === "HIGH") {
        fallbackText += `1. **خفض المصاريف التشغيلية فوراً**: يتجاوز حجم الإنفاق الحالي الحدود الآمنة. يجب إيقاف كافة القنوات الاستهلاكية غير الضرورية.\n`;
        fallbackText += `2. **إعادة هيكلة الديون**: تواصل مع الجهات المقرضة لإعادة جدولة الديون الإجمالية لخفض الأقساط الشهرية.\n`;
        fallbackText += `3. **رفع رصيد سداد المدفوعات**: تظهر السجلات وجود تأخيرات في السداد بنسبة تراجع تبلغ ${repaymentPenalty}%. يجب تفعيل الدفع الآلي الفوري لمنع تدهور جدارتك الائتمانية.\n`;
      } else if (severity === "MEDIUM") {
        fallbackText += `1. **تحسين الميزانية الشهرية**: نسبة النفقات الحالية للمداخيل هي ${dti}%. ينصح بخفضها لتكون دون 35% لتحقيق استقرار مستدام.\n`;
        fallbackText += `2. **تسريع خطة السداد**: استهدف سداد الديون ذات الفائدة الأعلى أولاً لخفض العبء التراكمي.\n`;
      } else {
        fallbackText += `1. **استدامة ممتازة**: الحسابات في وضع صحي ممتاز (خطورة منخفضة: ${roundedScore}%).\n`;
        fallbackText += `2. **الاستثمار الفائض**: ينصح بتوجيه الفائض المالي نحو أصول استثمارية منخفضة المخاطر.`;
      }
    } else {
      fallbackText = `### Automated Risk Assessment Report (Tanbeeh Engine)\n\n`;
      fallbackText += `* **Severity Level**: ${severity}\n`;
      fallbackText += `* **Debt-to-Income (DTI) Index**: ${dti}%\n`;
      fallbackText += `* **Annual Debt Leverage**: ${leverage}%\n\n`;
      fallbackText += `#### Proactive Advisory Directives:\n`;

      if (severity === "CRITICAL" || severity === "HIGH") {
        fallbackText += `1. **Aggressive Expense Reduction**: Your current expenditure is operating at an unsustainable level (${dti}% of income). Instantly freeze all discretionary and non-essential spending.\n`;
        fallbackText += `2. **Debt Restructuring Protocol**: Contact creditors immediately to restructure your aggregate outstanding liabilities (${leverage}% of your annual income).\n`;
        fallbackText += `3. **Address Repayment Slippages**: Your repayment record demonstrates a significant performance drop of ${repaymentPenalty}%. Implement strict autopay rules.\n`;
      } else if (severity === "MEDIUM") {
        fallbackText += `1. **Optimize Operating Margins**: Monthly expenses represent ${dti}% of income. Target reduction of this ratio below 35% to establish a resilient margin of safety.\n`;
        fallbackText += `2. **Accelerated Debt Liquidation**: Allocate extra cash flow toward high-interest debt tranches.\n`;
      } else {
        fallbackText += `1. **Excellent Financial Stewardship**: Your risk matrix is solid (Score: ${roundedScore}%).\n`;
        fallbackText += `2. **Capital Deployment**: Channel excess cash flow into low-volatility yielding assets.`;
      }
    }

    setResults({
      riskScore: roundedScore,
      severity,
      dti,
      leverage,
      repaymentPenalty,
      advice: fallbackText
    });
  };

  // SVG Gauge Math Helpers
  const gaugeRadius = 80;
  const gaugeCircumference = Math.PI * gaugeRadius; // ~251.3
  const getGaugeDashOffset = (score: number) => {
    const validScore = Math.min(100, Math.max(0, score));
    return gaugeCircumference - (validScore / 100) * gaugeCircumference;
  };

  const getGaugeColor = (score: number) => {
    if (score >= 75) return "#EF4444"; // Red
    if (score >= 50) return "#F59E0B"; // Yellow/Orange
    if (score >= 30) return "#0A2540"; // Navy Neutral
    return "#10B981"; // Green
  };

  const getNeedleRotation = (score: number) => {
    const validScore = Math.min(100, Math.max(0, score));
    return (validScore / 100) * 180; // 0deg (left) to 180deg (right)
  };

  // Severity UI styling helpers
  const getSeverityBadgeClass = (score: number) => {
    if (score >= 75) return "bg-red-50 text-red-600 border border-red-200";
    if (score >= 50) return "bg-amber-50 text-amber-600 border border-amber-200";
    if (score >= 30) return "bg-slate-50 text-slate-600 border border-slate-200";
    return "bg-emerald-50 text-emerald-600 border border-emerald-200";
  };

  const getSeverityLabel = (score: number) => {
    if (score >= 75) return t.severityCritical;
    if (score >= 50) return t.severityHigh;
    if (score >= 30) return t.severityMedium;
    return t.severityLow;
  };

  // Status indicators for metrics
  const getDtiStatus = (dti: number) => {
    if (dti <= 35) return { text: t.statusOptimal, color: "text-emerald-600" };
    if (dti <= 50) return { text: t.statusAcceptable, color: "text-amber-500" };
    return { text: t.statusHigh, color: "text-red-500" };
  };

  const getLeverageStatus = (lev: number) => {
    if (lev <= 15) return { text: t.statusLowDebt, color: "text-emerald-600" };
    if (lev <= 40) return { text: t.statusMediumDebt, color: "text-amber-500" };
    return { text: t.statusHighDebt, color: "text-red-500" };
  };

  const getRepaymentStatus = (penalty: number) => {
    if (penalty === 0) return { text: t.statusPerfectPay, color: "text-emerald-600" };
    if (penalty <= 15) return { text: t.statusMinorPay, color: "text-amber-500" };
    return { text: t.statusPoorPay, color: "text-red-500" };
  };

  // File Viewer actions
  const getFileContent = (fileName: string) => {
    switch (fileName) {
      case "app.py": return flaskFiles.app_py;
      case "index.html": return flaskFiles.index_html;
      case "style.css": return flaskFiles.style_css;
      case "script.js": return flaskFiles.script_js;
      case "README.md": return flaskFiles.readme_md;
      default: return "";
    }
  };

  const handleCopyCode = (fileName: string) => {
    const code = getFileContent(fileName);
    navigator.clipboard.writeText(code);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  const handleDownloadFile = (fileName: string) => {
    const code = getFileContent(fileName);
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="min-h-screen bg-[#F4F7F9] text-[#0A2540] flex flex-col relative overflow-x-hidden pb-12" 
      dir={lang === "AR" ? "rtl" : "ltr"}
    >
      {/* Background radial glowing effects matching high-end layout */}
      <div className="absolute w-[350px] h-[350px] rounded-full filter blur-[120px] opacity-[0.25] bg-gradient-to-r from-[#E6B3A8] to-transparent top-[-50px] right-[5%] -z-10" />
      <div className="absolute w-[450px] h-[450px] rounded-full filter blur-[120px] opacity-[0.12] bg-gradient-to-r from-[#0A2540] to-transparent bottom-[150px] left-[-100px] -z-10" />

      {/* Professional Polish Navbar */}
      <nav className="h-16 bg-[#0A2540] flex items-center justify-between px-4 sm:px-8 sticky top-0 z-50 shadow-lg shrink-0">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <h1 className="text-white font-semibold text-xl sm:text-2xl tracking-tight flex items-center gap-1 sm:gap-2">
              <span>{t.appName}</span>
              <span className="opacity-40 font-light mx-1">|</span>
              <span className="text-xs sm:text-sm font-light tracking-widest text-white/70 uppercase">{t.appSubBrand}</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <span className="text-xs text-white/60 font-mono bg-white/10 border border-white/15 px-2.5 py-1 rounded-md hidden md:inline-block">
              {lang === "AR" ? "الوضع الآمن للذكاء الاصطناعي نشط" : "Secure AI Engine Active"}
            </span>
            <div className="flex bg-white/10 rounded-full p-1 border border-white/20 shadow-sm">
              <button 
                onClick={() => setLang("EN")}
                className={`px-3.5 py-1 rounded-full text-2xs font-bold transition-all ${lang === "EN" ? "bg-[#E6B3A8] text-[#0A2540]" : "text-white/60 hover:text-white"}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang("AR")}
                className={`px-3.5 py-1 rounded-full text-2xs font-bold transition-all ${lang === "AR" ? "bg-[#E6B3A8] text-[#0A2540]" : "text-white/60 hover:text-white"}`}
              >
                AR
              </button>
            </div>
            <div className="h-8 w-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 mt-8 flex-grow">
        {/* Header Console */}
        <header className="text-center mb-10 max-w-3xl mx-auto mt-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A2540] tracking-tight mb-3">
            {t.headerTitle}
          </h1>
          <p className="text-[#0A2540]/70 text-sm sm:text-base">
            {t.headerSubtitle}
          </p>
        </header>

        {/* Dashboard Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Input Panel Module */}
          <section className="bg-white/80 backdrop-blur-md rounded-2xl border border-white p-6 shadow-xl shadow-[#0A2540]/5 lg:col-span-5">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#0A2540]/5">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-[#E6B3A8]" />
                <h2 className="text-lg font-bold text-[#0A2540]">{t.formTitle}</h2>
              </div>
              <span className="text-[10px] bg-[#0A2540]/5 text-[#0A2540] px-2.5 py-1 rounded uppercase font-bold tracking-widest">
                {lang === "AR" ? "مدخلات النظام" : "STANDARD INPUT"}
              </span>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleCalculation(); }} className="space-y-6">
              
              {/* Monthly Income input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0A2540]/60 uppercase tracking-widest block">{t.incomeLabel}</label>
                <div className="relative">
                  <span className={`absolute ${lang === "AR" ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 font-bold text-[#0A2540]/30 text-xs`}>{lang === "AR" ? "ر.س" : "SAR"}</span>
                  <input 
                    type="number" 
                    value={income}
                    onChange={(e) => setIncome(Math.max(0, parseInt(e.target.value) || 0))}
                    className={`w-full bg-[#F4F7F9] border-none rounded-xl py-3 ${lang === "AR" ? "pr-12 pl-4" : "pl-12 pr-4"} font-mono text-sm focus:ring-2 focus:ring-[#E6B3A8] text-[#0A2540] transition-all font-semibold`}
                    required
                    min={0}
                  />
                </div>
              </div>

              {/* Monthly Expenses input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0A2540]/60 uppercase tracking-widest block">{t.expensesLabel}</label>
                <div className="relative">
                  <span className={`absolute ${lang === "AR" ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 font-bold text-[#0A2540]/30 text-xs`}>{lang === "AR" ? "ر.س" : "SAR"}</span>
                  <input 
                    type="number" 
                    value={expenses}
                    onChange={(e) => setExpenses(Math.max(0, parseInt(e.target.value) || 0))}
                    className={`w-full bg-[#F4F7F9] border-none rounded-xl py-3 ${lang === "AR" ? "pr-12 pl-4" : "pl-12 pr-4"} font-mono text-sm focus:ring-2 focus:ring-[#E6B3A8] text-[#0A2540] transition-all font-semibold`}
                    required
                    min={0}
                  />
                </div>
              </div>

              {/* Total Debt input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0A2540]/60 uppercase tracking-widest block">{t.debtLabel}</label>
                <div className="relative">
                  <span className={`absolute ${lang === "AR" ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 font-bold text-[#0A2540]/30 text-xs`}>{lang === "AR" ? "ر.س" : "SAR"}</span>
                  <input 
                    type="number" 
                    value={debt}
                    onChange={(e) => setDebt(Math.max(0, parseInt(e.target.value) || 0))}
                    className={`w-full bg-[#F4F7F9] border-none rounded-xl py-3 ${lang === "AR" ? "pr-12 pl-4" : "pl-12 pr-4"} font-mono text-sm focus:ring-2 focus:ring-[#E6B3A8] text-[#0A2540] transition-all font-semibold`}
                    required
                    min={0}
                  />
                </div>
              </div>

              {/* Repayment History Range Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#0A2540]/60 uppercase tracking-widest block">{t.repaymentLabel}</label>
                  <span className="font-mono text-xs font-bold bg-[#0A2540]/5 text-[#0A2540] px-2.5 py-1 rounded">
                    {repayment}%
                  </span>
                </div>
                <div className="flex items-center gap-4 py-1">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={repayment}
                    onChange={(e) => setRepayment(parseInt(e.target.value))}
                    className="w-full h-2 bg-[#F4F7F9] rounded-lg appearance-none cursor-pointer accent-[#E6B3A8]"
                  />
                </div>
                <p className="text-[11px] text-[#0A2540]/50 leading-relaxed font-medium">{t.repaymentHelper}</p>
              </div>

              {/* Action Submit button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-8 bg-[#E6B3A8] text-[#0A2540] font-black py-4 rounded-xl shadow-lg shadow-[#E6B3A8]/30 uppercase tracking-tight hover:brightness-95 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin text-[#0A2540]" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-[#0A2540]" />
                )}
                <span>{loading ? t.btnGenerating : t.btnAnalyze}</span>
              </button>
            </form>
          </section>

          {/* Results Analytics Module */}
          <section className="lg:col-span-7 flex flex-col gap-6">
            {!results ? (
              <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white p-12 shadow-xl shadow-[#0A2540]/5 min-h-[450px] flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#0A2540]/5 flex items-center justify-center text-2xl mb-4">
                  📊
                </div>
                <h3 className="text-lg font-bold text-[#0A2540] mb-2">{t.noAnalysis}</h3>
                <p className="text-[#0A2540]/60 text-sm max-w-sm leading-relaxed">{t.noAnalysisDesc}</p>
              </div>
            ) : (
              <>
                {/* 1. Gauge Chart for the Risk Score */}
                <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-6 sm:p-8 flex flex-col shadow-xl shadow-[#0A2540]/5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-6 bg-[#E6B3A8] rounded-full"></div>
                      <h3 className="text-lg font-bold tracking-tight text-[#0A2540]">{t.riskScoreLabel}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getSeverityBadgeClass(results.riskScore)}`}>
                      {getSeverityLabel(results.riskScore)}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 items-center justify-center py-6">
                    {/* Futuristic Neo-Fintech Radial Donut Progress Ring */}
                    <div className="relative w-48 h-48 flex items-center justify-center select-none shrink-0">
                      {/* High-end animated glowing ring */}
                      <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90 filter drop-shadow-[0_8px_24px_rgba(10,37,64,0.08)]">
                        <defs>
                          {/* Modern Horizontal Premium Gradient */}
                          <linearGradient id="neonProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10B981" />   {/* Emerald (Safe) */}
                            <stop offset="50%" stopColor="#F59E0B" />  {/* Golden Amber (Caution) */}
                            <stop offset="100%" stopColor="#EF4444" /> {/* Electric Red (Alert) */}
                          </linearGradient>
                          {/* Radial Glow Layer Filter */}
                          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3.5" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>

                        {/* Ring 1: Thick structural background track with subtle gap at the bottom */}
                        <circle
                          cx="60"
                          cy="60"
                          r="48"
                          fill="none"
                          stroke="#E2E8F0"
                          strokeWidth="9"
                          strokeDasharray="250 301.6"
                          strokeLinecap="round"
                          className="origin-center rotate-[30deg]"
                        />

                        {/* Ring 2: Subtle inner guide ring for premium design detail */}
                        <circle
                          cx="60"
                          cy="60"
                          r="39.5"
                          fill="none"
                          stroke="#94A3B8"
                          strokeWidth="1"
                          strokeDasharray="3 4"
                          opacity="0.3"
                        />

                        {/* Ring 3: Underlay Glow track for a futuristic neon pulse */}
                        <circle
                          cx="60"
                          cy="60"
                          r="48"
                          fill="none"
                          stroke="url(#neonProgressGradient)"
                          strokeWidth="9"
                          strokeDasharray={`${(Math.min(100, Math.max(0, results.riskScore)) / 100) * 250} 301.6`}
                          strokeLinecap="round"
                          filter="url(#neonGlow)"
                          opacity="0.25"
                          className="origin-center rotate-[30deg] transition-all duration-1000 ease-out"
                        />

                        {/* Ring 4: Core crisp active progress track */}
                        <circle
                          cx="60"
                          cy="60"
                          r="48"
                          fill="none"
                          stroke="url(#neonProgressGradient)"
                          strokeWidth="8"
                          strokeDasharray={`${(Math.min(100, Math.max(0, results.riskScore)) / 100) * 250} 301.6`}
                          strokeLinecap="round"
                          className="origin-center rotate-[30deg] transition-all duration-1000 ease-out"
                        />

                        {/* Zone Markers / Status Nodes to elevate professionalism */}
                        <circle cx="23" cy="87.5" r="2" fill="#10B981" /> {/* Safe Node */}
                        <circle cx="60" cy="12" r="2" fill="#F59E0B" />   {/* Moderate Node */}
                        <circle cx="97" cy="87.5" r="2" fill="#EF4444" /> {/* Critical Node */}
                      </svg>

                      {/* Display Typography centered directly inside the donut */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-2">
                        <div className="text-4xl sm:text-5xl font-black text-[#0A2540] font-mono tracking-tighter leading-none flex items-baseline">
                          <span>{results.riskScore}</span>
                          <span className="text-lg font-bold text-[#0A2540]/60">%</span>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#0A2540]/40 mt-1">
                          {lang === "AR" ? "مؤشر الخطورة" : "Risk Index"}
                        </span>
                        <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full mt-2.5 border transition-all shadow-sm ${getSeverityBadgeClass(results.riskScore)}`}>
                          {getSeverityLabel(results.riskScore)}
                        </span>
                      </div>
                    </div>

                    {/* Explanatory context panel to the right/left */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left rtl:md:text-right gap-3 max-w-xs md:pl-4 rtl:md:pl-0 rtl:md:pr-4">
                      <div className="bg-[#0A2540]/5 px-3 py-1 rounded-full text-[10px] font-bold text-[#0A2540]/70 uppercase tracking-wider inline-block">
                        {lang === "AR" ? "تحليل المخاطر المتقدم" : "Predictive Risk Analytics"}
                      </div>
                      <p className="text-xs sm:text-sm text-[#0A2540]/70 leading-relaxed font-semibold">
                        {lang === "AR" ? (
                          <>تم تصنيف وضعك الائتماني بصفة <span className="font-bold text-[#E6B3A8]">{getSeverityLabel(results.riskScore)}</span>. يدمج هذا التحليل الذكي التزامات الأقساط الحالية وتاريخ السداد في مؤشر ملاءة موحد.</>
                        ) : (
                          <>Your financial position has been evaluated as <span className="font-bold text-[#E6B3A8]">{getSeverityLabel(results.riskScore)}</span>. This multi-layered analytical engine combines total monthly debts with active payment standings into a unified liquidity index.</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Grid of 4 Cards to display the KPIs (Income, Expenses, DTI%, Credit Score) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* KPI 1: Income */}
                  <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-lg shadow-[#0A2540]/2 flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A2540]/50">
                        {lang === "AR" ? "الدخل الشهري" : "Monthly Income"}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                        <DollarSign className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="text-base sm:text-lg font-black text-[#0A2540] font-mono leading-none">
                        {income.toLocaleString()} <span className="text-[10px] font-bold text-[#0A2540]/60">{lang === "AR" ? "ر.س" : "SAR"}</span>
                      </div>
                      <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full mt-2 inline-block">
                        {lang === "AR" ? "تدفق رأس مال" : "Capital Inflow"}
                      </span>
                    </div>
                  </div>

                  {/* KPI 2: Expenses */}
                  <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-lg shadow-[#0A2540]/2 flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A2540]/50">
                        {lang === "AR" ? "المصاريف الجارية" : "Monthly Expenses"}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                        <TrendingDown className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="text-base sm:text-lg font-black text-[#0A2540] font-mono leading-none">
                        {expenses.toLocaleString()} <span className="text-[10px] font-bold text-[#0A2540]/60">{lang === "AR" ? "ر.س" : "SAR"}</span>
                      </div>
                      <span className="text-[9px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full mt-2 inline-block">
                        {lang === "AR" ? "تدفق خارج" : "Capital Outflow"}
                      </span>
                    </div>
                  </div>

                  {/* KPI 3: DTI% */}
                  <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-lg shadow-[#0A2540]/2 flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A2540]/50">
                        {lang === "AR" ? "نسبة عبء الدين" : "DTI Ratio"}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-[#0A2540]/5 flex items-center justify-center text-[#0A2540] shrink-0">
                        <Percent className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="text-base sm:text-lg font-black text-[#0A2540] font-mono leading-none">
                        {results.dti}%
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full mt-2 inline-block ${
                        results.dti <= 35 ? "bg-emerald-50 text-emerald-600" : results.dti <= 50 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                      }`}>
                        {getDtiStatus(results.dti).text}
                      </span>
                    </div>
                  </div>

                  {/* KPI 4: Credit Score */}
                  <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-lg shadow-[#0A2540]/2 flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A2540]/50">
                        {lang === "AR" ? "مؤشر الالتزام" : "Credit Score"}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-[#E6B3A8]/20 flex items-center justify-center text-[#E6B3A8] shrink-0">
                        <CreditCard className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="text-base sm:text-lg font-black text-[#0A2540] font-mono leading-none">
                        {repayment}<span className="text-xs font-bold text-[#0A2540]/60">/100</span>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full mt-2 inline-block ${
                        repayment >= 85 ? "bg-emerald-50 text-emerald-600" : repayment >= 60 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                      }`}>
                        {getRepaymentStatus(100 - repayment).text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Actionable Bulleted List for the Advice/Recommendations */}
                <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-6 sm:p-8 flex flex-col shadow-xl shadow-[#0A2540]/5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-6 bg-[#E6B3A8] rounded-full"></div>
                    <h3 className="text-lg font-bold tracking-tight text-[#0A2540]">{t.adviceHeading}</h3>
                  </div>

                  {/* Aesthetic grid of 4 dynamic helper callouts preceding/enhancing the core advice */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-[#0A2540]/5">
                    <div className="bg-white p-4 rounded-xl border border-[#0A2540]/5 shadow-sm">
                      <h4 className="text-[#E6B3A8] font-bold text-xs uppercase mb-1">{lang === "AR" ? "إدارة الديون" : "Debt Control"}</h4>
                      <p className="text-xs leading-relaxed text-[#0A2540]/80 font-medium">
                        {lang === "AR" ? "أعد هيكلة الديون أو تواصل لتوحيد الالتزامات." : "Consolidate outstanding high-interest debts immediately."}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#0A2540]/5 shadow-sm">
                      <h4 className="text-[#E6B3A8] font-bold text-xs uppercase mb-1">{lang === "AR" ? "نسبة الملاءة" : "Operating Margin"}</h4>
                      <p className="text-xs leading-relaxed text-[#0A2540]/80 font-medium">
                        {lang === "AR" ? "حافظ على مؤشر سداد الأقساط أعلى من 85 نقطة دائمًا." : "Keep operational outflow metrics under 35% of income."}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#0A2540]/5 shadow-sm">
                      <h4 className="text-[#E6B3A8] font-bold text-xs uppercase mb-1">{lang === "AR" ? "إصلاح السداد" : "Payment Repair"}</h4>
                      <p className="text-xs leading-relaxed text-[#0A2540]/80 font-medium">
                        {lang === "AR" ? "فعل نظام الاستقطاع والخصم التلقائي لضمان الالتزام." : "Activate absolute Autopay patterns to prevent minor delays."}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#0A2540]/5 shadow-sm">
                      <h4 className="text-[#E6B3A8] font-bold text-xs uppercase mb-1">{lang === "AR" ? "مكعب استشاري" : "Next Protocol"}</h4>
                      <p className="text-xs leading-relaxed text-[#0A2540]/80 font-medium">
                        {lang === "AR" ? "قم بتحميل كود فلاسك البرمجي أدناه لتشغيل النظام محليًا." : "Download the verified Python Flask environment files below."}
                      </p>
                    </div>
                  </div>

                  {/* Parse and render the AI advice into pristine actionable bullet cards */}
                  <div className="text-sm leading-relaxed text-[#0A2540] select-text">
                    <ActionableAdviceList advice={results.advice} lang={lang} />
                  </div>
                </div>
              </>
            )}
          </section>
        </div>

        {/* Local Python Code Exporter Module */}
        <section className="bg-white/80 backdrop-blur-md rounded-2xl border border-white p-6 shadow-xl shadow-[#0A2540]/5 mt-8">
          <div className="border-b border-slate-200 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <FileCode className="w-6 h-6 text-[#0A2540]" />
              <h2 className="text-xl font-bold text-[#0A2540]">{t.codeHubTitle}</h2>
            </div>
            <p className="text-[#0A2540]/60 text-sm mt-1">{t.codeHubSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* File List Navigation Sidebar */}
            <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
              {[
                { name: "app.py", desc: lang === "AR" ? "ملف خادم فلاسك الرئيسي" : "Flask Server File" },
                { name: "index.html", desc: lang === "AR" ? "واجهة مستخدم HTML" : "HTML Frontend UI" },
                { name: "style.css", desc: lang === "AR" ? "تنسيقات CSS الزجاجية" : "Glassmorphism CSS" },
                { name: "script.js", desc: lang === "AR" ? "منطق تشارت كود ومكتبة Chart.js" : "Chart.js & Client Logic" },
                { name: "README.md", desc: lang === "AR" ? "دليل تشغيل وإعداد النظام" : "Setup Instructions" }
              ].map((file) => (
                <button
                  key={file.name}
                  onClick={() => setActiveFile(file.name)}
                  className={`flex-shrink-0 flex flex-col items-start px-4 py-3 rounded-xl transition-all w-full text-left rtl:text-right cursor-pointer border ${
                    activeFile === file.name 
                      ? "bg-[#0A2540] border-[#0A2540] text-white shadow-md shadow-slate-900/15" 
                      : "bg-[#F4F7F9] hover:bg-[#EAEFF2] text-[#0A2540] border-transparent"
                  }`}
                >
                  <span className="font-bold text-sm font-mono">{file.name}</span>
                  <span className={`text-2xs mt-0.5 ${activeFile === file.name ? "text-[#E6B3A8]" : "text-[#0A2540]/60"}`}>{file.desc}</span>
                </button>
              ))}
            </div>

            {/* Code Viewer pane */}
            <div className="lg:col-span-9 flex flex-col border border-slate-200/60 rounded-xl overflow-hidden shadow-sm bg-[#051525]">
              
              {/* File Titlebar controls */}
              <div className="flex justify-between items-center bg-[#0A2540] px-4 py-2.5 border-b border-slate-800 text-white">
                <span className="font-mono text-xs text-[#E6B3A8]">{activeFile}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyCode(activeFile)}
                    className="flex items-center gap-1.5 text-2xs font-bold bg-white/10 hover:bg-white/20 text-white py-1.5 px-3 rounded-lg transition-all border border-white/10 cursor-pointer"
                  >
                    {copiedFile === activeFile ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{lang === "AR" ? "تم النسخ" : "Copied"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t.copyBtn}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDownloadFile(activeFile)}
                    className="flex items-center gap-1.5 text-2xs font-bold bg-[#E6B3A8] hover:bg-[#D09D93] text-[#0A2540] py-1.5 px-3 rounded-lg transition-all shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.downloadBtn}</span>
                  </button>
                </div>
              </div>

              {/* Textarea viewing */}
              <textarea
                readOnly
                value={getFileContent(activeFile)}
                className="w-full h-80 bg-[#051525] p-4 font-mono text-xs sm:text-sm text-slate-100 outline-none border-none resize-none leading-relaxed select-text"
                style={{ direction: activeFile === "README.md" ? "ltr" : "ltr" }}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer styled according to professional polish guidelines */}
      <footer className="mt-16 border-t border-[#0A2540]/5 bg-white/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#0A2540]/60 gap-4">
          <p>© 2026 TANBEEH (تنبّه) FINTECH SOLUTIONS — RISK ANALYTICS ENGINE v4.2</p>
          <p>{lang === "AR" ? "عقد تشفير آمن: 412.55.901" : "SECURE ENCRYPTED NODE: 412.55.901"}</p>
        </div>
      </footer>
    </div>
  );
}
