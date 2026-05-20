import { Injectable } from "@angular/core";

import {
  ElectronCustomerDto,
  ElectronCustomerPayload,
} from "../shared/electron-contracts";
import { Customer } from "../models/customer.model";
import { MockDataService } from "./mock-data.service";
import { hasElectronApi, readJson, writeJson } from "./local-storage-json";

const FALLBACK_KEY = "tax-invoice-manager.customers";

@Injectable({
  providedIn: "root",
})
export class CustomerDbService {
  constructor(private readonly mockDataService: MockDataService) {}

  async getCustomers(searchTerm = ""): Promise<Customer[]> {
    if (hasElectronApi()) {
      const rows = (await window.api!.getCustomers(
        searchTerm,
      )) as ElectronCustomerDto[];
      return rows.map((row) => this.toCustomer(row));
    }

    const customers = readJson<Customer[]>(
      FALLBACK_KEY,
      this.mockDataService.getCustomers(),
    );
    const term = searchTerm.trim().toLowerCase();

    return customers.filter((customer) =>
      [
        customer.name,
        customer.gstin,
        customer.address,
        customer.phone,
        customer.email,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }

  async saveCustomer(customer: Customer): Promise<Customer> {
    if (hasElectronApi()) {
      const saved = (await window.api!.saveCustomer(
        this.toPayload(customer),
      )) as ElectronCustomerDto;
      return this.toCustomer(saved);
    }

    const customers = readJson<Customer[]>(
      FALLBACK_KEY,
      this.mockDataService.getCustomers(),
    );
    const existingIndex = customers.findIndex(
      (candidate) => candidate.id === customer.id,
    );
    if (existingIndex >= 0) {
      customers[existingIndex] = customer;
    } else {
      customers.push(customer);
    }
    writeJson(FALLBACK_KEY, customers);
    return customer;
  }

  async deleteCustomer(id: string): Promise<void> {
    if (hasElectronApi()) {
      await window.api!.deleteCustomer(id);
      return;
    }

    const customers = readJson<Customer[]>(
      FALLBACK_KEY,
      this.mockDataService.getCustomers(),
    );
    writeJson(
      FALLBACK_KEY,
      customers.filter((customer) => customer.id !== id),
    );
  }

  private toPayload(customer: Customer): ElectronCustomerPayload {
    return {
      id: customer.id,
      customerName: customer.name,
      gstin: customer.gstin,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      phone: customer.phone,
      email: customer.email,
    };
  }

  private toCustomer(row: ElectronCustomerDto): Customer {
    return {
      id: row.id,
      name: row.customerName,
      gstin: row.gstin,
      address: row.address,
      city: row.city,
      state: row.state,
      phone: row.phone,
      email: row.email,
      createdDate: row.createdAt,
    };
  }
}
