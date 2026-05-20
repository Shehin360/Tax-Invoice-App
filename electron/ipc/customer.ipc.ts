import { ipcMain } from "electron";
import { customerRepository } from "../database/customer.repository";

export function registerCustomerIpc(): void {
  ipcMain.handle("customer:get-all", async (_event, searchTerm?: string) => {
    return customerRepository.getCustomers(searchTerm ?? "");
  });

  ipcMain.handle("customer:get-by-id", async (_event, id: string) => {
    return customerRepository.getCustomerById(id);
  });

  ipcMain.handle("customer:save", async (_event, payload) => {
    return customerRepository.saveCustomer(payload);
  });

  ipcMain.handle("customer:delete", async (_event, id: string) => {
    await customerRepository.deleteCustomer(id);
    return true;
  });
}
