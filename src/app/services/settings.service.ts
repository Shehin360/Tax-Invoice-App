import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { CompanySettings } from "../models/settings.model";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  private settingsSubject = new BehaviorSubject<CompanySettings>(
    this.getDefaultSettings(),
  );
  public settings$ = this.settingsSubject.asObservable();

  constructor() {}

  getSettings(): Observable<CompanySettings> {
    return this.settings$;
  }

  updateSettings(settings: CompanySettings): void {
    this.settingsSubject.next(settings);
  }

  getCurrentSettings(): CompanySettings {
    return this.settingsSubject.value;
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
}
