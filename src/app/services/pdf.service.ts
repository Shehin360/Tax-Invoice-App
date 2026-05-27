import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class PdfService {
  async generateInvoicePDF(invoiceId: string): Promise<string> {
    if (!window.api) {
      throw new Error("PDF generation is only available inside Electron.");
    }

    return window.api.generateInvoicePDF(invoiceId);
  }

  async savePDF(invoiceId: string): Promise<string> {
    return this.generateInvoicePDF(invoiceId);
  }

  async openPDF(invoiceId: string): Promise<string> {
    if (!window.api) {
      throw new Error("Opening PDFs is only available inside Electron.");
    }

    return window.api.openInvoicePDF(invoiceId);
  }

  async deletePDF(invoiceId: string): Promise<boolean> {
    if (!window.api) {
      throw new Error("Deleting PDFs is only available inside Electron.");
    }

    return window.api.deleteInvoicePDF(invoiceId);
  }

  async printPDF(invoiceId: string): Promise<boolean> {
    if (!window.api) {
      throw new Error("Printing PDFs is only available inside Electron.");
    }

    return window.api.printInvoicePDF(invoiceId);
  }

  async getPDFPath(invoiceId: string): Promise<string | null> {
    if (!window.api) {
      return null;
    }

    return window.api.getInvoicePDFPath(invoiceId);
  }
}
