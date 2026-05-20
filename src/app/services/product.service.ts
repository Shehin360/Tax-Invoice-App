import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Product } from "../models/product.model";
import { ProductDbService } from "./product-db.service";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private readonly productDbService: ProductDbService) {
    void this.refreshProducts();
  }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  async refreshProducts(): Promise<void> {
    const products = await this.productDbService.getProducts();
    this.productsSubject.next(products);
  }

  async addProduct(product: Product): Promise<void> {
    await this.productDbService.saveProduct(product);
    await this.refreshProducts();
  }

  async saveProduct(product: Product): Promise<void> {
    await this.productDbService.saveProduct(product);
    await this.refreshProducts();
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

  async deleteProduct(productId: string): Promise<void> {
    await this.productDbService.deleteProduct(productId);
    await this.refreshProducts();
  }

  getProductByHsnSac(hsnSac: string): Product | undefined {
    return this.productsSubject.value.find(
      (product) => product.hsnSac === hsnSac,
    );
  }
}
