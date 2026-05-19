export interface CompanySettings {
  id?: string;
  companyName: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  logoUrl?: string;
}
