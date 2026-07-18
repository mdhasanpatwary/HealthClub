"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ContactMessage } from "@/app/actions/contactActions";

interface ContactMessagesTabProps {
  messages: ContactMessage[];
  onDelete: (id: string) => void;
  t: (key: string) => string;
  locale: string;
}

export function ContactMessagesTab({
  messages,
  onDelete,
  t,
  locale,
}: ContactMessagesTabProps) {
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <Card className="border-border shadow-md">
      <CardHeader>
        <CardTitle className="font-heading text-lg font-bold text-secondary">
          {t("admin.dashboard.contactMessages")}
        </CardTitle>
        <CardDescription>
          {locale === "bn"
            ? "ব্যবহারকারীদের পাঠানো যোগাযোগের তথ্যের তালিকা"
            : "List of contact messages sent by visitors"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden border border-border rounded-xl bg-background">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="font-semibold text-secondary w-[200px]">
                  {t("admin.dashboard.senderName")}
                </TableHead>
                <TableHead className="font-semibold text-secondary w-[180px]">
                  {t("admin.dashboard.senderPhone")}
                </TableHead>
                <TableHead className="font-semibold text-secondary w-[200px]">
                  {t("admin.dashboard.senderEmail")}
                </TableHead>
                <TableHead className="font-semibold text-secondary">
                  {t("admin.dashboard.senderMessage")}
                </TableHead>
                <TableHead className="font-semibold text-secondary w-[180px]">
                  {t("admin.dashboard.sentDate")}
                </TableHead>
                <TableHead className="font-semibold text-secondary text-right w-[80px]">
                  {t("admin.dashboard.action")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {t("admin.dashboard.noMessages")}
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((msg) => (
                  <TableRow key={msg.id} className="hover:bg-muted/20 border-b border-border/60">
                    <TableCell className="font-bold text-secondary">
                      {msg.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-secondary">
                      {msg.phone}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {msg.email || "-"}
                    </TableCell>
                    <TableCell className="text-sm text-secondary whitespace-pre-wrap max-w-md break-words">
                      {msg.message}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(msg.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(msg.id)}
                        className="text-destructive hover:bg-destructive/10 h-8 w-8 rounded-lg"
                        title={t("admin.dashboard.delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
