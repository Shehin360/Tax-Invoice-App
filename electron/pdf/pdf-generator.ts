import { shell } from "electron";
import fs from "fs/promises";
import path from "path";

import puppeteer from "puppeteer";

import { database } from "../database/database";
import { invoiceRepository } from "../database/invoice.repository";
import { settingsRepository } from "../database/settings.repository";
import { renderInvoiceHtml } from "./template-renderer";

async function ensurePdfDirectories(): Promise<void> {
  const paths = database.getStoragePaths();
  await fs.mkdir(paths.invoicesDir, { recursive: true });
  await fs.mkdir(path.join(paths.rootDir, "temp"), { recursive: true });
}

function sanitizeFileName(value: string): string {
  return value.replace(/[\\/:*?"<>|]/g, "_");
}

export class PdfGenerator {
  async generateInvoicePDF(invoiceId: string): Promise<string> {
    await ensurePdfDirectories();

    const invoice = await invoiceRepository.getInvoiceById(invoiceId);
    if (!invoice) {
      throw new Error("Invoice not found.");
    }

    const settings = await settingsRepository.getSettings();
    const html = await renderInvoiceHtml(invoice, settings);
    const pdfPath = this.getInvoicePdfPath(invoice.invoice_number);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "load" });
      await page.pdf({
        path: pdfPath,
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: "0", bottom: "0", left: "0", right: "0" },
      });
      await page.close();
    } finally {
      await browser.close();
    }

    return pdfPath;
  }

  async openInvoicePDF(invoiceId: string): Promise<string> {
    const pdfPath = await this.generateInvoicePDF(invoiceId);
    await shell.openPath(pdfPath);
    return pdfPath;
  }

  async deleteInvoicePDF(invoiceId: string): Promise<boolean> {
    const invoice = await invoiceRepository.getInvoiceById(invoiceId);
    if (!invoice) {
      return false;
    }

    const pdfPath = this.getInvoicePdfPath(invoice.invoice_number);
    await fs.rm(pdfPath, { force: true });
    return true;
  }

  getInvoicePdfPath(invoiceNumber: string): string {
    const paths = database.getStoragePaths();
    return path.join(
      paths.invoicesDir,
      `${sanitizeFileName(invoiceNumber)}.pdf`,
    );
  }
}

export const pdfGenerator = new PdfGenerator();
