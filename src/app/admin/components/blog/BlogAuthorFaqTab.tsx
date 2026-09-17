import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface FAQItem {
  questionBn: string;
  questionEn: string;
  answerBn: string;
  answerEn: string;
}

interface BlogAuthorFaqTabProps {
  isEn: boolean;
  authorNameBn: string;
  setAuthorNameBn: (val: string) => void;
  authorNameEn: string;
  setAuthorNameEn: (val: string) => void;
  authorRoleBn: string;
  setAuthorRoleBn: (val: string) => void;
  authorRoleEn: string;
  setAuthorRoleEn: (val: string) => void;
  faqs: FAQItem[];
  setFaqs: (val: FAQItem[]) => void;
}

export function BlogAuthorFaqTab({
  isEn,
  authorNameBn,
  setAuthorNameBn,
  authorNameEn,
  setAuthorNameEn,
  authorRoleBn,
  setAuthorRoleBn,
  authorRoleEn,
  setAuthorRoleEn,
  faqs,
  setFaqs,
}: BlogAuthorFaqTabProps) {
  return (
    <div className="space-y-4 pt-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="authorBn" className="text-xs font-semibold">
            {isEn ? "Author Name (Bangla)" : "লেখকের নাম (বাংলা)"}
          </Label>
          <Input
            id="authorBn"
            value={authorNameBn}
            onChange={(e) => setAuthorNameBn(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="authorEn" className="text-xs font-semibold">
            {isEn ? "Author Name (English)" : "Author Name (English)"}
          </Label>
          <Input
            id="authorEn"
            value={authorNameEn}
            onChange={(e) => setAuthorNameEn(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="authorRoleBn" className="text-xs font-semibold">
            {isEn ? "Author Role (Bangla)" : "লেখকের পদবি (বাংলা)"}
          </Label>
          <Input
            id="authorRoleBn"
            value={authorRoleBn}
            onChange={(e) => setAuthorRoleBn(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="authorRoleEn" className="text-xs font-semibold">
            {isEn ? "Author Role (English)" : "Author Role (English)"}
          </Label>
          <Input
            id="authorRoleEn"
            value={authorRoleEn}
            onChange={(e) => setAuthorRoleEn(e.target.value)}
          />
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">
            {isEn ? "Frequently Asked Questions (FAQs)" : "সাধারণ জিজ্ঞাসা ও উত্তর (FAQ)"}
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setFaqs([
                ...faqs,
                { questionBn: "", questionEn: "", answerBn: "", answerEn: "" },
              ])
            }
            className="h-7 text-xs gap-1"
          >
            <Plus className="h-3 w-3" />
            {isEn ? "Add FAQ" : "প্রশ্ন যোগ"}
          </Button>
        </div>
        {faqs.length === 0 && (
          <p className="text-xs text-muted-foreground italic">
            {isEn ? "No FAQs added yet." : "কোনো FAQ যোগ করা হয়নি।"}
          </p>
        )}
        {faqs.map((faq, idx) => (
          <div key={idx} className="p-3 border rounded-xl bg-muted/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">
                {isEn ? `FAQ #${idx + 1}` : `প্রশ্নোত্তর #${idx + 1}`}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                className="h-6 w-6 text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                value={faq.questionBn}
                onChange={(e) => {
                  const updated = [...faqs];
                  updated[idx].questionBn = e.target.value;
                  setFaqs(updated);
                }}
                placeholder="প্রশ্ন (বাংলা)..."
                className="text-xs"
              />
              <Input
                value={faq.questionEn}
                onChange={(e) => {
                  const updated = [...faqs];
                  updated[idx].questionEn = e.target.value;
                  setFaqs(updated);
                }}
                placeholder="Question (English)..."
                className="text-xs"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Textarea
                value={faq.answerBn}
                onChange={(e) => {
                  const updated = [...faqs];
                  updated[idx].answerBn = e.target.value;
                  setFaqs(updated);
                }}
                placeholder="উত্তর (বাংলা)..."
                rows={2}
                className="text-xs"
              />
              <Textarea
                value={faq.answerEn}
                onChange={(e) => {
                  const updated = [...faqs];
                  updated[idx].answerEn = e.target.value;
                  setFaqs(updated);
                }}
                placeholder="Answer (English)..."
                rows={2}
                className="text-xs"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
