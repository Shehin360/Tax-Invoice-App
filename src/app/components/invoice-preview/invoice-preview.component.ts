import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";

import { Invoice } from "../../models/invoice.model";
import { InvoicePrintTemplateComponent } from "../invoice-print-template/invoice-print-template.component";

@Component({
  selector: "app-invoice-preview",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    InvoicePrintTemplateComponent,
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

      <div class="preview-body" *ngIf="invoice; else emptyState">
        <app-invoice-print-template
          [invoice]="invoice"
          [compact]="true"></app-invoice-print-template>
      </div>

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

      .preview-body {
        overflow: auto;
        padding: 0 10px 10px;
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
    `,
  ],
})
export class InvoicePreviewComponent {
  @Input() invoice: Invoice | null = null;
}
