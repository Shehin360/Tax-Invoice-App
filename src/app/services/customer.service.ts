import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Customer } from "../models/customer.model";
import { CustomerDbService } from "./customer-db.service";

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  private customersSubject = new BehaviorSubject<Customer[]>([]);
  public customers$ = this.customersSubject.asObservable();

  constructor(private readonly customerDbService: CustomerDbService) {
    void this.refreshCustomers();
  }

  getCustomers(): Observable<Customer[]> {
    return this.customers$;
  }

  async refreshCustomers(): Promise<void> {
    const customers = await this.customerDbService.getCustomers();
    this.customersSubject.next(customers);
  }

  async addCustomer(customer: Customer): Promise<void> {
    await this.customerDbService.saveCustomer(customer);
    await this.refreshCustomers();
  }

  async saveCustomer(customer: Customer): Promise<void> {
    await this.customerDbService.saveCustomer(customer);
    await this.refreshCustomers();
  }

  searchCustomers(searchTerm: string): Customer[] {
    const term = searchTerm.toLowerCase();
    return this.customersSubject.value.filter(
      (customer) =>
        customer.name.toLowerCase().includes(term) ||
        customer.gstin.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term),
    );
  }

  async deleteCustomer(customerId: string): Promise<void> {
    await this.customerDbService.deleteCustomer(customerId);
    await this.refreshCustomers();
  }
}
