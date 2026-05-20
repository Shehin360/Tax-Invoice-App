import { Injectable } from "@angular/core";

import {
  ElectronInvoiceHistoryItem,
  ElectronInvoiceQueryOptions,
  ElectronSaveInvoicePayload,
} from "../shared/electron-contracts";
import { hasElectronApi, readJson, writeJson } from "./local-storage-json";
import { Invoice } from "../models/invoice.model";

const FALLBACK_KEY = "tax-invoice-manager.invoices";

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
    const invoices = readJson<Invoice[]>(FALLBACK_KEY, []);
    const sequence = invoices.reduce((max, invoice) => {
      const parts = invoice.invoiceNumber.split("-");
      const value = Number(parts[2]);
      return Number.isFinite(value) && value > max ? value : max;
    }, 0);

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

    const invoices = readJson<Invoice[]>(FALLBACK_KEY, []);
    const searchTerm = options.searchTerm?.trim().toLowerCase();
    const filtered = invoices.filter((invoice) => {
      const matchesSearch = !searchTerm
        ? true
        : [invoice.invoiceNumber, invoice.buyerName, invoice.buyerGstin]
            .join(" ")
            .toLowerCase()
            .includes(searchTerm);
      const invoiceDate = new Date(invoice.invoiceDate)
        .toISOString()
        .slice(0, 10);
      const matchesFrom = !options.fromDate || invoiceDate >= options.fromDate;
      const matchesTo = !options.toDate || invoiceDate <= options.toDate;
      return matchesSearch && matchesFrom && matchesTo;
    });

    return filtered.map((invoice, index) => ({
      id: String(index + 1),
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate:
        invoice.invoiceDate instanceof Date
          ? invoice.invoiceDate.toISOString().slice(0, 10)
          : String(invoice.invoiceDate).slice(0, 10),
      buyerName: invoice.buyerName,
      grandTotal: invoice.grandTotal,
      createdAt: new Date().toISOString(),
    }));
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    if (hasElectronApi()) {
      const row = (await window.api!.getInvoiceById(id)) as unknown;
      return row ? this.toAngularInvoice(row) : null;
    }

    const invoices = readJson<Invoice[]>(FALLBACK_KEY, []);
    const invoice = invoices[Number(id) - 1];
    return invoice
      ? this.toAngularInvoice({
          id,
          ...this.toPayload(invoice),
          created_at: new Date().toISOString(),
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

    const invoices = readJson<Invoice[]>(FALLBACK_KEY, []);
    const existingIndex = invoices.findIndex(
      (candidate) => candidate.invoiceNumber === invoice.invoiceNumber,
    );

    if (existingIndex >= 0) {
      invoices[existingIndex] = invoice;
    } else {
      invoices.unshift(invoice);
    }

    writeJson(FALLBACK_KEY, invoices);
    return invoice;
  }

  async deleteInvoice(id: string): Promise<void> {
    if (hasElectronApi()) {
      await window.api!.deleteInvoice(id);
      return;
    }

    const invoices = readJson<Invoice[]>(FALLBACK_KEY, []);
    writeJson(
      FALLBACK_KEY,
      invoices.filter((_, index) => String(index + 1) !== id),
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
}
