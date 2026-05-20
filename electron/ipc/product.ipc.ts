import { ipcMain } from "electron";
import { productRepository } from "../database/product.repository";

export function registerProductIpc(): void {
  ipcMain.handle("product:get-all", async (_event, searchTerm?: string) => {
    return productRepository.getProducts(searchTerm ?? "");
  });

  ipcMain.handle("product:get-by-id", async (_event, id: string) => {
    return productRepository.getProductById(id);
  });

  ipcMain.handle("product:save", async (_event, payload) => {
    return productRepository.saveProduct(payload);
  });

  ipcMain.handle("product:delete", async (_event, id: string) => {
    await productRepository.deleteProduct(id);
    return true;
  });
}
