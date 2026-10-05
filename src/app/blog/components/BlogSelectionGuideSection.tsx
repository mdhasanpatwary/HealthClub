import { toBanglaNums } from "@/lib/utils";
import { BlogPost } from "@/types/blog";
import {
  formatAeoSelectionHeading,
  getSelectionDirectAnswer,
} from "@/app/blog/utils/blogAeoHeadingUtils";

interface BlogSelectionGuideSectionProps {
  selectionGuide: NonNullable<BlogPost["selectionGuideBn"]>;
  post: BlogPost;
  sectionNumber: number;
}

export function BlogSelectionGuideSection({
  selectionGuide,
  post,
  sectionNumber,
}: BlogSelectionGuideSectionProps) {
  const rawList: unknown[] = (
    selectionGuide.pointsBn ||
    (selectionGuide as unknown as { criteria?: unknown[] }).criteria ||
    (selectionGuide as unknown as { points?: unknown[] }).points ||
    []
  );

  return (
    <section id="selection-guide" className="scroll-mt-24 space-y-5">
      <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
        {`${toBanglaNums(sectionNumber)}. `}
        {formatAeoSelectionHeading(selectionGuide.titleBn)}
      </h2>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {getSelectionDirectAnswer(post)}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rawList.map((rawPt, idx) => {
          const isString = typeof rawPt === "string";
          const colonIdx = isString
            ? (rawPt.indexOf(":") !== -1 ? rawPt.indexOf(":") : rawPt.indexOf("ঃ"))
            : -1;
          const pt = !isString && typeof rawPt === "object" && rawPt !== null
            ? (rawPt as Record<string, unknown>)
            : null;

          let title = isString
            ? (colonIdx !== -1 ? rawPt.slice(0, colonIdx).trim() : rawPt.trim())
            : String(pt?.title || pt?.titleBn || pt?.point || pt?.criterionBn || "").trim();

          let desc = isString
            ? (colonIdx !== -1 ? rawPt.slice(colonIdx + 1).trim() : "")
            : String(pt?.desc || pt?.descBn || pt?.description || pt?.descriptionBn || pt?.detail || "").trim();

          if (!desc && title) {
            const titleColonIdx = title.indexOf(":") !== -1 ? title.indexOf(":") : title.indexOf("ঃ");
            if (titleColonIdx !== -1) {
              desc = title.slice(titleColonIdx + 1).trim();
              title = title.slice(0, titleColonIdx).trim();
            }
          }

          return (
            <div
              key={idx}
              className="rounded-2xl border border-border/80 bg-card p-5 space-y-2"
            >
              <h3 className="font-heading text-base font-bold text-primary flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                <span>{title}</span>
              </h3>
              {desc ? (
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
