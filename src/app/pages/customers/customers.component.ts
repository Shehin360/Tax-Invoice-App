import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDividerModule } from "@angular/material/divider";
import { CustomerService } from "../../services/customer.service";
import { Customer } from "../../models/customer.model";

@Component({
  selector: "app-customers",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  template: `
    <div class="customers-container">
      <h1 class="page-title">Customers</h1>

      <mat-card class="customers-card">
        <mat-card-header>
          <div class="header-content">
            <mat-card-title>Customer List</mat-card-title>
            <button mat-raised-button color="primary">
              <mat-icon>add</mat-icon> Add Customer
            </button>
          </div>
        </mat-card-header>
        <mat-divider></mat-divider>

        <!-- Search Bar -->
        <mat-card-content class="search-section">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search Customers</mat-label>
            <input
              matInput
              [(ngModel)]="searchTerm"
              (keyup)="searchCustomers()"
              placeholder="Search by name, GSTIN, or email..." />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </mat-card-content>

        <!-- Customers Table -->
        <mat-card-content class="table-content">
          <div class="table-container">
            <table
              mat-table
              [dataSource]="filteredCustomers"
              class="customers-table">
              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Customer Name</th>
                <td mat-cell *matCellDef="let element">
                  <div class="cell-content">
                    <mat-icon class="cell-icon">person</mat-icon>
                    {{ element.name }}
                  </div>
                </td>
              </ng-container>

              <!-- GSTIN Column -->
              <ng-container matColumnDef="gstin">
                <th mat-header-cell *matHeaderCellDef>GSTIN</th>
                <td mat-cell *matCellDef="let element">{{ element.gstin }}</td>
              </ng-container>

              <!-- Email Column -->
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let element">{{ element.email }}</td>
              </ng-container>

              <!-- State Column -->
              <ng-container matColumnDef="state">
                <th mat-header-cell *matHeaderCellDef>State</th>
                <td mat-cell *matCellDef="let element">{{ element.state }}</td>
              </ng-container>

              <!-- Phone Column -->
              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef>Phone</th>
                <td mat-cell *matCellDef="let element">{{ element.phone }}</td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let element">
                  <button mat-icon-button color="primary" matTooltip="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="warn"
                    matTooltip="Delete"
                    (click)="deleteCustomer(element.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>

            <div *ngIf="filteredCustomers.length === 0" class="no-data">
              <mat-icon>info</mat-icon>
              <p>No customers found</p>
            </div>
          </div>
        </mat-card-content>

        <!-- Stats Footer -->
        <mat-divider></mat-divider>
        <mat-card-content class="footer-stats">
          <span
            >Total Customers:
            <strong>{{ filteredCustomers.length }}</strong></span
          >
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .customers-container {
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

      .customers-card {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .customers-card ::ng-deep .mat-card-header {
        padding: 20px;
        background-color: #f5f5f5;
        border-bottom: 1px solid #e0e0e0;
      }

      .customers-card ::ng-deep .mat-card-title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin: 0;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .search-section {
        padding: 20px;
        background-color: #fafafa;
        border-bottom: 1px solid #e0e0e0;
      }

      .search-field {
        width: 100%;
        max-width: 400px;
      }

      .table-content {
        padding: 0;
      }

      .table-container {
        overflow-x: auto;
        min-height: 300px;
      }

      .customers-table {
        width: 100%;
        border-collapse: collapse;
      }

      .customers-table th {
        background-color: #f5f5f5;
        font-weight: 600;
        color: #333;
        padding: 12px;
        text-align: left;
        border-bottom: 2px solid #e0e0e0;
        white-space: nowrap;
      }

      .customers-table td {
        padding: 12px;
        border-bottom: 1px solid #e0e0e0;
        color: #666;
      }

      .customers-table tbody tr:hover {
        background-color: #fafafa;
      }

      .cell-content {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .cell-icon {
        color: #2196f3;
        width: 20px;
        height: 20px;
        font-size: 20px;
      }

      .no-data {
        text-align: center;
        padding: 40px;
        color: #999;
      }

      .no-data mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #ddd;
        margin-bottom: 16px;
      }

      .no-data p {
        font-size: 16px;
        margin: 0;
      }

      .footer-stats {
        padding: 16px 20px;
        background-color: #fafafa;
        font-size: 14px;
        color: #666;
      }

      .footer-stats strong {
        color: #333;
        font-weight: 600;
      }

      @media (max-width: 768px) {
        .customers-container {
          padding: 16px;
        }

        .header-content {
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
        }

        .customers-table {
          font-size: 12px;
        }

        .customers-table th,
        .customers-table td {
          padding: 8px;
        }

        .search-field {
          max-width: 100%;
        }
      }
    `,
  ],
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchTerm = "";
  displayedColumns = ["name", "gstin", "email", "state", "phone", "actions"];

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customerService.customers$.subscribe((customers) => {
      this.customers = customers;
      this.filteredCustomers = customers;
    });
  }

  searchCustomers(): void {
    if (this.searchTerm.trim() === "") {
      this.filteredCustomers = this.customers;
    } else {
      this.filteredCustomers = this.customerService.searchCustomers(
        this.searchTerm,
      );
    }
  }

  deleteCustomer(customerId: string): void {
    if (confirm("Are you sure you want to delete this customer?")) {
      this.customerService.deleteCustomer(customerId);
    }
  }
}
