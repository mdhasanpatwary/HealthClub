import { PregnancyDueDateTool } from "@/components/health-tools/PregnancyDueDateTool";
import { BloodPressureCategoryTool } from "@/components/health-tools/BloodPressureCategoryTool";
import { BmiCategoryTool } from "@/components/health-tools/BmiCategoryTool";

export type EmbeddedToolType = "bmi" | "pregnancy-due-date" | "blood-pressure";

interface BlogEmbeddedToolProps {
  tool?: EmbeddedToolType;
  slug?: string;
  category?: string;
}

/**
 * Intelligent tool resolver: If post has explicit embeddedTool, use it.
 * Otherwise, inspect slug and topic to automatically embed the relevant calculator.
 */
export function resolveEmbeddedTool(
  tool?: string,
  slug?: string,
  category?: string
): EmbeddedToolType | null {
  if (
    tool === "pregnancy-due-date" ||
    tool === "blood-pressure" ||
    tool === "bmi"
  ) {
    return tool as EmbeddedToolType;
  }

  if (!slug) return null;
  const s = slug.toLowerCase();
  const c = (category || "").toLowerCase();

  // Pregnancy / Maternity / Obstetric / Anomaly scan
  if (
    s.includes("pregnancy") ||
    s.includes("ultrason") ||
    s.includes("maternity") ||
    s.includes("cesarean") ||
    s.includes("delivery") ||
    s.includes("gynecology") ||
    c.includes("maternal") ||
    c.includes("pregnancy")
  ) {
    return "pregnancy-due-date";
  }

  // Cardiac / Blood pressure / Heart / Stroke / CCU / ECG-Echo
  if (
    s.includes("cardiac") ||
    s.includes("heart") ||
    s.includes("stroke") ||
    s.includes("blood-pressure") ||
    s.includes("hypertension") ||
    s.includes("ecg-echo") ||
    s.includes("ccu") ||
    c.includes("cardiac")
  ) {
    return "blood-pressure";
  }

  // Full body / Checkup / Diabetes / Thyroid / General wellness
  if (
    s.includes("full-body") ||
    s.includes("checkup") ||
    s.includes("diabetes") ||
    s.includes("thyroid") ||
    s.includes("bmi") ||
    s.includes("lipid") ||
    c.includes("checkup")
  ) {
    return "bmi";
  }

  return null;
}

export function BlogEmbeddedTool({
  tool,
  slug,
  category,
}: BlogEmbeddedToolProps) {
  const activeTool = resolveEmbeddedTool(tool, slug, category);

  if (!activeTool) return null;

  return (
    <section
      id="interactive-health-tool"
      aria-label="ইন্টারেক্টিভ হেলথ ক্যালকুলেটর"
      className="scroll-mt-24 pt-2 pb-1"
    >
      {activeTool === "pregnancy-due-date" && <PregnancyDueDateTool />}
      {activeTool === "blood-pressure" && <BloodPressureCategoryTool />}
      {activeTool === "bmi" && <BmiCategoryTool />}
    </section>
  );
}
