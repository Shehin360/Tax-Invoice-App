import { database, CustomerRecord } from "./database";

export interface CustomerPayload {
  id?: string;
  customerName: string;
  gstin: string;
  address: string;
  city?: string;
  state: string;
  phone: string;
  email?: string;
}

export interface CustomerDto {
  id: string;
  customerName: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  createdAt: string;
}

export class CustomerRepository {
  async getCustomers(searchTerm = ""): Promise<CustomerDto[]> {
    const clauses: string[] = [];
    const params: Array<string | number | null> = [];

    if (searchTerm.trim()) {
      clauses.push(
        "(customer_name LIKE ? OR gstin LIKE ? OR address LIKE ? OR phone LIKE ?)",
      );
      const term = `%${searchTerm.trim()}%`;
      params.push(term, term, term, term);
    }

    const whereClause =
      clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
    const rows = await database.all<CustomerRecord>(
      `SELECT * FROM customers ${whereClause} ORDER BY customer_name ASC, id DESC`,
      params,
    );

    return rows.map((row) => ({
      id: String(row.id),
      customerName: row.customer_name,
      gstin: row.gstin,
      address: row.address,
      city: row.city ?? "",
      state: row.state,
      phone: row.phone,
      email: row.email ?? "",
      createdAt: row.created_at ?? "",
    }));
  }

  async saveCustomer(payload: CustomerPayload): Promise<CustomerDto> {
    if (payload.id) {
      await database.run(
        `UPDATE customers
         SET customer_name = ?, gstin = ?, address = ?, city = ?, state = ?, phone = ?, email = ?
         WHERE id = ?`,
        [
          payload.customerName,
          payload.gstin,
          payload.address,
          payload.city ?? null,
          payload.state,
          payload.phone,
          payload.email ?? null,
          Number(payload.id),
        ],
      );

      const updated = await this.getCustomerById(payload.id);
      if (!updated) {
        throw new Error("Customer update failed.");
      }

      return updated;
    }

    const result = await database.run(
      `INSERT INTO customers (customer_name, gstin, address, city, state, phone, email)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.customerName,
        payload.gstin,
        payload.address,
        payload.city ?? null,
        payload.state,
        payload.phone,
        payload.email ?? null,
      ],
    );

    const created = await this.getCustomerById(String(result.lastID));
    if (!created) {
      throw new Error("Customer could not be loaded after save.");
    }

    return created;
  }

  async getCustomerById(id: string): Promise<CustomerDto | null> {
    const row = await database.get<CustomerRecord>(
      "SELECT * FROM customers WHERE id = ?",
      [Number(id)],
    );

    if (!row) {
      return null;
    }

    return {
      id: String(row.id),
      customerName: row.customer_name,
      gstin: row.gstin,
      address: row.address,
      city: row.city ?? "",
      state: row.state,
      phone: row.phone,
      email: row.email ?? "",
      createdAt: row.created_at ?? "",
    };
  }

  async deleteCustomer(id: string): Promise<void> {
    await database.run("DELETE FROM customers WHERE id = ?", [Number(id)]);
  }
}

export const customerRepository = new CustomerRepository();
