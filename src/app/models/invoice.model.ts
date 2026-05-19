export interface Customer {
  id: string;
  name: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  createdDate: string;
}

export interface Product {
  id: string;
  name: string;
  hsnSac: string;
  description: string;
  rate: number;
  gstPercent: number;
  unit: string;
  createdDate: string;
}

export interface InvoiceItem {
  id: string;
  slNo: number;
  productId: string;
  productName: string;
  hsnSac: string;
  quantity: number;
  unit: string;
  rate: number;
  gstPercent: number;
  amount: number;
}

export interface InvoiceTaxSummary {
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  grandTotal: number;
}

export interface Invoice extends InvoiceTaxSummary {
  invoiceNumber: string;
  invoiceDate: string | Date;
  deliveryNote: string;
  vehicleNumber: string;
  termsOfPayment: string;
  buyerName: string;
  buyerGstin: string;
  buyerAddress: string;
  buyerState: string;
  consigneeName: string;
  consigneeGstin: string;
  consigneeAddress: string;
  consigneeState: string;
  items: InvoiceItem[];
  amountInWords: string;
  declaration: string;
}

export type InvoiceForm = Invoice;
export type TaxSummary = InvoiceTaxSummary;
