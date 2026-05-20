import { database, ProductRecord } from "./database";

export interface ProductPayload {
  id?: string;
  productName: string;
  hsn: string;
  description?: string;
  unit: string;
  rate: number;
  gstPercentage: number;
}

export interface ProductDto {
  id: string;
  productName: string;
  hsn: string;
  description: string;
  unit: string;
  rate: number;
  gstPercentage: number;
  createdAt: string;
}

export class ProductRepository {
  async getProducts(searchTerm = ""): Promise<ProductDto[]> {
    const clauses: string[] = [];
    const params: Array<string | number | null> = [];

    if (searchTerm.trim()) {
      clauses.push(
        "(product_name LIKE ? ESCAPE '\\' OR hsn LIKE ? ESCAPE '\\' OR description LIKE ? ESCAPE '\\')",
      );
      const escapedTerm = searchTerm
        .trim()
        .replace(/\\/g, "\\\\")
        .replace(/%/g, "\\%")
        .replace(/_/g, "\\_");
      const term = `%${escapedTerm}%`;
      params.push(term, term, term);
    }

    const whereClause =
      clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
    const rows = await database.all<ProductRecord>(
      `SELECT * FROM products ${whereClause} ORDER BY product_name ASC, id DESC`,
      params,
    );

    return rows.map((row) => ({
      id: String(row.id),
      productName: row.product_name,
      hsn: row.hsn,
      description: row.description ?? "",
      unit: row.unit,
      rate: row.rate,
      gstPercentage: row.gst_percentage,
      createdAt: row.created_at ?? "",
    }));
  }

  async saveProduct(payload: ProductPayload): Promise<ProductDto> {
    if (payload.id) {
      await database.run(
        `UPDATE products
         SET product_name = ?, hsn = ?, description = ?, unit = ?, rate = ?, gst_percentage = ?
         WHERE id = ?`,
        [
          payload.productName,
          payload.hsn,
          payload.description ?? null,
          payload.unit,
          payload.rate,
          payload.gstPercentage,
          Number(payload.id),
        ],
      );

      const updated = await this.getProductById(payload.id);
      if (!updated) {
        throw new Error("Product update failed.");
      }

      return updated;
    }

    const result = await database.run(
      `INSERT INTO products (product_name, hsn, description, unit, rate, gst_percentage)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        payload.productName,
        payload.hsn,
        payload.description ?? null,
        payload.unit,
        payload.rate,
        payload.gstPercentage,
      ],
    );

    const created = await this.getProductById(String(result.lastID));
    if (!created) {
      throw new Error("Product could not be loaded after save.");
    }

    return created;
  }

  async getProductById(id: string): Promise<ProductDto | null> {
    const row = await database.get<ProductRecord>(
      "SELECT * FROM products WHERE id = ?",
      [Number(id)],
    );

    if (!row) {
      return null;
    }

    return {
      id: String(row.id),
      productName: row.product_name,
      hsn: row.hsn,
      description: row.description ?? "",
      unit: row.unit,
      rate: row.rate,
      gstPercentage: row.gst_percentage,
      createdAt: row.created_at ?? "",
    };
  }

  async deleteProduct(id: string): Promise<void> {
    await database.run("DELETE FROM products WHERE id = ?", [Number(id)]);
  }
}

export const productRepository = new ProductRepository();
