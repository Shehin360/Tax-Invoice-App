import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <button
        mat-icon-button
        (click)="sidenav.toggle()"
        matTooltip="Toggle Menu">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="spacer"></span>
      <span class="app-title">Tax Invoice Manager</span>
      <span class="spacer"></span>
      <button mat-icon-button matTooltip="User Settings">
        <mat-icon>account_circle</mat-icon>
      </button>
    </mat-toolbar>

    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" [opened]="true" class="sidenav">
        <mat-nav-list class="nav-list">
          <h2 mat-subheader>MAIN MENU</h2>

          <mat-list-item
            routerLink="/dashboard"
            routerLinkActive="active"
            (click)="closeSidenavMobile()">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </mat-list-item>

          <mat-list-item
            routerLink="/invoice"
            routerLinkActive="active"
            (click)="closeSidenavMobile()">
            <mat-icon matListItemIcon>description</mat-icon>
            <span matListItemTitle>New Invoice</span>
          </mat-list-item>

          <h2 mat-subheader>MANAGEMENT</h2>

          <mat-list-item
            routerLink="/customers"
            routerLinkActive="active"
            (click)="closeSidenavMobile()">
            <mat-icon matListItemIcon>people</mat-icon>
            <span matListItemTitle>Customers</span>
          </mat-list-item>

          <mat-list-item
            routerLink="/products"
            routerLinkActive="active"
            (click)="closeSidenavMobile()">
            <mat-icon matListItemIcon>inventory</mat-icon>
            <span matListItemTitle>Products</span>
          </mat-list-item>

          <h2 mat-subheader>CONFIGURATION</h2>

          <mat-list-item
            routerLink="/settings"
            routerLinkActive="active"
            (click)="closeSidenavMobile()">
            <mat-icon matListItemIcon>settings</mat-icon>
            <span matListItemTitle>Settings</span>
          </mat-list-item>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="sidenav-content">
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .app-toolbar {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .spacer {
        flex: 1 1 auto;
      }

      .app-title {
        font-size: 20px;
        font-weight: 500;
        text-align: center;
      }

      .sidenav-container {
        height: calc(100vh - 64px);
      }

      .sidenav {
        width: 250px;
        background-color: #f5f5f5;
        border-right: 1px solid #e0e0e0;
      }

      .nav-list {
        padding: 0;
      }

      .nav-list h2 {
        padding: 16px;
        font-size: 12px;
        font-weight: 500;
        color: #999;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .nav-list ::ng-deep .mdc-list-item {
        border-left: 3px solid transparent;
        transition: all 0.3s ease;

        &.active {
          background-color: #e8f5e9;
          border-left-color: #4caf50;

          .mdc-list-item__primary-text {
            color: #2e7d32;
            font-weight: 500;
          }

          mat-icon {
            color: #2e7d32;
          }
        }

        &:hover:not(.active) {
          background-color: #fafafa;
        }
      }

      .sidenav-content {
        overflow-y: auto;
        background-color: #fff;
      }

      @media (max-width: 768px) {
        .sidenav {
          width: 200px;
        }
      }
    `,
  ],
})
export class LayoutComponent {
  constructor() {}

  closeSidenavMobile(): void {
    // Mobile close logic can be added here if needed
  }
}
