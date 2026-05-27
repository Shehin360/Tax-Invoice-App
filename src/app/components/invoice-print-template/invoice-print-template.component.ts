import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  DecimalPipe,
} from "@angular/common";
import { Component, Input } from "@angular/core";

import { Invoice } from "../../models/invoice.model";
import { SettingsService } from "../../services/settings.service";

@Component({
  selector: "app-invoice-print-template",
  standalone: true,
  imports: [CommonModule, AsyncPipe, DatePipe, DecimalPipe],
  template: `
    <section class="print-wrap" [class.compact]="compact">
      <article class="sheet" *ngIf="invoice; else emptyState">
        <ng-container *ngIf="settings$ | async as company">
          <header class="header-grid">
            <div class="company-panel">
              <div class="logo-slot">
                <img
                  *ngIf="company.logoUrl; else logoFallback"
                  class="logo"
                  [src]="company.logoUrl"
                  alt="Company logo" />
                <ng-template #logoFallback>
                  <div class="logo-fallback">LOGO</div>
                </ng-template>
              </div>

              <div class="company-copy">
                <h1>{{ company.companyName }}</h1>
                <p>{{ company.address }}</p>
                <p *ngIf="company.city || company.state">
                  {{ company.city
                  }}<span *ngIf="company.city && company.state">, </span
                  >{{ company.state }}
                </p>
                <p>GSTIN: {{ company.gstin }}</p>
                <p>Phone: {{ company.phone }}</p>
                <p *ngIf="company.bankName">
                  {{ company.bankName }} | A/C {{ company.accountNumber }} |
                  IFSC {{ company.ifscCode }}
                </p>
              </div>
            </div>

            <aside class="meta-panel">
              <table>
                <tr>
                  <td>Invoice No.</td>
                  <td>{{ invoice.invoiceNumber }}</td>
                </tr>
                <tr>
                  <td>Invoice Date</td>
                  <td>{{ invoice.invoiceDate | date: "dd/MM/yyyy" }}</td>
                </tr>
                <tr>
                  <td>Delivery Note</td>
                  <td>{{ invoice.deliveryNote || "-" }}</td>
                </tr>
                <tr>
                  <td>Vehicle No.</td>
                  <td>{{ invoice.vehicleNumber || "-" }}</td>
                </tr>
                <tr>
                  <td>Terms</td>
                  <td>{{ invoice.termsOfPayment || "-" }}</td>
                </tr>
              </table>
            </aside>
          </header>

          <div class="title">TAX INVOICE</div>

          <section class="parties">
            <div class="party-box">
              <p class="label">Buyer Details</p>
              <h2>{{ invoice.buyerName || "Buyer Name" }}</h2>
              <p>GSTIN: {{ invoice.buyerGstin || "-" }}</p>
              <p>{{ invoice.buyerAddress || "-" }}</p>
              <p>State: {{ invoice.buyerState || "-" }}</p>
            </div>

            <div class="party-box">
              <p class="label">Consignee Details</p>
              <h2>{{ invoice.consigneeName || "Consignee Name" }}</h2>
              <p>GSTIN: {{ invoice.consigneeGstin || "-" }}</p>
              <p>{{ invoice.consigneeAddress || "-" }}</p>
              <p>State: {{ invoice.consigneeState || "-" }}</p>
            </div>
          </section>

          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 8mm;">Sl No</th>
                <th>Product Name</th>
                <th style="width: 18mm;">HSN/SAC</th>
                <th style="width: 14mm;">Qty</th>
                <th style="width: 16mm;">Unit</th>
                <th style="width: 22mm;">Rate</th>
                <th style="width: 16mm;">GST %</th>
                <th style="width: 24mm;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="
                  let item of invoice.items;
                  let i = index;
                  trackBy: trackByItemId
                ">
                <td class="center">{{ i + 1 }}</td>
                <td>{{ item.productName }}</td>
                <td class="center">{{ item.hsnSac }}</td>
                <td class="center">{{ item.quantity }}</td>
                <td class="center">{{ item.unit }}</td>
                <td class="right">₹{{ item.rate | number: "1.2-2" }}</td>
                <td class="center">{{ item.gstPercent | number: "1.0-2" }}%</td>
                <td class="right">₹{{ item.amount | number: "1.2-2" }}</td>
              </tr>
            </tbody>
          </table>

          <section class="summary-grid">
            <div class="words-box">
              <p class="label">Amount in Words</p>
              <strong>{{ invoice.amountInWords }}</strong>
            </div>

            <div class="summary-box">
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
          </section>

          <footer class="footer-grid">
            <div class="declaration-box">
              <p class="label">Declaration</p>
              <p>{{ invoice.declaration }}</p>
              <p class="computer-generated">Computer Generated Invoice</p>
            </div>

            <div class="signature-box">
              <div class="signature-line"></div>
              <p>Authorized Signatory</p>
            </div>
          </footer>
        </ng-container>
      </article>

      <ng-template #emptyState>
        <div class="empty-state">No invoice selected.</div>
      </ng-template>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .print-wrap {
        display: block;
        padding: 16px;
      }

      .sheet {
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        background: #fff;
        color: #111827;
        border: 1px solid #111827;
        padding: 8mm;
        font-family: Arial, Helvetica, sans-serif;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .compact .sheet {
        transform: scale(0.87);
        transform-origin: top center;
        margin-bottom: -10%;
      }

      .header-grid {
        display: grid;
        grid-template-columns: 1.2fr 0.85fr;
        gap: 6mm;
      }

      .company-panel {
        display: grid;
        grid-template-columns: 28mm 1fr;
        gap: 4mm;
        align-items: center;
      }

      .logo,
      .logo-fallback {
        width: 28mm;
        height: 28mm;
        object-fit: contain;
        border: 1px solid #cbd5e1;
        padding: 2mm;
      }

      .logo-fallback {
        display: grid;
        place-items: center;
        font-weight: 700;
      }

      .company-copy h1 {
        margin: 0 0 2mm;
        font-size: 16pt;
        line-height: 1.15;
      }

      .company-copy p {
        margin: 0.5mm 0;
        font-size: 9.5pt;
        line-height: 1.35;
      }

      .meta-panel {
        border: 1px solid #111827;
        padding: 3mm;
      }

      .meta-panel table,
      .items-table {
        width: 100%;
        border-collapse: collapse;
      }

      .meta-panel td {
        padding: 1.3mm 0;
        vertical-align: top;
        font-size: 9.5pt;
      }

      .meta-panel td:last-child {
        text-align: right;
        font-weight: 700;
      }

      .title {
        margin: 3mm 0;
        text-align: center;
        font-weight: 800;
        letter-spacing: 0.2em;
        border-top: 1px solid #111827;
        border-bottom: 1px solid #111827;
        padding: 2mm 0;
      }

      .parties {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 4mm;
        margin-bottom: 4mm;
      }

      .party-box,
      .words-box,
      .summary-box,
      .declaration-box,
      .signature-box {
        border: 1px solid #111827;
        padding: 3mm;
      }

      .party-box h2 {
        margin: 0 0 2mm;
        font-size: 10.5pt;
      }

      .party-box p,
      .declaration-box p,
      .signature-box p {
        margin: 1mm 0;
        font-size: 9.5pt;
        line-height: 1.4;
      }

      .label {
        margin: 0 0 1.5mm;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 8.5pt;
        font-weight: 800;
        color: #8b5e34;
      }

      .items-table th,
      .items-table td {
        border: 1px solid #111827;
        padding: 1.8mm 1.4mm;
        font-size: 9pt;
        vertical-align: top;
      }

      .items-table th {
        background: #f3f4f6;
        text-align: center;
        font-weight: 700;
      }

      .items-table tr {
        page-break-inside: avoid;
      }

      .center {
        text-align: center;
      }

      .right {
        text-align: right;
        white-space: nowrap;
      }

      .summary-grid {
        display: grid;
        grid-template-columns: 1fr 74mm;
        gap: 4mm;
        margin-top: 4mm;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        gap: 4mm;
        font-size: 9.5pt;
        padding: 1.4mm 0;
      }

      .summary-row.total {
        margin-top: 1mm;
        padding-top: 2mm;
        border-top: 1px solid #111827;
        font-weight: 700;
      }

      .words-box strong {
        display: block;
        margin-top: 1.5mm;
        line-height: 1.45;
      }

      .footer-grid {
        display: grid;
        grid-template-columns: 1fr 42mm;
        gap: 4mm;
        margin-top: 4mm;
        align-items: end;
      }

      .signature-box {
        display: grid;
        align-content: end;
        min-height: 34mm;
        text-align: center;
      }

      .signature-line {
        border-top: 1px solid #111827;
        margin-bottom: 2mm;
      }

      .computer-generated {
        text-align: center;
        font-weight: 700;
        margin-top: 3mm;
      }

      .empty-state {
        display: grid;
        place-items: center;
        min-height: 280px;
        color: #6b7280;
      }

      @media print {
        .print-wrap {
          padding: 0;
        }
        .sheet {
          border: none;
          margin: 0;
          transform: none !important;
        }
      }
    `,
  ],
})
export class InvoicePrintTemplateComponent {
  @Input() invoice: Invoice | null = null;
  @Input() compact = false;

  readonly settings$ = this.settingsService.settings$;

  constructor(private readonly settingsService: SettingsService) {}

  trackByItemId(_: number, item: Invoice["items"][number]): string {
    return item.id;
  }
}
