import Link from "next/link";

interface BlogMarkdownParagraphsProps {
  paragraphs: string[];
}

export function BlogMarkdownParagraphs({ paragraphs }: BlogMarkdownParagraphsProps) {
  if (!paragraphs || paragraphs.length === 0) return null;

  return (
    <div className="space-y-4 text-sm sm:text-base text-foreground/90 leading-relaxed">
      {paragraphs.map((p, idx) => {
        const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(p)) !== null) {
          if (match.index > lastIndex) {
            parts.push(p.substring(lastIndex, match.index));
          }
          const [, label, href] = match;
          parts.push(
            <Link
              key={`${href}-${match.index}`}
              href={href}
              className="font-semibold text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
            >
              {label}
            </Link>
          );
          lastIndex = regex.lastIndex;
        }

        if (lastIndex < p.length) {
          parts.push(p.substring(lastIndex));
        }

        return <p key={idx}>{parts.length > 0 ? parts : p}</p>;
      })}
    </div>
  );
}
