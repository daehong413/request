import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { Inquiry, inquiryEmailBody, validateInquiry } from "@/lib/contact";
import { siteConfig } from "@/lib/site-config";
import { getSiteOrigin } from "@/lib/seo";
import { inquiryEmailHtml } from "@/lib/contact-email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  // Allow the origin serving this form, including localhost and preview URLs.
  // Also allow the public origin when a reverse proxy terminates HTTPS.
  const allowedOrigins = new Set([new URL(request.url).origin, getSiteOrigin()]);
  if (origin && !allowedOrigins.has(origin)) {
    return NextResponse.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 415 });
  }

  let data: Inquiry;
  try {
    // Bound the body before JSON parsing, including requests without Content-Length.
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Missing body");
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 16_384) {
        await reader.cancel();
        return NextResponse.json({ error: "문의 내용이 너무 깁니다." }, { status: 413 });
      }
      chunks.push(value);
    }
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    const limits = { address: 200, size: 30, scope: 30, name: 50, phone: 20, message: 2000 };
    if (!body || typeof body !== "object" || body.confirmed !== true ||
      Object.entries(limits).some(([key, limit]) =>
        typeof body[key] !== "string" || body[key].length > limit)) {
      throw new Error("Invalid fields");
    }
    data = body;
    if (Object.keys({ ...validateInquiry(data, 0), ...validateInquiry(data, 1) }).length) {
      throw new Error("Invalid inquiry");
    }
  } catch {
    return NextResponse.json({ error: "입력하신 상담 정보를 다시 확인해주세요." }, { status: 400 });
  }

  const user = process.env.DAOU_SMTP_USER;
  const pass = process.env.DAOU_SMTP_PASSWORD;
  const to = process.env.CONTACT_EMAIL_TO || siteConfig.email;
  if (!user || !pass) {
    return NextResponse.json({ error: "현재 이메일 상담 접수가 어렵습니다. 전화로 문의해주세요." }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host: "outbound.daouoffice.com",
    port: 465,
    secure: true,
    requireTLS: true,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  try {
    const result = await transporter.sendMail({
      from: { name: siteConfig.name, address: user },
      to,
      subject: `[창호 견적 상담] ${data.scope}`,
      text: inquiryEmailBody(data),
      html: inquiryEmailHtml(data),
    });
    if (!result.accepted.length || result.rejected.length) {
      throw Object.assign(new Error("Recipient rejected"), { code: "EENVELOPE" });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    // Do not log the full SMTP error: responses may contain addresses or credentials.
    const smtp = error as { code?: unknown; responseCode?: unknown; command?: unknown } | null;
    const code = typeof smtp?.code === "string" && /^E[A-Z0-9_]{1,40}$/.test(smtp.code)
      ? smtp.code : "UNKNOWN";
    const responseCode = typeof smtp?.responseCode === "number" ? smtp.responseCode : undefined;
    const command = typeof smtp?.command === "string"
      ? smtp.command.split(" ")[0].toUpperCase() : "";
    console.error("[contact-mail] SMTP send failed", {
      code,
      responseCode,
      command: ["CONN", "EHLO", "HELO", "STARTTLS", "AUTH", "MAIL", "RCPT", "DATA"].includes(command)
        ? command : "UNKNOWN",
    });
    if (code === "EAUTH") {
      return NextResponse.json({ error: "현재 이메일 상담 접수가 어렵습니다. 잠시 후 다시 시도하거나 전화로 문의해주세요." }, { status: 503 });
    }
    return NextResponse.json({ error: "메일 전송을 완료하지 못했습니다. 잠시 후 다시 시도하거나 전화로 문의해주세요." }, { status: 502 });
  } finally {
    transporter.close();
  }
}
