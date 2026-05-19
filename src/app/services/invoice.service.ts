import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InvoiceForm, InvoiceItem, TaxSummary } from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private invoicesSubject = new BehaviorSubject<InvoiceForm[]>(this.getMockInvoices());
  public invoices$ = this.invoicesSubject.asObservable();

  constructor() {}

  getInvoices(): Observable<InvoiceForm[]> {
    return this.invoices$;
  }

  getMockInvoices(): InvoiceForm[] {
    return [
      {
        businessName: 'Your Company Ltd.',
        gstin: '27AABCU9603R1Z5',
        businessAddress: '123 Business Street, Mumbai, MH 400001',
        businessPhone: '+91 9876543210',
        buyerName: 'ABC Enterprises',
        buyerGstin: '18AABCR5055K1Z0',
        buyerAddress: '456 Customer Avenue, Delhi, DL 110001',
        buyerState: 'Delhi',
        consigneeName: 'ABC Enterprises Branch',
        consigneeAddress: '456 Customer Avenue, Delhi, DL 110001',
        consigneeState: 'Delhi',
        invoiceNumber: 'INV-001-2026',
        invoiceDate: '2026-05-12',
        vehicleNumber: 'MH01AB1234',
        deliveryNote: 'DN-001',
        termsOfPayment: 'Net 30',
        items: [
          {
            id: '1',
            slNo: 1,
            productName: 'Product A',
            hsnSac: '8471',
            quantity: 10,
            rate: 1000,
            gstPercent: 18,
            amount: 11800
          },
          {
            id: '2',
            slNo: 2,
            productName: 'Service B',
            hsnSac: '9983',
            quantity: 5,
            rate: 2000,
            gstPercent: 9,
            amount: 10900
          }
        ],
        subtotal: 30000,
        cgst: 2700,
        sgst: 2700,
        igst: 0,
        grandTotal: 35400,
        amountInWords: 'Thirty Five Thousand Four Hundred Only',
        declaration: 'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.'
      }
    ];
  }

  calculateTaxSummary(items: InvoiceItem[]): TaxSummary {
    let subtotal = 0;
    let totalTax = 0;

    items.forEach(item => {
      const itemAmount = item.quantity * item.rate;
      const itemTax = (itemAmount * item.gstPercent) / 100;
      subtotal += itemAmount;
      totalTax += itemTax;
    });

    // Simplified: assumes both CGST and SGST for intra-state
    const cgst = totalTax / 2;
    const sgst = totalTax / 2;

    return {
      subtotal,
      cgst,
      sgst,
      igst: 0,
      grandTotal: subtotal + totalTax
    };
  }

  calculateItemAmount(item: InvoiceItem): number {
    const baseAmount = item.quantity * item.rate;
    const tax = (baseAmount * item.gstPercent) / 100;
    return baseAmount + tax;
  }

  getRecentInvoices(limit: number = 5): InvoiceForm[] {
    return this.getMockInvoices().slice(0, limit);
  }
}
