import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { CustomerService } from '../../services/customer.service';
import { ProductService } from '../../services/product.service';
import { InvoiceForm } from '../../models/invoice.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    RouterModule
  ],
  template: `
    <div class="dashboard-container">
      <h1 class="page-title">Dashboard</h1>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <mat-card class="stat-card invoices-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon invoices-icon">
                <mat-icon>description</mat-icon>
              </div>
              <div class="stat-info">
                <p class="stat-label">Total Invoices</p>
                <p class="stat-value">{{ totalInvoices }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card customers-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon customers-icon">
                <mat-icon>people</mat-icon>
              </div>
              <div class="stat-info">
                <p class="stat-label">Total Customers</p>
                <p class="stat-value">{{ totalCustomers }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card products-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon products-icon">
                <mat-icon>inventory</mat-icon>
              </div>
              <div class="stat-info">
                <p class="stat-label">Total Products</p>
                <p class="stat-value">{{ totalProducts }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card revenue-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon revenue-icon">
                <mat-icon>trending_up</mat-icon>
              </div>
              <div class="stat-info">
                <p class="stat-label">Total Revenue</p>
                <p class="stat-value">₹{{ totalRevenue | number }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Recent Invoices -->
      <mat-card class="recent-invoices-card">
        <mat-card-header>
          <mat-card-title>Recent Invoices</mat-card-title>
          <button mat-raised-button color="primary" routerLink="/invoice">
            <mat-icon>add</mat-icon> Create Invoice
          </button>
        </mat-card-header>
        <mat-divider></mat-divider>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="recentInvoices" class="invoices-table">
              <!-- Invoice Number Column -->
              <ng-container matColumnDef="invoiceNumber">
                <th mat-header-cell *matHeaderCellDef>Invoice #</th>
                <td mat-cell *matCellDef="let element">{{ element.invoiceNumber }}</td>
              </ng-container>

              <!-- Buyer Column -->
              <ng-container matColumnDef="buyerName">
                <th mat-header-cell *matHeaderCellDef>Buyer</th>
                <td mat-cell *matCellDef="let element">{{ element.buyerName }}</td>
              </ng-container>

              <!-- Date Column -->
              <ng-container matColumnDef="invoiceDate">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let element">{{ element.invoiceDate | date: 'MMM dd, yyyy' }}</td>
              </ng-container>

              <!-- Amount Column -->
              <ng-container matColumnDef="grandTotal">
                <th mat-header-cell *matHeaderCellDef>Amount</th>
                <td mat-cell *matCellDef="let element">₹{{ element.grandTotal | number }}</td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let element">
                  <span class="status-badge">Completed</span>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-title {
      font-size: 28px;
      font-weight: 500;
      color: #333;
      margin-bottom: 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }
    }

    .stat-card mat-card-content {
      padding: 20px;
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 32px;

      mat-icon {
        width: 32px;
        height: 32px;
        font-size: 32px;
      }
    }

    .invoices-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .customers-icon {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .products-icon {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .revenue-icon {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .stat-info {
      flex: 1;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
      margin: 0;
      margin-bottom: 4px;
      font-weight: 500;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .recent-invoices-card {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .recent-invoices-card ::ng-deep .mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      padding-bottom: 0;
    }

    .recent-invoices-card ::ng-deep .mat-card-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .recent-invoices-card mat-card-content {
      padding: 20px;
    }

    .table-container {
      overflow-x: auto;
    }

    .invoices-table {
      width: 100%;
      border-collapse: collapse;
    }

    .invoices-table th {
      background-color: #f5f5f5;
      font-weight: 600;
      color: #333;
      padding: 12px;
      text-align: left;
      border-bottom: 2px solid #e0e0e0;
    }

    .invoices-table td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
      color: #666;
    }

    .invoices-table tr:hover {
      background-color: #fafafa;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      background-color: #e8f5e9;
      color: #2e7d32;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .recent-invoices-card ::ng-deep .mat-card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalInvoices = 0;
  totalCustomers = 0;
  totalProducts = 0;
  totalRevenue = 0;
  recentInvoices: InvoiceForm[] = [];
  displayedColumns = ['invoiceNumber', 'buyerName', 'invoiceDate', 'grandTotal', 'status'];

  constructor(
    private invoiceService: InvoiceService,
    private customerService: CustomerService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.invoiceService.invoices$.subscribe(invoices => {
      this.totalInvoices = invoices.length;
      this.recentInvoices = invoices.slice(0, 5);
      this.totalRevenue = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
    });

    this.customerService.customers$.subscribe(customers => {
      this.totalCustomers = customers.length;
    });

    this.productService.products$.subscribe(products => {
      this.totalProducts = products.length;
    });
  }
}
