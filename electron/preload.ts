import { contextBridge, ipcRenderer } from "electron";

import type { CustomerPayload } from "./database/customer.repository";
import type { SaveInvoicePayload } from "./database/invoice.repository";
import type { ProductPayload } from "./database/product.repository";
import type { SettingsPayload } from "./database/settings.repository";
import type { InvoiceListOptions } from "./database/invoice.repository";

interface ElectronSaveLogoPayload {
  fileName: string;
  dataUrl: string;
}

const electronApi = {
  getAppVersion: (): Promise<string> => ipcRenderer.invoke("get-app-version"),
  getAppName: (): Promise<string> => ipcRenderer.invoke("get-app-name"),

  saveInvoice: (payload: SaveInvoicePayload) =>
    ipcRenderer.invoke("invoice:save", payload),
  getInvoices: (options?: InvoiceListOptions) =>
    ipcRenderer.invoke("invoice:get-all", options),
  getInvoiceById: (id: string) => ipcRenderer.invoke("invoice:get-by-id", id),
  deleteInvoice: (id: string) => ipcRenderer.invoke("invoice:delete", id),
  getNextInvoiceNumber: (invoiceDate?: string) =>
    ipcRenderer.invoke("invoice:generate-number", invoiceDate),

  saveCustomer: (payload: CustomerPayload) =>
    ipcRenderer.invoke("customer:save", payload),
  getCustomers: (searchTerm?: string) =>
    ipcRenderer.invoke("customer:get-all", searchTerm),
  getCustomerById: (id: string) => ipcRenderer.invoke("customer:get-by-id", id),
  deleteCustomer: (id: string) => ipcRenderer.invoke("customer:delete", id),

  saveProduct: (payload: ProductPayload) =>
    ipcRenderer.invoke("product:save", payload),
  getProducts: (searchTerm?: string) =>
    ipcRenderer.invoke("product:get-all", searchTerm),
  getProductById: (id: string) => ipcRenderer.invoke("product:get-by-id", id),
  deleteProduct: (id: string) => ipcRenderer.invoke("product:delete", id),

  saveSettings: (payload: SettingsPayload) =>
    ipcRenderer.invoke("settings:save", payload),
  getSettings: () => ipcRenderer.invoke("settings:get"),

  saveLogo: (payload: ElectronSaveLogoPayload) =>
    ipcRenderer.invoke("settings:save-logo", payload),

  generateInvoicePDF: (invoiceId: string) =>
    ipcRenderer.invoke("pdf:generate", invoiceId),
  openInvoicePDF: (invoiceId: string) =>
    ipcRenderer.invoke("pdf:open", invoiceId),
  deleteInvoicePDF: (invoiceId: string) =>
    ipcRenderer.invoke("pdf:delete", invoiceId),
  printInvoicePDF: (invoiceId: string) =>
    ipcRenderer.invoke("pdf:print", invoiceId),
  getInvoicePDFPath: (invoiceId: string) =>
    ipcRenderer.invoke("pdf:path", invoiceId),
};

contextBridge.exposeInMainWorld("api", electronApi);
