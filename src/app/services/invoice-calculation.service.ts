import { Injectable } from "@angular/core";
import { toWords } from "number-to-words";

import { InvoiceItem, InvoiceTaxSummary } from "../models/invoice.model";

@Injectable({
  providedIn: "root",
})
export class InvoiceCalculationService {
  private readonly currencyFormatter = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  calculateItemAmount(quantity: number, rate: number): number {
    return this.roundCurrency(quantity * rate);
  }

  calculateSubtotal(items: InvoiceItem[]): number {
    return this.roundCurrency(
      items.reduce(
        (total, item) =>
          total + this.calculateItemAmount(item.quantity, item.rate),
        0,
      ),
    );
  }

  calculateCGST(subtotal: number, gstPercent: number): number {
    return this.roundCurrency((subtotal * gstPercent) / 200);
  }

  calculateSGST(subtotal: number, gstPercent: number): number {
    return this.roundCurrency((subtotal * gstPercent) / 200);
  }

  calculateIGST(subtotal: number, igstPercent: number): number {
    return this.roundCurrency((subtotal * igstPercent) / 100);
  }

  calculateGrandTotal(
    subtotal: number,
    cgst: number,
    sgst: number,
    igst: number,
  ): number {
    return this.roundCurrency(subtotal + cgst + sgst + igst);
  }

  calculateTaxSummary(
    items: InvoiceItem[],
    igstPercent = 0,
  ): InvoiceTaxSummary {
    const subtotal = this.calculateSubtotal(items);
    const totalGst = this.roundCurrency(
      items.reduce(
        (total, item) =>
          total +
          this.calculateItemAmount(item.quantity, item.rate) *
            (item.gstPercent / 100),
        0,
      ),
    );
    const cgst = this.roundCurrency(totalGst / 2);
    const sgst = this.roundCurrency(totalGst / 2);
    const igst = this.calculateIGST(subtotal, igstPercent);

    return {
      subtotal,
      cgst,
      sgst,
      igst,
      grandTotal: this.calculateGrandTotal(subtotal, cgst, sgst, igst),
    };
  }

  convertAmountToWords(amount: number): string {
    const roundedAmount = Math.max(0, Math.round(amount));

    if (roundedAmount === 0) {
      return "Zero Only";
    }

    const parts: string[] = [];
    let remainingAmount = roundedAmount;

    const crore = Math.floor(remainingAmount / 10000000);
    if (crore > 0) {
      parts.push(`${this.formatChunk(crore)} Crore`);
      remainingAmount -= crore * 10000000;
    }

    const lakh = Math.floor(remainingAmount / 100000);
    if (lakh > 0) {
      parts.push(`${this.formatChunk(lakh)} Lakh`);
      remainingAmount -= lakh * 100000;
    }

    const thousand = Math.floor(remainingAmount / 1000);
    if (thousand > 0) {
      parts.push(`${this.formatChunk(thousand)} Thousand`);
      remainingAmount -= thousand * 1000;
    }

    if (remainingAmount > 0) {
      parts.push(this.formatChunk(remainingAmount));
    }

    return `${parts.join(" ")} Only`;
  }

  formatCurrency(value: number): string {
    return this.currencyFormatter.format(this.roundCurrency(value));
  }

  private formatChunk(value: number): string {
    return this.capitalize(
      toWords(value)
        .replace(/-/g, " ")
        .replace(/\band\b/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    );
  }

  private capitalize(text: string): string {
    if (!text) {
      return text;
    }

    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  private roundCurrency(value: number): number {
    return Number(value.toFixed(2));
  }
}
