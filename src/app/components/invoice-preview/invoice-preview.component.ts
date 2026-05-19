import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";

@Component({
  selector: "app-invoice-preview",
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDividerModule],
  template: `
    <div class="invoice-preview">
      <div class="action-bar">
        <button mat-button (click)="printInvoice()">
          <mat-icon>print</mat-icon> Print
        </button>
        <button mat-button (click)="downloadPDF()">
          <mat-icon>download</mat-icon> Download PDF
        </button>
        <button mat-button (click)="closePreview()">
          <mat-icon>close</mat-icon> Close
        </button>
      </div>

      <div class="invoice-document">
        <!-- Invoice Header -->
        <div class="invoice-header">
          <div class="logo-section">
            <div class="logo-placeholder">LOGO</div>
          </div>
          <div class="company-info">
            <h1>{{ companyName }}</h1>
            <p>{{ gstin }}</p>
            <p>{{ address }}</p>
            <p>Phone: {{ phone }}</p>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Invoice Title -->
        <div class="invoice-title">
          <h2>TAX INVOICE</h2>
        </div>

        <!-- Invoice Details -->
        <div class="invoice-details-grid">
          <div class="invoice-info">
            <p><strong>Invoice No.:</strong> {{ invoiceNumber }}</p>
            <p>
              <strong>Date.:</strong> {{ invoiceDate | date: "dd/MM/yyyy" }}
            </p>
            <p><strong>Vehicle No.:</strong> {{ vehicleNumber }}</p>
            <p><strong>Delivery Note.:</strong> {{ deliveryNote }}</p>
          </div>
          <div class="terms-info">
            <p><strong>Terms of Payment:</strong> {{ termsOfPayment }}</p>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Party Details -->
        <div class="party-details">
          <div class="party-section">
            <h4>Bill To:</h4>
            <p>
              <strong>{{ buyerName }}</strong>
            </p>
            <p>GSTIN: {{ buyerGstin }}</p>
            <p>{{ buyerAddress }}</p>
            <p>State: {{ buyerState }}</p>
          </div>

          <div class="party-section">
            <h4>Ship To:</h4>
            <p>
              <strong>{{ consigneeName }}</strong>
            </p>
            <p>{{ consigneeAddress }}</p>
            <p>State: {{ consigneeState }}</p>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Items Table -->
        <div class="items-section">
          <table class="invoice-table">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Product Name</th>
                <th>HSN/SAC</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>GST %</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of items; let i = index">
                <td class="text-center">{{ i + 1 }}</td>
                <td>{{ item.productName }}</td>
                <td>{{ item.hsnSac }}</td>
                <td class="text-right">{{ item.quantity }}</td>
                <td class="text-right">₹{{ item.rate | number: "1.0-2" }}</td>
                <td class="text-center">{{ item.gstPercent }}%</td>
                <td class="text-right">₹{{ item.amount | number: "1.0-2" }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <mat-divider></mat-divider>

        <!-- Tax Summary -->
        <div class="summary-section">
          <div class="summary-box">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>₹{{ subtotal | number: "1.0-2" }}</span>
            </div>
            <div class="summary-row">
              <span>CGST (50%)</span>
              <span>₹{{ cgst | number: "1.0-2" }}</span>
            </div>
            <div class="summary-row">
              <span>SGST (50%)</span>
              <span>₹{{ sgst | number: "1.0-2" }}</span>
            </div>
            <div class="summary-row">
              <span>IGST</span>
              <span>₹{{ igst | number: "1.0-2" }}</span>
            </div>
            <div class="summary-row grand-total">
              <span>Grand Total</span>
              <span>₹{{ grandTotal | number: "1.0-2" }}</span>
            </div>
          </div>

          <div class="amount-words">
            <strong>Amount in Words:</strong> {{ amountInWords }}
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Declaration and Footer -->
        <div class="declaration-section">
          <div class="declaration">
            <h4>Declaration:</h4>
            <p>{{ declaration }}</p>
          </div>

          <div class="bank-details">
            <h4>Bank Details:</h4>
            <table class="bank-table">
              <tr>
                <td>Bank Name:</td>
                <td>{{ bankName }}</td>
              </tr>
              <tr>
                <td>Account No.:</td>
                <td>{{ accountNumber }}</td>
              </tr>
              <tr>
                <td>IFSC Code:</td>
                <td>{{ ifscCode }}</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Signature Section -->
        <div class="signature-section">
          <div class="signature-box">
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .invoice-preview {
        background-color: #f5f5f5;
        min-height: 100vh;
        padding: 20px;
      }

      .action-bar {
        background-color: white;
        padding: 12px 20px;
        margin-bottom: 20px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        gap: 12px;
      }

      .invoice-document {
        background-color: white;
        padding: 40px;
        max-width: 900px;
        margin: 0 auto;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      }

      .invoice-header {
        display: flex;
        gap: 40px;
        margin-bottom: 20px;
        align-items: center;
      }

      .logo-placeholder {
        width: 100px;
        height: 100px;
        border: 2px dashed #ddd;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        color: #999;
        border-radius: 4px;
      }

      .company-info {
        flex: 1;
      }

      .company-info h1 {
        margin: 0 0 8px 0;
        font-size: 24px;
      }

      .company-info p {
        margin: 4px 0;
        font-size: 13px;
        color: #666;
      }

      .invoice-title {
        text-align: center;
        padding: 20px 0;
      }

      .invoice-title h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
      }

      .invoice-details-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin: 20px 0;
        font-size: 13px;
      }

      .invoice-details-grid p {
        margin: 4px 0;
      }

      .invoice-details-grid strong {
        font-weight: 600;
      }

      .party-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        margin: 20px 0;
        font-size: 13px;
      }

      .party-section h4 {
        margin: 0 0 12px 0;
        font-weight: 600;
        font-size: 14px;
      }

      .party-section p {
        margin: 4px 0;
      }

      .items-section {
        margin: 20px 0;
      }

      .invoice-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }

      .invoice-table th {
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
        font-weight: 600;
      }

      .invoice-table td {
        border: 1px solid #ddd;
        padding: 8px;
      }

      .text-center {
        text-align: center;
      }

      .text-right {
        text-align: right;
      }

      .summary-section {
        margin: 20px 0;
      }

      .summary-box {
        max-width: 350px;
        margin-left: auto;
        border: 1px solid #ddd;
        font-size: 13px;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 12px;
        border-bottom: 1px solid #ddd;
      }

      .summary-row.grand-total {
        background-color: #f0f0f0;
        font-weight: 600;
        font-size: 14px;
        border-bottom: none;
      }

      .amount-words {
        margin: 12px 0;
        font-size: 13px;
        padding: 8px;
        background-color: #f9f9f9;
        border-radius: 4px;
      }

      .declaration-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin: 20px 0;
        font-size: 13px;
      }

      .declaration h4,
      .bank-details h4 {
        margin: 0 0 8px 0;
        font-weight: 600;
      }

      .declaration p {
        margin: 0;
        line-height: 1.5;
      }

      .bank-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }

      .bank-table td {
        padding: 4px 0;
      }

      .bank-table td:first-child {
        font-weight: 600;
        width: 50%;
      }

      .signature-section {
        display: flex;
        justify-content: flex-end;
        margin-top: 40px;
      }

      .signature-box {
        width: 200px;
        text-align: center;
        font-size: 12px;
      }

      .signature-box p {
        margin: 0;
      }

      @media print {
        .invoice-preview {
          background-color: white;
          padding: 0;
        }

        .action-bar {
          display: none;
        }

        .invoice-document {
          max-width: 100%;
          box-shadow: none;
          padding: 20px;
        }
      }

      @media (max-width: 768px) {
        .invoice-document {
          padding: 20px;
        }

        .invoice-header {
          flex-direction: column;
          gap: 20px;
        }

        .invoice-details-grid,
        .party-details,
        .declaration-section {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class InvoicePreviewComponent {
  // Sample invoice data - would be passed from parent component
  companyName = "Your Company Ltd.";
  gstin = "27AABCU9603R1Z5";
  address = "123 Business Street, Mumbai, MH 400001";
  phone = "+91 9876543210";

  invoiceNumber = "INV-001-2026";
  invoiceDate = new Date("2026-05-12");
  vehicleNumber = "MH01AB1234";
  deliveryNote = "DN-001";
  termsOfPayment = "Net 30";

  buyerName = "ABC Enterprises";
  buyerGstin = "18AABCR5055K1Z0";
  buyerAddress = "456 Customer Avenue, Delhi, DL 110001";
  buyerState = "Delhi";

  consigneeName = "ABC Enterprises Branch";
  consigneeAddress = "456 Customer Avenue, Delhi, DL 110001";
  consigneeState = "Delhi";

  items = [
    {
      productName: "Product A",
      hsnSac: "8471",
      quantity: 10,
      rate: 1000,
      gstPercent: 18,
      amount: 11800,
    },
    {
      productName: "Service B",
      hsnSac: "9983",
      quantity: 5,
      rate: 2000,
      gstPercent: 9,
      amount: 10900,
    },
  ];

  subtotal = 30000;
  cgst = 2700;
  sgst = 2700;
  igst = 0;
  grandTotal = 35400;

  amountInWords = "Thirty Five Thousand Four Hundred Only";
  declaration =
    "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.";

  bankName = "State Bank of India";
  accountNumber = "1234567890";
  ifscCode = "SBIN0001234";

  printInvoice(): void {
    window.print();
  }

  downloadPDF(): void {
    alert("PDF download feature coming soon!");
  }

  closePreview(): void {
    window.history.back();
  }
}
