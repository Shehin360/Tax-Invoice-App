import { app } from "electron";
import sqlite3 from "sqlite3";
import { mkdir } from "fs/promises";
import path from "path";

sqlite3.verbose();

export interface AppStoragePaths {
  rootDir: string;
  dataDir: string;
  invoicesDir: string;
  logosDir: string;
  databasePath: string;
}

export interface InvoiceItemRecord {
  id?: number;
  invoice_id?: number;
  product_name: string;
  hsn: string;
  quantity: number;
  unit: string;
  rate: number;
  gst: number;
  amount: number;
}

export interface InvoiceRecord {
  id?: number;
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
  items?: InvoiceItemRecord[];
}

export interface CustomerRecord {
  id?: number;
  customer_name: string;
  gstin: string;
  address: string;
  city?: string;
  state: string;
  phone: string;
  email?: string;
  created_at?: string;
}

export interface ProductRecord {
  id?: number;
  product_name: string;
  hsn: string;
  description?: string;
  unit: string;
  rate: number;
  gst_percentage: number;
  created_at?: string;
}

export interface SettingsRecord {
  id?: number;
  company_name: string;
  gstin: string;
  address: string;
  phone: string;
  bank_details?: string;
  logo_path?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  email?: string;
  bank_name?: string;
  account_number?: string;
  ifsc_code?: string;
  account_holder_name?: string;
}

export interface InvoiceQueryOptions {
  searchTerm?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: "invoice_date" | "invoice_number" | "grand_total" | "buyer_name";
  sortDirection?: "ASC" | "DESC";
}

type RunResult = {
  lastID: number;
  changes: number;
};

const DEFAULT_SETTINGS: SettingsRecord = {
  company_name: "Your Company Name",
  gstin: "27AABCU9603R1Z5",
  address: "123 Business Street",
  phone: "+91 9876543210",
  bank_details: "State Bank of India | A/C 1234567890 | IFSC SBIN0001234",
  logo_path: "",
  city: "Mumbai",
  state: "Maharashtra",
  postal_code: "400001",
  email: "info@company.com",
  bank_name: "State Bank of India",
  account_number: "1234567890",
  ifsc_code: "SBIN0001234",
  account_holder_name: "Your Company Ltd.",
};

class SqliteDatabaseManager {
  private database: sqlite3.Database | null = null;
  private initializationPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    if (!this.initializationPromise) {
      this.initializationPromise = this.doInitialize();
    }

    return this.initializationPromise;
  }

  getStoragePaths(): AppStoragePaths {
    const rootDir = path.join(app.getPath("userData"), "tax-invoice-manager");

    return {
      rootDir,
      dataDir: path.join(rootDir, "data"),
      invoicesDir: path.join(rootDir, "data", "invoices"),
      logosDir: path.join(rootDir, "assets", "logos"),
      databasePath: path.join(rootDir, "data", "tax_invoice_manager.db"),
    };
  }

  async run(
    sql: string,
    params: Array<string | number | null> = [],
  ): Promise<RunResult> {
    await this.initialize();

    return new Promise<RunResult>((resolve, reject) => {
      this.database!.run(sql, params, function runCallback(error) {
        if (error) {
          reject(error);
          return;
        }

        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  async get<T>(
    sql: string,
    params: Array<string | number | null> = [],
  ): Promise<T | undefined> {
    await this.initialize();

    return new Promise<T | undefined>((resolve, reject) => {
      this.database!.get(sql, params, (error, row) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(row as T | undefined);
      });
    });
  }

  async all<T>(
    sql: string,
    params: Array<string | number | null> = [],
  ): Promise<T[]> {
    await this.initialize();

    return new Promise<T[]>((resolve, reject) => {
      this.database!.all(sql, params, (error, rows) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(rows as T[]);
      });
    });
  }

  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    await this.run("BEGIN IMMEDIATE TRANSACTION");

    try {
      const result = await callback();
      await this.run("COMMIT");
      return result;
    } catch (error) {
      await this.run("ROLLBACK");
      throw error;
    }
  }

  private async doInitialize(): Promise<void> {
    const paths = this.getStoragePaths();
    await mkdir(paths.invoicesDir, { recursive: true });
    await mkdir(paths.logosDir, { recursive: true });

    this.database = await this.openDatabase(paths.databasePath);
    await this.run("PRAGMA foreign_keys = ON");
    await this.createTables();
  }

  private openDatabase(databasePath: string): Promise<sqlite3.Database> {
    return new Promise((resolve, reject) => {
      const database = new sqlite3.Database(databasePath, (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(database);
      });
    });
  }

  private async createTables(): Promise<void> {
    await this.run(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_number TEXT NOT NULL UNIQUE,
        invoice_date TEXT NOT NULL,
        buyer_name TEXT NOT NULL,
        buyer_gstin TEXT NOT NULL,
        buyer_address TEXT NOT NULL,
        buyer_state TEXT,
        consignee_name TEXT NOT NULL,
        consignee_gstin TEXT,
        consignee_address TEXT,
        consignee_state TEXT,
        delivery_note TEXT,
        vehicle_number TEXT,
        terms_of_payment TEXT,
        subtotal REAL NOT NULL,
        cgst REAL NOT NULL,
        sgst REAL NOT NULL,
        igst REAL NOT NULL,
        grand_total REAL NOT NULL,
        amount_in_words TEXT NOT NULL,
        declaration TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS invoice_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_id INTEGER NOT NULL,
        product_name TEXT NOT NULL,
        hsn TEXT NOT NULL,
        quantity REAL NOT NULL,
        unit TEXT NOT NULL,
        rate REAL NOT NULL,
        gst REAL NOT NULL,
        amount REAL NOT NULL,
        FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        gstin TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT,
        state TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_name TEXT NOT NULL,
        hsn TEXT NOT NULL,
        description TEXT,
        unit TEXT NOT NULL,
        rate REAL NOT NULL,
        gst_percentage REAL NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        company_name TEXT NOT NULL,
        gstin TEXT NOT NULL,
        address TEXT NOT NULL,
        phone TEXT NOT NULL,
        bank_details TEXT,
        logo_path TEXT,
        city TEXT,
        state TEXT,
        postal_code TEXT,
        email TEXT,
        bank_name TEXT,
        account_number TEXT,
        ifsc_code TEXT,
        account_holder_name TEXT
      )
    `);
  }
}

export const database = new SqliteDatabaseManager();
export { DEFAULT_SETTINGS };
