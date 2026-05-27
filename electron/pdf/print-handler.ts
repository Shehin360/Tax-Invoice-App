import { BrowserWindow } from "electron";

import { invoiceRepository } from "../database/invoice.repository";
import { settingsRepository } from "../database/settings.repository";
import { renderInvoiceHtml } from "./template-renderer";

export async function printInvoiceDocument(
  invoiceId: string,
): Promise<boolean> {
  const invoice = await invoiceRepository.getInvoiceById(invoiceId);
  if (!invoice) {
    throw new Error("Invoice not found.");
  }

  const settings = await settingsRepository.getSettings();
  const html = await renderInvoiceHtml(invoice, settings);
  const previewWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  try {
    await previewWindow.loadURL(
      `data:text/html;charset=utf-8,${encodeURIComponent(html)}`,
    );

    return await new Promise<boolean>((resolve, reject) => {
      previewWindow.webContents.print(
        { silent: false, printBackground: true },
        (success, failureReason) => {
          previewWindow.close();

          if (!success) {
            reject(new Error(failureReason || "Printing failed"));
            return;
          }

          resolve(true);
        },
      );
    });
  } finally {
    if (!previewWindow.isDestroyed()) {
      previewWindow.destroy();
    }
  }
}
