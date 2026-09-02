import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Receipt } from "lucide-react";

interface MemberTxSettingsCardProps {
  allowMemberTx: boolean;
  setAllowMemberTx: (value: boolean) => void;
  isEn: boolean;
}

export function MemberTxSettingsCard({
  allowMemberTx,
  setAllowMemberTx,
  isEn,
}: MemberTxSettingsCardProps) {
  return (
    <Card className="border border-border shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Receipt className="h-4 w-4 text-primary" />
            <span>{isEn ? "Member Self-Transaction Entry" : "মেম্বারদের স্বয়ংক্রিয় লেনদেন এন্ট্রি সুবিধা"}</span>
          </CardTitle>
          <span
            className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              allowMemberTx
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
            }`}
          >
            {allowMemberTx ? (isEn ? "Enabled" : "চালু রয়েছে") : isEn ? "Disabled" : "বন্ধ রয়েছে"}
          </span>
        </div>
        <CardDescription className="text-xs">
          {isEn
            ? "Allow members to record discount transactions directly from their own dashboard"
            : "চালু থাকলে মেম্বাররা তাদের নিজ ড্যাশবোর্ড থেকে ডিসকাউন্ট লেনদেন যুক্ত করতে পারবেন।"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/50 border border-border">
          <div className="space-y-0.5 pr-3">
            <Label className="text-xs font-bold text-foreground">
              {isEn ? "Allow Member Self-Transactions" : "মেম্বার স্বয়ংক্রিয় লেনদেন অনুমতি"}
            </Label>
            <p className="text-[11px] text-muted-foreground">
              {isEn
                ? "Allows members to add discounts manually from member dashboard"
                : "মেম্বাররা নিজে ড্যাশবোর্ড থেকে ডিসকাউন্ট লেনদেন এন্ট্রি দিতে পারবে"}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={allowMemberTx}
            onClick={() => setAllowMemberTx(!allowMemberTx)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              allowMemberTx ? "bg-primary" : "bg-muted-foreground/30"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                allowMemberTx ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
