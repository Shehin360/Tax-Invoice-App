import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { Invoice } from "../models/invoice.model";
import { MockDataService } from "./mock-data.service";

@Injectable({
  providedIn: "root",
})
export class InvoiceService {
  private readonly invoicesSubject = new BehaviorSubject<Invoice[]>(
    this.getMockInvoices(),
  );
  public readonly invoices$ = this.invoicesSubject.asObservable();

  constructor(private readonly mockDataService: MockDataService) {}

  getInvoices(): Observable<Invoice[]> {
    return this.invoices$;
  }

  addInvoice(invoice: Invoice): void {
    this.invoicesSubject.next([invoice, ...this.invoicesSubject.value]);
  }

  getMockInvoices(): Invoice[] {
    return [
      this.mockDataService.getSampleInvoiceDraft() as Invoice,
      {
        invoiceNumber: "INV-2026-002",
        invoiceDate: "2026-05-16",
        deliveryNote: "DN-002",
        vehicleNumber: "KL-07-CD-5678",
        termsOfPayment: "Against Delivery",
        buyerName: "ABC Traders",
        buyerGstin: "27ABCTR5678L1Z2",
        buyerAddress: "88 Market Street, Mumbai",
        buyerState: "Maharashtra",
        consigneeName: "ABC Traders Warehouse",
        consigneeGstin: "27ABCTR5678L1Z2",
        consigneeAddress: "88 Market Street, Mumbai",
        consigneeState: "Maharashtra",
        items: [
          {
            id: "inv-2-item-1",
            slNo: 1,
            productId: "prod-2",
            productName: "Pepper",
            hsnSac: "0904",
            quantity: 8,
            unit: "Kg",
            rate: 750,
            gstPercent: 5,
            amount: 6000,
          },
          {
            id: "inv-2-item-2",
            slNo: 2,
            productId: "prod-3",
            productName: "Cardamom",
            hsnSac: "0908",
            quantity: 2,
            unit: "Kg",
            rate: 1450,
            gstPercent: 5,
            amount: 2900,
          },
        ],
        subtotal: 8900,
        cgst: 222.5,
        sgst: 222.5,
        igst: 0,
        grandTotal: 9345,
        amountInWords: "Nine Thousand Three Hundred Forty Five Only",
        declaration: this.mockDataService.getDefaultDeclaration(),
      },
    ];
  }

  getRecentInvoices(limit: number = 5): Invoice[] {
    return this.getMockInvoices().slice(0, limit);
  }
}
