export interface InvoiceItem {
  id?: string;
  slNo: number;
  productName: string;
  hsnSac: string;
  quantity: number;
  rate: number;
  gstPercent: number;
  amount?: number;
}

export interface InvoiceForm {
  // Business Details
  businessName: string;
  gstin: string;
  businessAddress: string;
  businessPhone: string;

  // Buyer Details
  buyerName: string;
  buyerGstin: string;
  buyerAddress: string;
  buyerState: string;

  // Consignee Details
  consigneeName: string;
  consigneeAddress: string;
  consigneeState: string;

  // Invoice Information
  invoiceNumber: string;
  invoiceDate: string;
  vehicleNumber: string;
  deliveryNote: string;
  termsOfPayment: string;

  // Items
  items: InvoiceItem[];

  // Tax Summary
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  grandTotal: number;

  // Additional
  amountInWords: string;
  declaration: string;
}

export interface TaxSummary {
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  grandTotal: number;
}
