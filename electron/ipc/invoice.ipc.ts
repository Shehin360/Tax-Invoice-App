import { ipcMain } from "electron";
import {
  invoiceRepository,
  type InvoiceListOptions,
  type SaveInvoicePayload,
} from "../database/invoice.repository";

export function registerInvoiceIpc(): void {
  ipcMain.handle(
    "invoice:get-all",
    async (_event, options: InvoiceListOptions) => {
      return invoiceRepository.getInvoices(options);
    },
  );

  ipcMain.handle("invoice:get-by-id", async (_event, id: string) => {
    return invoiceRepository.getInvoiceById(id);
  });

  ipcMain.handle(
    "invoice:save",
    async (_event, payload: SaveInvoicePayload) => {
      return invoiceRepository.saveInvoice(payload);
    },
  );

  ipcMain.handle("invoice:delete", async (_event, id: string) => {
    await invoiceRepository.deleteInvoice(id);
    return true;
  });

  ipcMain.handle(
    "invoice:generate-number",
    async (_event, invoiceDate?: string) => {
      return invoiceRepository.generateInvoiceNumber(invoiceDate);
    },
  );
}
