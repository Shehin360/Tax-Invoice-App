import { Injectable } from "@angular/core";

import {
  ElectronSettingsDto,
  ElectronSettingsPayload,
} from "../shared/electron-contracts";
import { CompanySettings } from "../models/settings.model";
import { hasElectronApi, readJson, writeJson } from "./local-storage-json";

const FALLBACK_KEY = "tax-invoice-manager.settings";

@Injectable({
  providedIn: "root",
})
export class SettingsDbService {
  async getSettings(): Promise<CompanySettings> {
    if (hasElectronApi()) {
      const row = (await window.api!.getSettings()) as ElectronSettingsDto;
      return this.toSettings(row);
    }

    return readJson<CompanySettings>(FALLBACK_KEY, this.getDefaultSettings());
  }

  async saveSettings(settings: CompanySettings): Promise<CompanySettings> {
    if (hasElectronApi()) {
      const saved = (await window.api!.saveSettings(
        this.toPayload(settings),
      )) as ElectronSettingsDto;
      return this.toSettings(saved);
    }

    writeJson(FALLBACK_KEY, settings);
    return settings;
  }

  getDefaultSettings(): CompanySettings {
    return {
      companyName: "Your Company Name",
      gstin: "27AABCU9603R1Z5",
      address: "123 Business Street",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      phone: "+91 9876543210",
      email: "info@company.com",
      bankName: "State Bank of India",
      accountNumber: "1234567890",
      ifscCode: "SBIN0001234",
      accountHolderName: "Your Company Ltd.",
      logoUrl: "assets/logo.png",
    };
  }

  private toPayload(settings: CompanySettings): ElectronSettingsPayload {
    return {
      companyName: settings.companyName,
      gstin: settings.gstin,
      address: settings.address,
      phone: settings.phone,
      bankDetails: `${settings.bankName} | A/C ${settings.accountNumber} | IFSC ${settings.ifscCode}`,
      logoPath: settings.logoUrl ?? "",
      city: settings.city,
      state: settings.state,
      postalCode: settings.postalCode,
      email: settings.email,
      bankName: settings.bankName,
      accountNumber: settings.accountNumber,
      ifscCode: settings.ifscCode,
      accountHolderName: settings.accountHolderName,
    };
  }

  private toSettings(row: ElectronSettingsDto): CompanySettings {
    return {
      companyName: row.companyName,
      gstin: row.gstin,
      address: row.address,
      city: row.city,
      state: row.state,
      postalCode: row.postalCode,
      phone: row.phone,
      email: row.email,
      bankName: row.bankName,
      accountNumber: row.accountNumber,
      ifscCode: row.ifscCode,
      accountHolderName: row.accountHolderName,
      logoUrl: row.logoPath,
    };
  }
}
