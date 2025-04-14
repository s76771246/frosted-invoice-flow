
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
import { Invoice } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface InvoiceTableProps {
  invoices: Invoice[];
  onInvoiceClick?: (invoice: Invoice) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, onInvoiceClick }) => {
  const navigate = useNavigate();
  
  const renderStatus = (status: string) => {
    const statusClasses = {
      'Approved': 'bg-green-100 text-green-800',
      'Pending': 'bg-amber-100 text-amber-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Received': 'bg-purple-100 text-purple-800',
    };
    
    // @ts-ignore
    const className = statusClasses[status] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        {status}
      </span>
    );
  };

  const handleRowClick = (invoice: Invoice) => {
    // Navigate to the full page invoice view
    navigate(`/invoice/${invoice.id}`);
  };

  return (
    <div className="glassmorphism overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-white/10 backdrop-blur-sm">
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
                  className="cursor-pointer hover:bg-white/10"
                  onClick={() => handleRowClick(invoice)}
                >
                  <TableCell>
                    <Checkbox 
                      id={`select-${invoice.id}`} 
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{invoice.uniqueId}</TableCell>
                  <TableCell>{invoice.poNo}</TableCell>
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
