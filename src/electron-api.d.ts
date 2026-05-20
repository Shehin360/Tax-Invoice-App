import type {
  ElectronCustomerPayload,
  ElectronInvoiceQueryOptions,
  ElectronProductPayload,
  ElectronSaveInvoicePayload,
  ElectronSettingsPayload,
} from "./app/shared/electron-contracts";

declare global {
  interface Window {
    api?: {
      getAppVersion: () => Promise<string>;
      getAppName: () => Promise<string>;
      saveInvoice: (payload: ElectronSaveInvoicePayload) => Promise<unknown>;
      getInvoices: (options?: ElectronInvoiceQueryOptions) => Promise<unknown>;
      getInvoiceById: (id: string) => Promise<unknown>;
      deleteInvoice: (id: string) => Promise<unknown>;
      getNextInvoiceNumber: (invoiceDate?: string) => Promise<string>;
      saveCustomer: (payload: ElectronCustomerPayload) => Promise<unknown>;
      getCustomers: (searchTerm?: string) => Promise<unknown>;
      getCustomerById: (id: string) => Promise<unknown>;
      deleteCustomer: (id: string) => Promise<unknown>;
      saveProduct: (payload: ElectronProductPayload) => Promise<unknown>;
      getProducts: (searchTerm?: string) => Promise<unknown>;
      getProductById: (id: string) => Promise<unknown>;
      deleteProduct: (id: string) => Promise<unknown>;
      saveSettings: (payload: ElectronSettingsPayload) => Promise<unknown>;
      getSettings: () => Promise<unknown>;
    };
  }
}

export {};
