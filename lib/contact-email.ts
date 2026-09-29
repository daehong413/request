import type { Inquiry } from "./contact";
import { siteConfig } from "./site-config";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!);
}

function lines(value: string): string {
  return escapeHtml(value.trim()).replace(/\r\n|\r|\n/g, "<br />");
}

/** Table layout and inline styles keep the email usable in desktop mail clients. */
export function inquiryEmailHtml(data: Inquiry): string {
  const brand = escapeHtml(siteConfig.name);
  const phone = escapeHtml(data.phone.trim());
  const rows = [
    ["시공 주소", data.address],
    ["평형", data.size],
    ["시공 범위", data.scope],
  ].map(([label, value]) => `
    <tr>
      <th scope="row" align="left" valign="top" width="86" style="padding:16px 12px 16px 0;border-bottom:1px solid #e5e7eb;color:#596574;font-size:14px;font-weight:400;line-height:1.7;">${label}</th>
      <td valign="top" style="padding:16px 0;border-bottom:1px solid #e5e7eb;color:#1b2430;font-size:15px;line-height:1.7;word-break:break-word;overflow-wrap:anywhere;">${lines(value)}</td>
    </tr>`).join("");

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${brand} · 새 견적 상담</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">홈페이지에 새로운 창호 견적 상담이 접수되었습니다.</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f3f4f6">
    <tr><td align="center" style="padding:24px 12px;">
      <!--[if mso]><table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"><tr><td><![endif]-->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:12px;">
        <tr><td bgcolor="#1b2430" style="padding:28px 24px;border-radius:12px 12px 0 0;">
          <p style="margin:0 0 18px;color:#d4bb8b;font-size:15px;font-weight:700;letter-spacing:1px;">${brand}</p>
          <h1 style="margin:0;color:#ffffff;font-size:26px;line-height:1.4;">새로운 견적 상담이 도착했습니다</h1>
          <p style="margin:12px 0 0;color:#d1d8e0;font-size:14px;line-height:1.7;">아래 내용을 확인하고 고객님께 연락해주세요.</p>
        </td></tr>
        <tr><td style="padding:28px 24px 12px;">
          <h2 style="margin:0 0 14px;color:#596574;font-size:14px;font-weight:400;">상담 고객</h2>
          <p style="margin:0 0 8px;color:#1b2430;font-size:22px;font-weight:700;line-height:1.5;word-break:break-word;">${lines(data.name)} 님</p>
          <p style="margin:0 0 20px;color:#1b2430;font-size:18px;line-height:1.6;">${phone}</p>
        </td></tr>
        <tr><td style="padding:24px;">
          <h2 style="margin:0 0 4px;color:#1b2430;font-size:18px;line-height:1.5;">시공 정보</h2>
          <table width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;table-layout:fixed;">${rows}</table>
          <h2 style="margin:28px 0 12px;color:#1b2430;font-size:18px;line-height:1.5;">남겨주신 말씀</h2>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="table-layout:fixed;"><tr><td bgcolor="#f7f5f1" style="padding:20px;border-radius:8px;color:#303844;font-size:15px;line-height:1.9;word-break:break-word;overflow-wrap:anywhere;">${lines(data.message) || "상담 시 안내 부탁드립니다."}</td></tr></table>
        </td></tr>
        <tr><td style="padding:20px 24px;border-top:1px solid #e5e7eb;">
          <p style="margin:0;color:#596574;font-size:12px;line-height:1.8;">${brand} 홈페이지에서 접수된 상담 문의입니다.<br />고객 연락처로 직접 연락해주세요. 이 메일에 회신하면 발신 계정으로 전달됩니다.</p>
        </td></tr>
      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td></tr>
  </table>
</body>
</html>`;
}
