import { Routes } from "@angular/router";

import { LayoutComponent } from "./components/layout/layout.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { InvoiceFormComponent } from "./pages/invoice-form/invoice-form.component";
import { InvoiceHistoryComponent } from "./pages/invoice-history/invoice-history.component";
import { InvoicePreviewPageComponent } from "./pages/invoice-preview-page/invoice-preview-page.component";
import { CustomersComponent } from "./pages/customers/customers.component";
import { ProductsComponent } from "./pages/products/products.component";
import { SettingsComponent } from "./pages/settings/settings.component";

export const APP_ROUTES: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      { path: "dashboard", component: DashboardComponent },
      { path: "invoice", component: InvoiceFormComponent },
      { path: "history", component: InvoiceHistoryComponent },
      { path: "preview/:id", component: InvoicePreviewPageComponent },
      { path: "customers", component: CustomersComponent },
      { path: "products", component: ProductsComponent },
      { path: "settings", component: SettingsComponent },
    ],
  },
  { path: "**", redirectTo: "dashboard" },
];
