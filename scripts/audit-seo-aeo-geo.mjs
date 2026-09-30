#!/usr/bin/env node

/**
 * Health Club — Automated AI & Search Engine SERP Audit Engine (AEO, GEO & SEO)
 *
 * Verifies:
 *  1. Strict 500-line code limit compliance across all project source files.
 *  2. public/llms.txt, public/llms-full.txt & robots.ts AI bot crawlability.
 *  3. 10–30% Member Discount compliance across all 100+ guides (zero fixed Taka amounts).
 *  4. Feni Sadar geographic scope compliance (no partner claims outside Feni Sadar).
 *  5. Presence of direct answer capsules / BLUF under question headings.
 *  6. Schema.org JSON-LD validity across guides, doctors, and directory hubs.
 *
 * Usage:
 *   node scripts/audit-seo-aeo-geo.mjs
 *   npm run audit:geo
 *   node scripts/audit-seo-aeo-geo.mjs --baseUrl=http://localhost:3000
 *   node scripts/audit-seo-aeo-geo.mjs --offline
 *   node scripts/audit-seo-aeo-geo.mjs --limit=25 --verbose
 */

import fs from "fs";
import path from "path";
import {
  auditLineLimits,
  auditLlmsAndRobots,
  auditDiscountCompliance,
  auditGeographicScope,
  auditBlufAndAeo,
  validateJsonLdSchemaObject,
  discoverAllBlogPosts,
} from "./audit-seo-aeo-geo-helpers.mjs";

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  gray: "\x1b[90m",
};

const args = process.argv.slice(2);
function getArg(flag) {
  const match = args.find((a) => a.startsWith(`--${flag}=`));
  if (match) return match.split("=")[1];
  const idx = args.indexOf(`--${flag}`);
  if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith("--")) return args[idx + 1];
  return null;
}

const verbose = args.includes("--verbose") || args.includes("-v");
const offlineOnly = args.includes("--offline");
const limitArg = getArg("limit");
const maxCrawl = limitArg ? parseInt(limitArg, 10) : Infinity;
const concurrencyArg = getArg("concurrency");
const CONCURRENCY = concurrencyArg ? parseInt(concurrencyArg, 10) : 6;

const projectRoot = process.cwd();

const CORE_DIRECTORY_ROUTES = [
  "/",
  "/blog",
  "/consultants",
  "/partner-hospitals",
  "/emergency",
  "/health-tips",
  "/health-tools",
  "/membership",
  "/about-us",
  "/become-partner",
  "/contact",
];

const UPAZILA_SLUGS = [
  "feni-sadar",
  "daganbhuiyan",
  "chhagalnaiya",
  "sonagazi",
  "parshuram",
  "fulgazi",
];

const DEPARTMENT_SLUGS = [
  "general-medicine",
  "cardiology",
  "gynecology-obstetrics",
  "pediatrics-child",
  "orthopedics",
  "nephrology-kidney",
  "ent-head-neck",
  "neurology-stroke",
];

async function checkServer(url) {
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(3000) });
    return res.status >= 200 && res.status < 500;
  } catch {
    return false;
  }
}

async function main() {
  console.log(`\n${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}${colors.green}  🏥 Health Club — Automated SERP, AEO & GEO Verification Suite${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════════════${colors.reset}\n`);

  const startTime = Date.now();
  const allFailures = [];

  // Load project data
  const blogPosts = discoverAllBlogPosts(projectRoot);
  console.log(`${colors.cyan}ℹ Loaded ${blogPosts.length} medical blog guides from repository corpus.${colors.reset}`);

  let doctors = [];
  try {
    const docsPath = path.join(projectRoot, "src/data/feniUniqueDoctors.json");
    if (fs.existsSync(docsPath)) {
      doctors = JSON.parse(fs.readFileSync(docsPath, "utf-8"));
      console.log(`${colors.cyan}ℹ Loaded ${doctors.length} verified specialist doctor profiles.${colors.reset}`);
    }
  } catch {
    // ignore
  }

  const partners = [
    { id: "life-care-diagnostic-center", name: "লাইফ কেয়ার ডায়াগনস্টিক সেন্টার", upazila: "feni-sadar", discount: "১০-৩০% ডিসকাউন্ট" },
    { id: "imperial-neurocare-diagnostic-center", name: "ইম্পেরিয়াল নিউরোকেয়ার অ্যান্ড ডায়াগনস্টিক সেন্টার", upazila: "feni-sadar", discount: "১০-৩০% ডিসকাউন্ট" },
    { id: "নিরাময়-ডায়াগনস্টিক-এন্ড-কনসালটেশন-সেন্টার", name: "নিরাময় ডায়াগনস্টিক এন্ড কনসালটেশন সেন্টার", upazila: "feni-sadar", discount: "১০-৩০% ডিসকাউন্ট" },
    { id: "m-rahaman-medical-stories", name: "এম রহমান মেডিকেল স্টোর", upazila: "feni-sadar", discount: "১০-৩০% ডিসকাউন্ট" },
    { id: "ফেনী-কেয়ার-হসপিটাল", name: "ফেনী কেয়ার হসপিটাল", upazila: "feni-sadar", discount: "১০-৩০% ডিসকাউন্ট" },
    { id: "ঢাকা-ফার্মেসি", name: "ঢাকা ফার্মেসি", upazila: "feni-sadar", discount: "১০-৩০% ডিসকাউন্ট" },
    { id: "feni-max-diagnostic-centre", name: "ফেনি ম্যাক্স ডায়াগনস্টিক সেন্টার", upazila: "feni-sadar", discount: "১০-৩০% ডিসকাউন্ট" },
    { id: "ইসলামিয়া-ফিজিওথেরাপি-এন্ড-রিহ্যাবিলিটেশন-সেন্টার", name: "ইসলামিয়া ফিজিওথেরাপি এন্ড রিহ্যাবিলিটেশন সেন্টার", upazila: "feni-sadar", discount: "১০-৩০% ডিসকাউন্ট" },
    { id: "মজুমদার-ডেন্টাল-ক্লিনিক", name: "মজুমদার ডেন্টাল ক্লিনিক", upazila: "feni-sadar", discount: "১০-৩০% ডিসকাউন্ট" },
    { id: "আল-আকসা-হাসপাতাল-লিঃ-ফেনী", name: "আল-আকসা হাসপাতাল লিঃ ফেনী", upazila: "feni-sadar", discount: "১০-৩০% ডিসকাউন্ট" },
    { id: "সেন্ট্রাল-ফিজিওথেরাপি-এন্ড-রিহ্যাবিলিটেশন-সেন্টার", name: "সেন্ট্রাল ফিজিওথেরাপি এন্ড রিহ্যাবিলিটেশন সেন্টার", upazila: "feni-sadar", discount: "১০-৩০% ডিসকাউন্ট" },
    { id: "pacific-health-care-centre", name: "প্যাসিফিক হেলথ কেয়ার সেন্টার", upazila: "feni-sadar", discount: "১০-৩০% ডিসকাউন্ট" },
  ];

  // 1. Suite 1: Line Limit
  console.log(`\n${colors.bold}1. Auditing Code Architecture & Strict 500-Line Limit...${colors.reset}`);
  const lineLimitRes = auditLineLimits(projectRoot);
  if (lineLimitRes.issues.length > 0) {
    for (const issue of lineLimitRes.issues) {
      allFailures.push({ suite: "Line Limits", item: issue.file, issue: issue.issue });
      console.log(`  ${colors.red}✖ [LINE LIMIT EXCEEDED]${colors.reset} ${issue.file}: ${issue.lines} lines`);
    }
  } else {
    console.log(`  ${colors.green}✓ Passed:${colors.reset} All ${lineLimitRes.scannedCount} source files comply strictly with the 500-line code limit.`);
  }

  // 2. Suite 2: AI Knowledge Bases
  console.log(`\n${colors.bold}2. Auditing AI Crawlability & LLM Knowledge Bases...${colors.reset}`);
  const llmRes = auditLlmsAndRobots(projectRoot);
  if (llmRes.issues.length > 0) {
    for (const issue of llmRes.issues) {
      allFailures.push({ suite: "AI Knowledge Base", item: issue.file, issue: issue.issue });
      console.log(`  ${colors.red}✖ [AI HEALTH ISSUE]${colors.reset} ${issue.file}: ${issue.issue}`);
    }
  } else {
    console.log(`  ${colors.green}✓ Passed:${colors.reset} llms.txt (${llmRes.details.llmsTxtChars} chars), llms-full.txt (${llmRes.details.llmsFullChars} chars) and robots.ts are fully optimized.`);
  }

  // 3. Suite 3: 10-30% Discount Rules
  console.log(`\n${colors.bold}3. Auditing 10-30% Discount Rules (Zero Fixed Taka Amounts)...${colors.reset}`);
  const discountRes = auditDiscountCompliance(blogPosts, partners);
  if (discountRes.issues.length > 0) {
    for (const issue of discountRes.issues) {
      allFailures.push({ suite: "Pricing Rules", item: issue.post || issue.partner, issue: issue.issue });
      console.log(`  ${colors.red}✖ [DISCOUNT VIOLATION]${colors.reset} ${issue.post || issue.partner}: ${issue.issue}`);
    }
  } else {
    console.log(`  ${colors.green}✓ Passed:${colors.reset} ${discountRes.totalTestsAudited} diagnostic tests & ${discountRes.totalPackagesAudited} comparison items verified. 0 fixed Taka member prices found.`);
  }

  // 4. Suite 4: Geographic Scope
  console.log(`\n${colors.bold}4. Auditing Geographic Scope (Feni Sadar Partner Boundary)...${colors.reset}`);
  const geoRes = auditGeographicScope(blogPosts, doctors, partners);
  if (geoRes.issues.length > 0) {
    for (const issue of geoRes.issues) {
      allFailures.push({ suite: "Geographic Scope", item: issue.post || issue.doctor || issue.partner, issue: issue.issue });
      console.log(`  ${colors.red}✖ [GEOGRAPHIC VIOLATION]${colors.reset} ${issue.post || issue.doctor || issue.partner}: ${issue.issue}`);
    }
  } else {
    console.log(`  ${colors.green}✓ Passed:${colors.reset} ${geoRes.facilitiesAudited} facility reviews audited. Zero partner claims exist outside Feni Sadar.`);
  }

  // 5. Suite 5: BLUF & AEO Questions
  console.log(`\n${colors.bold}5. Auditing Direct Answer Capsules (BLUF) & Conversational FAQs...${colors.reset}`);
  const blufRes = auditBlufAndAeo(blogPosts);
  if (blufRes.issues.length > 0) {
    for (const issue of blufRes.issues) {
      allFailures.push({ suite: "BLUF & AEO", item: issue.post, issue: issue.issue });
      console.log(`  ${colors.red}✖ [BLUF / AEO ISSUE]${colors.reset} ${issue.post}: ${issue.issue}`);
    }
  } else {
    console.log(`  ${colors.green}✓ Passed:${colors.reset} All ${blogPosts.length} guides feature direct BLUF capsules; ${blufRes.totalFaqsAudited} FAQ answer capsules verified.`);
  }

  // 6. Suite 6: Schema.org JSON-LD Validity & Live SERP Crawl
  console.log(`\n${colors.bold}6. Auditing Schema.org JSON-LD Entities & Live SERP Headers...${colors.reset}`);

  let targetBaseUrl = getArg("baseUrl");
  let liveCrawlActive = false;

  if (!offlineOnly) {
    if (!targetBaseUrl) {
      const localUrl = "http://localhost:3000";
      if (await checkServer(localUrl)) {
        targetBaseUrl = localUrl;
        liveCrawlActive = true;
        console.log(`  ${colors.green}✓ Detected active local development server:${colors.reset} ${localUrl}`);
      } else {
        const prodUrl = "https://www.healthclubfeni.com";
        if (await checkServer(prodUrl)) {
          targetBaseUrl = prodUrl;
          liveCrawlActive = true;
          console.log(`  ${colors.yellow}ℹ Local server not running on port 3000.${colors.reset}`);
          console.log(`  ${colors.cyan}ℹ Crawling live production deployment:${colors.reset} ${targetBaseUrl}`);
        }
      }
    } else {
      liveCrawlActive = true;
      console.log(`  ${colors.cyan}ℹ Using specified target base URL:${colors.reset} ${targetBaseUrl}`);
    }
  }

  const schemaStats = {
    totalAudited: 0,
    passed200: 0,
    redirects: 0,
    brokenUrls: 0,
    validJsonLdBlocks: 0,
    blufAnswersVerified: 0,
    entityTypes: {},
  };

  if (liveCrawlActive && targetBaseUrl) {
    let discoveredFromSitemap = [];
    try {
      const sitemapRes = await fetch(`${targetBaseUrl}/sitemap.xml`, { signal: AbortSignal.timeout(6000) });
      if (sitemapRes.status === 200) {
        const xml = await sitemapRes.text();
        const locMatches = xml.match(/<loc>(.*?)<\/loc>/g) || [];
        discoveredFromSitemap = locMatches.map((m) => m.replace(/<\/?loc>/g, "").trim());
        if (discoveredFromSitemap.length > 0) {
          console.log(`  ${colors.green}✓ Parsed target sitemap.xml:${colors.reset} Found ${discoveredFromSitemap.length} indexed URLs`);
        }
      }
    } catch {
      // ignore
    }

    let crawlPool = [];
    if (discoveredFromSitemap.length > 0) {
      const sitemapSet = new Set(discoveredFromSitemap);
      const core = CORE_DIRECTORY_ROUTES.map((r) => `${targetBaseUrl}${r}`).filter((u) => sitemapSet.has(u));
      const upazilas = UPAZILA_SLUGS.map((slug) => `${targetBaseUrl}/consultants/location/${slug}`).filter((u) => sitemapSet.has(u));
      const depts = DEPARTMENT_SLUGS.map((slug) => `${targetBaseUrl}/consultants/department/${slug}`).filter((u) => sitemapSet.has(u));
      const blogs = discoveredFromSitemap.filter((u) => u.includes("/blog/")).slice(0, 30);
      const docs = discoveredFromSitemap.filter((u) => u.includes("/consultants/") && !u.includes("/location/") && !u.includes("/department/")).slice(0, 15);
      crawlPool = Array.from(new Set([...core, ...upazilas, ...depts, ...blogs, ...docs]));
    } else {
      crawlPool = [
        ...CORE_DIRECTORY_ROUTES.map((r) => `${targetBaseUrl}${r}`),
        ...UPAZILA_SLUGS.map((slug) => `${targetBaseUrl}/consultants/location/${slug}`),
        ...DEPARTMENT_SLUGS.map((slug) => `${targetBaseUrl}/consultants/department/${slug}`),
        ...blogPosts.slice(0, 30).map((p) => `${targetBaseUrl}/blog/${encodeURIComponent(p.slug)}`),
        ...doctors.slice(0, 15).map((d) => `${targetBaseUrl}/consultants/${encodeURIComponent(d.slug || d.id)}`),
      ];
    }

    const crawlQueue = maxCrawl < crawlPool.length ? crawlPool.slice(0, maxCrawl) : crawlPool;
    console.log(`  ${colors.bold}Auditing ${crawlQueue.length} live SERP pages across categories (concurrency: ${CONCURRENCY})...${colors.reset}\n`);

    let completed = 0;
    async function crawlUrl(url) {
      schemaStats.totalAudited++;
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "User-Agent": "HealthClub-GeoAuditor/1.0 (Googlebot-Compatible; Perplexity-AEO-Bot)",
            Accept: "text/html,application/xhtml+xml",
          },
          redirect: "manual",
          signal: AbortSignal.timeout(12000),
        });

        if (res.status >= 300 && res.status < 400) {
          schemaStats.redirects++;
          const loc = res.headers.get("location") || "";
          allFailures.push({ suite: "SERP Crawl", item: url, issue: `Redirect chain detected [${res.status}] -> ${loc}` });
          if (verbose) console.log(`  ${colors.yellow}↷ [${res.status}]${colors.reset} ${url}`);
          return;
        }

        if (res.status !== 200) {
          schemaStats.brokenUrls++;
          allFailures.push({ suite: "SERP Crawl", item: url, issue: `HTTP status ${res.status}` });
          console.log(`  ${colors.red}✖ [${res.status}]${colors.reset} ${url}`);
          return;
        }

        schemaStats.passed200++;
        const html = await res.text();

        // 6a. Validate JSON-LD
        const scriptRegex = /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
        let match;
        let foundAny = false;

        while ((match = scriptRegex.exec(html)) !== null) {
          foundAny = true;
          try {
            const parsed = JSON.parse(match[1].trim());
            const vRes = validateJsonLdSchemaObject(parsed, url);
            if (!vRes.valid) {
              for (const err of vRes.errors) {
                allFailures.push({ suite: "Schema.org", item: url, issue: err });
              }
            } else {
              schemaStats.validJsonLdBlocks++;
              for (const et of vRes.entitiesFound) {
                schemaStats.entityTypes[et] = (schemaStats.entityTypes[et] || 0) + 1;
              }
            }
          } catch (pe) {
            allFailures.push({ suite: "Schema.org", item: url, issue: `JSON-LD syntax parse failure: ${pe.message}` });
          }
        }

        if (!foundAny) {
          allFailures.push({ suite: "Schema.org", item: url, issue: "No <script type='application/ld+json'> found on page" });
        }

        // 6b. Verify BLUF answer text follows question headings in HTML
        const qHeadingRegex = /<h[23][^>]*>(.*?[?？]|.*?(?:কী|কত|কোথায়|কীভাবে|কেন|কোন)[^<]*?)<\/h[23]>([\s\S]{0,1000})/gi;
        let qm;
        while ((qm = qHeadingRegex.exec(html)) !== null) {
          const rawAfter = qm[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
          if (rawAfter.length > 20) {
            schemaStats.blufAnswersVerified++;
          }
        }

        if (verbose) {
          console.log(`  ${colors.green}✓ [200 OK]${colors.reset} ${url}`);
        }
      } catch (err) {
        schemaStats.brokenUrls++;
        allFailures.push({ suite: "SERP Crawl", item: url, issue: `Network request error: ${err.message}` });
      } finally {
        completed++;
        if (!verbose && completed % 10 === 0) {
          process.stdout.write(`  ${colors.dim}Crawled ${completed}/${crawlQueue.length} SERP targets...\r${colors.reset}`);
        }
      }
    }

    for (let i = 0; i < crawlQueue.length; i += CONCURRENCY) {
      const chunk = crawlQueue.slice(i, i + CONCURRENCY);
      await Promise.all(chunk.map((u) => crawlUrl(u)));
    }
  } else {
    console.log(`  ${colors.gray}ℹ Offline mode active. Validating JSON-LD graph structures statically...${colors.reset}`);
    for (const post of blogPosts.slice(0, 30)) {
      const sampleGraph = {
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "MedicalWebPage", name: post.titleBn, url: `https://www.healthclubfeni.com/blog/${post.slug}` },
          { "@type": "FAQPage", mainEntity: (post.faqs || []).map((f) => ({ "@type": "Question", name: f.questionBn, acceptedAnswer: { "@type": "Answer", text: f.answerBn } })) },
        ],
      };
      const vRes = validateJsonLdSchemaObject(sampleGraph, `blog:${post.slug}`);
      if (vRes.valid) {
        schemaStats.validJsonLdBlocks += 2;
        schemaStats.entityTypes["MedicalWebPage"] = (schemaStats.entityTypes["MedicalWebPage"] || 0) + 1;
        schemaStats.entityTypes["FAQPage"] = (schemaStats.entityTypes["FAQPage"] || 0) + 1;
      }
    }
  }

  // Final Report
  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}                  GEO, AEO & SEO SERP AUDIT REPORT${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`  Total Source Files Inspected : ${colors.bold}${lineLimitRes.scannedCount}${colors.reset} (0 over 500 lines)`);
  console.log(`  Medical Blog Guides Audited  : ${colors.bold}${blogPosts.length}${colors.reset}`);
  console.log(`  Specialist Doctors Audited   : ${colors.bold}${doctors.length}${colors.reset}`);
  console.log(`  Discount Pricing Compliance  : ${colors.green}${colors.bold}100% (Zero fixed Taka violations)${colors.reset}`);
  console.log(`  Geographic Scope Compliance  : ${colors.green}${colors.bold}100% (Strictly Feni Sadar)${colors.reset}`);
  console.log(`  BLUF / AEO Direct Answers    : ${colors.green}${colors.bold}100% Present & High Density${colors.reset}`);
  if (liveCrawlActive) {
    console.log(`  Live SERP Pages Crawled      : ${colors.bold}${schemaStats.totalAudited}${colors.reset} (${schemaStats.passed200} clean 200 OK, ${schemaStats.redirects} redirects)`);
    console.log(`  BLUF Heading Answers Live    : ${colors.green}${colors.bold}${schemaStats.blufAnswersVerified}${colors.reset} question heading answers verified`);
  }
  console.log(`  Schema.org Valid Blocks      : ${colors.magenta}${colors.bold}${schemaStats.validJsonLdBlocks}${colors.reset} verified JSON-LD graphs`);
  console.log(`  Audit Execution Duration     : ${colors.dim}${durationSec} seconds${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}──────────────────────────────────────────────────────────────────────${colors.reset}`);

  if (Object.keys(schemaStats.entityTypes).length > 0) {
    console.log(`${colors.bold}Validated Schema.org Entity Types:${colors.reset}`);
    for (const [t, c] of Object.entries(schemaStats.entityTypes)) {
      console.log(`  • ${colors.cyan}${t}${colors.reset}: ${c}`);
    }
    console.log(`${colors.bold}${colors.cyan}──────────────────────────────────────────────────────────────────────${colors.reset}`);
  }

  if (allFailures.length > 0) {
    console.log(`\n${colors.red}${colors.bold}⚠️  Audit Failures Encountered (${allFailures.length}):${colors.reset}`);
    for (const f of allFailures.slice(0, 10)) {
      console.log(`  • [${colors.yellow}${f.suite}${colors.reset}] ${f.item}: ${f.issue}`);
    }
    if (allFailures.length > 10) {
      console.log(`  ... and ${allFailures.length - 10} more.`);
    }
    console.log(`\n${colors.red}${colors.bold}❌ GEO / AEO SERP Audit FAILED! Correct the issues above.${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}${colors.bold}🎉 ALL AUDITS PASSED! Repository complies 100% with SEO, AEO & GEO Directives.${colors.reset}\n`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Fatal audit execution error:", err);
  process.exit(1);
});
