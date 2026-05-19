import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Product } from "../models/product.model";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>(
    this.getMockProducts(),
  );
  public products$ = this.productsSubject.asObservable();

  constructor() {}

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getMockProducts(): Product[] {
    return [
      {
        id: "1",
        name: "Software License",
        hsnSac: "6212",
        description: "Annual software license",
        rate: 5000,
        gstPercent: 18,
        unit: "Piece",
        createdDate: "2025-01-10",
      },
      {
        id: "2",
        name: "Consultation Services",
        hsnSac: "9983",
        description: "Professional consulting services",
        rate: 2500,
        gstPercent: 18,
        unit: "Hour",
        createdDate: "2025-01-15",
      },
      {
        id: "3",
        name: "Hardware - Laptop",
        hsnSac: "8471",
        description: "Laptop computer",
        rate: 50000,
        gstPercent: 18,
        unit: "Piece",
        createdDate: "2025-02-01",
      },
      {
        id: "4",
        name: "Office Supplies",
        hsnSac: "4820",
        description: "Stationery and office supplies",
        rate: 500,
        gstPercent: 5,
        unit: "Box",
        createdDate: "2025-02-05",
      },
      {
        id: "5",
        name: "Training Program",
        hsnSac: "9983",
        description: "Employee training and development",
        rate: 10000,
        gstPercent: 18,
        unit: "Session",
        createdDate: "2025-03-01",
      },
      {
        id: "6",
        name: "Printing Services",
        hsnSac: "7811",
        description: "Document printing and design",
        rate: 1000,
        gstPercent: 18,
        unit: "Document",
        createdDate: "2025-03-10",
      },
    ];
  }

  addProduct(product: Product): void {
    const currentProducts = this.productsSubject.value;
    this.productsSubject.next([...currentProducts, product]);
  }

  searchProducts(searchTerm: string): Product[] {
    const term = searchTerm.toLowerCase();
    return this.productsSubject.value.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.hsnSac.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term),
    );
  }

  deleteProduct(productId: string): void {
    const updatedProducts = this.productsSubject.value.filter(
      (product) => product.id !== productId,
    );
    this.productsSubject.next(updatedProducts);
  }

  getProductByHsnSac(hsnSac: string): Product | undefined {
    return this.productsSubject.value.find(
      (product) => product.hsnSac === hsnSac,
    );
  }
}
