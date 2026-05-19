export interface Customer {
  id: string;
  name: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  createdDate: string;
}

export interface CreateCustomerRequest {
  name: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
}
