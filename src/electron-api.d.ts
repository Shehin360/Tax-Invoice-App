import type {
  ElectronCustomerDto,
  ElectronCustomerPayload,
  ElectronInvoiceDetails,
  ElectronInvoiceHistoryItem,
  ElectronInvoiceQueryOptions,
  ElectronProductPayload,
  ElectronSaveInvoicePayload,
  ElectronProductDto,
  ElectronSaveLogoPayload,
  ElectronSettingsDto,
  ElectronSettingsPayload,
} from "./app/shared/electron-contracts";

declare global {
  interface Window {
    api?: {
      getAppVersion: () => Promise<string>;
      getAppName: () => Promise<string>;
      saveInvoice: (
        payload: ElectronSaveInvoicePayload,
      ) => Promise<ElectronInvoiceDetails>;
      getInvoices: (
        options?: ElectronInvoiceQueryOptions,
      ) => Promise<ElectronInvoiceHistoryItem[]>;
      getInvoiceById: (id: string) => Promise<ElectronInvoiceDetails | null>;
      deleteInvoice: (id: string) => Promise<boolean>;
      getNextInvoiceNumber: (invoiceDate?: string) => Promise<string>;
      saveCustomer: (
        payload: ElectronCustomerPayload,
      ) => Promise<ElectronCustomerDto>;
      getCustomers: (searchTerm?: string) => Promise<ElectronCustomerDto[]>;
      getCustomerById: (id: string) => Promise<ElectronCustomerDto | null>;
      deleteCustomer: (id: string) => Promise<boolean>;
      saveProduct: (
        payload: ElectronProductPayload,
      ) => Promise<ElectronProductDto>;
      getProducts: (searchTerm?: string) => Promise<ElectronProductDto[]>;
      getProductById: (id: string) => Promise<ElectronProductDto | null>;
      deleteProduct: (id: string) => Promise<boolean>;
      saveSettings: (
        payload: ElectronSettingsPayload,
      ) => Promise<ElectronSettingsDto>;
      getSettings: () => Promise<ElectronSettingsDto>;
      saveLogo: (payload: ElectronSaveLogoPayload) => Promise<string>;

      generateInvoicePDF: (invoiceId: string) => Promise<string>;
      openInvoicePDF: (invoiceId: string) => Promise<string>;
      deleteInvoicePDF: (invoiceId: string) => Promise<boolean>;
      printInvoicePDF: (invoiceId: string) => Promise<boolean>;
      getInvoicePDFPath: (invoiceId: string) => Promise<string | null>;
    };
  }
}

export {};
