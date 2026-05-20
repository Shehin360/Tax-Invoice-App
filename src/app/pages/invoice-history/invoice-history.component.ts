import { CommonModule } from "@angular/common";
import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from "@angular/material/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";

import {
  ElectronInvoiceHistoryItem,
  ElectronInvoiceQueryOptions,
} from "../../shared/electron-contracts";
import { InvoiceDbService } from "../../services/invoice-db.service";

@Component({
  selector: "app-invoice-history",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  template: `
    <div class="history-page">
      <div class="page-header">
        <div>
          <p class="eyebrow">Phase 3</p>
          <h1>Invoice History</h1>
          <p class="subhead">
            Search, filter, open, and delete saved invoices from the local
            SQLite store.
          </p>
        </div>
        <button mat-raised-button color="primary" routerLink="/invoice">
          <mat-icon>add</mat-icon>
          New Invoice
        </button>
      </div>

      <mat-card class="toolbar-card">
        <form [formGroup]="filterForm" class="filter-grid">
          <mat-form-field appearance="outline">
            <mat-label>Search</mat-label>
            <input
              matInput
              formControlName="searchTerm"
              placeholder="Invoice number or customer" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>From Date</mat-label>
            <input
              matInput
              [matDatepicker]="fromPicker"
              formControlName="fromDate" />
            <mat-datepicker-toggle
              matIconSuffix
              [for]="fromPicker"></mat-datepicker-toggle>
            <mat-datepicker #fromPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>To Date</mat-label>
            <input
              matInput
              [matDatepicker]="toPicker"
              formControlName="toDate" />
            <mat-datepicker-toggle
              matIconSuffix
              [for]="toPicker"></mat-datepicker-toggle>
            <mat-datepicker #toPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Sort By</mat-label>
            <mat-select formControlName="sortBy">
              <mat-option value="invoice_date">Invoice Date</mat-option>
              <mat-option value="invoice_number">Invoice Number</mat-option>
              <mat-option value="buyer_name">Customer Name</mat-option>
              <mat-option value="grand_total">Grand Total</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Direction</mat-label>
            <mat-select formControlName="sortDirection">
              <mat-option value="DESC">Newest First</mat-option>
              <mat-option value="ASC">Oldest First</mat-option>
            </mat-select>
          </mat-form-field>
        </form>

        <div class="toolbar-actions">
          <button mat-stroked-button type="button" (click)="clearFilters()">
            <mat-icon>filter_alt_off</mat-icon>
            Clear
          </button>
          <button mat-stroked-button type="button" (click)="loadInvoices()">
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
        </div>
      </mat-card>

      <mat-card class="table-card">
        <mat-card-content>
          <div class="loading-state" *ngIf="loading">
            <mat-progress-spinner
              mode="indeterminate"
              diameter="40"></mat-progress-spinner>
            <p>Loading invoices...</p>
          </div>

          <div class="empty-state" *ngIf="!loading && invoices.length === 0">
            <mat-icon>receipt_long</mat-icon>
            <h3>No invoices found</h3>
            <p>Try a different filter or create a new invoice.</p>
          </div>

          <div class="table-wrap" *ngIf="!loading && invoices.length > 0">
            <table mat-table [dataSource]="invoices" class="history-table">
              <ng-container matColumnDef="invoiceNumber">
                <th mat-header-cell *matHeaderCellDef>Invoice Number</th>
                <td mat-cell *matCellDef="let row">{{ row.invoiceNumber }}</td>
              </ng-container>

              <ng-container matColumnDef="buyerName">
                <th mat-header-cell *matHeaderCellDef>Customer Name</th>
                <td mat-cell *matCellDef="let row">{{ row.buyerName }}</td>
              </ng-container>

              <ng-container matColumnDef="invoiceDate">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let row">
                  {{ row.invoiceDate | date: "dd MMM yyyy" }}
                </td>
              </ng-container>

              <ng-container matColumnDef="grandTotal">
                <th mat-header-cell *matHeaderCellDef>Grand Total</th>
                <td mat-cell *matCellDef="let row">
                  ₹{{ row.grandTotal | number: "1.2-2" }}
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let row">
                  <button
                    mat-icon-button
                    color="primary"
                    matTooltip="Open"
                    (click)="openInvoice(row.id)">
                    <mat-icon>open_in_new</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="warn"
                    matTooltip="Delete"
                    (click)="deleteInvoice(row.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .history-page {
        padding: 24px;
        max-width: 1400px;
        margin: 0 auto;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: flex-start;
        margin-bottom: 20px;
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

      .toolbar-card,
      .table-card {
        border-radius: 20px;
        box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
      }

      .filter-grid {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 16px;
      }

      .toolbar-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 12px;
      }

      mat-form-field {
        width: 100%;
      }

      .table-card {
        margin-top: 16px;
      }

      .table-wrap {
        overflow-x: auto;
      }

      .history-table {
        width: 100%;
      }

      .history-table th {
        background: #faf5ee;
      }

      .history-table th,
      .history-table td {
        padding: 12px 10px;
      }

      .loading-state,
      .empty-state {
        display: grid;
        place-items: center;
        gap: 10px;
        min-height: 240px;
        text-align: center;
        color: #6b7280;
      }

      .empty-state mat-icon {
        font-size: 52px;
        width: 52px;
        height: 52px;
        color: #cbd5e1;
      }

      .empty-state h3 {
        margin: 0;
        color: #111827;
      }

      @media (max-width: 1200px) {
        .filter-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 768px) {
        .history-page {
          padding: 16px;
        }

        .page-header {
          flex-direction: column;
        }

        .filter-grid {
          grid-template-columns: 1fr;
        }

        .toolbar-actions {
          justify-content: stretch;
          flex-direction: column;
        }
      }
    `,
  ],
})
export class InvoiceHistoryComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  loading = false;
  invoices: ElectronInvoiceHistoryItem[] = [];
  displayedColumns = [
    "invoiceNumber",
    "buyerName",
    "invoiceDate",
    "grandTotal",
    "actions",
  ];

  filterForm = this.fb.group({
    searchTerm: [""],
    fromDate: [null as Date | null],
    toDate: [null as Date | null],
    sortBy: ["invoice_date" as ElectronInvoiceQueryOptions["sortBy"]],
    sortDirection: ["DESC" as ElectronInvoiceQueryOptions["sortDirection"]],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly invoiceDbService: InvoiceDbService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.loadInvoices();
      });

    void this.loadInvoices();
  }

  async loadInvoices(): Promise<void> {
    this.loading = true;

    try {
      const filters = this.filterForm.getRawValue();
      this.invoices = await this.invoiceDbService.getInvoices({
        searchTerm: filters.searchTerm ?? undefined,
        fromDate: filters.fromDate
          ? this.toDateString(filters.fromDate)
          : undefined,
        toDate: filters.toDate ? this.toDateString(filters.toDate) : undefined,
        sortBy: filters.sortBy ?? "invoice_date",
        sortDirection: filters.sortDirection ?? "DESC",
      });
    } catch (error) {
      console.error(error);
      this.snackBar.open("Unable to load invoices", "Close", {
        duration: 4000,
      });
    } finally {
      this.loading = false;
    }
  }

  clearFilters(): void {
    this.filterForm.reset({
      searchTerm: "",
      fromDate: null,
      toDate: null,
      sortBy: "invoice_date",
      sortDirection: "DESC",
    });
  }

  async openInvoice(id: string): Promise<void> {
    await this.router.navigate(["/invoice"], { queryParams: { id } });
  }

  async deleteInvoice(id: string): Promise<void> {
    if (!confirm("Delete this invoice? This cannot be undone.")) {
      return;
    }

    await this.invoiceDbService.deleteInvoice(id);
    this.snackBar.open("Invoice deleted", "Close", { duration: 2500 });
    await this.loadInvoices();
  }

  private toDateString(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
