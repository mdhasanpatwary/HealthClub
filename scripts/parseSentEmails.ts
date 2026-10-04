import tls from "tls";
import fs from "fs";
import dotenv from "dotenv";

const env = dotenv.parse(fs.readFileSync(".env"));
const user = env.SMTP_USER;
const pass = (env.SMTP_PASSWORD || "").replace(/\s+/g, "");

function decodeQuotedPrintableUtf8(str: string): string {
  const clean = str.replace(/=\r?\n/g, "");
  const bytes: number[] = [];
  for (let i = 0; i < clean.length; i++) {
    if (clean[i] === "=" && i + 2 < clean.length && /^[0-9A-Fa-f]{2}$/.test(clean.substring(i + 1, i + 3))) {
      bytes.push(parseInt(clean.substring(i + 1, i + 3), 16));
      i += 2;
    } else {
      bytes.push(clean.charCodeAt(i));
    }
  }
  return Buffer.from(bytes).toString("utf-8");
}

function decodeBase64Header(str: string): string {
  return str.replace(/=\?UTF-8\?B\?([^?]+)\?=/gi, (_, b64) => {
    try {
      return Buffer.from(b64, "base64").toString("utf-8");
    } catch {
      return _;
    }
  });
}

interface SentRecord {
  seq: number;
  date: string;
  to: string;
  name: string;
  subject: string;
}

async function fetchSentEmails(): Promise<SentRecord[]> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(993, "imap.gmail.com", { rejectUnauthorized: false });
    let step = 0;
    let buffer = "";
    const records: SentRecord[] = [];

    socket.on("data", (data) => {
      buffer += data.toString("binary");

      if (step === 0 && buffer.includes("* OK")) {
        step = 1;
        buffer = "";
        socket.write(`a001 LOGIN "${user}" "${pass}"\r\n`);
      } else if (step === 1 && buffer.includes("a001 OK")) {
        step = 2;
        buffer = "";
        socket.write(`a002 SELECT "[Gmail]/Sent Mail"\r\n`);
      } else if (step === 2 && buffer.includes("a002 OK")) {
        step = 3;
        buffer = "";
        socket.write(`a003 SEARCH SINCE 24-Aug-2026\r\n`);
      } else if (step === 3 && buffer.includes("a003 OK")) {
        const searchMatch = buffer.match(/\* SEARCH ([\d\s]+)/);
        const uids = searchMatch ? searchMatch[1].trim().split(/\s+/) : [];
        console.log(`Found ${uids.length} messages sent since Aug 24, 2026.`);
        if (uids.length === 0) {
          socket.end();
          resolve([]);
          return;
        }

        step = 4;
        buffer = "";
        // Fetch full body of all messages in range
        const range = `${uids[0]}:${uids[uids.length - 1]}`;
        socket.write(`a004 FETCH ${range} (BODY[])\r\n`);
      } else if (step === 4 && buffer.includes("a004 OK")) {
        // Parse individual FETCH responses
        const messageParts = buffer.split(/\* \d+ FETCH \(BODY\[\]/);

        for (const part of messageParts) {
          if (!part || !part.includes("From:")) continue;

          const toMatch = part.match(/\nTo:\s*([^\r\n]+)/i);
          const dateMatch = part.match(/\nDate:\s*([^\r\n]+)/i);
          const subjMatch = part.match(/\nSubject:\s*([^\r\n]+(?:\r?\n\s+[^\r\n]+)*)/i);

          const decodedBody = decodeQuotedPrintableUtf8(part);
          const nameMatch = decodedBody.match(/প্রিয়\s*(?:&lt;strong&gt;|<strong>)?\s*([^<&\r\n]+)/);

          const to = toMatch ? toMatch[1].trim() : "";
          const date = dateMatch ? dateMatch[1].trim() : "";
          const subject = subjMatch ? decodeBase64Header(subjMatch[1].replace(/\r?\n\s+/g, "")) : "";
          const name = nameMatch ? nameMatch[1].trim() : "";

          if (to && (subject.includes("ভেরিফিকেশন") || subject.includes("Verification") || name)) {
            records.push({
              seq: records.length + 1,
              date,
              to,
              name,
              subject,
            });
          }
        }

        socket.end();
        resolve(records);
      }
    });

    socket.on("error", (err) => {
      reject(err);
    });
  });
}

async function main() {
  const records = await fetchSentEmails();
  console.log(`\n======================================================`);
  console.log(`Extracted ${records.length} member verification emails:`);
  console.log(`======================================================`);
  records.forEach((r, idx) => {
    console.log(`${idx + 1}. Date: ${r.date} | Email: ${r.to} | Name: "${r.name}" | Subject: ${r.subject}`);
  });

  fs.writeFileSync(
    "scratch/sent_verification_emails.json",
    JSON.stringify(records, null, 2)
  );
  console.log("\nSaved to scratch/sent_verification_emails.json");
}

main().catch(console.error);
