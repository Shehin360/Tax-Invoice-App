import { CommonModule } from "@angular/common";
import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActivatedRoute } from "@angular/router";

import { InvoicePreviewComponent } from "../../components/invoice-preview/invoice-preview.component";
import {
  Customer,
  Invoice,
  InvoiceItem,
  InvoiceTaxSummary,
  Product,
} from "../../models/invoice.model";
import { InvoiceCalculationService } from "../../services/invoice-calculation.service";
import { InvoiceService } from "../../services/invoice.service";
import { MockDataService } from "../../services/mock-data.service";
import { CustomerService } from "../../services/customer.service";
import { ProductService } from "../../services/product.service";

type InvoiceItemControls = {
  productId: FormControl<string>;
  productName: FormControl<string>;
  hsnSac: FormControl<string>;
  quantity: FormControl<number>;
  unit: FormControl<string>;
  rate: FormControl<number>;
  gstPercent: FormControl<number>;
  amount: FormControl<number>;
};

type InvoiceFormControls = {
  invoiceNumber: FormControl<string>;
  invoiceDate: FormControl<Date | null>;
  deliveryNote: FormControl<string>;
  vehicleNumber: FormControl<string>;
  termsOfPayment: FormControl<string>;
  buyerName: FormControl<string>;
  buyerGstin: FormControl<string>;
  buyerAddress: FormControl<string>;
  buyerState: FormControl<string>;
  consigneeName: FormControl<string>;
  consigneeGstin: FormControl<string>;
  consigneeAddress: FormControl<string>;
  consigneeState: FormControl<string>;
  igstPercent: FormControl<number>;
  declaration: FormControl<string>;
  items: FormArray<FormGroup<InvoiceItemControls>>;
};

@Component({
  selector: "app-invoice-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDividerModule,
    MatTooltipModule,
    InvoicePreviewComponent,
  ],
  template: `
    <div class="invoice-page">
      <div class="page-header">
        <div>
          <p class="eyebrow">Phase 2</p>
          <h1>New GST Invoice</h1>
          <p class="subhead">
            Reactive form, dynamic items, instant tax calculation, and live
            preview.
          </p>
        </div>

        <div class="header-chip">
          <mat-icon>bolt</mat-icon>
          <span>Mock data only</span>
        </div>
      </div>

      <form [formGroup]="invoiceForm" class="invoice-layout" novalidate>
        <section class="editor-column">
          <mat-card class="section-card">
            <mat-card-header>
              <mat-card-title>Invoice Details</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="grid-form two-col">
                <mat-form-field appearance="outline">
                  <mat-label>Invoice Number</mat-label>
                  <input matInput formControlName="invoiceNumber" />
                  <mat-error *ngIf="hasFormError('invoiceNumber')"
                    >Invoice number is required</mat-error
                  >
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Invoice Date</mat-label>
                  <input
                    matInput
                    [matDatepicker]="invoiceDatePicker"
                    formControlName="invoiceDate" />
                  <mat-datepicker-toggle
                    matIconSuffix
                    [for]="invoiceDatePicker"></mat-datepicker-toggle>
                  <mat-datepicker #invoiceDatePicker></mat-datepicker>
                  <mat-error *ngIf="hasFormError('invoiceDate')"
                    >Invoice date is required</mat-error
                  >
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Delivery Note</mat-label>
                  <input matInput formControlName="deliveryNote" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Vehicle Number</mat-label>
                  <input matInput formControlName="vehicleNumber" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Terms of Payment</mat-label>
                  <input matInput formControlName="termsOfPayment" />
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="section-card">
            <mat-card-header>
              <mat-card-title>Buyer Details</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="grid-form two-col">
                <mat-form-field appearance="outline">
                  <mat-label>Buyer Name</mat-label>
                  <mat-select
                    formControlName="buyerName"
                    (selectionChange)="
                      applyCustomerSelection('buyer', $event.value)
                    ">
                    <mat-option
                      *ngFor="let customer of customers"
                      [value]="customer.name"
                      >{{ customer.name }}</mat-option
                    >
                  </mat-select>
                  <mat-error *ngIf="hasFormError('buyerName')"
                    >Buyer name is required</mat-error
                  >
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Buyer GSTIN</mat-label>
                  <input matInput formControlName="buyerGstin" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Buyer Address</mat-label>
                  <textarea
                    matInput
                    rows="2"
                    formControlName="buyerAddress"></textarea>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Buyer State</mat-label>
                  <input matInput formControlName="buyerState" />
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="section-card">
            <mat-card-header>
              <mat-card-title>Consignee Details</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="grid-form two-col">
                <mat-form-field appearance="outline">
                  <mat-label>Consignee Name</mat-label>
                  <mat-select
                    formControlName="consigneeName"
                    (selectionChange)="
                      applyCustomerSelection('consignee', $event.value)
                    ">
                    <mat-option
                      *ngFor="let customer of customers"
                      [value]="customer.name"
                      >{{ customer.name }}</mat-option
                    >
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Consignee GSTIN</mat-label>
                  <input matInput formControlName="consigneeGstin" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Consignee Address</mat-label>
                  <textarea
                    matInput
                    rows="2"
                    formControlName="consigneeAddress"></textarea>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Consignee State</mat-label>
                  <input matInput formControlName="consigneeState" />
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="section-card table-card">
            <mat-card-header>
              <mat-card-title>Product Rows</mat-card-title>
              <button
                mat-stroked-button
                color="primary"
                type="button"
                (click)="addItem()">
                <mat-icon>add</mat-icon>
                Add Row
              </button>
            </mat-card-header>
            <mat-card-content>
              <div class="table-wrap" formArrayName="items">
                <table mat-table [dataSource]="itemRows" class="items-table">
                  <ng-container matColumnDef="slNo">
                    <th mat-header-cell *matHeaderCellDef>Sl No</th>
                    <td mat-cell *matCellDef="let row; let i = index">
                      {{ i + 1 }}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="productName">
                    <th mat-header-cell *matHeaderCellDef>Product Name</th>
                    <td
                      mat-cell
                      *matCellDef="let row; let i = index"
                      [formGroup]="itemGroup(i)">
                      <mat-form-field appearance="outline" class="table-field">
                        <mat-select
                          formControlName="productId"
                          (selectionChange)="
                            onProductSelected(i, $event.value)
                          ">
                          <mat-option value="">Select product</mat-option>
                          <mat-option
                            *ngFor="let product of products"
                            [value]="product.id"
                            >{{ product.name }}</mat-option
                          >
                        </mat-select>
                        <mat-error *ngIf="hasItemError(i, 'productId')"
                          >Product is required</mat-error
                        >
                      </mat-form-field>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="hsnSac">
                    <th mat-header-cell *matHeaderCellDef>HSN/SAC</th>
                    <td
                      mat-cell
                      *matCellDef="let row; let i = index"
                      [formGroup]="itemGroup(i)">
                      <mat-form-field
                        appearance="outline"
                        class="table-field compact">
                        <input matInput formControlName="hsnSac" />
                      </mat-form-field>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="quantity">
                    <th mat-header-cell *matHeaderCellDef>Quantity</th>
                    <td
                      mat-cell
                      *matCellDef="let row; let i = index"
                      [formGroup]="itemGroup(i)">
                      <mat-form-field
                        appearance="outline"
                        class="table-field compact">
                        <input
                          matInput
                          type="number"
                          formControlName="quantity"
                          min="0.01" />
                        <mat-error *ngIf="hasItemError(i, 'quantity')"
                          >Quantity must be greater than 0</mat-error
                        >
                      </mat-form-field>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="unit">
                    <th mat-header-cell *matHeaderCellDef>Unit</th>
                    <td
                      mat-cell
                      *matCellDef="let row; let i = index"
                      [formGroup]="itemGroup(i)">
                      <mat-form-field
                        appearance="outline"
                        class="table-field compact">
                        <input matInput formControlName="unit" />
                      </mat-form-field>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="rate">
                    <th mat-header-cell *matHeaderCellDef>Rate</th>
                    <td
                      mat-cell
                      *matCellDef="let row; let i = index"
                      [formGroup]="itemGroup(i)">
                      <mat-form-field
                        appearance="outline"
                        class="table-field compact">
                        <input
                          matInput
                          type="number"
                          formControlName="rate"
                          min="0.01" />
                        <mat-error *ngIf="hasItemError(i, 'rate')"
                          >Rate must be greater than 0</mat-error
                        >
                      </mat-form-field>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="gstPercent">
                    <th mat-header-cell *matHeaderCellDef>GST %</th>
                    <td
                      mat-cell
                      *matCellDef="let row; let i = index"
                      [formGroup]="itemGroup(i)">
                      <mat-form-field
                        appearance="outline"
                        class="table-field compact">
                        <input
                          matInput
                          type="number"
                          formControlName="gstPercent"
                          min="0" />
                        <mat-error *ngIf="hasItemError(i, 'gstPercent')"
                          >GST cannot be negative</mat-error
                        >
                      </mat-form-field>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="amount">
                    <th mat-header-cell *matHeaderCellDef>Amount</th>
                    <td
                      mat-cell
                      *matCellDef="let row; let i = index"
                      [formGroup]="itemGroup(i)">
                      <mat-form-field
                        appearance="outline"
                        class="table-field compact readonly-field">
                        <input matInput formControlName="amount" readonly />
                      </mat-form-field>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Action</th>
                    <td mat-cell *matCellDef="let row; let i = index">
                      <button
                        mat-icon-button
                        color="warn"
                        type="button"
                        matTooltip="Remove row"
                        (click)="removeItem(i)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr
                    mat-row
                    *matRowDef="
                      let row;
                      columns: displayedColumns;
                      trackBy: trackByRow
                    "></tr>
                </table>
              </div>
            </mat-card-content>
          </mat-card>

          <div class="action-row">
            <button
              mat-raised-button
              color="primary"
              type="button"
              (click)="saveInvoice()">
              <mat-icon>save</mat-icon>
              Save Invoice
            </button>
            <button mat-stroked-button type="button" (click)="resetForm()">
              <mat-icon>restart_alt</mat-icon>
              Reset Draft
            </button>
          </div>

          <p class="status-text" *ngIf="statusMessage">{{ statusMessage }}</p>
        </section>

        <aside class="preview-column">
          <mat-card class="sticky-summary">
            <mat-card-header>
              <mat-card-title>Tax Summary</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="grid-form summary-grid">
                <mat-form-field appearance="outline">
                  <mat-label>IGST %</mat-label>
                  <input
                    matInput
                    type="number"
                    formControlName="igstPercent"
                    min="0" />
                </mat-form-field>
              </div>

              <div class="summary-list">
                <div class="summary-line">
                  <span>Subtotal</span
                  ><strong>{{ taxSummary.subtotal | number: "1.2-2" }}</strong>
                </div>
                <div class="summary-line">
                  <span>CGST</span
                  ><strong>{{ taxSummary.cgst | number: "1.2-2" }}</strong>
                </div>
                <div class="summary-line">
                  <span>SGST</span
                  ><strong>{{ taxSummary.sgst | number: "1.2-2" }}</strong>
                </div>
                <div class="summary-line">
                  <span>IGST</span
                  ><strong>{{ taxSummary.igst | number: "1.2-2" }}</strong>
                </div>
                <mat-divider></mat-divider>
                <div class="summary-line total">
                  <span>Grand Total</span
                  ><strong>{{
                    taxSummary.grandTotal | number: "1.2-2"
                  }}</strong>
                </div>
              </div>

              <div class="words-box">
                <p class="eyebrow small">Amount in Words</p>
                <strong>{{ amountInWords }}</strong>
              </div>
            </mat-card-content>
          </mat-card>

          <app-invoice-preview [invoice]="previewInvoice"></app-invoice-preview>
        </aside>
      </form>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        background: linear-gradient(180deg, #f7f1e8 0%, #f3eee6 100%);
        min-height: 100%;
      }

      .invoice-page {
        padding: 24px;
        max-width: 1600px;
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

      .eyebrow.small {
        font-size: 10px;
        margin-bottom: 4px;
      }

      .page-header h1 {
        margin: 0;
        font-size: 32px;
        color: #1f2937;
      }

      .subhead {
        margin: 8px 0 0;
        color: #6b7280;
      }

      .header-chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        border-radius: 999px;
        background: rgba(120, 53, 15, 0.08);
        color: #7c2d12;
        font-weight: 700;
        white-space: nowrap;
      }

      .invoice-layout {
        display: grid;
        grid-template-columns: minmax(0, 1.35fr) minmax(380px, 0.9fr);
        gap: 20px;
        align-items: start;
      }

      .editor-column,
      .preview-column {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .section-card,
      .sticky-summary {
        border-radius: 20px;
        border: 1px solid rgba(15, 23, 42, 0.08);
        box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
      }

      .section-card mat-card-header,
      .sticky-summary mat-card-header {
        padding-bottom: 4px;
      }

      .section-card mat-card-content,
      .sticky-summary mat-card-content {
        padding-top: 8px;
      }

      .grid-form {
        display: grid;
        gap: 16px;
      }

      .two-col {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .full-width {
        grid-column: 1 / -1;
      }

      mat-form-field {
        width: 100%;
      }

      .table-card mat-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .table-wrap {
        overflow-x: auto;
      }

      .items-table {
        width: 100%;
        min-width: 1150px;
        border-collapse: collapse;
      }

      .items-table th {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #6b7280;
        background: #faf5ee;
      }

      .items-table th,
      .items-table td {
        padding: 10px 8px;
        border-bottom: 1px solid #eadfce;
        vertical-align: top;
      }

      .table-field {
        width: 100%;
        margin-bottom: -1.25em;
      }

      .compact ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }

      .readonly-field input {
        color: #111827;
        font-weight: 700;
      }

      .action-row {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .action-row button {
        min-width: 160px;
      }

      .status-text {
        margin: 0;
        color: #6b7280;
      }

      .sticky-summary {
        position: sticky;
        top: 18px;
      }

      .summary-grid {
        margin-bottom: 10px;
      }

      .summary-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .summary-line {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        font-size: 14px;
      }

      .summary-line.total {
        font-size: 16px;
        font-weight: 800;
        color: #111827;
      }

      .words-box {
        margin-top: 14px;
        padding: 14px;
        border-radius: 16px;
        background: linear-gradient(180deg, #fff7ed 0%, #fff 100%);
        border: 1px solid #f1d7ba;
      }

      .words-box strong {
        display: block;
        margin-top: 6px;
        color: #111827;
        line-height: 1.5;
      }

      @media (max-width: 1200px) {
        .invoice-layout {
          grid-template-columns: 1fr;
        }

        .sticky-summary {
          position: static;
        }
      }

      @media (max-width: 768px) {
        .invoice-page {
          padding: 16px;
        }

        .page-header {
          flex-direction: column;
        }

        .two-col {
          grid-template-columns: 1fr;
        }

        .action-row button {
          width: 100%;
        }
      }
    `,
  ],
})
export class InvoiceFormComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  invoiceForm!: FormGroup<InvoiceFormControls>;
  previewInvoice: Invoice | null = null;
  taxSummary: InvoiceTaxSummary = {
    subtotal: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    grandTotal: 0,
  };
  amountInWords = "Zero Only";
  statusMessage = "";
  private selectedInvoiceId: string | null = null;

  customers: Customer[] = [];
  products: Product[] = [];
  readonly displayedColumns = [
    "slNo",
    "productName",
    "hsnSac",
    "quantity",
    "unit",
    "rate",
    "gstPercent",
    "amount",
    "actions",
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly calculationService: InvoiceCalculationService,
    private readonly mockDataService: MockDataService,
    private readonly invoiceService: InvoiceService,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService,
    private readonly snackBar: MatSnackBar,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.invoiceForm = this.buildForm();

    this.customerService.customers$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((customers) => {
        this.customers = customers;
      });

    this.productService.products$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => {
        this.products = products;
      });

    void this.loadInitialState();

    this.invoiceForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.recalculateInvoice();
      });

    this.recalculateInvoice();
  }

  get itemRows(): FormGroup<InvoiceItemControls>[] {
    return this.itemsArray.controls;
  }

  get itemsArray(): FormArray<FormGroup<InvoiceItemControls>> {
    return this.invoiceForm.controls.items;
  }

  itemGroup(index: number): FormGroup<InvoiceItemControls> {
    return this.itemsArray.at(index);
  }

  trackByRow(index: number): number {
    return index;
  }

  hasFormError(controlName: keyof Omit<InvoiceFormControls, "items">): boolean {
    const control = this.invoiceForm.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  hasItemError(index: number, controlName: keyof InvoiceItemControls): boolean {
    const control = this.itemGroup(index).controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  addItem(item?: Partial<InvoiceItem>): void {
    this.itemsArray.push(this.createItemGroup(item));
    this.recalculateInvoice();
  }

  removeItem(index: number): void {
    if (this.itemsArray.length > 1) {
      this.itemsArray.removeAt(index);
    } else {
      this.itemsArray.at(0).reset({
        productId: "",
        productName: "",
        hsnSac: "",
        quantity: 1,
        unit: "",
        rate: 0,
        gstPercent: 0,
        amount: 0,
      });
    }

    this.recalculateInvoice();
  }

  onProductSelected(index: number, productId: string): void {
    const product = this.products.find(
      (candidate) => candidate.id === productId,
    );

    if (!product) {
      return;
    }

    this.itemGroup(index).patchValue(
      {
        productId: product.id,
        productName: product.name,
        hsnSac: product.hsnSac,
        unit: product.unit,
        rate: product.rate,
        gstPercent: product.gstPercent,
      },
      { emitEvent: false },
    );

    this.recalculateInvoice();
  }

  applyCustomerSelection(
    type: "buyer" | "consignee",
    customerName: string,
  ): void {
    const customer = this.customers.find(
      (candidate) => candidate.name === customerName,
    );

    if (!customer) {
      return;
    }

    const patch = {
      name: customer.name,
      gstin: customer.gstin,
      address: customer.address,
      state: customer.state,
    };

    if (type === "buyer") {
      this.invoiceForm.patchValue(
        {
          buyerName: patch.name,
          buyerGstin: patch.gstin,
          buyerAddress: patch.address,
          buyerState: patch.state,
        },
        { emitEvent: false },
      );
    } else {
      this.invoiceForm.patchValue(
        {
          consigneeName: patch.name,
          consigneeGstin: patch.gstin,
          consigneeAddress: patch.address,
          consigneeState: patch.state,
        },
        { emitEvent: false },
      );
    }

    this.recalculateInvoice();
  }

  async saveInvoice(): Promise<void> {
    if (this.invoiceForm.invalid || this.itemsArray.length === 0) {
      this.invoiceForm.markAllAsTouched();
      this.itemsArray.controls.forEach((group) => group.markAllAsTouched());
      this.statusMessage =
        "Please fix the highlighted validation errors before saving.";
      return;
    }

    const invoice = this.buildInvoicePayload();
    try {
      await this.invoiceService.saveInvoice(invoice);
      this.statusMessage = `Invoice ${invoice.invoiceNumber} saved successfully.`;
      this.snackBar.open(`Invoice ${invoice.invoiceNumber} saved`, "Close", {
        duration: 3000,
      });
      await this.initializeInvoiceNumber();
    } catch (error) {
      console.error(error);
      this.statusMessage = "Unable to save the invoice. Please try again.";
      this.snackBar.open("Failed to save invoice", "Close", {
        duration: 4000,
      });
    }
  }

  resetForm(): void {
    this.loadDraft(this.mockDataService.getSampleInvoiceDraft());
    this.recalculateInvoice();
    this.statusMessage = "Draft reset to the sample invoice.";
    this.selectedInvoiceId = null;
    void this.initializeInvoiceNumber();
  }

  private buildForm(): FormGroup<InvoiceFormControls> {
    return this.fb.group({
      invoiceNumber: this.fb.control("INV-2026-001", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      invoiceDate: this.fb.control<Date | null>(
        this.mockDataService.getDefaultInvoiceDate(),
        {
          validators: [Validators.required],
        },
      ),
      deliveryNote: this.fb.control("", { nonNullable: true }),
      vehicleNumber: this.fb.control("", { nonNullable: true }),
      termsOfPayment: this.fb.control("Net 30 Days", { nonNullable: true }),
      buyerName: this.fb.control("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      buyerGstin: this.fb.control("", { nonNullable: true }),
      buyerAddress: this.fb.control("", { nonNullable: true }),
      buyerState: this.fb.control("", { nonNullable: true }),
      consigneeName: this.fb.control("", { nonNullable: true }),
      consigneeGstin: this.fb.control("", { nonNullable: true }),
      consigneeAddress: this.fb.control("", { nonNullable: true }),
      consigneeState: this.fb.control("", { nonNullable: true }),
      igstPercent: this.fb.control(0, {
        nonNullable: true,
        validators: [Validators.min(0)],
      }),
      declaration: this.fb.control(
        this.mockDataService.getDefaultDeclaration(),
        { nonNullable: true },
      ),
      items: this.fb.array([this.createItemGroup()]) as FormArray<
        FormGroup<InvoiceItemControls>
      >,
    }) as FormGroup<InvoiceFormControls>;
  }

  private createItemGroup(
    item?: Partial<InvoiceItem>,
  ): FormGroup<InvoiceItemControls> {
    return this.fb.group({
      productId: this.fb.control(item?.productId ?? "", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      productName: this.fb.control(item?.productName ?? "", {
        nonNullable: true,
      }),
      hsnSac: this.fb.control(item?.hsnSac ?? "", { nonNullable: true }),
      quantity: this.fb.control(item?.quantity ?? 1, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0.01)],
      }),
      unit: this.fb.control(item?.unit ?? "", { nonNullable: true }),
      rate: this.fb.control(item?.rate ?? 0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0.01)],
      }),
      gstPercent: this.fb.control(item?.gstPercent ?? 0, {
        nonNullable: true,
        validators: [Validators.min(0)],
      }),
      amount: this.fb.control(item?.amount ?? 0, { nonNullable: true }),
    }) as FormGroup<InvoiceItemControls>;
  }

  private loadDraft(draft: Partial<Invoice>): void {
    this.invoiceForm.patchValue(
      {
        invoiceNumber: draft.invoiceNumber ?? "INV-2026-001",
        invoiceDate:
          this.coerceDate(draft.invoiceDate) ??
          this.mockDataService.getDefaultInvoiceDate(),
        deliveryNote: draft.deliveryNote ?? "",
        vehicleNumber: draft.vehicleNumber ?? "",
        termsOfPayment: draft.termsOfPayment ?? "Net 30 Days",
        buyerName: draft.buyerName ?? "",
        buyerGstin: draft.buyerGstin ?? "",
        buyerAddress: draft.buyerAddress ?? "",
        buyerState: draft.buyerState ?? "",
        consigneeName: draft.consigneeName ?? "",
        consigneeGstin: draft.consigneeGstin ?? "",
        consigneeAddress: draft.consigneeAddress ?? "",
        consigneeState: draft.consigneeState ?? "",
        declaration:
          draft.declaration ?? this.mockDataService.getDefaultDeclaration(),
      },
      { emitEvent: false },
    );

    this.itemsArray.clear();

    if (draft.items && draft.items.length > 0) {
      draft.items.forEach((item) =>
        this.itemsArray.push(this.createItemGroup(item)),
      );
    } else {
      this.itemsArray.push(this.createItemGroup());
    }
  }

  private async initializeInvoiceNumber(): Promise<void> {
    if (this.selectedInvoiceId) {
      return;
    }

    const nextInvoiceNumber = await this.invoiceService.getNextInvoiceNumber(
      this.invoiceForm.controls.invoiceDate.value ?? undefined,
    );
    this.invoiceForm.controls.invoiceNumber.setValue(nextInvoiceNumber, {
      emitEvent: false,
    });
    this.recalculateInvoice();
  }

  private async loadInitialState(): Promise<void> {
    const invoiceId = this.route.snapshot.queryParamMap.get("id");

    if (invoiceId) {
      const invoice = await this.invoiceService.getInvoiceById(invoiceId);

      if (invoice) {
        this.selectedInvoiceId = invoice.id ?? invoiceId;
        this.loadDraft(invoice);
        this.recalculateInvoice();
        this.statusMessage = `Editing invoice ${invoice.invoiceNumber}.`;
        return;
      }
    }

    this.loadDraft(this.mockDataService.getSampleInvoiceDraft());
    this.recalculateInvoice();
    await this.initializeInvoiceNumber();
  }

  private recalculateInvoice(): void {
    const items = this.itemRows.map((group, index) => {
      const productId = group.controls.productId.value;
      const product = this.products.find(
        (candidate) => candidate.id === productId,
      );

      if (product) {
        const nextPatch = {
          productName: product.name,
          hsnSac: product.hsnSac,
          unit: product.unit,
          rate: product.rate,
          gstPercent: product.gstPercent,
        };
        group.patchValue(nextPatch, { emitEvent: false });
      }

      const quantity = Number(group.controls.quantity.value) || 0;
      const rate = Number(group.controls.rate.value) || 0;
      const amount = this.calculationService.calculateItemAmount(
        quantity,
        rate,
      );

      if (group.controls.amount.value !== amount) {
        group.controls.amount.setValue(amount, { emitEvent: false });
      }

      return {
        id: product?.id || group.controls.productId.value || `row-${index + 1}`,
        slNo: index + 1,
        productId: product?.id || group.controls.productId.value,
        productName: product?.name || group.controls.productName.value,
        hsnSac: group.controls.hsnSac.value,
        quantity,
        unit: group.controls.unit.value,
        rate,
        gstPercent: Number(group.controls.gstPercent.value) || 0,
        amount,
      } satisfies InvoiceItem;
    });

    const igstPercent =
      Number(this.invoiceForm.controls.igstPercent.value) || 0;
    this.taxSummary = this.calculationService.calculateTaxSummary(
      items,
      igstPercent,
    );
    this.amountInWords = this.calculationService.convertAmountToWords(
      this.taxSummary.grandTotal,
    );
    this.previewInvoice = this.buildInvoicePayload(items);
  }

  private buildInvoicePayload(
    items: InvoiceItem[] = this.itemRows.map((group, index) =>
      this.serializeItem(group, index),
    ),
  ): Invoice {
    const raw = this.invoiceForm.getRawValue();

    return {
      invoiceNumber: raw.invoiceNumber,
      invoiceDate:
        raw.invoiceDate ?? this.mockDataService.getDefaultInvoiceDate(),
      deliveryNote: raw.deliveryNote,
      vehicleNumber: raw.vehicleNumber,
      termsOfPayment: raw.termsOfPayment,
      buyerName: raw.buyerName,
      buyerGstin: raw.buyerGstin,
      buyerAddress: raw.buyerAddress,
      buyerState: raw.buyerState,
      consigneeName: raw.consigneeName,
      consigneeGstin: raw.consigneeGstin,
      consigneeAddress: raw.consigneeAddress,
      consigneeState: raw.consigneeState,
      items,
      subtotal: this.taxSummary.subtotal,
      cgst: this.taxSummary.cgst,
      sgst: this.taxSummary.sgst,
      igst: this.taxSummary.igst,
      grandTotal: this.taxSummary.grandTotal,
      amountInWords: this.amountInWords,
      declaration: raw.declaration,
      id: this.selectedInvoiceId ?? undefined,
    };
  }

  private serializeItem(
    group: FormGroup<InvoiceItemControls>,
    index: number,
  ): InvoiceItem {
    const product = this.products.find(
      (candidate) => candidate.id === group.controls.productId.value,
    );
    const quantity = Number(group.controls.quantity.value) || 0;
    const rate = Number(group.controls.rate.value) || 0;

    return {
      id: product?.id || group.controls.productId.value || `row-${index + 1}`,
      slNo: index + 1,
      productId: product?.id || group.controls.productId.value,
      productName: product?.name || group.controls.productName.value,
      hsnSac: group.controls.hsnSac.value,
      quantity,
      unit: group.controls.unit.value,
      rate,
      gstPercent: Number(group.controls.gstPercent.value) || 0,
      amount: this.calculationService.calculateItemAmount(quantity, rate),
    };
  }

  private coerceDate(value: string | Date | undefined): Date | null {
    if (!value) {
      return null;
    }

    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
}
