import { Injectable } from "@angular/core";

import { Customer, Invoice, Product } from "../models/invoice.model";

export interface CompanyProfile {
  name: string;
  gstin: string;
  address: string;
  phone: string;
}

@Injectable({
  providedIn: "root",
})
export class MockDataService {
  private readonly companyProfile: CompanyProfile = {
    name: "Tax Invoice Manager Trading Co.",
    gstin: "32AAACT1234R1Z5",
    address: "12, Spice Market Road, Kochi, Kerala 682001",
    phone: "+91 98765 43210",
  };

  private readonly customers: Customer[] = [
    {
      id: "cus-1",
      name: "Kuruwa Enterprises",
      gstin: "32KURUW1234A1Z7",
      address: "45 Industrial Estate, Ernakulam",
      city: "Kochi",
      state: "Kerala",
      phone: "+91 98470 11223",
      email: "accounts@kuruwa.com",
      createdDate: "2026-01-05",
    },
    {
      id: "cus-2",
      name: "ABC Traders",
      gstin: "27ABCTR5678L1Z2",
      address: "88 Market Street, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      phone: "+91 98123 44556",
      email: "billing@abctraders.com",
      createdDate: "2026-02-18",
    },
  ];

  private readonly products: Product[] = [
    {
      id: "prod-1",
      name: "Dry Ginger",
      hsnSac: "0910",
      description: "Premium dry ginger for spice trading",
      rate: 480,
      gstPercent: 5,
      unit: "Kg",
      createdDate: "2026-01-10",
    },
    {
      id: "prod-2",
      name: "Pepper",
      hsnSac: "0904",
      description: "Black pepper export quality",
      rate: 750,
      gstPercent: 5,
      unit: "Kg",
      createdDate: "2026-01-10",
    },
    {
      id: "prod-3",
      name: "Cardamom",
      hsnSac: "0908",
      description: "Green cardamom small pods",
      rate: 1450,
      gstPercent: 5,
      unit: "Kg",
      createdDate: "2026-01-10",
    },
  ];

  getCompanyProfile(): CompanyProfile {
    return { ...this.companyProfile };
  }

  getCustomers(): Customer[] {
    return this.customers.map((customer) => ({ ...customer }));
  }

  getProducts(): Product[] {
    return this.products.map((product) => ({ ...product }));
  }

  getDefaultInvoiceDate(): Date {
    return new Date();
  }

  getDefaultDeclaration(): string {
    return "We declare that this invoice shows the actual price of the goods described and all particulars are true and correct.";
  }

  getSampleInvoiceDraft(): Partial<Invoice> {
    const customer = this.customers[0];
    const product = this.products[0];
    const subtotal = product.rate * 10;
    const cgst = subtotal * 0.025;
    const sgst = subtotal * 0.025;
    const grandTotal = subtotal + cgst + sgst;

    return {
      invoiceNumber: "INV-2026-001",
      invoiceDate: this.getDefaultInvoiceDate(),
      deliveryNote: "DN-001",
      vehicleNumber: "KL-07-AB-1234",
      termsOfPayment: "Net 30 Days",
      buyerName: customer.name,
      buyerGstin: customer.gstin,
      buyerAddress: customer.address,
      buyerState: customer.state,
      consigneeName: customer.name,
      consigneeGstin: customer.gstin,
      consigneeAddress: customer.address,
      consigneeState: customer.state,
      items: [
        {
          id: product.id,
          slNo: 1,
          productId: product.id,
          productName: product.name,
          hsnSac: product.hsnSac,
          quantity: 10,
          unit: product.unit,
          rate: product.rate,
          gstPercent: product.gstPercent,
          amount: subtotal,
        },
      ],
      subtotal,
      cgst,
      sgst,
      igst: 0,
      grandTotal,
      amountInWords: "Five Thousand Forty Only",
      declaration: this.getDefaultDeclaration(),
    };
  }
}
