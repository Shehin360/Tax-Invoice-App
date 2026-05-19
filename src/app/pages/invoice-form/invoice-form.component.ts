import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { InvoiceService } from '../../services/invoice.service';
import { ProductService } from '../../services/product.service';
import { InvoiceForm, InvoiceItem } from '../../models/invoice.model';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDividerModule,
    MatTooltipModule,
    MatExpansionModule
  ],
  template: `
    <div class="invoice-container">
      <h1 class="page-title">Create New Invoice</h1>

      <form [formGroup]="invoiceForm" class="invoice-form">
        <!-- Business Details Section -->
        <mat-card class="form-section">
          <mat-card-header>
            <mat-card-title>Business Details</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Business Name</mat-label>
                <input matInput formControlName="businessName" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>GSTIN</mat-label>
                <input matInput formControlName="gstin" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Address</mat-label>
                <textarea matInput formControlName="businessAddress" rows="2"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Phone</mat-label>
                <input matInput formControlName="businessPhone" />
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Invoice Information Section -->
        <mat-card class="form-section">
          <mat-card-header>
            <mat-card-title>Invoice Information</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Invoice Number</mat-label>
                <input matInput formControlName="invoiceNumber" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Invoice Date</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="invoiceDate" />
                <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Vehicle Number</mat-label>
                <input matInput formControlName="vehicleNumber" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Delivery Note</mat-label>
                <input matInput formControlName="deliveryNote" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Terms of Payment</mat-label>
                <input matInput formControlName="termsOfPayment" />
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Buyer Details Section -->
        <mat-card class="form-section">
          <mat-card-header>
            <mat-card-title>Buyer Details</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Buyer Name</mat-label>
                <input matInput formControlName="buyerName" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>GSTIN</mat-label>
                <input matInput formControlName="buyerGstin" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Address</mat-label>
                <textarea matInput formControlName="buyerAddress" rows="2"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>State</mat-label>
                <input matInput formControlName="buyerState" />
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Consignee Details Section -->
        <mat-card class="form-section">
          <mat-card-header>
            <mat-card-title>Consignee Details</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Consignee Name</mat-label>
                <input matInput formControlName="consigneeName" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Address</mat-label>
                <textarea matInput formControlName="consigneeAddress" rows="2"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>State</mat-label>
                <input matInput formControlName="consigneeState" />
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Products/Items Section -->
        <mat-card class="form-section">
          <mat-card-header>
            <mat-card-title>Items</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="table-container">
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Sl No</th>
                    <th>Product Name</th>
                    <th>HSN/SAC</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>GST %</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of items; let i = index">
                    <td>{{ i + 1 }}</td>
                    <td>
                      <input
                        type="text"
                        class="table-input"
                        [(ngModel)]="item.productName"
                        [ngModelOptions]="{ standalone: true }"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        class="table-input"
                        [(ngModel)]="item.hsnSac"
                        [ngModelOptions]="{ standalone: true }"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        class="table-input"
                        [(ngModel)]="item.quantity"
                        [ngModelOptions]="{ standalone: true }"
                        (change)="calculateItemAmount(i)"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        class="table-input"
                        [(ngModel)]="item.rate"
                        [ngModelOptions]="{ standalone: true }"
                        (change)="calculateItemAmount(i)"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        class="table-input"
                        [(ngModel)]="item.gstPercent"
                        [ngModelOptions]="{ standalone: true }"
                        (change)="calculateItemAmount(i)"
                      />
                    </td>
                    <td class="amount-cell">₹{{ item.amount || 0 | number: '1.0-2' }}</td>
                    <td>
                      <button
                        mat-icon-button
                        color="warn"
                        (click)="removeItem(i)"
                        matTooltip="Remove Item"
                      >
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              mat-raised-button
              color="accent"
              (click)="addItem()"
              class="add-item-btn"
            >
              <mat-icon>add</mat-icon> Add Item
            </button>
          </mat-card-content>
        </mat-card>

        <!-- Tax Summary Section -->
        <mat-card class="form-section">
          <mat-card-header>
            <mat-card-title>Tax Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="tax-summary">
              <div class="summary-row">
                <span class="label">Subtotal:</span>
                <span class="value">₹{{ taxSummary.subtotal | number: '1.0-2' }}</span>
              </div>
              <div class="summary-row">
                <span class="label">CGST (50%):</span>
                <span class="value">₹{{ taxSummary.cgst | number: '1.0-2' }}</span>
              </div>
              <div class="summary-row">
                <span class="label">SGST (50%):</span>
                <span class="value">₹{{ taxSummary.sgst | number: '1.0-2' }}</span>
              </div>
              <div class="summary-row">
                <span class="label">IGST:</span>
                <span class="value">₹{{ taxSummary.igst | number: '1.0-2' }}</span>
              </div>
              <mat-divider></mat-divider>
              <div class="summary-row grand-total">
                <span class="label">Grand Total:</span>
                <span class="value">₹{{ taxSummary.grandTotal | number: '1.0-2' }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Amount in Words & Declaration -->
        <mat-card class="form-section">
          <mat-card-header>
            <mat-card-title>Additional Information</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Amount in Words</mat-label>
              <textarea matInput formControlName="amountInWords" rows="2"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Declaration</mat-label>
              <textarea matInput formControlName="declaration" rows="3"></textarea>
            </mat-form-field>
          </mat-card-content>
        </mat-card>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button mat-raised-button color="primary" (click)="saveInvoice()">
            <mat-icon>save</mat-icon> Save Invoice
          </button>
          <button mat-raised-button (click)="previewInvoice()">
            <mat-icon>preview</mat-icon> Preview
          </button>
          <button mat-raised-button (click)="resetForm()">
            <mat-icon>clear</mat-icon> Reset
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .invoice-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-title {
      font-size: 28px;
      font-weight: 500;
      color: #333;
      margin-bottom: 24px;
    }

    .invoice-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-section {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .form-section ::ng-deep .mat-card-header {
      background-color: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;
      padding: 16px;
    }

    .form-section ::ng-deep .mat-card-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .form-section mat-card-content {
      padding: 20px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    mat-form-field {
      width: 100%;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    /* Table Styles */
    .table-container {
      overflow-x: auto;
      margin-bottom: 16px;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    .items-table th {
      background-color: #f5f5f5;
      font-weight: 600;
      color: #333;
      padding: 12px;
      text-align: left;
      border-bottom: 2px solid #e0e0e0;
      white-space: nowrap;
    }

    .items-table td {
      padding: 8px 12px;
      border-bottom: 1px solid #e0e0e0;
    }

    .items-table tbody tr:hover {
      background-color: #fafafa;
    }

    .table-input {
      width: 100%;
      padding: 6px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;

      &:focus {
        outline: none;
        border-color: #2196f3;
        box-shadow: 0 0 4px rgba(33, 150, 243, 0.3);
      }
    }

    .amount-cell {
      text-align: right;
      font-weight: 500;
      color: #2196f3;
    }

    .add-item-btn {
      margin-top: 12px;
    }

    /* Tax Summary */
    .tax-summary {
      padding: 16px;
      background-color: #f9f9f9;
      border-radius: 4px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }

    .summary-row .label {
      font-weight: 500;
      color: #666;
    }

    .summary-row .value {
      font-weight: 600;
      color: #333;
    }

    .summary-row.grand-total {
      padding: 12px 0;
      font-size: 18px;
      color: #2196f3;

      .value {
        color: #2196f3;
      }
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
      padding: 24px 0;
      flex-wrap: wrap;
    }

    .action-buttons button {
      min-width: 120px;
    }

    @media (max-width: 768px) {
      .invoice-container {
        padding: 16px;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .table-container {
        font-size: 12px;
      }

      .items-table th,
      .items-table td {
        padding: 6px;
      }

      .action-buttons {
        flex-direction: column;
      }

      .action-buttons button {
        width: 100%;
      }
    }
  `]
})
export class InvoiceFormComponent implements OnInit {
  invoiceForm!: FormGroup;
  items: InvoiceItem[] = [
    {
      id: '1',
      slNo: 1,
      productName: '',
      hsnSac: '',
      quantity: 1,
      rate: 0,
      gstPercent: 18,
      amount: 0
    }
  ];
  taxSummary = {
    subtotal: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    grandTotal: 0
  };

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadInvoiceData();
  }

  initializeForm(): void {
    this.invoiceForm = this.fb.group({
      businessName: ['', Validators.required],
      gstin: ['', Validators.required],
      businessAddress: ['', Validators.required],
      businessPhone: ['', Validators.required],
      buyerName: ['', Validators.required],
      buyerGstin: ['', Validators.required],
      buyerAddress: ['', Validators.required],
      buyerState: ['', Validators.required],
      consigneeName: [''],
      consigneeAddress: [''],
      consigneeState: [''],
      invoiceNumber: ['', Validators.required],
      invoiceDate: [new Date().toISOString().split('T')[0], Validators.required],
      vehicleNumber: [''],
      deliveryNote: [''],
      termsOfPayment: [''],
      amountInWords: [''],
      declaration: ['']
    });
  }

  loadInvoiceData(): void {
    const mockInvoices = this.invoiceService.getMockInvoices();
    if (mockInvoices.length > 0) {
      const invoice = mockInvoices[0];
      this.invoiceForm.patchValue({
        businessName: invoice.businessName,
        gstin: invoice.gstin,
        businessAddress: invoice.businessAddress,
        businessPhone: invoice.businessPhone,
        buyerName: invoice.buyerName,
        buyerGstin: invoice.buyerGstin,
        buyerAddress: invoice.buyerAddress,
        buyerState: invoice.buyerState,
        consigneeName: invoice.consigneeName,
        consigneeAddress: invoice.consigneeAddress,
        consigneeState: invoice.consigneeState,
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate,
        vehicleNumber: invoice.vehicleNumber,
        deliveryNote: invoice.deliveryNote,
        termsOfPayment: invoice.termsOfPayment,
        amountInWords: invoice.amountInWords,
        declaration: invoice.declaration
      });

      this.items = invoice.items.map(item => ({ ...item }));
      this.calculateTaxSummary();
    }
  }

  addItem(): void {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      slNo: this.items.length + 1,
      productName: '',
      hsnSac: '',
      quantity: 1,
      rate: 0,
      gstPercent: 18,
      amount: 0
    };
    this.items.push(newItem);
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
    this.calculateTaxSummary();
  }

  calculateItemAmount(index: number): void {
    const item = this.items[index];
    item.amount = this.invoiceService.calculateItemAmount(item);
    this.calculateTaxSummary();
  }

  calculateTaxSummary(): void {
    this.taxSummary = this.invoiceService.calculateTaxSummary(this.items);
  }

  saveInvoice(): void {
    if (this.invoiceForm.valid && this.items.length > 0) {
      const invoiceData: InvoiceForm = {
        ...this.invoiceForm.value,
        items: this.items,
        ...this.taxSummary
      };
      console.log('Invoice saved:', invoiceData);
      alert('Invoice saved successfully!');
    } else {
      alert('Please fill in all required fields and add at least one item.');
    }
  }

  previewInvoice(): void {
    alert('Invoice preview feature coming soon!');
  }

  resetForm(): void {
    this.invoiceForm.reset();
    this.items = [
      {
        id: '1',
        slNo: 1,
        productName: '',
        hsnSac: '',
        quantity: 1,
        rate: 0,
        gstPercent: 18,
        amount: 0
      }
    ];
    this.calculateTaxSummary();
  }
}
