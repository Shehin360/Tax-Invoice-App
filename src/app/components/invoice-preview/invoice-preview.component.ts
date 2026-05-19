import { CommonModule, DatePipe, DecimalPipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";

import { Invoice } from "../../models/invoice.model";
import { MockDataService } from "../../services/mock-data.service";

@Component({
  selector: "app-invoice-preview",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    DatePipe,
    DecimalPipe,
  ],
  template: `
    <mat-card class="preview-shell">
      <div class="preview-header">
        <div>
          <p class="eyebrow">Live Invoice Preview</p>
          <h2>GST Tax Invoice</h2>
        </div>
        <div class="badge">
          <mat-icon>visibility</mat-icon>
          <span>Auto-updating</span>
        </div>
      </div>

      <article class="invoice-sheet" *ngIf="invoice; else emptyState">
        <header class="top-grid">
          <section class="company-block">
            <div class="logo-block">
              <div class="logo-placeholder">LOGO</div>
            </div>
            <div class="company-copy">
              <h3>{{ company.name }}</h3>
              <p>{{ company.address }}</p>
              <p>Phone: {{ company.phone }}</p>
              <p>GSTIN: {{ company.gstin }}</p>
            </div>
          </section>

          <aside class="meta-block">
            <div class="meta-row">
              <span>Invoice No.</span
              ><strong>{{ invoice.invoiceNumber }}</strong>
            </div>
            <div class="meta-row">
              <span>Date</span
              ><strong>{{ invoice.invoiceDate | date: "dd/MM/yyyy" }}</strong>
            </div>
            <div class="meta-row">
              <span>Delivery Note</span
              ><strong>{{ invoice.deliveryNote || "-" }}</strong>
            </div>
            <div class="meta-row">
              <span>Vehicle No.</span
              ><strong>{{ invoice.vehicleNumber || "-" }}</strong>
            </div>
            <div class="meta-row">
              <span>Terms</span
              ><strong>{{ invoice.termsOfPayment || "-" }}</strong>
            </div>
          </aside>
        </header>

        <div class="invoice-title">
          <span>TAX INVOICE</span>
        </div>

        <section class="party-grid">
          <div class="party-card">
            <p class="section-label">Buyer</p>
            <h4>{{ invoice.buyerName || "Buyer Name" }}</h4>
            <p>GSTIN: {{ invoice.buyerGstin || "-" }}</p>
            <p>{{ invoice.buyerAddress || "-" }}</p>
            <p>State: {{ invoice.buyerState || "-" }}</p>
          </div>

          <div class="party-card">
            <p class="section-label">Consignee</p>
            <h4>{{ invoice.consigneeName || "Consignee Name" }}</h4>
            <p>GSTIN: {{ invoice.consigneeGstin || "-" }}</p>
            <p>{{ invoice.consigneeAddress || "-" }}</p>
            <p>State: {{ invoice.consigneeState || "-" }}</p>
          </div>
        </section>

        <section class="table-section">
          <table class="line-item-table">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Product Name</th>
                <th>HSN/SAC</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Rate</th>
                <th>GST %</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="
                  let item of invoice.items;
                  let i = index;
                  trackBy: trackByItemId
                ">
                <td>{{ i + 1 }}</td>
                <td>{{ item.productName }}</td>
                <td>{{ item.hsnSac }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.unit }}</td>
                <td class="numeric">₹{{ item.rate | number: "1.2-2" }}</td>
                <td class="numeric">
                  {{ item.gstPercent | number: "1.0-2" }}%
                </td>
                <td class="numeric">₹{{ item.amount | number: "1.2-2" }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="summary-grid">
          <div class="summary-card">
            <div class="summary-row">
              <span>Subtotal</span
              ><strong>₹{{ invoice.subtotal | number: "1.2-2" }}</strong>
            </div>
            <div class="summary-row">
              <span>CGST</span
              ><strong>₹{{ invoice.cgst | number: "1.2-2" }}</strong>
            </div>
            <div class="summary-row">
              <span>SGST</span
              ><strong>₹{{ invoice.sgst | number: "1.2-2" }}</strong>
            </div>
            <div class="summary-row">
              <span>IGST</span
              ><strong>₹{{ invoice.igst | number: "1.2-2" }}</strong>
            </div>
            <div class="summary-row total">
              <span>Grand Total</span
              ><strong>₹{{ invoice.grandTotal | number: "1.2-2" }}</strong>
            </div>
          </div>

          <div class="words-card">
            <p class="section-label">Amount in Words</p>
            <strong>{{ invoice.amountInWords }}</strong>
          </div>
        </section>

        <mat-divider></mat-divider>

        <section class="footer-grid">
          <div class="declaration-card">
            <p class="section-label">Declaration</p>
            <p>{{ invoice.declaration }}</p>
          </div>

          <div class="signature-card">
            <div class="signature-line"></div>
            <p>Authorized Signatory</p>
          </div>
        </section>
      </article>

      <ng-template #emptyState>
        <div class="empty-state">
          <mat-icon>description</mat-icon>
          <p>Enter invoice details to generate the live preview.</p>
        </div>
      </ng-template>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .preview-shell {
        border-radius: 24px;
        background: linear-gradient(180deg, #ffffff 0%, #faf7f0 100%);
        box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
        border: 1px solid rgba(15, 23, 42, 0.08);
        overflow: hidden;
      }

      .preview-header {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: center;
        padding: 20px 24px 0;
      }

      .eyebrow {
        margin: 0 0 6px;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: 11px;
        color: #8b5e34;
        font-weight: 700;
      }

      .preview-header h2 {
        margin: 0;
        font-size: 24px;
        color: #1f2937;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        border-radius: 999px;
        background: rgba(120, 53, 15, 0.08);
        color: #7c2d12;
        font-size: 12px;
        font-weight: 600;
      }

      .invoice-sheet {
        margin: 20px;
        padding: 24px;
        background: #fffdf9;
        border: 1px solid #d6c8b8;
        border-radius: 18px;
      }

      .top-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.4fr) minmax(240px, 0.8fr);
        gap: 18px;
      }

      .company-block {
        display: grid;
        grid-template-columns: 88px 1fr;
        gap: 16px;
        align-items: center;
      }

      .logo-placeholder {
        width: 88px;
        height: 88px;
        border-radius: 16px;
        border: 2px dashed #d4bfa7;
        display: grid;
        place-items: center;
        color: #8b5e34;
        font-weight: 800;
        background: linear-gradient(145deg, #fff8f0, #f5e8db);
      }

      .company-copy h3 {
        margin: 0 0 8px;
        font-size: 24px;
        color: #111827;
      }

      .company-copy p {
        margin: 2px 0;
        color: #4b5563;
        font-size: 13px;
        line-height: 1.45;
      }

      .meta-block {
        border: 1px solid #dccbb7;
        border-radius: 16px;
        padding: 16px;
        background: linear-gradient(180deg, #fff8ef 0%, #fff 100%);
      }

      .meta-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 6px 0;
        border-bottom: 1px dotted #e5d8c9;
        font-size: 13px;
      }

      .meta-row:last-child {
        border-bottom: none;
      }

      .meta-row span {
        color: #6b7280;
      }

      .meta-row strong {
        color: #111827;
        text-align: right;
      }

      .invoice-title {
        margin: 18px 0;
        text-align: center;
        border-top: 2px solid #111827;
        border-bottom: 2px solid #111827;
        padding: 8px 0;
        font-weight: 800;
        letter-spacing: 0.18em;
      }

      .party-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
        margin-bottom: 18px;
      }

      .party-card {
        border: 1px solid #dccbb7;
        border-radius: 16px;
        padding: 14px;
        background: #fff;
      }

      .party-card h4 {
        margin: 4px 0 8px;
        font-size: 15px;
        color: #111827;
      }

      .party-card p {
        margin: 3px 0;
        color: #4b5563;
        font-size: 13px;
        line-height: 1.4;
      }

      .section-label {
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 10px;
        font-weight: 800;
        color: #8b5e34;
      }

      .table-section {
        overflow-x: auto;
        border: 1px solid #dccbb7;
        border-radius: 16px;
        margin-bottom: 18px;
      }

      .line-item-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 820px;
      }

      .line-item-table th,
      .line-item-table td {
        border-bottom: 1px solid #e9dccf;
        padding: 12px 10px;
        font-size: 13px;
      }

      .line-item-table th {
        background: #f4e9dc;
        color: #3f2d20;
        text-align: left;
        font-weight: 700;
      }

      .line-item-table tbody tr:last-child td {
        border-bottom: none;
      }

      .numeric {
        text-align: right;
        white-space: nowrap;
      }

      .summary-grid {
        display: grid;
        grid-template-columns: minmax(0, 320px) minmax(0, 1fr);
        gap: 14px;
        margin-bottom: 16px;
      }

      .summary-card,
      .words-card,
      .declaration-card,
      .signature-card {
        border: 1px solid #dccbb7;
        border-radius: 16px;
        background: #fff;
        padding: 14px;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 6px 0;
        font-size: 13px;
      }

      .summary-row.total {
        margin-top: 4px;
        padding-top: 10px;
        border-top: 1px solid #dccbb7;
        font-size: 15px;
        font-weight: 800;
      }

      .words-card strong {
        display: block;
        margin-top: 8px;
        color: #111827;
        line-height: 1.5;
      }

      .footer-grid {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 14px;
        margin-top: 16px;
      }

      .declaration-card p:last-child {
        margin: 8px 0 0;
        color: #374151;
        font-size: 13px;
        line-height: 1.55;
      }

      .signature-card {
        display: grid;
        align-content: end;
        min-height: 120px;
        text-align: center;
      }

      .signature-line {
        border-top: 1px solid #111827;
        width: 75%;
        justify-self: center;
        margin-bottom: 10px;
      }

      .empty-state {
        display: grid;
        place-items: center;
        min-height: 360px;
        color: #6b7280;
        gap: 10px;
      }

      .empty-state mat-icon {
        width: 44px;
        height: 44px;
        font-size: 44px;
      }

      @media (max-width: 1100px) {
        .top-grid,
        .summary-grid,
        .footer-grid,
        .party-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 768px) {
        .preview-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .invoice-sheet {
          margin: 14px;
          padding: 16px;
        }

        .company-block {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class InvoicePreviewComponent {
  @Input() invoice: Invoice | null = null;

  readonly company = this.mockDataService.getCompanyProfile();

  constructor(private readonly mockDataService: MockDataService) {}

  trackByItemId(_: number, item: Invoice["items"][number]): string {
    return item.id;
  }
}
