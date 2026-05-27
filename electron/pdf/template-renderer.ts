import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import QRCode from "qrcode";

import type { InvoiceDetails } from "../database/invoice.repository";
import type { SettingsDto } from "../database/settings.repository";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN");
}

async function resolveLogoDataUrl(logoPath: string): Promise<string> {
  if (!logoPath) {
    return "";
  }

  const filePath = logoPath.startsWith("file://")
    ? fileURLToPath(logoPath)
    : logoPath;

  try {
    const buffer = await readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    const mimeType =
      extension === ".jpg" || extension === ".jpeg"
        ? "image/jpeg"
        : "image/png";

    return `data:${mimeType};base64,${buffer.toString("base64")}`;
  } catch {
    return "";
  }
}

export async function renderInvoiceHtml(
  invoice: InvoiceDetails,
  settings: SettingsDto,
): Promise<string> {
  const logoDataUrl = await resolveLogoDataUrl(settings.logoPath);
  const qrDataUrl = await QRCode.toDataURL(
    JSON.stringify({
      invoiceNumber: invoice.invoice_number,
      gstin: settings.gstin,
      total: invoice.grand_total,
    }),
    { width: 128, margin: 1 },
  );

  const rows = invoice.items
    .map(
      (item, index) => `
        <tr>
          <td class="center">${index + 1}</td>
          <td>${escapeHtml(item.product_name)}</td>
          <td class="center">${escapeHtml(item.hsn)}</td>
          <td class="center">${item.quantity}</td>
          <td class="center">${escapeHtml(item.unit)}</td>
          <td class="right">${currencyFormatter.format(item.rate)}</td>
          <td class="center">${Number(item.gst).toFixed(0)}%</td>
          <td class="right">${currencyFormatter.format(item.amount)}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${escapeHtml(invoice.invoice_number)} - Invoice</title>
      <style>
        @page { size: A4; margin: 10mm; }
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: #fff; color: #111827; font-family: Arial, Helvetica, sans-serif; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .page { width: 190mm; min-height: 277mm; margin: 0 auto; padding: 8mm; border: 1px solid #111827; }
        .header { display: grid; grid-template-columns: 1.25fr 0.9fr; gap: 8mm; margin-bottom: 4mm; }
        .company { display: grid; grid-template-columns: 28mm 1fr; gap: 4mm; align-items: center; }
        .logo { width: 28mm; height: 28mm; object-fit: contain; border: 1px solid #cbd5e1; padding: 2mm; }
        .logo-fallback { width: 28mm; height: 28mm; border: 1px solid #cbd5e1; display: grid; place-items: center; font-weight: 700; font-size: 12px; }
        .company h1 { margin: 0 0 2mm; font-size: 16pt; line-height: 1.15; }
        .company p { margin: 0.5mm 0; font-size: 9.5pt; line-height: 1.35; }
        .meta { border: 1px solid #111827; padding: 3mm; font-size: 9.5pt; }
        .meta table { width: 100%; border-collapse: collapse; }
        .meta td { padding: 1.4mm 0; vertical-align: top; }
        .meta td:last-child { text-align: right; font-weight: 700; }
        .title { text-align: center; font-size: 11pt; font-weight: 700; letter-spacing: 0.2em; margin: 3mm 0; padding: 2mm 0; border-top: 1px solid #111827; border-bottom: 1px solid #111827; }
        .parties { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4mm; margin-bottom: 4mm; }
        .box { border: 1px solid #111827; padding: 3mm; min-height: 33mm; }
        .box h2 { margin: 0 0 2mm; font-size: 10.5pt; }
        .box p { margin: 0.8mm 0; font-size: 9.5pt; line-height: 1.4; }
        table.items { width: 100%; border-collapse: collapse; font-size: 9pt; }
        table.items th, table.items td { border: 1px solid #111827; padding: 2mm 1.6mm; vertical-align: top; }
        table.items th { background: #f3f4f6; text-align: center; font-weight: 700; }
        table.items tr { page-break-inside: avoid; }
        .center { text-align: center; }
        .right { text-align: right; white-space: nowrap; }
        .summary-wrap { display: grid; grid-template-columns: 1fr 74mm; gap: 4mm; margin-top: 4mm; }
        .summary { border: 1px solid #111827; padding: 3mm; }
        .summary-row { display: flex; justify-content: space-between; gap: 4mm; font-size: 9.5pt; padding: 1.5mm 0; }
        .summary-row.total { font-size: 10.5pt; font-weight: 700; border-top: 1px solid #111827; margin-top: 1.5mm; padding-top: 2mm; }
        .words { border: 1px solid #111827; padding: 3mm; font-size: 9.5pt; }
        .words strong { display: block; margin-top: 1.5mm; line-height: 1.45; }
        .footer { display: grid; grid-template-columns: 1fr 42mm; gap: 4mm; margin-top: 4mm; align-items: end; }
        .declaration, .signature, .qr { border: 1px solid #111827; padding: 3mm; min-height: 28mm; }
        .signature { display: grid; align-content: end; text-align: center; }
        .signature-line { border-top: 1px solid #111827; margin-bottom: 1.8mm; }
        .qr img { width: 34mm; height: 34mm; display: block; margin: 0 auto; }
        .computer-generated { margin-top: 3mm; text-align: center; font-size: 9pt; font-weight: 700; }
        .muted { color: #4b5563; }
        .nowrap { white-space: nowrap; }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="header">
          <div class="company">
            ${logoDataUrl ? `<img class="logo" src="${logoDataUrl}" alt="Company logo" />` : `<div class="logo-fallback">LOGO</div>`}
            <div>
              <h1>${escapeHtml(settings.companyName)}</h1>
              <p>${escapeHtml(settings.address)}</p>
              <p>GSTIN: ${escapeHtml(settings.gstin)}</p>
              <p>Phone: ${escapeHtml(settings.phone)}</p>
              ${settings.bankDetails ? `<p class="muted">${escapeHtml(settings.bankDetails)}</p>` : ""}
            </div>
          </div>
          <div class="meta">
            <table>
              <tr><td>Invoice No.</td><td>${escapeHtml(invoice.invoice_number)}</td></tr>
              <tr><td>Invoice Date</td><td>${escapeHtml(formatDate(invoice.invoice_date))}</td></tr>
              <tr><td>Delivery Note</td><td>${escapeHtml(invoice.delivery_note || "-")}</td></tr>
              <tr><td>Vehicle No.</td><td>${escapeHtml(invoice.vehicle_number || "-")}</td></tr>
              <tr><td>Terms</td><td>${escapeHtml(invoice.terms_of_payment || "-")}</td></tr>
            </table>
          </div>
        </div>

        <div class="title">TAX INVOICE</div>

        <div class="parties">
          <div class="box">
            <h2>Buyer Details</h2>
            <p><strong>${escapeHtml(invoice.buyer_name)}</strong></p>
            <p>GSTIN: ${escapeHtml(invoice.buyer_gstin)}</p>
            <p>${escapeHtml(invoice.buyer_address)}</p>
            <p>State: ${escapeHtml(invoice.buyer_state || "-")}</p>
          </div>
          <div class="box">
            <h2>Consignee Details</h2>
            <p><strong>${escapeHtml(invoice.consignee_name)}</strong></p>
            <p>GSTIN: ${escapeHtml(invoice.consignee_gstin || "-")}</p>
            <p>${escapeHtml(invoice.consignee_address || "-")}</p>
            <p>State: ${escapeHtml(invoice.consignee_state || "-")}</p>
          </div>
        </div>

        <table class="items">
          <thead>
            <tr>
              <th style="width: 8mm;">Sl</th>
              <th>Product Name</th>
              <th style="width: 18mm;">HSN/SAC</th>
              <th style="width: 14mm;">Qty</th>
              <th style="width: 16mm;">Unit</th>
              <th style="width: 20mm;">Rate</th>
              <th style="width: 16mm;">GST %</th>
              <th style="width: 24mm;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="summary-wrap">
          <div class="words">
            <div><strong>Amount in Words</strong></div>
            <strong>${escapeHtml(invoice.amount_in_words)}</strong>
          </div>
          <div class="summary">
            <div class="summary-row"><span>Subtotal</span><span>${currencyFormatter.format(invoice.subtotal)}</span></div>
            <div class="summary-row"><span>CGST</span><span>${currencyFormatter.format(invoice.cgst)}</span></div>
            <div class="summary-row"><span>SGST</span><span>${currencyFormatter.format(invoice.sgst)}</span></div>
            <div class="summary-row"><span>IGST</span><span>${currencyFormatter.format(invoice.igst)}</span></div>
            <div class="summary-row total"><span>Grand Total</span><span>${currencyFormatter.format(invoice.grand_total)}</span></div>
          </div>
        </div>

        <div class="footer">
          <div class="declaration">
            <strong>Declaration</strong>
            <p>${escapeHtml(invoice.declaration || "We declare that this invoice shows the actual price of the goods described and all particulars are true and correct.")}</p>
            <p class="computer-generated">Computer Generated Invoice</p>
          </div>
          <div class="signature">
            ${qrDataUrl ? `<div class="qr"><img src="${qrDataUrl}" alt="Invoice QR code" /></div>` : ""}
            <div class="signature-line"></div>
            <strong>Authorized Signatory</strong>
          </div>
        </div>
      </div>
    </body>
  </html>`;
}
