import { Injectable } from "@angular/core";

import {
  ElectronProductDto,
  ElectronProductPayload,
} from "../shared/electron-contracts";
import { Product } from "../models/product.model";
import { MockDataService } from "./mock-data.service";
import { hasElectronApi, readJson, writeJson } from "./local-storage-json";

const FALLBACK_KEY = "tax-invoice-manager.products";

@Injectable({
  providedIn: "root",
})
export class ProductDbService {
  constructor(private readonly mockDataService: MockDataService) {}

  async getProducts(searchTerm = ""): Promise<Product[]> {
    if (hasElectronApi()) {
      const rows = (await window.api!.getProducts(
        searchTerm,
      )) as ElectronProductDto[];
      return rows.map((row) => this.toProduct(row));
    }

    const products = readJson<Product[]>(
      FALLBACK_KEY,
      this.mockDataService.getProducts(),
    );
    const term = searchTerm.trim().toLowerCase();
    return products.filter((product) =>
      [product.name, product.hsnSac, product.description]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }

  async saveProduct(product: Product): Promise<Product> {
    if (hasElectronApi()) {
      const saved = (await window.api!.saveProduct(
        this.toPayload(product),
      )) as ElectronProductDto;
      return this.toProduct(saved);
    }

    const products = readJson<Product[]>(
      FALLBACK_KEY,
      this.mockDataService.getProducts(),
    );
    const existingIndex = products.findIndex(
      (candidate) => candidate.id === product.id,
    );
    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      products.push(product);
    }
    writeJson(FALLBACK_KEY, products);
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    if (hasElectronApi()) {
      await window.api!.deleteProduct(id);
      return;
    }

    const products = readJson<Product[]>(
      FALLBACK_KEY,
      this.mockDataService.getProducts(),
    );
    writeJson(
      FALLBACK_KEY,
      products.filter((product) => product.id !== id),
    );
  }

  private toPayload(product: Product): ElectronProductPayload {
    return {
      id: product.id,
      productName: product.name,
      hsn: product.hsnSac,
      description: product.description,
      unit: product.unit,
      rate: product.rate,
      gstPercentage: product.gstPercent,
    };
  }

  private toProduct(row: ElectronProductDto): Product {
    return {
      id: row.id,
      name: row.productName,
      hsnSac: row.hsn,
      description: row.description,
      rate: row.rate,
      gstPercent: row.gstPercentage,
      unit: row.unit,
      createdDate: row.createdAt,
    };
  }
}
