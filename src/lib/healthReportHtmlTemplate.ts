import { HealthAssessmentReport } from "@/lib/healthReportPdf";

export function generateHealthReportHtml(report: HealthAssessmentReport): string {
  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <title>Health Assessment Report - ${report.reportId}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Bengali", sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.45;
      font-size: 12px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .page-container {
      width: 100%;
      max-width: 780px;
      margin: 0 auto;
      padding: 8px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2.5px solid #16a34a;
      padding-bottom: 10px;
      margin-bottom: 12px;
      flex-wrap: wrap;
      gap: 8px;
    }
    .logo-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-badge {
      background: #16a34a;
      color: white;
      font-weight: 800;
      font-size: 16px;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .brand-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
    }
    .brand-sub {
      font-size: 10.5px;
      color: #64748b;
    }
    .report-badge {
      text-align: right;
    }
    .badge-tag {
      background: #f0fdf4;
      color: #15803d;
      border: 1px solid #bbf7d0;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 10.5px;
      display: inline-block;
    }
    .meta-line {
      font-size: 10.5px;
      color: #64748b;
      margin-top: 2px;
    }
    .patient-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px 12px;
      margin-bottom: 12px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      font-size: 11px;
    }
    .patient-card div strong {
      color: #475569;
      display: block;
      font-size: 9.5px;
      text-transform: uppercase;
    }
    .patient-card div span {
      font-weight: 700;
      color: #0f172a;
    }
    .score-banner {
      background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
      border: 1.5px solid #86efac;
      border-radius: 10px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .score-circle {
      width: 48px;
      height: 48px;
      background: #16a34a;
      color: white;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 16px;
      line-height: 1;
      shrink: 0;
    }
    .score-circle small {
      font-size: 7.5px;
      font-weight: 500;
      opacity: 0.9;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px;
      background: #ffffff;
    }
    .card-title {
      font-size: 12px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 4px;
    }
    .metric-value {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .metric-status {
      display: inline-block;
      padding: 1.5px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .status-normal { background: #dcfce7; color: #15803d; }
    .status-warning { background: #fef3c7; color: #b45309; }
    .status-danger { background: #fee2e2; color: #b91c1c; }
    .card-list {
      list-style-type: none;
      padding-left: 0;
      font-size: 11px;
      color: #334155;
    }
    .card-list li {
      position: relative;
      padding-left: 12px;
      margin-bottom: 3px;
    }
    .card-list li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: #16a34a;
      font-weight: bold;
      font-size: 13px;
    }
    .card-list.warning li::before {
      color: #dc2626;
    }
    .doctor-box {
      background: #f0fdf4;
      border: 1px dashed #16a34a;
      border-radius: 8px;
      padding: 8px 12px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      flex-wrap: wrap;
      gap: 6px;
    }
    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      margin-top: 10px;
      font-size: 9.5px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 4px;
    }
    @media screen and (max-width: 600px) {
      .patient-card {
        grid-template-columns: 1fr 1fr;
      }
      .grid-2 {
        grid-template-columns: 1fr;
      }
      .report-badge {
        text-align: left;
      }
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="header">
      <div class="logo-container">
        <div class="logo-badge">HC</div>
        <div>
          <div class="brand-title">হেলথ ক্লাব (Health Club)</div>
          <div class="brand-sub">স্মার্ট ডিজিটাল স্বাস্থ্য সেবা ও প্রিভিলেজ নেটওয়ার্ক • সিলেট, বাংলাদেশ</div>
        </div>
      </div>
      <div class="report-badge">
        <div class="badge-tag">হেলথ অ্যাসেসমেন্ট সামারি</div>
        <div class="meta-line">${report.reportId} | ${report.generatedDate} ${report.generatedTime}</div>
      </div>
    </div>

    <div class="patient-card">
      <div>
        <strong>নাম / সদস্য</strong>
        <span>${report.name || "স্বাস্থ্য সচেতন সদস্য"}</span>
      </div>
      <div>
        <strong>বয়স ও লিঙ্গ</strong>
        <span>${report.age} বছর (${report.gender === "male" ? "পুরুষ" : "মহিলা"})</span>
      </div>
      <div>
        <strong>উচ্চতা ও ওজন</strong>
        <span>${report.heightCm} cm | ${report.weightKg} kg</span>
      </div>
      <div>
        <strong>কাজের মাত্রা</strong>
        <span>${
          report.activityLevel === "sedentary"
            ? "বসে কাজ"
            : report.activityLevel === "light"
            ? "হালকা সক্রিয়"
            : report.activityLevel === "moderate"
            ? "মাঝারি ব্যায়াম"
            : "অত্যধিক সক্রিয়"
        }</span>
      </div>
    </div>

    <div class="score-banner">
      <div>
        <div style="font-weight: 800; font-size: 13px; color: #065f46;">
          সার্বিক স্বাস্থ্য মূল্যায়ন স্কোর (Overall Wellness Score)
        </div>
        <div style="font-size: 11px; color: #047857; margin-top: 1px;">
          ${report.wellnessStatusBn}
        </div>
      </div>
      <div class="score-circle">
        ${report.overallScore}
        <small>/ 100</small>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-title">
          <span>বডি ম্যাস ইনডেক্স (BMI)</span>
          <span class="metric-status ${report.bmiCategory === "normal" ? "status-normal" : report.bmiCategory === "overweight" ? "status-warning" : "status-danger"}">
            ${report.bmiCategoryBn}
          </span>
        </div>
        <div class="metric-value">${report.bmi} <span style="font-size: 11px; font-weight: 500; color: #64748b;">kg/m²</span></div>
        <p style="font-size: 10.5px; color: #475569; margin-bottom: 4px;">
          আদর্শ ওজনের সীমা: ${report.idealMinKg} - ${report.idealMaxKg} কেজি
        </p>
        <p style="font-size: 10.5px; color: #334155; line-height: 1.35;">
          ${report.weightStatusAdviceBn}
        </p>
      </div>

      <div class="card">
        <div class="card-title">
          <span>দৈনিক ক্যালোরি ও এনার্জি</span>
          <span class="metric-status status-normal">${report.maintenanceCalories} kcal/day</span>
        </div>
        <div class="metric-value">${report.maintenanceCalories} <span style="font-size: 11px; font-weight: 500; color: #64748b;">kcal/দিন</span></div>
        <div style="font-size: 10.5px; color: #475569; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-top: 4px;">
          <div>BMR বিপাকীয় হার: <strong>${report.bmr} kcal</strong></div>
          <div>ওজন হ্রাস টার্গেট: <strong>${report.weightLossCalories} kcal</strong></div>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-title">
          <span>দৈনিক পানির চাহিদা (Hydration)</span>
          <span class="metric-status status-normal">${report.dailyWaterLiters} Liters</span>
        </div>
        <div class="metric-value">${report.dailyWaterLiters} L <span style="font-size: 11px; font-weight: 500; color: #64748b;">(~${report.dailyGlasses} গ্লাস)</span></div>
        <p style="font-size: 10.5px; color: #475569;">
          শরীরের ওজন অনুযায়ী প্রতিদিন অন্তত ${report.dailyGlasses} গ্লাস (২৫০ মিলি) পানি পান করুন।
        </p>
      </div>

      <div class="card">
        <div class="card-title">
          <span>ক্লিনিক্যাল নির্দেশক (BP ও সুগার)</span>
          <span class="metric-status ${report.bpEvaluation?.urgencyLevel === "normal" || !report.bpEvaluation ? "status-normal" : "status-warning"}">
            ${report.bpEvaluation ? report.bpEvaluation.badgeBn : "রুটিন"}
          </span>
        </div>
        <div style="font-size: 11px; color: #334155;">
          ${
            report.bpEvaluation
              ? `<div>রক্তচাপ: <strong>${report.bpEvaluation.systolic}/${report.bpEvaluation.diastolic} mmHg</strong> (${report.bpEvaluation.titleBn})</div>`
              : `<div>রক্তচাপ: আদর্শ মান < ১২০/৮০ mmHg</div>`
          }
          ${
            report.glucoseEvaluation
              ? `<div style="margin-top: 3px;">শর্করা: <strong>${report.glucoseEvaluation.valueMmol} mmol/L</strong> (${report.glucoseEvaluation.titleBn})</div>`
              : `<div style="margin-top: 3px;">শর্করা: স্বাভাবিক ফাস্টিং ৩.৯ - ৫.৫ mmol/L</div>`
          }
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-title">পুষ্টি ও খাদ্যাভ্যাস নির্দেশনা</div>
        <ul class="card-list">
          ${report.dietRecommendationsBn.slice(0, 3).map((rec) => `<li>${rec}</li>`).join("")}
        </ul>
      </div>

      <div class="card">
        <div class="card-title">শরীরচর্চা ও রেড-ফ্ল্যাগ সংকেত</div>
        <ul class="card-list">
          ${report.exerciseRecommendationsBn.slice(0, 2).map((rec) => `<li>${rec}</li>`).join("")}
        </ul>
        <ul class="card-list warning" style="margin-top: 4px;">
          ${report.warningSignsBn.slice(0, 1).map((sign) => `<li>${sign}</li>`).join("")}
        </ul>
      </div>
    </div>

    <div class="doctor-box">
      <div>
        <strong style="color: #065f46;">প্রয়োজনীয় বিশেষজ্ঞ পরামর্শ:</strong>
        <span style="color: #047857; margin-left: 4px;">${report.doctorReferralBn}</span>
      </div>
      <div style="font-weight: 700; color: #16a34a; font-size: 10.5px;">
        হেলথ ক্লাব কার্ডে ২০% পর্যন্ত ডিসকাউন্ট
      </div>
    </div>

    <div class="footer">
      <div>সতর্কবার্তা: এই প্রতিবেদনটি প্রাথমিক স্বাস্থ্য সচেতনতার জন্য তৈরি।</div>
      <div>Health Club • Sylhet, Bangladesh</div>
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  </script>
</body>
</html>`;
}

export function printHealthAssessmentReport(
  report: HealthAssessmentReport
): void {
  const htmlContent = generateHealthReportHtml(report);
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    window.print();
    return;
  }
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
