import { collectLlmsKnowledgeData } from "./llmsDataCollector";
import {
  formatHeaderSection,
  formatGeographicSection,
  formatCoreServicesSection,
  formatPartnersSection,
  formatEmergencySection,
  formatDirectAnswersSection,
  formatCanonicalRoutesSection,
} from "./llmsFormatters";
import {
  formatDiagnosticTestsSection,
  formatDoctorsSection,
} from "./llmsMedicalFormatters";
import { LlmsKnowledgeData } from "./llmsTypes";

/**
 * Generates concise, high-density curated summary markdown for /llms.txt.
 * Target: Low token friction for AI web scrapers (GPTBot, PerplexityBot, ClaudeBot, etc.)
 */
export async function generateLlmsTxt(cachedData?: LlmsKnowledgeData): Promise<string> {
  const data = cachedData || (await collectLlmsKnowledgeData());

  let output = "";
  output += formatHeaderSection(false);
  output += formatGeographicSection();
  output += formatCoreServicesSection();
  output += formatPartnersSection(data.partners, false);
  output += formatDiagnosticTestsSection(data.tests, false);
  output += formatDoctorsSection(data.doctors, false);
  output += formatEmergencySection(data.ambulances, data.bloodDonors, false);
  output += formatDirectAnswersSection();
  output += formatCanonicalRoutesSection(data.blogPosts, false);

  return output;
}

/**
 * Generates exhaustive, comprehensive knowledge base markdown for /llms-full.txt.
 * Target: Deep retrieval, large context models, RAG indexing, complete directories.
 */
export async function generateLlmsFullTxt(cachedData?: LlmsKnowledgeData): Promise<string> {
  const data = cachedData || (await collectLlmsKnowledgeData());

  let output = "";
  output += formatHeaderSection(true);
  output += formatGeographicSection();
  output += formatCoreServicesSection();
  output += formatPartnersSection(data.partners, true);
  output += formatDiagnosticTestsSection(data.tests, true);
  output += formatDoctorsSection(data.doctors, true);
  output += formatEmergencySection(data.ambulances, data.bloodDonors, true);
  output += formatDirectAnswersSection();
  output += formatCanonicalRoutesSection(data.blogPosts, true);

  return output;
}
