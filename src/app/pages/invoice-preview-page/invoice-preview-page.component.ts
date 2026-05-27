import { CommonModule } from "@angular/common";
import { Component, DestroyRef, OnInit, inject } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

import { InvoicePrintTemplateComponent } from "../../components/invoice-print-template/invoice-print-template.component";
import { Invoice } from "../../models/invoice.model";
import { InvoiceService } from "../../services/invoice.service";
import { PdfService } from "../../services/pdf.service";

@Component({
  selector: "app-invoice-preview-page",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    InvoicePrintTemplateComponent,
  ],
  template: `
    <div class="preview-page">
      <div class="toolbar">
        <div>
          <p class="eyebrow">Phase 4</p>
          <h1>Invoice Preview</h1>
          <p class="subhead">
            Exact A4 layout used for PDF generation and printing.
          </p>
        </div>

        <div class="actions">
          <button mat-stroked-button type="button" (click)="zoomOut()">
            <mat-icon>remove</mat-icon>
            Zoom Out
          </button>
          <button mat-stroked-button type="button" (click)="zoomIn()">
            <mat-icon>add</mat-icon>
            Zoom In
          </button>
          <button
            mat-stroked-button
            type="button"
            (click)="printInvoice()"
            [disabled]="!invoice || busy">
            <mat-icon>print</mat-icon>
            Print
          </button>
          <button
            mat-raised-button
            color="primary"
            type="button"
            (click)="downloadInvoice()"
            [disabled]="!invoice || busy">
            <mat-icon>picture_as_pdf</mat-icon>
            Download PDF
          </button>
        </div>
      </div>

      <mat-card class="preview-card">
        <div class="loading-state" *ngIf="loading">
          <mat-progress-spinner
            mode="indeterminate"
            diameter="42"></mat-progress-spinner>
        </div>

        <div class="canvas" *ngIf="!loading">
          <div class="canvas-inner" [style.transform]="'scale(' + zoom + ')'">
            <app-invoice-print-template
              [invoice]="invoice"></app-invoice-print-template>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .preview-page {
        padding: 24px;
        max-width: 1600px;
        margin: 0 auto;
      }

      .toolbar {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: flex-start;
        margin-bottom: 16px;
      }

      .eyebrow {
        margin: 0 0 8px;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 11px;
        font-weight: 800;
        color: #8b5e34;
      }

      h1 {
        margin: 0;
        font-size: 32px;
        color: #1f2937;
      }

      .subhead {
        margin: 8px 0 0;
        color: #6b7280;
      }

      .actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }

      .preview-card {
        border-radius: 24px;
        box-shadow: 0 18px 44px rgba(15, 23, 42, 0.08);
        overflow: hidden;
      }

      .canvas {
        overflow: auto;
        background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);
        padding: 24px;
        min-height: 600px;
      }

      .canvas-inner {
        transform-origin: top center;
      }

      .loading-state {
        min-height: 500px;
        display: grid;
        place-items: center;
      }

      @media (max-width: 768px) {
        .preview-page {
          padding: 16px;
        }
        .toolbar {
          flex-direction: column;
        }
        .actions {
          justify-content: stretch;
        }
        .actions button {
          width: 100%;
        }
      }
    `,
  ],
})
export class InvoicePreviewPageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  loading = true;
  busy = false;
  zoom = 0.9;
  invoice: Invoice | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly invoiceService: InvoiceService,
    private readonly pdfService: PdfService,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: async (params) => {
        const invoiceId = params.get("id");
        if (!invoiceId) {
          this.loading = false;
          return;
        }

        this.loading = true;
        try {
          this.invoice = await this.invoiceService.getInvoiceById(invoiceId);
        } catch (error) {
          console.error(error);
          this.snackBar.open("Unable to load invoice", "Close", {
            duration: 4000,
          });
        } finally {
          this.loading = false;
        }
      },
    });
  }

  zoomIn(): void {
    this.zoom = Math.min(1.15, Number((this.zoom + 0.05).toFixed(2)));
  }

  zoomOut(): void {
    this.zoom = Math.max(0.7, Number((this.zoom - 0.05).toFixed(2)));
  }

  async downloadInvoice(): Promise<void> {
    if (!this.invoice?.id) {
      return;
    }

    this.busy = true;
    try {
      const pdfPath = await this.pdfService.savePDF(this.invoice.id);
      this.snackBar.open(`PDF saved: ${pdfPath.split("/").pop()}`, "Close", {
        duration: 3500,
      });
    } catch (error) {
      console.error(error);
      this.snackBar.open("Failed to generate PDF", "Close", { duration: 4000 });
    } finally {
      this.busy = false;
    }
  }

  async printInvoice(): Promise<void> {
    if (!this.invoice?.id) {
      return;
    }

    this.busy = true;
    try {
      await this.pdfService.printPDF(this.invoice.id);
    } catch (error) {
      console.error(error);
      this.snackBar.open("Printing failed", "Close", { duration: 4000 });
    } finally {
      this.busy = false;
    }
  }
}
