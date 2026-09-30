import fs from "fs";
import path from "path";

/**
 * Health Club — SEO, AEO & GEO Verification Helpers
 * Modular audit checkers verifying Schema.org, BLUF capsules, 10-30% discount rules,
 * Feni Sadar geographic boundaries, LLM crawlability, and the strict 500-line code limit.
 */

const NON_SADAR_TOKENS = [
  "দাগনভূঞা", "daganbhuiyan",
  "ছাগলনাইয়া", "chhagalnaiya",
  "সোনাগাজী", "sonagazi",
  "পরশুরাম", "parshuram",
  "ফুলগাজী", "fulgazi",
];

/**
 * 1. Code Architecture: Scans for files exceeding strict 500-line limit.
 */
export function auditLineLimits(projectRoot) {
  const issues = [];
  const scanned = [];

  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (["node_modules", ".next", ".git", "generated"].includes(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (/\.(tsx?|jsx?|mjs)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, "utf-8");
        const lines = content.split("\n").length;
        const relPath = path.relative(projectRoot, fullPath);
        scanned.push({ file: relPath, lines });
        if (lines > 500) {
          issues.push({
            file: relPath,
            lines,
            issue: `File exceeds 500-line code limit (${lines} lines)`,
          });
        }
      }
    }
  }

  scanDir(path.join(projectRoot, "src"));
  scanDir(path.join(projectRoot, "scripts"));

  return { scannedCount: scanned.length, issues };
}

/**
 * 2. LLMs & Robots Health: Verifies knowledge bases and AI crawler access.
 */
export function auditLlmsAndRobots(projectRoot) {
  const issues = [];
  const details = {};

  const llmsTxtPath = path.join(projectRoot, "public/llms.txt");
  const llmsFullTxtPath = path.join(projectRoot, "public/llms-full.txt");
  const robotsPath = path.join(projectRoot, "src/app/robots.ts");

  // Check public/llms.txt
  if (!fs.existsSync(llmsTxtPath)) {
    issues.push({ file: "public/llms.txt", issue: "Missing public/llms.txt file" });
  } else {
    const content = fs.readFileSync(llmsTxtPath, "utf-8");
    details.llmsTxtChars = content.length;
    if (content.length < 500) {
      issues.push({ file: "public/llms.txt", issue: "File is suspiciously short (< 500 chars)" });
    }
    if (!content.includes("Health Club") && !content.includes("হেলথ ক্লাব")) {
      issues.push({ file: "public/llms.txt", issue: "Missing 'Health Club' brand entity" });
    }
    if (!content.includes("Feni Sadar") && !content.includes("ফেনী সদর")) {
      issues.push({ file: "public/llms.txt", issue: "Missing 'Feni Sadar' geographic scope mention" });
    }
    if (!content.includes("10%") && !content.includes("১০%")) {
      issues.push({ file: "public/llms.txt", issue: "Missing 10-30% discount policy clarification" });
    }
  }

  // Check public/llms-full.txt
  if (!fs.existsSync(llmsFullTxtPath)) {
    issues.push({ file: "public/llms-full.txt", issue: "Missing public/llms-full.txt file" });
  } else {
    const fullContent = fs.readFileSync(llmsFullTxtPath, "utf-8");
    details.llmsFullChars = fullContent.length;
    if (fullContent.length < 2000) {
      issues.push({ file: "public/llms-full.txt", issue: "File is suspiciously short (< 2000 chars)" });
    }
  }

  // Check src/app/robots.ts
  if (!fs.existsSync(robotsPath)) {
    issues.push({ file: "src/app/robots.ts", issue: "Missing src/app/robots.ts route configuration" });
  } else {
    const robotsCode = fs.readFileSync(robotsPath, "utf-8");
    const requiredBots = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];
    for (const bot of requiredBots) {
      if (!robotsCode.includes(bot)) {
        issues.push({ file: "src/app/robots.ts", issue: `AI crawler '${bot}' not declared in robots.ts` });
      }
    }
    const requiredAllowPaths = ["/llms.txt", "/llms-full.txt", "/blog", "/consultants", "/partner-hospitals"];
    for (const rPath of requiredAllowPaths) {
      if (!robotsCode.includes(`"${rPath}"`)) {
        issues.push({ file: "src/app/robots.ts", issue: `Public path '${rPath}' not declared in ALLOWED_PATHS` });
      }
    }
  }

  return { issues, details };
}

/**
 * 3. Pricing Rule Compliance: Strictly 10-30% savings badge. Zero fixed taka member prices.
 */
export function auditDiscountCompliance(blogPosts, partners = []) {
  const issues = [];
  let totalTestsAudited = 0;
  let totalPackagesAudited = 0;

  for (const post of blogPosts) {
    const slug = post.slug || "unknown";

    // 3a. Diagnostic test pricing
    let testPricing = post.diagnosticTestPricingBn;
    if (testPricing && typeof testPricing === "object" && !Array.isArray(testPricing) && Array.isArray(testPricing.items)) {
      testPricing = testPricing.items;
    }

    if (Array.isArray(testPricing)) {
      for (const item of testPricing) {
        totalTestsAudited++;
        const benefit = String(item.memberPriceRangeBn || item.healthClubBenefitBn || item.discountPriceRangeBn || item.discount || "");
        // Check for illegal fixed taka in member price (e.g. ৳২৪০ - ৳৪০০) without percentage savings or govt note
        if (/৳\s*[\d০-৯]+/.test(benefit) && !/%|শতাংশ|ছাড়|ডিসকাউন্ট|সরকারি|নয়/.test(benefit)) {
          issues.push({
            post: slug,
            testName: item.testNameBn || item.testNameEn,
            issue: `Direct discounted Taka amount in member benefit column: "${benefit}"`,
          });
        }
      }
    }

    // 3b. Diagnostic comparison table
    const table = post.diagnosticComparisonTable || [];
    if (Array.isArray(table)) {
      for (const row of table) {
        totalPackagesAudited++;
        const discountText = String(row.discountBn || row.discountEn || "");
        if (/৳\s*[\d০-৯]+/.test(discountText) && !/%|শতাংশ|ছাড়|ডিসকাউন্ট|সরকারি|নয়|Not/.test(discountText)) {
          issues.push({
            post: slug,
            facility: row.nameBn || row.nameEn,
            issue: `Direct discounted Taka in comparison table discount column: "${discountText}"`,
          });
        }
      }
    }
  }

  // 3c. Partner directory discount strings
  for (const p of partners) {
    if (p.discount && /৳\s*[\d০-৯]+/.test(p.discount) && !/%|শতাংশ|ছাড়|ডিসকাউন্ট/.test(p.discount)) {
      issues.push({
        partner: p.name || p.id,
        issue: `Partner discount contains fixed Taka amount instead of percentage savings: "${p.discount}"`,
      });
    }
  }

  return { issues, totalTestsAudited, totalPackagesAudited };
}

/**
 * 4. Geographic Scope Compliance: Health Club partners strictly in Feni Sadar.
 */
export function auditGeographicScope(blogPosts, doctors = [], partners = []) {
  const issues = [];
  let facilitiesAudited = 0;

  for (const post of blogPosts) {
    const slug = post.slug || "unknown";

    // Check diagnostic centers
    const centers = post.diagnosticCenters || [];
    if (Array.isArray(centers)) {
      for (const c of centers) {
        facilitiesAudited++;
        const loc = `${c.addressBn || ""} ${c.locationBn || ""} ${c.addressEn || ""}`.toLowerCase();
        const isNonSadar = NON_SADAR_TOKENS.some((t) => loc.includes(t));
        if (isNonSadar && c.partnerStatus === true) {
          issues.push({
            post: slug,
            facility: c.nameBn || c.nameEn,
            issue: `Facility in non-Sadar upazila marked with partnerStatus: true (${c.addressBn || c.locationBn})`,
          });
        }
      }
    }

    // Check comparison table
    const table = post.diagnosticComparisonTable || [];
    if (Array.isArray(table)) {
      for (const row of table) {
        const loc = `${row.locationBn || ""} ${row.locationEn || ""}`.toLowerCase();
        const isNonSadar = NON_SADAR_TOKENS.some((t) => loc.includes(t));
        if (isNonSadar && row.partnerStatus === true) {
          issues.push({
            post: slug,
            facility: row.nameBn || row.nameEn,
            issue: `Comparison table row in non-Sadar upazila marked with partnerStatus: true (${row.locationBn})`,
          });
        }
      }
    }
  }

  // Check doctors directory
  for (const doc of doctors) {
    const addr = `${doc.chamberAddress || ""} ${doc.chamberName || ""}`.toLowerCase();
    const isNonSadar = NON_SADAR_TOKENS.some((t) => addr.includes(t));
    if (isNonSadar && (doc.partnerId || doc.partnerStatus)) {
      issues.push({
        doctor: doc.name || doc.id,
        chamber: doc.chamberName,
        issue: `Doctor in non-Sadar upazila marked with partnerStatus / partnerId (${doc.chamberAddress})`,
      });
    }
  }

  // Check partner facility directory
  for (const p of partners) {
    if (p.upazila && p.upazila !== "feni-sadar") {
      issues.push({
        partner: p.name || p.id,
        issue: `Partner directory has contracted facility located outside Feni Sadar (${p.upazila})`,
      });
    }
  }

  return { issues, facilitiesAudited };
}

/**
 * 5. Direct Answer Capsules (BLUF) & AEO Questions
 */
export function auditBlufAndAeo(blogPosts) {
  const issues = [];
  let totalFaqsAudited = 0;

  for (const post of blogPosts) {
    const slug = post.slug || "unknown";

    // 5a. Opening Direct Answer BLUF
    const intros = post.introParagraphsBn || [];
    if (!intros || intros.length === 0) {
      issues.push({ post: slug, issue: "Missing introParagraphsBn opening answer capsule" });
    } else {
      const combinedIntro = intros.join(" ");
      if (combinedIntro.trim().split(/\s+/).length < 20) {
        issues.push({ post: slug, issue: `Intro capsule is too short (< 20 words) for direct AI synthesis: "${combinedIntro}"` });
      }
    }

    // 5b. Key highlights capsule
    const highlights = post.keyHighlightsBn || [];
    if (!highlights || highlights.length === 0) {
      issues.push({ post: slug, issue: "Missing keyHighlightsBn quick answer takeaways" });
    }

    // 5c. Conversational FAQ pairs
    const faqs = post.faqs || [];
    if (!Array.isArray(faqs) || faqs.length < 3) {
      issues.push({ post: slug, issue: `Insufficient FAQ pairs (${faqs.length} found, minimum 3 required for FAQPage schema)` });
    } else {
      for (const faq of faqs) {
        totalFaqsAudited++;
        const q = String(faq.questionBn || faq.question || "").trim();
        const a = String(faq.answerBn || faq.answer || "").trim();
        if (!q || !a) {
          issues.push({ post: slug, issue: "Encountered blank FAQ question or answer" });
        } else if (a.split(/\s+/).length < 8) {
          issues.push({ post: slug, question: q, issue: `FAQ answer too terse (< 8 words) for AEO direct answer box: "${a}"` });
        }
      }
    }
  }

  return { issues, totalFaqsAudited };
}

/**
 * 6. Schema.org JSON-LD Deep Validator
 */
export function validateJsonLdSchemaObject(schema, sourceContext = "unknown") {
  const errors = [];
  const entitiesFound = [];

  if (!schema || typeof schema !== "object") {
    errors.push(`Invalid JSON-LD in ${sourceContext}: Not an object`);
    return { valid: false, errors, entitiesFound };
  }

  const items = Array.isArray(schema) ? schema : [schema];

  for (const item of items) {
    if (!item || typeof item !== "object") continue;

    // Check @graph structure
    if (Array.isArray(item["@graph"])) {
      for (const subItem of item["@graph"]) {
        const subRes = validateSingleSchemaNode(subItem, sourceContext);
        errors.push(...subRes.errors);
        entitiesFound.push(...subRes.entitiesFound);
      }
      continue;
    }

    const singleRes = validateSingleSchemaNode(item, sourceContext);
    errors.push(...singleRes.errors);
    entitiesFound.push(...singleRes.entitiesFound);
  }

  return {
    valid: errors.length === 0,
    errors,
    entitiesFound,
  };
}

function validateSingleSchemaNode(node, sourceContext) {
  const errors = [];
  const entitiesFound = [];
  if (!node || typeof node !== "object") return { errors, entitiesFound };

  const rawType = node["@type"];
  const typeStr = Array.isArray(rawType) ? rawType.join("+") : (rawType || "Unknown");
  entitiesFound.push(typeStr);

  const context = node["@context"];
  if (context && typeof context === "string" && !context.includes("schema.org")) {
    errors.push(`[${sourceContext}] Invalid @context: "${context}" (must reference schema.org)`);
  }

  // Validate URL integrity (no undefined, null, [object Object])
  function checkUrlStrings(obj, pathKey = "") {
    for (const [k, v] of Object.entries(obj)) {
      const currentPath = pathKey ? `${pathKey}.${k}` : k;
      if (typeof v === "string") {
        if (["url", "@id", "item", "image", "logo"].includes(k) || currentPath.includes("Url")) {
          if (v.includes("undefined") || v.includes("null") || v.includes("[object")) {
            errors.push(`[${sourceContext}] Corrupt URL detected at ${currentPath}: "${v}"`);
          }
        }
      } else if (v && typeof v === "object") {
        checkUrlStrings(v, currentPath);
      }
    }
  }
  checkUrlStrings(node);

  // Type-specific schema constraints
  if (typeStr.includes("MedicalWebPage") || typeStr.includes("BlogPosting")) {
    if (!node.headline && !node.name) {
      errors.push(`[${sourceContext}] ${typeStr} missing 'headline' or 'name'`);
    }
  }

  if (typeStr.includes("FAQPage")) {
    if (!Array.isArray(node.mainEntity) || node.mainEntity.length === 0) {
      errors.push(`[${sourceContext}] FAQPage missing or empty 'mainEntity' array`);
    }
  }

  if (typeStr.includes("BreadcrumbList")) {
    if (!Array.isArray(node.itemListElement) || node.itemListElement.length === 0) {
      errors.push(`[${sourceContext}] BreadcrumbList missing or empty 'itemListElement' array`);
    }
  }

  if (typeStr.includes("Physician")) {
    if (!node.name) {
      errors.push(`[${sourceContext}] Physician missing 'name'`);
    }
  }

  return { errors, entitiesFound };
}

/**
 * Discovers and loads all blog posts from backups or static sources.
 */
export function discoverAllBlogPosts(projectRoot) {
  const postsMap = new Map();

  // 1. Inspect backups folder for latest JSON dump
  try {
    const backupDir = path.join(projectRoot, "backups");
    if (fs.existsSync(backupDir)) {
      const files = fs.readdirSync(backupDir).filter((f) => f.endsWith(".json")).sort().reverse();
      for (const file of files) {
        try {
          const content = fs.readFileSync(path.join(backupDir, file), "utf-8");
          const posts = JSON.parse(content);
          if (Array.isArray(posts)) {
            for (const p of posts) {
              if (p && p.slug && !postsMap.has(p.slug)) {
                postsMap.set(p.slug, p);
              }
            }
          }
        } catch {
          // ignore individual parse errors
        }
      }
    }
  } catch {
    // ignore
  }

  return Array.from(postsMap.values());
}
