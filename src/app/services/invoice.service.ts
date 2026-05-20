import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { Invoice } from "../models/invoice.model";
import { InvoiceDbService } from "./invoice-db.service";
import { MockDataService } from "./mock-data.service";

@Injectable({
  providedIn: "root",
})
export class InvoiceService {
  private readonly invoicesSubject = new BehaviorSubject<Invoice[]>([]);
  private readonly readySubject = new BehaviorSubject<boolean>(false);
  private initializationPromise: Promise<void>;
  public readonly invoices$ = this.invoicesSubject.asObservable();
  public readonly isReady$ = this.readySubject.asObservable();

  constructor(
    private readonly mockDataService: MockDataService,
    private readonly invoiceDbService: InvoiceDbService,
  ) {
    this.initializationPromise = this.initialize();
  }

  getInvoices(): Observable<Invoice[]> {
    return this.invoices$;
  }

  async addInvoice(invoice: Invoice): Promise<void> {
    await this.ensureReady();
    const saved = await this.invoiceDbService.saveInvoice(invoice);
    await this.refreshInvoices();
  }

  async saveInvoice(invoice: Invoice): Promise<Invoice> {
    await this.ensureReady();
    const saved = await this.invoiceDbService.saveInvoice(invoice);
    await this.refreshInvoices();
    return saved as Invoice;
  }

  async deleteInvoice(invoiceId: string): Promise<void> {
    await this.ensureReady();
    await this.invoiceDbService.deleteInvoice(invoiceId);
    await this.refreshInvoices();
  }

  async getInvoiceById(invoiceId: string): Promise<Invoice | null> {
    await this.ensureReady();
    return (await this.invoiceDbService.getInvoiceById(
      invoiceId,
    )) as Invoice | null;
  }

  async getNextInvoiceNumber(invoiceDate?: string | Date): Promise<string> {
    await this.ensureReady();
    return this.invoiceDbService.getNextInvoiceNumber(invoiceDate);
  }

  async refreshInvoices(): Promise<void> {
    await this.ensureReady();

    const invoices =
      (await this.invoiceDbService.getInvoices()) as unknown as Invoice[];
    if (invoices.length > 0) {
      this.invoicesSubject.next(invoices);
    } else {
      this.invoicesSubject.next(this.getMockInvoices());
    }
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

  private async initialize(): Promise<void> {
    try {
      await this.loadInvoicesFromDb();
      this.readySubject.next(true);
    } catch (error) {
      console.error("Failed to initialize invoice service", error);
      this.readySubject.next(false);
      throw error;
    }
  }

  private async ensureReady(): Promise<void> {
    await this.initializationPromise;
    if (!this.readySubject.value) {
      throw new Error("Invoice service is not ready.");
    }
  }

  private async loadInvoicesFromDb(): Promise<void> {
    const invoices =
      (await this.invoiceDbService.getInvoices()) as unknown as Invoice[];
    if (invoices.length > 0) {
      this.invoicesSubject.next(invoices);
      return;
    }

    this.invoicesSubject.next(this.getMockInvoices());
  }
}
