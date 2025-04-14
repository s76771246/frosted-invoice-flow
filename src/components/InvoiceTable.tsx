
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Invoice } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface InvoiceTableProps {
  invoices: Invoice[];
  onInvoiceClick: (invoice: Invoice) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, onInvoiceClick }) => {
  const renderStatus = (status: string) => {
    const statusClasses = {
      'Matched': 'bg-green-100 text-green-800',
      'Not Matched': 'bg-red-100 text-red-800',
      'Pending': 'bg-amber-100 text-amber-800',
      'Processed': 'bg-blue-100 text-blue-800',
      'Received': 'bg-purple-100 text-purple-800',
      'Rejected': 'bg-gray-100 text-gray-800',
    };
    
    // @ts-ignore
    const className = statusClasses[status] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="glassmorphism overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-white/10 backdrop-blur-sm">
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-12">SR NO</TableHead>
              <TableHead>ACTION</TableHead>
              <TableHead>UNIQUE ID</TableHead>
              <TableHead>TITLE OF INVOICE</TableHead>
              <TableHead>PO NO</TableHead>
              <TableHead>VALIDATION STATUS</TableHead>
              <TableHead>VALIDATION REMARK</TableHead>
              <TableHead>INVOICE NO</TableHead>
              <TableHead>INVOICE DATE</TableHead>
              <TableHead>INVOICE DOC</TableHead>
              <TableHead>INVOICE CURRENCY</TableHead>
              <TableHead>INVOICE VALUE</TableHead>
              <TableHead>SUPPLIER CODE</TableHead>
              <TableHead>SUPPLIER NAME</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={15} className="text-center py-8">
                  No invoices found.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice, index) => (
                <TableRow 
                  key={invoice.id} 
                  className="cursor-pointer hover:bg-white/10"
                  onClick={() => onInvoiceClick(invoice)}
                >
                  <TableCell>
                    <Checkbox id={`select-${invoice.id}`} />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button className="p-1 rounded bg-blue-100 text-blue-600 hover:bg-blue-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{invoice.uniqueId}</TableCell>
                  <TableCell>{invoice.title}</TableCell>
                  <TableCell>{invoice.poNo}</TableCell>
                  <TableCell>{renderStatus(invoice.validationStatus)}</TableCell>
                  <TableCell>{invoice.validationRemark}</TableCell>
                  <TableCell>{invoice.invoiceNo}</TableCell>
                  <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                  <TableCell className="font-mono text-xs">{invoice.invoiceDoc}</TableCell>
                  <TableCell>{invoice.invoiceCurrency}</TableCell>
                  <TableCell>{formatCurrency(invoice.invoiceValue, invoice.invoiceCurrency)}</TableCell>
                  <TableCell>{invoice.supplierCode}</TableCell>
                  <TableCell>{invoice.supplierName}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InvoiceTable;
