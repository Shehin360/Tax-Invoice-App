import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Customer } from "../models/customer.model";

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  private customersSubject = new BehaviorSubject<Customer[]>(
    this.getMockCustomers(),
  );
  public customers$ = this.customersSubject.asObservable();

  constructor() {}

  getCustomers(): Observable<Customer[]> {
    return this.customers$;
  }

  getMockCustomers(): Customer[] {
    return [
      {
        id: "1",
        name: "ABC Enterprises",
        gstin: "18AABCR5055K1Z0",
        address: "456 Customer Avenue",
        city: "Delhi",
        state: "Delhi",
        phone: "+91 8765432109",
        email: "abc@enterprise.com",
        createdDate: "2025-01-15",
      },
      {
        id: "2",
        name: "XYZ Industries",
        gstin: "27ABCDE1234F1Z0",
        address: "789 Industrial Park",
        city: "Bangalore",
        state: "Karnataka",
        phone: "+91 7654321098",
        email: "info@xyzind.com",
        createdDate: "2025-02-20",
      },
      {
        id: "3",
        name: "Tech Solutions Pvt Ltd",
        gstin: "33AABCT1234Q1Z0",
        address: "321 Tech Street",
        city: "Hyderabad",
        state: "Telangana",
        phone: "+91 6543210987",
        email: "contact@techsol.com",
        createdDate: "2025-03-10",
      },
      {
        id: "4",
        name: "Manufacturing Co",
        gstin: "24AABCM5432R1Z0",
        address: "654 Factory Road",
        city: "Chennai",
        state: "Tamil Nadu",
        phone: "+91 5432109876",
        email: "sales@mfgco.com",
        createdDate: "2025-04-05",
      },
      {
        id: "5",
        name: "Global Traders",
        gstin: "29AABCT9876Q1Z0",
        address: "987 Trade Center",
        city: "Kolkata",
        state: "West Bengal",
        phone: "+91 4321098765",
        email: "info@globaltrade.com",
        createdDate: "2025-04-20",
      },
    ];
  }

  addCustomer(customer: Customer): void {
    const currentCustomers = this.customersSubject.value;
    this.customersSubject.next([...currentCustomers, customer]);
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

  deleteCustomer(customerId: string): void {
    const updatedCustomers = this.customersSubject.value.filter(
      (customer) => customer.id !== customerId,
    );
    this.customersSubject.next(updatedCustomers);
  }
}
