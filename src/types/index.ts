
export type UserRole = 'CEO' | 'Manager' | 'Clerk';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
}

export type InvoiceStatus = 'Received' | 'Processed' | 'Pending' | 'Rejected' | 'Matched' | 'Not Matched';

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  uniqueId: string;
  title: string;
  poNo: string;
  validationStatus: InvoiceStatus;
  validationRemark: string;
  invoiceNo: string;
  invoiceDate: string;
  invoiceDoc: string;
  invoiceCurrency: string;
  invoiceValue: number;
  supplierCode: string;
  supplierName: string;
  items?: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface StatusTile {
  status: InvoiceStatus;
  count: number;
  color: string;
  icon: string;
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export type FilterType = 'month' | 'quarter' | 'year' | 'vendor';

export interface FilterState {
  month: string;
  quarter: string;
  year: string;
  vendor: string;
}

export interface ThemeOption {
  id: string;
  name: string;
  class: string;
  gradient: string;
}
