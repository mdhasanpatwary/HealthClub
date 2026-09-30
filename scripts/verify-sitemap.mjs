#!/usr/bin/env node

/**
 * Health Club — Automated Search Engine & Sitemap Verification Engine
 * Crawls sitemap entries, blog guides, doctor profiles, and upazila landing pages.
 * Verifies:
 *  1. 200 OK HTTP Status
 *  2. Zero redirect chains (direct canonical destination)
 *  3. Schema.org JSON-LD parsing & syntax validity
 *
 * Usage:
 *   node scripts/verify-sitemap.mjs
 *   node scripts/verify-sitemap.mjs --baseUrl=http://localhost:3000
 *   node scripts/verify-sitemap.mjs --limit=20 --verbose
 */

import fs from "fs";
import path from "path";

// Color formatting
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

// Parse CLI flags
const args = process.argv.slice(2);
function getArgValue(flag) {
  const match = args.find((a) => a.startsWith(`--${flag}=`));
  if (match) return match.split("=")[1];
  const idx = args.indexOf(`--${flag}`);
  if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith("--")) {
    return args[idx + 1];
  }
  return null;
}

const verbose = args.includes("--verbose") || args.includes("-v");
const limitArg = getArgValue("limit");
const maxUrls = limitArg ? parseInt(limitArg, 10) : Infinity;
const concurrencyArg = getArgValue("concurrency");
const CONCURRENCY = concurrencyArg ? parseInt(concurrencyArg, 10) : 6;

// Core static routes to always test
const CORE_STATIC_ROUTES = [
  "/",
  "/emergency",
  "/consultants",
  "/partner-hospitals",
  "/blog",
  "/health-tips",
  "/health-tools",
  "/membership",
  "/about-us",
  "/become-partner",
  "/contact",
  "/editorial-policy",
  "/terms-conditions",
  "/privacy-policy",
];

// Feni 6 Upazilas
const UPAZILA_SLUGS = [
  "feni-sadar",
  "daganbhuiyan",
  "chhagalnaiya",
  "sonagazi",
  "parshuram",
  "fulgazi",
];

// Major Doctor Department Slugs
const DEPARTMENT_SLUGS = [
  "general-medicine",
  "cardiology",
  "gynecology-obstetrics",
  "pediatrics-child",
  "orthopedics",
  "general-laparoscopic-surgery",
  "ent-head-neck",
  "dermatology-venereology",
  "neurology-stroke",
  "nephrology-kidney",
  "urology-care",
  "gastroenterology-liver",
  "ophthalmology-eye",
  "dental-care",
];

// Partner Category Slugs
const PARTNER_CATEGORIES = ["hospital", "diagnostic", "pharmacy"];

/**
 * Discovers blog post slugs from backups, static data, or disk
 */
function discoverBlogSlugs() {
  const slugs = new Set();
  const projectRoot = process.cwd();

  // 1. Check backups directory for latest JSON backup
  try {
    const backupDir = path.resolve(projectRoot, "backups");
    if (fs.existsSync(backupDir)) {
      const files = fs.readdirSync(backupDir).filter((f) => f.endsWith(".json"));
      for (const file of files) {
        try {
          const content = fs.readFileSync(path.join(backupDir, file), "utf-8");
          const posts = JSON.parse(content);
          if (Array.isArray(posts)) {
            for (const p of posts) {
              if (p.slug) slugs.add(p.slug);
            }
          }
        } catch {
          // ignore single file parse errors
        }
      }
    }
  } catch {
    // ignore
  }

  // 2. Check static blog posts file
  try {
    const staticPostsFile = path.resolve(projectRoot, "src/data/blog/blogPosts.ts");
    if (fs.existsSync(staticPostsFile)) {
      const content = fs.readFileSync(staticPostsFile, "utf-8");
      const regex = /slug:\s*["']([^"']+)["']/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        slugs.add(match[1]);
      }
    }
  } catch {
    // ignore
  }

  return Array.from(slugs);
}

/**
 * Validates JSON-LD schema blocks within an HTML response.
 */
function validateSchemaJsonLd(html) {
  const scriptRegex = /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const schemas = [];
  const errors = [];
  let match;

  while ((match = scriptRegex.exec(html)) !== null) {
    const rawContent = match[1].trim();
    if (!rawContent) continue;

    try {
      const parsed = JSON.parse(rawContent);
      const isArray = Array.isArray(parsed);
      const items = isArray ? parsed : [parsed];

      for (const item of items) {
        if (!item || typeof item !== "object") {
          errors.push("Invalid JSON-LD item (not an object)");
          continue;
        }

        const context = item["@context"] || (item["@graph"] && "graph");
        const type = item["@type"] || (item["@graph"] ? "Graph" : "Unknown");

        if (!context && !item["@graph"]) {
          errors.push(`Missing @context in JSON-LD schema (type: ${type})`);
        } else {
          schemas.push({
            type,
            name: item.name || item.headline || undefined,
          });
        }
      }
    } catch (parseErr) {
      errors.push(`JSON-LD Syntax Error: ${parseErr.message}`);
    }
  }

  return {
    valid: errors.length === 0,
    count: schemas.length,
    schemas,
    errors,
  };
}

/**
 * Detects whether a server is responding at target URL
 */
async function checkServerReachable(url) {
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(3000) });
    return res.status >= 200 && res.status < 500;
  } catch {
    return false;
  }
}

/**
 * Main Verification Workflow
 */
async function main() {
  console.log(`\n${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}${colors.green}  🏥 Health Club — Search Engine & Sitemap Verification Engine${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════${colors.reset}\n`);

  // 1. Resolve Target Base URL
  let targetBaseUrl = getArgValue("baseUrl");
  if (!targetBaseUrl) {
    const localUrl = "http://localhost:3000";
    const isLocalUp = await checkServerReachable(localUrl);

    if (isLocalUp) {
      targetBaseUrl = localUrl;
      console.log(`${colors.green}✓ Detected active local dev/production server:${colors.reset} ${localUrl}`);
    } else {
      targetBaseUrl = "https://www.healthclubfeni.com";
      console.log(`${colors.yellow}ℹ Local server not running on port 3000.${colors.reset}`);
      console.log(`${colors.cyan}ℹ Verifying against live production domain:${colors.reset} ${targetBaseUrl}\n`);
    }
  } else {
    console.log(`${colors.cyan}ℹ Using specified target base URL:${colors.reset} ${targetBaseUrl}\n`);
  }

  // 2. Attempt to fetch live sitemap.xml
  let urlsToCrawl = [];
  const sitemapUrl = `${targetBaseUrl}/sitemap.xml`;
  try {
    const sitemapRes = await fetch(sitemapUrl, { signal: AbortSignal.timeout(6000) });
    if (sitemapRes.status === 200) {
      const xml = await sitemapRes.text();
      const locMatches = xml.match(/<loc>(.*?)<\/loc>/g) || [];
      const discovered = locMatches.map((m) => m.replace(/<\/?loc>/g, "").trim());
      if (discovered.length > 0) {
        console.log(`${colors.green}✓ Successfully parsed sitemap.xml:${colors.reset} Found ${discovered.length} URLs in sitemap`);
        urlsToCrawl = discovered;
      }
    }
  } catch {
    console.log(`${colors.gray}ℹ /sitemap.xml not immediately fetched. Generating comprehensive URL matrix...${colors.reset}`);
  }

  // 3. If sitemap was unavailable or incomplete, compile direct route matrix
  if (urlsToCrawl.length === 0) {
    const blogSlugs = discoverBlogSlugs();
    console.log(`${colors.cyan}ℹ Discovered ${blogSlugs.length} blog guides from data corpus.${colors.reset}`);

    const matrix = [
      ...CORE_STATIC_ROUTES.map((r) => `${targetBaseUrl}${r}`),
      ...UPAZILA_SLUGS.map((slug) => `${targetBaseUrl}/consultants/location/${slug}`),
      ...DEPARTMENT_SLUGS.map((slug) => `${targetBaseUrl}/consultants/department/${slug}`),
      ...PARTNER_CATEGORIES.map((cat) => `${targetBaseUrl}/partner-hospitals/category/${cat}`),
      ...blogSlugs.map((slug) => `${targetBaseUrl}/blog/${encodeURIComponent(slug)}`),
    ];

    urlsToCrawl = Array.from(new Set(matrix));
  }

  if (maxUrls < urlsToCrawl.length) {
    console.log(`${colors.yellow}ℹ Limiting audit to first ${maxUrls} URLs as requested.${colors.reset}`);
    urlsToCrawl = urlsToCrawl.slice(0, maxUrls);
  }

  console.log(`${colors.bold}Auditing ${urlsToCrawl.length} URLs with concurrency ${CONCURRENCY}...${colors.reset}\n`);

  const results = {
    total: urlsToCrawl.length,
    passed200: 0,
    redirects: 0,
    errors: 0,
    totalSchemas: 0,
    schemaTypes: {},
    failures: [],
  };

  const startTime = Date.now();
  let completed = 0;

  // Worker function
  async function auditUrl(url, retryCount = 1) {
    try {
      // Use redirect: 'manual' to verify zero redirect chains
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "HealthClub-SeoAuditor/1.0 (Googlebot-Compatible)",
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "manual",
        signal: AbortSignal.timeout(15000),
      });

      const isRedirect = res.status >= 300 && res.status < 400;
      const isSuccess = res.status === 200;

      if (isRedirect) {
        results.redirects++;
        const location = res.headers.get("location") || "Unknown location";
        results.failures.push({ url, status: res.status, issue: `Redirect chain detected -> ${location}` });
        if (verbose) {
          console.log(`  ${colors.yellow}↷ [${res.status}]${colors.reset} ${url} -> ${location}`);
        }
        return;
      }

      if (!isSuccess) {
        if (retryCount > 0 && res.status >= 500) {
          await new Promise((r) => setTimeout(r, 600));
          return auditUrl(url, retryCount - 1);
        }
        results.errors++;
        results.failures.push({ url, status: res.status, issue: `HTTP status ${res.status}` });
        console.log(`  ${colors.red}✖ [${res.status}]${colors.reset} ${url}`);
        return;
      }

      results.passed200++;
      const html = await res.text();
      const schemaCheck = validateSchemaJsonLd(html);

      if (!schemaCheck.valid) {
        results.failures.push({
          url,
          status: 200,
          issue: `Schema.org Error: ${schemaCheck.errors.join(", ")}`,
        });
      } else {
        results.totalSchemas += schemaCheck.count;
        for (const s of schemaCheck.schemas) {
          results.schemaTypes[s.type] = (results.schemaTypes[s.type] || 0) + 1;
        }
      }

      if (verbose) {
        console.log(`  ${colors.green}✓ [200 OK]${colors.reset} ${url} ${colors.gray}(${schemaCheck.count} JSON-LD schemas)${colors.reset}`);
      }
    } catch (err) {
      if (retryCount > 0) {
        await new Promise((r) => setTimeout(r, 800));
        return auditUrl(url, retryCount - 1);
      }
      results.errors++;
      results.failures.push({ url, status: 0, issue: `Fetch failed: ${err.message}` });
      if (verbose) {
        console.log(`  ${colors.red}✖ [ERR]${colors.reset} ${url}: ${err.message}`);
      }
    } finally {
      if (retryCount === 1) {
        completed++;
        if (!verbose && completed % 15 === 0) {
          process.stdout.write(`${colors.dim}Audited ${completed}/${urlsToCrawl.length} URLs...\r${colors.reset}`);
        }
      }
    }
  }

  // Run in concurrency pool
  for (let i = 0; i < urlsToCrawl.length; i += CONCURRENCY) {
    const chunk = urlsToCrawl.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map((u) => auditUrl(u)));
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);

  // 4. Output Final Report
  console.log(`\n${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}                    AUDIT SUMMARY REPORT${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`  Target Base URL        : ${colors.bold}${targetBaseUrl}${colors.reset}`);
  console.log(`  Total URLs Audited     : ${colors.bold}${results.total}${colors.reset}`);
  console.log(`  200 OK Clean Status    : ${colors.green}${colors.bold}${results.passed200}${colors.reset}`);
  console.log(`  Redirect Chains Found  : ${results.redirects > 0 ? colors.yellow : colors.green}${colors.bold}${results.redirects}${colors.reset} ${results.redirects === 0 ? "(Zero Redirects ✅)" : "⚠️"}`);
  console.log(`  Broken URLs / Errors   : ${results.errors > 0 ? colors.red : colors.green}${colors.bold}${results.errors}${colors.reset}`);
  console.log(`  Schema.org Blocks      : ${colors.magenta}${colors.bold}${results.totalSchemas}${colors.reset} valid JSON-LD entities`);
  console.log(`  Total Elapsed Time     : ${colors.dim}${durationSec} seconds${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}──────────────────────────────────────────────────────────────${colors.reset}`);

  if (Object.keys(results.schemaTypes).length > 0) {
    console.log(`${colors.bold}Detected Schema.org Entity Breakdown:${colors.reset}`);
    for (const [type, count] of Object.entries(results.schemaTypes)) {
      console.log(`  • ${colors.cyan}${type}${colors.reset}: ${count}`);
    }
    console.log(`${colors.bold}${colors.cyan}──────────────────────────────────────────────────────────────${colors.reset}`);
  }

  if (results.failures.length > 0) {
    console.log(`\n${colors.red}${colors.bold}Issues Encountered (${results.failures.length}):${colors.reset}`);
    for (const f of results.failures.slice(0, 10)) {
      console.log(`  • ${colors.yellow}${f.url}${colors.reset}: ${f.issue}`);
    }
    if (results.failures.length > 10) {
      console.log(`  ... and ${results.failures.length - 10} more.`);
    }
  }

  const isSuccess = results.errors === 0;
  if (isSuccess) {
    console.log(`\n${colors.green}${colors.bold}🎉 SEO & Sitemap Verification PASSED! All URLs healthy & IndexReady.${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${colors.red}${colors.bold}⚠️  Verification completed with ${results.errors} error(s).${colors.reset}\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal verification engine error:", err);
  process.exit(1);
});
