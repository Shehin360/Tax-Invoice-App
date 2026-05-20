import { Injectable } from "@angular/core";

import {
  ElectronInvoiceHistoryItem,
  ElectronInvoiceQueryOptions,
  ElectronSaveInvoicePayload,
} from "../shared/electron-contracts";
import { hasElectronApi, readJson, writeJson } from "./local-storage-json";
import { Invoice } from "../models/invoice.model";

const FALLBACK_KEY = "tax-invoice-manager.invoices";

type PersistedInvoice = Invoice & {
  createdAt: string;
};

@Injectable({
  providedIn: "root",
})
export class InvoiceDbService {
  async getNextInvoiceNumber(invoiceDate?: string | Date): Promise<string> {
    if (hasElectronApi()) {
      return window.api!.getNextInvoiceNumber(
        invoiceDate instanceof Date ? invoiceDate.toISOString() : invoiceDate,
      );
    }

    const date = invoiceDate instanceof Date ? invoiceDate : new Date();
    const year = date.getFullYear();
    const invoices = readJson<PersistedInvoice[]>(FALLBACK_KEY, []);
    const sequence = invoices
      .map((invoice) => invoice.invoiceNumber.split("-"))
      .filter((parts) => parts.length >= 3 && parts[1] === String(year))
      .map((parts) => Number(parts[2]))
      .filter((value) => Number.isFinite(value))
      .reduce((max, value) => (value > max ? value : max), 0);

    return `INV-${year}-${String(sequence + 1).padStart(3, "0")}`;
  }

  async getInvoices(
    options: ElectronInvoiceQueryOptions = {},
  ): Promise<ElectronInvoiceHistoryItem[]> {
    if (hasElectronApi()) {
      return window.api!.getInvoices(options) as Promise<
        ElectronInvoiceHistoryItem[]
      >;
    }

    const invoices = this.hydrateFallbackInvoices(
      readJson<PersistedInvoice[]>(FALLBACK_KEY, []),
    );
    const searchTerm = options.searchTerm?.trim().toLowerCase();
    const filtered = invoices.filter((invoice) => {
      const matchesSearch = !searchTerm
        ? true
        : [invoice.invoiceNumber, invoice.buyerName, invoice.buyerGstin]
            .join(" ")
            .toLowerCase()
            .includes(searchTerm);
      const invoiceDate = this.toDateString(invoice.invoiceDate);
      const matchesFrom = !options.fromDate || invoiceDate >= options.fromDate;
      const matchesTo = !options.toDate || invoiceDate <= options.toDate;
      return matchesSearch && matchesFrom && matchesTo;
    });

    return filtered.map((invoice) => ({
      id: invoice.id ?? this.createFallbackInvoiceId(),
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: this.toDateString(invoice.invoiceDate),
      buyerName: invoice.buyerName,
      grandTotal: invoice.grandTotal,
      createdAt: invoice.createdAt,
    }));
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    if (hasElectronApi()) {
      const row = (await window.api!.getInvoiceById(id)) as unknown;
      return row ? this.toAngularInvoice(row) : null;
    }

    const invoices = this.hydrateFallbackInvoices(
      readJson<PersistedInvoice[]>(FALLBACK_KEY, []),
    );
    const invoice = invoices.find((candidate) => candidate.id === id);
    return invoice
      ? this.toAngularInvoice({
          id,
          ...this.toPayload(invoice),
          created_at: invoice.createdAt,
          items: invoice.items.map((item) => ({
            id: item.id,
            invoiceId: id,
            productName: item.productName,
            hsn: item.hsnSac,
            quantity: item.quantity,
            unit: item.unit,
            rate: item.rate,
            gst: item.gstPercent,
            amount: item.amount,
          })),
        })
      : null;
  }

  async saveInvoice(invoice: Invoice): Promise<Invoice> {
    const payload = this.toPayload(invoice);

    if (hasElectronApi()) {
      const saved = (await window.api!.saveInvoice(payload)) as unknown;
      return this.toAngularInvoice(saved);
    }

    const invoices = this.hydrateFallbackInvoices(
      readJson<PersistedInvoice[]>(FALLBACK_KEY, []),
    );
    const persistedInvoice: PersistedInvoice = {
      ...invoice,
      id: invoice.id || this.createFallbackInvoiceId(),
      createdAt:
        invoices.find((candidate) => candidate.id === invoice.id)?.createdAt ||
        new Date().toISOString(),
    };

    const existingIndex = invoices.findIndex((candidate) => {
      if (invoice.id) {
        return candidate.id === invoice.id;
      }

      return candidate.invoiceNumber === invoice.invoiceNumber;
    });

    if (existingIndex >= 0) {
      invoices[existingIndex] = persistedInvoice;
    } else {
      invoices.unshift(persistedInvoice);
    }

    writeJson(FALLBACK_KEY, invoices);
    return this.toAngularInvoice({
      ...payload,
      id: persistedInvoice.id,
      created_at: persistedInvoice.createdAt,
      createdAt: persistedInvoice.createdAt,
      items: payload.items.map((item, index) => ({
        id: String(index + 1),
        invoiceId: persistedInvoice.id,
        productName: item.productName,
        hsn: item.hsn,
        quantity: item.quantity,
        unit: item.unit,
        rate: item.rate,
        gst: item.gst,
        amount: item.amount,
      })),
    });
  }

  async deleteInvoice(id: string): Promise<void> {
    if (hasElectronApi()) {
      await window.api!.deleteInvoice(id);
      return;
    }

    const invoices = this.hydrateFallbackInvoices(
      readJson<PersistedInvoice[]>(FALLBACK_KEY, []),
    );
    writeJson(
      FALLBACK_KEY,
      invoices.filter((invoice) => invoice.id !== id),
    );
  }

  private toPayload(invoice: Invoice): ElectronSaveInvoicePayload {
    return {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate:
        invoice.invoiceDate instanceof Date
          ? invoice.invoiceDate.toISOString().slice(0, 10)
          : String(invoice.invoiceDate).slice(0, 10),
      buyerName: invoice.buyerName,
      buyerGstin: invoice.buyerGstin,
      buyerAddress: invoice.buyerAddress,
      buyerState: invoice.buyerState,
      consigneeName: invoice.consigneeName,
      consigneeGstin: invoice.consigneeGstin,
      consigneeAddress: invoice.consigneeAddress,
      consigneeState: invoice.consigneeState,
      deliveryNote: invoice.deliveryNote,
      vehicleNumber: invoice.vehicleNumber,
      termsOfPayment: invoice.termsOfPayment,
      subtotal: invoice.subtotal,
      cgst: invoice.cgst,
      sgst: invoice.sgst,
      igst: invoice.igst,
      grandTotal: invoice.grandTotal,
      amountInWords: invoice.amountInWords,
      declaration: invoice.declaration,
      items: invoice.items.map((item) => ({
        productName: item.productName,
        hsn: item.hsnSac,
        quantity: item.quantity,
        unit: item.unit,
        rate: item.rate,
        gst: item.gstPercent,
        amount: item.amount,
      })),
    };
  }

  private toAngularInvoice(row: any): Invoice {
    return {
      id: String(row.id ?? ""),
      invoiceNumber: row.invoiceNumber ?? row.invoice_number,
      invoiceDate: row.invoiceDate ?? row.invoice_date,
      deliveryNote: row.deliveryNote ?? row.delivery_note ?? "",
      vehicleNumber: row.vehicleNumber ?? row.vehicle_number ?? "",
      termsOfPayment: row.termsOfPayment ?? row.terms_of_payment ?? "",
      buyerName: row.buyerName ?? row.buyer_name,
      buyerGstin: row.buyerGstin ?? row.buyer_gstin,
      buyerAddress: row.buyerAddress ?? row.buyer_address,
      buyerState: row.buyerState ?? row.buyer_state ?? "",
      consigneeName: row.consigneeName ?? row.consignee_name,
      consigneeGstin: row.consigneeGstin ?? row.consignee_gstin ?? "",
      consigneeAddress: row.consigneeAddress ?? row.consignee_address ?? "",
      consigneeState: row.consigneeState ?? row.consignee_state ?? "",
      items: (row.items ?? []).map((item: any, index: number) => ({
        id: item.id,
        slNo: index + 1,
        productId: String(item.productId ?? item.id ?? index + 1),
        productName: item.productName ?? item.product_name,
        hsnSac: item.hsnSac ?? item.hsn,
        quantity: item.quantity,
        unit: item.unit,
        rate: item.rate,
        gstPercent: item.gstPercent ?? item.gst,
        amount: item.amount,
      })),
      subtotal: row.subtotal,
      cgst: row.cgst,
      sgst: row.sgst,
      igst: row.igst,
      grandTotal: row.grandTotal ?? row.grand_total,
      amountInWords: row.amountInWords ?? row.amount_in_words,
      declaration: row.declaration ?? "",
    };
  }

  private createFallbackInvoiceId(): string {
    return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`;
  }

  private hydrateFallbackInvoices(
    invoices: PersistedInvoice[],
  ): PersistedInvoice[] {
    let changed = false;

    const hydrated = invoices.map((invoice) => {
      if (invoice.id) {
        return invoice;
      }

      changed = true;
      return {
        ...invoice,
        id: this.createFallbackInvoiceId(),
        createdAt: invoice.createdAt || this.toDateString(invoice.invoiceDate),
      };
    });

    if (changed) {
      writeJson(FALLBACK_KEY, hydrated);
    }

    return hydrated;
  }

  private toDateString(value: string | Date): string {
    return value instanceof Date
      ? value.toISOString().slice(0, 10)
      : String(value).slice(0, 10);
  }
}
