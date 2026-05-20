export interface ElectronInvoiceItemPayload {
  productName: string;
  hsn: string;
  quantity: number;
  unit: string;
  rate: number;
  gst: number;
  amount: number;
}

export interface ElectronSaveInvoicePayload {
  id?: string;
  invoiceNumber?: string;
  invoiceDate: string;
  buyerName: string;
  buyerGstin: string;
  buyerAddress: string;
  buyerState?: string;
  consigneeName: string;
  consigneeGstin?: string;
  consigneeAddress?: string;
  consigneeState?: string;
  deliveryNote?: string;
  vehicleNumber?: string;
  termsOfPayment?: string;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  grandTotal: number;
  amountInWords: string;
  declaration?: string;
  items: ElectronInvoiceItemPayload[];
}

export interface ElectronInvoiceHistoryItem {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  buyerName: string;
  grandTotal: number;
  createdAt: string;
}

export interface ElectronInvoiceDetails extends ElectronSaveInvoicePayload {
  id: string;
  createdAt?: string;
}

export interface ElectronCustomerPayload {
  id?: string;
  customerName: string;
  gstin: string;
  address: string;
  city?: string;
  state: string;
  phone: string;
  email?: string;
}

export interface ElectronCustomerDto {
  id: string;
  customerName: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface ElectronProductPayload {
  id?: string;
  productName: string;
  hsn: string;
  description?: string;
  unit: string;
  rate: number;
  gstPercentage: number;
}

export interface ElectronProductDto {
  id: string;
  productName: string;
  hsn: string;
  description: string;
  unit: string;
  rate: number;
  gstPercentage: number;
  createdAt: string;
}

export interface ElectronSettingsPayload {
  id?: string;
  companyName: string;
  gstin: string;
  address: string;
  phone: string;
  bankDetails?: string;
  logoPath?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  email?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
}

export interface ElectronSettingsDto {
  id: string;
  companyName: string;
  gstin: string;
  address: string;
  phone: string;
  bankDetails: string;
  logoPath: string;
  city: string;
  state: string;
  postalCode: string;
  email: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
}

export interface ElectronInvoiceQueryOptions {
  searchTerm?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?:
    | "invoice_date"
    | "invoice_number"
    | "grand_total"
    | "buyer_name"
    | "created_at";
  sortDirection?: "ASC" | "DESC";
}
