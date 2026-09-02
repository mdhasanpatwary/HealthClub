import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Megaphone } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { SystemSettingsFormValues } from "@/lib/validations/settings";

interface NoticeSettingsCardProps {
  register: UseFormRegister<SystemSettingsFormValues>;
  noticeEnabled: boolean;
  setNoticeEnabled: (value: boolean) => void;
  noticeText: string;
  isEn: boolean;
}

export function NoticeSettingsCard({
  register,
  noticeEnabled,
  setNoticeEnabled,
  noticeText,
  isEn,
}: NoticeSettingsCardProps) {
  return (
    <Card className="border border-border shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-primary" />
          <span>{isEn ? "Website Notice Banner" : "ওয়েবসাইট নোটিশ ও ব্যানার"}</span>
        </CardTitle>
        <CardDescription className="text-xs">
          {isEn ? "Show announcement bar on top of all pages" : "ওয়েবসাইটের শীর্ষে বিশেষ অফার বা জরুরি নোটিশ প্রদর্শন"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
          <div className="space-y-0.5">
            <Label className="text-xs font-bold text-foreground">
              {isEn ? "Enable Global Notice Banner" : "ওয়েবসাইট নোটিশ ব্যানার চালু"}
            </Label>
            <p className="text-[11px] text-muted-foreground">
              {isEn ? "Show announcement bar to all visitors" : "চালু থাকলে ভিজিটররা সাইটের উপরে নোটিশ দেখতে পাবে"}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={noticeEnabled}
            onClick={() => setNoticeEnabled(!noticeEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              noticeEnabled ? "bg-primary" : "bg-muted-foreground/30"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                noticeEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {noticeEnabled && (
          <div className="space-y-2 animate-in fade-in duration-200">
            <Label htmlFor="notice-text" className="text-xs font-semibold">
              {isEn ? "Notice Banner Message" : "ব্যানারের বার্তা (টেক্সট)"}
            </Label>
            <Input
              id="notice-text"
              placeholder={isEn ? "e.g. Free Eye Camp on 25th August!" : "যেমন: আগামী ২৫ আগস্ট ফ্রি চক্ষু ক্যাম্প!"}
              {...register("notice_text")}
            />
            {noticeText.trim() && (
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs flex items-center justify-between gap-2 shadow-xs border border-emerald-500/30">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="p-1 rounded bg-white/20 text-amber-200 shrink-0">
                    <Megaphone className="size-3" />
                  </span>
                  <span className="truncate font-medium">{noticeText}</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-black/20 text-emerald-100 shrink-0">
                  {isEn ? "Preview" : "প্রিভিউ"}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
