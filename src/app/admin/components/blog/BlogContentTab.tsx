import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { toBanglaNums } from "@/lib/utils";

interface BlogContentTabProps {
  excerptBn: string;
  setExcerptBn: (val: string) => void;
  excerptEn: string;
  setExcerptEn: (val: string) => void;
  keyHighlightsBn: string[];
  setKeyHighlightsBn: (val: string[]) => void;
  introParagraphsBn: string[];
  setIntroParagraphsBn: (val: string[]) => void;
}

export function BlogContentTab({
  excerptBn,
  setExcerptBn,
  excerptEn,
  setExcerptEn,
  keyHighlightsBn,
  setKeyHighlightsBn,
  introParagraphsBn,
  setIntroParagraphsBn,
}: BlogContentTabProps) {
  return (
    <div className="space-y-4 pt-3">
      <div className="space-y-1.5">
        <Label htmlFor="excerptBn" className="text-xs font-semibold">
          বাংলা সারাংশ (সারসংক্ষেপ) *
        </Label>
        <Textarea
          id="excerptBn"
          value={excerptBn}
          onChange={(e) => setExcerptBn(e.target.value)}
          placeholder="ব্লগের সংক্ষিপ্ত পরিচয় যা কার্ডে ও গুগল সার্চে দেখাবে..."
          rows={2}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="excerptEn" className="text-xs font-semibold">
          English Excerpt *
        </Label>
        <Textarea
          id="excerptEn"
          value={excerptEn}
          onChange={(e) => setExcerptEn(e.target.value)}
          placeholder="Short summary for preview card and search engines..."
          rows={2}
          required
        />
      </div>

      {/* Key Highlights */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">
            মূল আকর্ষণ / হাইলাইটস (বাংলা পয়েন্ট)
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setKeyHighlightsBn([...keyHighlightsBn, ""])}
            className="h-7 text-xs gap-1"
          >
            <Plus className="h-3 w-3" />
            পয়েন্ট যোগ
          </Button>
        </div>
        {keyHighlightsBn.map((hl, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <Input
              value={hl}
              onChange={(e) => {
                const updated = [...keyHighlightsBn];
                updated[idx] = e.target.value;
                setKeyHighlightsBn(updated);
              }}
              placeholder={`হাইলাইট #${toBanglaNums(idx + 1)}...`}
              className="text-xs"
            />
            {keyHighlightsBn.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setKeyHighlightsBn(keyHighlightsBn.filter((_, i) => i !== idx))
                }
                className="h-8 w-8 text-destructive shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Main Paragraphs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">
            আর্টিকেলের মূল প্যারাগ্রাফসমূহ *
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIntroParagraphsBn([...introParagraphsBn, ""])}
            className="h-7 text-xs gap-1"
          >
            <Plus className="h-3 w-3" />
            প্যারা যোগ
          </Button>
        </div>
        {introParagraphsBn.map((p, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>অনুচ্ছেদ {toBanglaNums(idx + 1)}</span>
              {introParagraphsBn.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setIntroParagraphsBn(introParagraphsBn.filter((_, i) => i !== idx))
                  }
                  className="h-5 text-xs text-destructive p-0 px-1"
                >
                  মুছুন
                </Button>
              )}
            </div>
            <Textarea
              value={p}
              onChange={(e) => {
                const updated = [...introParagraphsBn];
                updated[idx] = e.target.value;
                setIntroParagraphsBn(updated);
              }}
              placeholder={`অনুচ্ছেদ #${toBanglaNums(idx + 1)} বিস্তারিত তথ্য...`}
              rows={3}
              className="text-xs"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
