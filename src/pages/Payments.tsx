
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle } from 'lucide-react';
import { Invoice, InvoiceStatus } from '@/types';
import { mockInvoices } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { formatCurrency, formatDate } from '@/utils/formatters';

const Payments = () => {
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const [payableInvoices, setPayableInvoices] = useState<Invoice[]>([]);
  const [paidInvoices, setPaidInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    // Filter invoices that are approved by both Clerk and Manager (Final Approved)
    const approved = mockInvoices.filter(inv => 
      inv.validationStatus === 'Final Approved' && !inv.isPaid
    );
    
    const paid = mockInvoices.filter(inv => inv.isPaid);
    
    setPayableInvoices(approved);
    setPaidInvoices(paid);
  }, []);

  const handlePayInvoice = (invoice: Invoice) => {
    // Update the invoice status
    const updatedInvoice: Invoice = { 
      ...invoice, 
      isPaid: true,
      paymentDate: new Date().toLocaleDateString(),
      validationStatus: 'Paid' as InvoiceStatus,
      validationRemark: `Payment processed by ${user?.name} on ${new Date().toLocaleDateString()}`
    };
    
    // Update the mock data
    const index = mockInvoices.findIndex(inv => inv.id === invoice.id);
    if (index !== -1) {
      mockInvoices[index] = updatedInvoice;
    }
    
    // Update the state
    setPayableInvoices(prev => prev.filter(inv => inv.id !== invoice.id));
    setPaidInvoices(prev => [...prev, updatedInvoice]);
    
    toast({
      title: "Payment Successful",
      description: `Invoice ${invoice.invoiceNo} has been paid successfully.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <div className="mt-8">
          <h1 className="text-3xl font-bold mb-6 text-black">Payment Management</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-black">Invoices Ready for Payment</h2>
            
            {payableInvoices.length === 0 ? (
              <div className="bg-gradient-to-br from-sky-200/30 to-purple-200/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg p-6 text-center text-black">
                <p>No invoices ready for payment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {payableInvoices.map(invoice => (
                  <div key={invoice.id} className="bg-gradient-to-br from-blue-100/30 to-purple-100/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg text-black">{invoice.invoiceNo} - {invoice.title}</h3>
                      <p className="text-black/80">Supplier: {invoice.supplierName}</p>
                      <p className="text-black/80">Amount: {formatCurrency(invoice.invoiceValue)}</p>
                      <p className="text-black/70 text-sm">Approved on: {formatDate(invoice.updatedAt)}</p>
                    </div>
                    {user?.role === 'Manager' && (
                      <Button 
                        onClick={() => handlePayInvoice(invoice)}
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                      >
                        <CreditCard className="mr-2 h-4 w-4" /> Process Payment
                      </Button>
                    )}
                    {user?.role === 'CEO' && (
                      <Button 
                        disabled
                        className="bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
                      >
                        <CreditCard className="mr-2 h-4 w-4" /> Awaiting Payment
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4 text-black">Payment History</h2>
            
            {paidInvoices.length === 0 ? (
              <div className="bg-gradient-to-br from-sky-200/30 to-purple-200/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg p-6 text-center text-black">
                <p>No payment history available</p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-100/30 to-purple-100/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg overflow-hidden">
                <table className="min-w-full divide-y divide-white/10">
                  <thead>
                    <tr className="bg-white/10">
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Invoice No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Supplier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Payment Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {paidInvoices.map(invoice => (
                      <tr key={invoice.id} className="hover:bg-white/10">
                        <td className="px-6 py-4 whitespace-nowrap text-black">{invoice.invoiceNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-black">{invoice.supplierName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-black">{formatCurrency(invoice.invoiceValue)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-black">{invoice.paymentDate || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <CheckCircle className="h-4 w-4 mr-1" /> Paid
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
