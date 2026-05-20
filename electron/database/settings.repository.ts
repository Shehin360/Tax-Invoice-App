import { database, DEFAULT_SETTINGS, SettingsRecord } from "./database";

export interface SettingsPayload {
  id?: string;
  companyName: string;
  gstin: string;
  address: string;
  phone: string;
  bankDetails?: string;
  logoPath?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  email?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
}

export interface SettingsDto {
  id: string;
  companyName: string;
  gstin: string;
  address: string;
  phone: string;
  bankDetails: string;
  logoPath: string;
  city: string;
  state: string;
  postalCode: string;
  email: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
}

export class SettingsRepository {
  async getSettings(): Promise<SettingsDto> {
    const row = await database.get<SettingsRecord>(
      "SELECT * FROM settings WHERE id = 1",
    );

    if (!row) {
      await database.run(
        `INSERT INTO settings (
          id, company_name, gstin, address, phone, bank_details, logo_path,
          city, state, postal_code, email, bank_name, account_number, ifsc_code, account_holder_name
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          DEFAULT_SETTINGS.company_name,
          DEFAULT_SETTINGS.gstin,
          DEFAULT_SETTINGS.address,
          DEFAULT_SETTINGS.phone,
          DEFAULT_SETTINGS.bank_details ?? "",
          DEFAULT_SETTINGS.logo_path ?? "",
          DEFAULT_SETTINGS.city ?? "",
          DEFAULT_SETTINGS.state ?? "",
          DEFAULT_SETTINGS.postal_code ?? "",
          DEFAULT_SETTINGS.email ?? "",
          DEFAULT_SETTINGS.bank_name ?? "",
          DEFAULT_SETTINGS.account_number ?? "",
          DEFAULT_SETTINGS.ifsc_code ?? "",
          DEFAULT_SETTINGS.account_holder_name ?? "",
        ],
      );

      return this.getSettings();
    }

    return {
      id: String(row.id ?? 1),
      companyName: row.company_name,
      gstin: row.gstin,
      address: row.address,
      phone: row.phone,
      bankDetails: row.bank_details ?? "",
      logoPath: row.logo_path ?? "",
      city: row.city ?? "",
      state: row.state ?? "",
      postalCode: row.postal_code ?? "",
      email: row.email ?? "",
      bankName: row.bank_name ?? "",
      accountNumber: row.account_number ?? "",
      ifscCode: row.ifsc_code ?? "",
      accountHolderName: row.account_holder_name ?? "",
    };
  }

  async saveSettings(payload: SettingsPayload): Promise<SettingsDto> {
    await database.run(
      `INSERT INTO settings (
        id, company_name, gstin, address, phone, bank_details, logo_path,
        city, state, postal_code, email, bank_name, account_number, ifsc_code, account_holder_name
      ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        company_name = excluded.company_name,
        gstin = excluded.gstin,
        address = excluded.address,
        phone = excluded.phone,
        bank_details = excluded.bank_details,
        logo_path = excluded.logo_path,
        city = excluded.city,
        state = excluded.state,
        postal_code = excluded.postal_code,
        email = excluded.email,
        bank_name = excluded.bank_name,
        account_number = excluded.account_number,
        ifsc_code = excluded.ifsc_code,
        account_holder_name = excluded.account_holder_name`,
      [
        payload.companyName,
        payload.gstin,
        payload.address,
        payload.phone,
        payload.bankDetails ?? "",
        payload.logoPath ?? "",
        payload.city ?? "",
        payload.state ?? "",
        payload.postalCode ?? "",
        payload.email ?? "",
        payload.bankName ?? "",
        payload.accountNumber ?? "",
        payload.ifscCode ?? "",
        payload.accountHolderName ?? "",
      ],
    );

    return this.getSettings();
  }
}

export const settingsRepository = new SettingsRepository();
