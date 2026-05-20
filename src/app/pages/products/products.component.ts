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
import { ProductService } from "../../services/product.service";
import { Product } from "../../models/product.model";

@Component({
  selector: "app-products",
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
    <div class="products-container">
      <h1 class="page-title">Products</h1>

      <mat-card class="products-card">
        <mat-card-header>
          <div class="header-content">
            <mat-card-title>Product List</mat-card-title>
            <button mat-raised-button color="primary" (click)="addProduct()">
              <mat-icon>add</mat-icon> Add Product
            </button>
          </div>
        </mat-card-header>
        <mat-divider></mat-divider>

        <!-- Search Bar -->
        <mat-card-content class="search-section">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search Products</mat-label>
            <input
              matInput
              [(ngModel)]="searchTerm"
              (keyup)="searchProducts()"
              placeholder="Search by name, HSN/SAC, or description..." />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </mat-card-content>

        <!-- Products Table -->
        <mat-card-content class="table-content">
          <div class="table-container">
            <table
              mat-table
              [dataSource]="filteredProducts"
              class="products-table">
              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Product Name</th>
                <td mat-cell *matCellDef="let element">
                  <div class="cell-content">
                    <mat-icon class="cell-icon">inventory_2</mat-icon>
                    {{ element.name }}
                  </div>
                </td>
              </ng-container>

              <!-- HSN/SAC Column -->
              <ng-container matColumnDef="hsnSac">
                <th mat-header-cell *matHeaderCellDef>HSN/SAC</th>
                <td mat-cell *matCellDef="let element">{{ element.hsnSac }}</td>
              </ng-container>

              <!-- Description Column -->
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Description</th>
                <td mat-cell *matCellDef="let element">
                  {{ element.description }}
                </td>
              </ng-container>

              <!-- Rate Column -->
              <ng-container matColumnDef="rate">
                <th mat-header-cell *matHeaderCellDef>Rate</th>
                <td mat-cell *matCellDef="let element">
                  ₹{{ element.rate | number: "1.0-2" }}
                </td>
              </ng-container>

              <!-- GST Column -->
              <ng-container matColumnDef="gstPercent">
                <th mat-header-cell *matHeaderCellDef>GST %</th>
                <td mat-cell *matCellDef="let element">
                  {{ element.gstPercent }}%
                </td>
              </ng-container>

              <!-- Unit Column -->
              <ng-container matColumnDef="unit">
                <th mat-header-cell *matHeaderCellDef>Unit</th>
                <td mat-cell *matCellDef="let element">{{ element.unit }}</td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let element">
                  <button
                    mat-icon-button
                    color="primary"
                    matTooltip="Edit"
                    (click)="editProduct(element)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="warn"
                    matTooltip="Delete"
                    (click)="deleteProduct(element.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>

            <div *ngIf="filteredProducts.length === 0" class="no-data">
              <mat-icon>info</mat-icon>
              <p>No products found</p>
            </div>
          </div>
        </mat-card-content>

        <!-- Stats Footer -->
        <mat-divider></mat-divider>
        <mat-card-content class="footer-stats">
          <span
            >Total Products:
            <strong>{{ filteredProducts.length }}</strong></span
          >
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .products-container {
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

      .products-card {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .products-card ::ng-deep .mat-card-header {
        padding: 20px;
        background-color: #f5f5f5;
        border-bottom: 1px solid #e0e0e0;
      }

      .products-card ::ng-deep .mat-card-title {
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

      .products-table {
        width: 100%;
        border-collapse: collapse;
      }

      .products-table th {
        background-color: #f5f5f5;
        font-weight: 600;
        color: #333;
        padding: 12px;
        text-align: left;
        border-bottom: 2px solid #e0e0e0;
        white-space: nowrap;
      }

      .products-table td {
        padding: 12px;
        border-bottom: 1px solid #e0e0e0;
        color: #666;
      }

      .products-table tbody tr:hover {
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
        .products-container {
          padding: 16px;
        }

        .header-content {
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
        }

        .products-table {
          font-size: 12px;
        }

        .products-table th,
        .products-table td {
          padding: 8px;
        }

        .search-field {
          max-width: 100%;
        }
      }
    `,
  ],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = "";
  displayedColumns = [
    "name",
    "hsnSac",
    "description",
    "rate",
    "gstPercent",
    "unit",
    "actions",
  ];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.products$.subscribe((products) => {
      this.products = products;
      this.filteredProducts = products;
    });
  }

  searchProducts(): void {
    if (this.searchTerm.trim() === "") {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.productService.searchProducts(
        this.searchTerm,
      );
    }
  }

  addProduct(): void {
    this.editProduct({
      id: `${Date.now()}`,
      name: "",
      hsnSac: "",
      description: "",
      rate: 0,
      gstPercent: 0,
      unit: "",
      createdDate: new Date().toISOString().slice(0, 10),
    });
  }

  editProduct(product: Product): void {
    const name = prompt("Product name", product.name);
    if (name === null) {
      return;
    }

    const hsnSac = prompt("HSN/SAC", product.hsnSac);
    if (hsnSac === null) {
      return;
    }

    const description = prompt("Description", product.description);
    if (description === null) {
      return;
    }

    const rateValue = prompt("Rate", String(product.rate));
    if (rateValue === null) {
      return;
    }

    const gstValue = prompt("GST %", String(product.gstPercent));
    if (gstValue === null) {
      return;
    }

    const unit = prompt("Unit", product.unit);
    if (unit === null) {
      return;
    }

    void this.productService.saveProduct({
      ...product,
      id: product.id || `${Date.now()}`,
      name,
      hsnSac,
      description,
      rate: Number(rateValue),
      gstPercent: Number(gstValue),
      unit,
      createdDate: product.createdDate || new Date().toISOString().slice(0, 10),
    });
  }

  async deleteProduct(productId: string): Promise<void> {
    if (confirm("Are you sure you want to delete this product?")) {
      await this.productService.deleteProduct(productId);
    }
  }
}
