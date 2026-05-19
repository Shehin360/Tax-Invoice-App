export interface Product {
  id: string;
  name: string;
  hsnSac: string;
  description: string;
  rate: number;
  gstPercent: number;
  unit: string;
  createdDate: string;
}

export interface CreateProductRequest {
  name: string;
  hsnSac: string;
  description: string;
  rate: number;
  gstPercent: number;
  unit: string;
}
