import { ipcMain } from "electron";

import { pdfGenerator } from "../pdf/pdf-generator";
import { printInvoiceDocument } from "../pdf/print-handler";

export function registerPdfIpc(): void {
  ipcMain.handle("pdf:generate", async (_event, invoiceId: string) => {
    return pdfGenerator.generateInvoicePDF(invoiceId);
  });

  ipcMain.handle("pdf:open", async (_event, invoiceId: string) => {
    return pdfGenerator.openInvoicePDF(invoiceId);
  });

  ipcMain.handle("pdf:delete", async (_event, invoiceId: string) => {
    return pdfGenerator.deleteInvoicePDF(invoiceId);
  });

  ipcMain.handle("pdf:path", async (_event, invoiceId: string) => {
    const invoice = await import("../database/invoice.repository").then(
      (module) => module.invoiceRepository.getInvoiceById(invoiceId),
    );

    if (!invoice) {
      return null;
    }

    return pdfGenerator.getInvoicePdfPath(invoice.invoice_number);
  });

  ipcMain.handle("pdf:print", async (_event, invoiceId: string) => {
    return printInvoiceDocument(invoiceId);
  });
}
