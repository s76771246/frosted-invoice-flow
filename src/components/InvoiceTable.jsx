
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency, formatDate } from '@/utils/formatters';

const InvoiceTable = ({ invoices, onInvoiceClick }) => {
  const navigate = useNavigate();
  
  const renderStatus = (status) => {
    const statusClasses = {
      'Approved': 'bg-green-100/80 text-green-800',
      'Final Approved': 'bg-blue-100/80 text-blue-800', 
      'Pending': 'bg-amber-100/80 text-amber-800',
      'Rejected': 'bg-red-100/80 text-red-800',
      'Manager Rejected': 'bg-red-200/80 text-red-900',
      'Received': 'bg-purple-100/80 text-purple-800',
      'Paid': 'bg-emerald-100/80 text-emerald-800',
    };
    
    const className = statusClasses[status] || 'bg-gray-100/80 text-gray-800';
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        {status}
      </span>
    );
  };

  const handleRowClick = (invoice) => {
    // Navigate to the full page invoice view
    navigate(`/invoice/${invoice.id}`);
  };

  return (
    <div className="true-glass overflow-hidden">
      <div className="overflow-x-auto max-h-[calc(100vh-20rem)]">
        <Table>
          <TableHeader className="bg-white/20 backdrop-blur-sm sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>UNIQUE ID</TableHead>
              <TableHead>PO NO</TableHead>
              <TableHead>RECEIVED DATE</TableHead>
              <TableHead>INVOICE DATE</TableHead>
              <TableHead>INVOICE NUMBER</TableHead>
              <TableHead>VENDOR NAME</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>RECEIVED TIME</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  No invoices found.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow 
                  key={invoice.id} 
                  className="cursor-pointer hover:bg-white/20"
                  onClick={() => handleRowClick(invoice)}
                >
                  <TableCell>
                    <Checkbox 
                      id={`select-${invoice.id}`} 
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{invoice.uniqueId}</TableCell>
                  <TableCell>{invoice.poNo || 'NA'}</TableCell>
                  <TableCell>{formatDate(invoice.receivedDate || invoice.createdAt)}</TableCell>
                  <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                  <TableCell>{invoice.invoiceNo}</TableCell>
                  <TableCell>{invoice.supplierName}</TableCell>
                  <TableCell>{renderStatus(invoice.validationStatus)}</TableCell>
                  <TableCell>{invoice.receivedTime || '09:30 AM'}</TableCell>
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
