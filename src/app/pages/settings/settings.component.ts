import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatTabsModule } from "@angular/material/tabs";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { SettingsService } from "../../services/settings.service";
import { CompanySettings } from "../../models/settings.model";

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTabsModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="settings-container">
      <h1 class="page-title">Settings</h1>

      <mat-card class="settings-card">
        <mat-tab-group>
          <!-- Company Settings Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>business</mat-icon>
              <span>Company Settings</span>
            </ng-template>

            <mat-card-content class="tab-content">
              <form
                [formGroup]="companyForm"
                (ngSubmit)="saveCompanySettings()">
                <div class="form-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>Company Name</mat-label>
                    <input matInput formControlName="companyName" />
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>GSTIN</mat-label>
                    <input matInput formControlName="gstin" />
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Address</mat-label>
                    <textarea
                      matInput
                      formControlName="address"
                      rows="3"></textarea>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>City</mat-label>
                    <input matInput formControlName="city" />
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>State</mat-label>
                    <input matInput formControlName="state" />
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Postal Code</mat-label>
                    <input matInput formControlName="postalCode" />
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Phone</mat-label>
                    <input matInput formControlName="phone" />
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Email</mat-label>
                    <input matInput type="email" formControlName="email" />
                  </mat-form-field>

                  <!-- Logo Upload -->
                  <div class="full-width logo-section">
                    <h3>Logo</h3>
                    <input
                      #logoInput
                      type="file"
                      accept="image/*"
                      hidden
                      (change)="onLogoSelected($event)" />
                    <div class="logo-container">
                      <div class="logo-preview">
                        <img
                          *ngIf="logoPreviewSrc; else logoPlaceholder"
                          [src]="logoPreviewSrc"
                          alt="Logo preview" />
                        <ng-template #logoPlaceholder>
                          <mat-icon>image</mat-icon>
                          <p>Logo Preview</p>
                        </ng-template>
                      </div>
                      <button
                        mat-raised-button
                        type="button"
                        (click)="logoInput.click()"
                        [disabled]="uploadingLogo">
                        <mat-icon>upload</mat-icon>
                        {{ uploadingLogo ? "Uploading..." : "Upload Logo" }}
                      </button>
                    </div>
                  </div>
                </div>

                <div class="action-buttons">
                  <button mat-raised-button color="primary" type="submit">
                    <mat-icon>save</mat-icon> Save Settings
                  </button>
                  <button
                    mat-raised-button
                    type="button"
                    (click)="resetCompanyForm()">
                    <mat-icon>refresh</mat-icon> Reset
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-tab>

          <!-- Bank Details Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>account_balance</mat-icon>
              <span>Bank Details</span>
            </ng-template>

            <mat-card-content class="tab-content">
              <form [formGroup]="bankForm" (ngSubmit)="saveBankSettings()">
                <div class="form-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>Bank Name</mat-label>
                    <input matInput formControlName="bankName" />
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Account Holder Name</mat-label>
                    <input matInput formControlName="accountHolderName" />
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Account Number</mat-label>
                    <input matInput formControlName="accountNumber" />
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>IFSC Code</mat-label>
                    <input matInput formControlName="ifscCode" />
                  </mat-form-field>
                </div>

                <div class="bank-info-box">
                  <mat-icon>info</mat-icon>
                  <p>
                    Bank details will be displayed on invoices for payment
                    reference.
                  </p>
                </div>

                <div class="action-buttons">
                  <button mat-raised-button color="primary" type="submit">
                    <mat-icon>save</mat-icon> Save Bank Details
                  </button>
                  <button
                    mat-raised-button
                    type="button"
                    (click)="resetBankForm()">
                    <mat-icon>refresh</mat-icon> Reset
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-tab>

          <!-- General Settings Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>settings</mat-icon>
              <span>General</span>
            </ng-template>

            <mat-card-content class="tab-content general-settings">
              <div class="settings-group">
                <h3>Application Settings</h3>
                <div class="setting-item">
                  <div class="setting-info">
                    <p class="setting-label">Currency</p>
                    <p class="setting-description">
                      Default currency for invoices
                    </p>
                  </div>
                  <span class="setting-value">Indian Rupee (₹)</span>
                </div>

                <mat-divider></mat-divider>

                <div class="setting-item">
                  <div class="setting-info">
                    <p class="setting-label">Invoice Prefix</p>
                    <p class="setting-description">
                      Prefix for invoice numbers
                    </p>
                  </div>
                  <span class="setting-value">INV</span>
                </div>

                <mat-divider></mat-divider>

                <div class="setting-item">
                  <div class="setting-info">
                    <p class="setting-label">Theme</p>
                    <p class="setting-description">
                      Application theme and appearance
                    </p>
                  </div>
                  <span class="setting-value">Light</span>
                </div>

                <mat-divider></mat-divider>

                <div class="setting-item">
                  <div class="setting-info">
                    <p class="setting-label">Auto Save</p>
                    <p class="setting-description">
                      Automatically save invoices as draft
                    </p>
                  </div>
                  <button mat-button>Enable</button>
                </div>
              </div>

              <div class="settings-group">
                <h3>Data Management</h3>
                <div class="action-buttons">
                  <button mat-raised-button>
                    <mat-icon>backup</mat-icon> Backup Data
                  </button>
                  <button mat-raised-button>
                    <mat-icon>restore</mat-icon> Restore Data
                  </button>
                  <button mat-raised-button color="warn">
                    <mat-icon>delete</mat-icon> Clear Cache
                  </button>
                </div>
              </div>
            </mat-card-content>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .settings-container {
        padding: 24px;
        max-width: 1000px;
        margin: 0 auto;
      }

      .page-title {
        font-size: 28px;
        font-weight: 500;
        color: #333;
        margin-bottom: 24px;
      }

      .settings-card {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .settings-card ::ng-deep .mat-mdc-tab-list {
        border-bottom: 1px solid #e0e0e0;
      }

      .tab-content {
        padding: 32px 24px;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }

      mat-form-field {
        width: 100%;
      }

      .full-width {
        grid-column: 1 / -1;
      }

      .logo-section {
        padding: 20px;
        background-color: #f5f5f5;
        border-radius: 8px;
        margin-top: 16px;
      }

      .logo-section h3 {
        margin: 0 0 16px 0;
        font-size: 14px;
        font-weight: 600;
        color: #333;
      }

      .logo-container {
        display: flex;
        gap: 24px;
        align-items: center;
      }

      .logo-preview {
        width: 120px;
        height: 120px;
        border: 2px dashed #ddd;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #999;
        overflow: hidden;
      }

      .logo-preview mat-icon {
        font-size: 36px;
        width: 36px;
        height: 36px;
      }

      .logo-preview p {
        font-size: 12px;
        margin: 8px 0 0 0;
      }

      .logo-preview img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .bank-info-box {
        display: flex;
        gap: 12px;
        padding: 16px;
        background-color: #e3f2fd;
        border-radius: 4px;
        margin-bottom: 24px;
        color: #1565c0;
      }

      .bank-info-box mat-icon {
        flex-shrink: 0;
      }

      .bank-info-box p {
        margin: 0;
        font-size: 14px;
      }

      .action-buttons {
        display: flex;
        gap: 12px;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin-top: 24px;
      }

      .action-buttons button {
        min-width: 120px;
      }

      .general-settings {
        padding: 32px 24px;
      }

      .settings-group {
        margin-bottom: 32px;
      }

      .settings-group h3 {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 16px 0;
      }

      .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
      }

      .setting-info {
        flex: 1;
      }

      .setting-label {
        font-weight: 500;
        color: #333;
        margin: 0 0 4px 0;
        font-size: 14px;
      }

      .setting-description {
        color: #999;
        margin: 0;
        font-size: 12px;
      }

      .setting-value {
        color: #666;
        font-weight: 500;
      }

      @media (max-width: 768px) {
        .settings-container {
          padding: 16px;
        }

        .tab-content {
          padding: 20px 16px;
        }

        .form-grid {
          grid-template-columns: 1fr;
        }

        .logo-container {
          flex-direction: column;
          align-items: flex-start;
        }

        .action-buttons {
          flex-direction: column;
        }

        .action-buttons button {
          width: 100%;
        }

        .setting-item {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }
      }
    `,
  ],
})
export class SettingsComponent implements OnInit {
  companyForm!: FormGroup;
  bankForm!: FormGroup;
  currentSettings!: CompanySettings;
  logoPreviewSrc = "";
  uploadingLogo = false;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.settingsService.settings$.subscribe((settings) => {
      this.currentSettings = settings;
      this.initializeCompanyForm();
      this.initializeBankForm();
    });
  }

  initializeCompanyForm(): void {
    this.companyForm = this.fb.group({
      companyName: [this.currentSettings.companyName, Validators.required],
      gstin: [this.currentSettings.gstin, Validators.required],
      address: [this.currentSettings.address, Validators.required],
      city: [this.currentSettings.city, Validators.required],
      state: [this.currentSettings.state, Validators.required],
      postalCode: [this.currentSettings.postalCode],
      phone: [this.currentSettings.phone, Validators.required],
      email: [
        this.currentSettings.email,
        [Validators.required, Validators.email],
      ],
      logoUrl: [this.currentSettings.logoUrl ?? ""],
    });
    this.logoPreviewSrc = this.currentSettings.logoUrl ?? "";
  }

  initializeBankForm(): void {
    this.bankForm = this.fb.group({
      bankName: [this.currentSettings.bankName],
      accountHolderName: [this.currentSettings.accountHolderName],
      accountNumber: [this.currentSettings.accountNumber],
      ifscCode: [this.currentSettings.ifscCode],
    });
  }

  saveCompanySettings(): void {
    if (this.companyForm.valid) {
      const updatedSettings: CompanySettings = {
        ...this.currentSettings,
        ...this.companyForm.value,
      };
      this.settingsService.updateSettings(updatedSettings);
      alert("Company settings saved successfully!");
    }
  }

  saveBankSettings(): void {
    const updatedSettings: CompanySettings = {
      ...this.currentSettings,
      ...this.bankForm.value,
    };
    this.settingsService.updateSettings(updatedSettings);
    alert("Bank details saved successfully!");
  }

  resetCompanyForm(): void {
    this.initializeCompanyForm();
  }

  async onLogoSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.uploadingLogo = true;

    try {
      const dataUrl = await this.readFileAsDataUrl(file);
      if (!window.api) {
        this.logoPreviewSrc = dataUrl;
        this.companyForm.patchValue({ logoUrl: dataUrl });
        return;
      }

      const logoPath = await window.api.saveLogo({
        fileName: file.name,
        dataUrl,
      });

      this.logoPreviewSrc = logoPath;
      this.companyForm.patchValue({ logoUrl: logoPath });
      this.currentSettings = {
        ...this.currentSettings,
        logoUrl: logoPath,
      };
      this.snackBar.open("Logo saved successfully", "Close", {
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
      this.snackBar.open("Failed to upload logo", "Close", {
        duration: 4000,
      });
    } finally {
      this.uploadingLogo = false;
      input.value = "";
    }
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("Unable to read logo file"));
      reader.readAsDataURL(file);
    });
  }

  resetBankForm(): void {
    this.initializeBankForm();
  }
}
