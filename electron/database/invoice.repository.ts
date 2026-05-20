import {
  database,
  InvoiceItemRecord,
  InvoiceQueryOptions,
  InvoiceRecord,
} from "./database";

export interface InvoiceItemPayload {
  productName: string;
  hsn: string;
  quantity: number;
  unit: string;
  rate: number;
  gst: number;
  amount: number;
}

export interface SaveInvoicePayload {
  id?: string;
  invoiceNumber?: string;
  invoiceDate: string;
  buyerName: string;
  buyerGstin: string;
  buyerAddress: string;
  buyerState?: string;
  consigneeName: string;
  consigneeGstin?: string;
  consigneeAddress?: string;
  consigneeState?: string;
  deliveryNote?: string;
  vehicleNumber?: string;
  termsOfPayment?: string;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  grandTotal: number;
  amountInWords: string;
  declaration?: string;
  items: InvoiceItemPayload[];
}

export interface InvoiceHistoryItem {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  buyerName: string;
  grandTotal: number;
  createdAt: string;
}

export interface InvoiceDetails {
  id: string;
  invoice_number: string;
  invoice_date: string;
  buyer_name: string;
  buyer_gstin: string;
  buyer_address: string;
  buyer_state?: string;
  consignee_name: string;
  consignee_gstin?: string;
  consignee_address?: string;
  consignee_state?: string;
  delivery_note?: string;
  vehicle_number?: string;
  terms_of_payment?: string;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  grand_total: number;
  amount_in_words: string;
  declaration?: string;
  created_at?: string;
  items: Array<
    Omit<InvoiceItemRecord, "id" | "invoice_id"> & {
      id: string;
      invoiceId: string;
    }
  >;
}

export interface InvoiceListOptions {
  searchTerm?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: "invoice_date" | "invoice_number" | "grand_total" | "buyer_name";
  sortDirection?: "ASC" | "DESC";
}

export class InvoiceRepository {
  async getInvoices(
    options: InvoiceListOptions = {},
  ): Promise<InvoiceHistoryItem[]> {
    const clauses: string[] = [];
    const params: Array<string | number | null> = [];

    if (options.searchTerm) {
      clauses.push(
        "(invoice_number LIKE ? OR buyer_name LIKE ? OR buyer_gstin LIKE ?)",
      );
      const term = `%${options.searchTerm}%`;
      params.push(term, term, term);
    }

    if (options.fromDate) {
      clauses.push("invoice_date >= ?");
      params.push(options.fromDate);
    }

    if (options.toDate) {
      clauses.push("invoice_date <= ?");
      params.push(options.toDate);
    }

    const sortBy = options.sortBy ?? "invoice_date";
    const sortDirection = options.sortDirection ?? "DESC";
    const whereClause =
      clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
    const rows = await database.all<{
      id: number;
      invoice_number: string;
      invoice_date: string;
      buyer_name: string;
      grand_total: number;
      created_at: string;
    }>(
      `SELECT id, invoice_number, invoice_date, buyer_name, grand_total, created_at
       FROM invoices
       ${whereClause}
       ORDER BY ${sortBy} ${sortDirection}, id DESC`,
      params,
    );

    return rows.map((row) => ({
      id: String(row.id),
      invoiceNumber: row.invoice_number,
      invoiceDate: row.invoice_date,
      buyerName: row.buyer_name,
      grandTotal: row.grand_total,
      createdAt: row.created_at,
    }));
  }

  async getInvoiceById(id: string): Promise<InvoiceDetails | null> {
    const invoice = await database.get<{
      id: number;
      invoice_number: string;
      invoice_date: string;
      buyer_name: string;
      buyer_gstin: string;
      buyer_address: string;
      buyer_state?: string;
      consignee_name: string;
      consignee_gstin?: string;
      consignee_address?: string;
      consignee_state?: string;
      delivery_note?: string;
      vehicle_number?: string;
      terms_of_payment?: string;
      subtotal: number;
      cgst: number;
      sgst: number;
      igst: number;
      grand_total: number;
      amount_in_words: string;
      declaration?: string;
      created_at: string;
    }>("SELECT * FROM invoices WHERE id = ?", [Number(id)]);

    if (!invoice) {
      return null;
    }

    const items = await database.all<{
      id: number;
      invoice_id: number;
      product_name: string;
      hsn: string;
      quantity: number;
      unit: string;
      rate: number;
      gst: number;
      amount: number;
    }>("SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY id ASC", [
      Number(id),
    ]);

    return {
      id: String(invoice.id),
      invoice_number: invoice.invoice_number,
      invoice_date: invoice.invoice_date,
      buyer_name: invoice.buyer_name,
      buyer_gstin: invoice.buyer_gstin,
      buyer_address: invoice.buyer_address,
      buyer_state: invoice.buyer_state,
      consignee_name: invoice.consignee_name,
      consignee_gstin: invoice.consignee_gstin,
      consignee_address: invoice.consignee_address,
      consignee_state: invoice.consignee_state,
      delivery_note: invoice.delivery_note,
      vehicle_number: invoice.vehicle_number,
      terms_of_payment: invoice.terms_of_payment,
      subtotal: invoice.subtotal,
      cgst: invoice.cgst,
      sgst: invoice.sgst,
      igst: invoice.igst,
      grand_total: invoice.grand_total,
      amount_in_words: invoice.amount_in_words,
      declaration: invoice.declaration,
      created_at: invoice.created_at,
      items: items.map((item) => ({
        id: String(item.id),
        invoiceId: String(item.invoice_id),
        product_name: item.product_name,
        hsn: item.hsn,
        quantity: item.quantity,
        unit: item.unit,
        rate: item.rate,
        gst: item.gst,
        amount: item.amount,
      })),
    };
  }

  async saveInvoice(payload: SaveInvoicePayload): Promise<InvoiceDetails> {
    let invoiceId = payload.id ? Number(payload.id) : undefined;
    const invoiceNumber =
      payload.invoiceNumber?.trim() ||
      (await this.generateInvoiceNumber(payload.invoiceDate));

    const normalizedDate = payload.invoiceDate.slice(0, 10);

    return database.transaction(async () => {
      if (invoiceId) {
        await database.run(
          `UPDATE invoices
           SET invoice_number = ?, invoice_date = ?, buyer_name = ?, buyer_gstin = ?, buyer_address = ?, buyer_state = ?, consignee_name = ?, consignee_gstin = ?, consignee_address = ?, consignee_state = ?, delivery_note = ?, vehicle_number = ?, terms_of_payment = ?, subtotal = ?, cgst = ?, sgst = ?, igst = ?, grand_total = ?, amount_in_words = ?, declaration = ?
           WHERE id = ?`,
          [
            invoiceNumber,
            normalizedDate,
            payload.buyerName,
            payload.buyerGstin,
            payload.buyerAddress,
            payload.buyerState ?? null,
            payload.consigneeName,
            payload.consigneeGstin ?? null,
            payload.consigneeAddress ?? null,
            payload.consigneeState ?? null,
            payload.deliveryNote ?? null,
            payload.vehicleNumber ?? null,
            payload.termsOfPayment ?? null,
            payload.subtotal,
            payload.cgst,
            payload.sgst,
            payload.igst,
            payload.grandTotal,
            payload.amountInWords,
            payload.declaration ?? null,
            invoiceId,
          ],
        );
        await database.run("DELETE FROM invoice_items WHERE invoice_id = ?", [
          invoiceId,
        ]);
      } else {
        const result = await database.run(
          `INSERT INTO invoices (
            invoice_number, invoice_date, buyer_name, buyer_gstin, buyer_address, buyer_state,
            consignee_name, consignee_gstin, consignee_address, consignee_state, delivery_note,
            vehicle_number, terms_of_payment, subtotal, cgst, sgst, igst, grand_total,
            amount_in_words, declaration
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            invoiceNumber,
            normalizedDate,
            payload.buyerName,
            payload.buyerGstin,
            payload.buyerAddress,
            payload.buyerState ?? null,
            payload.consigneeName,
            payload.consigneeGstin ?? null,
            payload.consigneeAddress ?? null,
            payload.consigneeState ?? null,
            payload.deliveryNote ?? null,
            payload.vehicleNumber ?? null,
            payload.termsOfPayment ?? null,
            payload.subtotal,
            payload.cgst,
            payload.sgst,
            payload.igst,
            payload.grandTotal,
            payload.amountInWords,
            payload.declaration ?? null,
          ],
        );
        invoiceId = result.lastID;
      }

      for (const item of payload.items) {
        await database.run(
          `INSERT INTO invoice_items (invoice_id, product_name, hsn, quantity, unit, rate, gst, amount)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            invoiceId!,
            item.productName,
            item.hsn,
            item.quantity,
            item.unit,
            item.rate,
            item.gst,
            item.amount,
          ],
        );
      }

      const savedInvoice = await this.getInvoiceById(String(invoiceId!));
      if (!savedInvoice) {
        throw new Error("Invoice could not be reloaded after save.");
      }

      return savedInvoice;
    });
  }

  async deleteInvoice(id: string): Promise<void> {
    await database.run("DELETE FROM invoices WHERE id = ?", [Number(id)]);
  }

  async generateInvoiceNumber(invoiceDate?: string): Promise<string> {
    const referenceDate = invoiceDate ? new Date(invoiceDate) : new Date();
    const year = referenceDate.getFullYear();
    const rows = await database.all<{ invoice_number: string }>(
      "SELECT invoice_number FROM invoices WHERE invoice_number LIKE ?",
      [`INV-${year}-%`],
    );

    const nextSequence =
      rows.reduce((max, row) => {
        const parts = row.invoice_number.split("-");
        const sequence = Number(parts[2]);
        return Number.isFinite(sequence) && sequence > max ? sequence : max;
      }, 0) + 1;

    return `INV-${year}-${String(nextSequence).padStart(3, "0")}`;
  }
}

export const invoiceRepository = new InvoiceRepository();
