import { Injectable } from "@angular/core";

import { PdfService } from "./pdf.service";

@Injectable({
  providedIn: "root",
})
export class PrintService {
  constructor(private readonly pdfService: PdfService) {}

  async printInvoice(invoiceId: string): Promise<boolean> {
    return this.pdfService.printPDF(invoiceId);
  }
}
