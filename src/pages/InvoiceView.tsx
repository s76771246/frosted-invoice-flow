import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Invoice, InvoiceItem } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { mockInvoices } from '@/data/mockData';

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const { user, hasPermission } = useAuth();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  
  useEffect(() => {
    const foundInvoice = mockInvoices.find(inv => inv.id === id);
    if (foundInvoice) {
      setInvoice(foundInvoice);
      setItems(
        foundInvoice.items || [
          { description: 'Item 1', quantity: 1, rate: 100, amount: 100 },
          { description: 'Item 2', quantity: 2, rate: 200, amount: 400 },
        ]
      );
    }
  }, [id]);

  if (!invoice) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Header />
          <div className="flex items-center space-x-4 mb-6">
            <Button onClick={() => navigate('/dashboard')} variant="outline" size="sm" className="true-glass text-black">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-black">Invoice Not Found</h1>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof Invoice, value: string | number) => {
    setInvoice(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    
    if (field === 'quantity' || field === 'rate') {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      newItems[index][field] = numValue;
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    } else {
      (newItems[index] as any)[field] = value;
    }
    
    setItems(newItems);
  };

  const handleAction = (action: 'approve' | 'reject') => {
    if (!invoice) return;
    
    let updatedInvoice = { ...invoice, items };
    
    if (user?.role === 'Clerk') {
      if (action === 'approve') {
        updatedInvoice.validationStatus = 'Approved';
        updatedInvoice.validationRemark = 'Invoice approved by Clerk: ' + user.name;
        updatedInvoice.clerkApproved = true;
      } else if (action === 'reject') {
        updatedInvoice.validationStatus = 'Rejected';
        updatedInvoice.validationRemark = 'Invoice rejected by Clerk: ' + user.name;
        updatedInvoice.clerkApproved = false;
      }
    } else if (user?.role === 'Manager') {
      if (action === 'approve') {
        updatedInvoice.validationStatus = 'Final Approved';
        updatedInvoice.validationRemark = 'Invoice approved by Manager: ' + user.name;
        updatedInvoice.managerApproved = true;
      } else if (action === 'reject') {
        updatedInvoice.validationStatus = 'Manager Rejected';
        updatedInvoice.validationRemark = 'Invoice rejected by Manager: ' + user.name;
        updatedInvoice.managerApproved = false;
      }
    } else if (user?.role === 'CEO') {
      if (action === 'approve') {
        updatedInvoice.validationStatus = 'Final Approved';
        updatedInvoice.validationRemark = 'Invoice approved by CEO: ' + user.name;
        updatedInvoice.clerkApproved = true;
        updatedInvoice.managerApproved = true;
      } else if (action === 'reject') {
        updatedInvoice.validationStatus = 'Rejected';
        updatedInvoice.validationRemark = 'Invoice rejected by CEO: ' + user.name;
        updatedInvoice.clerkApproved = false;
        updatedInvoice.managerApproved = false;
      }
    }
    
    const invoiceIndex = mockInvoices.findIndex(inv => inv.id === invoice.id);
    if (invoiceIndex !== -1) {
      mockInvoices[invoiceIndex] = updatedInvoice;
    }
    
    toast({
      title: `Invoice ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `Invoice ${updatedInvoice.invoiceNo} has been ${action === 'approve' ? 'approved' : 'rejected'} successfully.`,
    });
    
    setInvoice(updatedInvoice);
    
    // This causes a window event to be dispatched that will force the tiles to update
    const statusChangeEvent = new CustomEvent('invoice-status-change', {
      detail: { invoice: updatedInvoice }
    });
    window.dispatchEvent(statusChangeEvent);
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const showApprovalButtons = () => {
    if (user?.role === 'Clerk' && invoice.validationStatus === 'Pending') {
      return true;
    }
    if (user?.role === 'Manager' && invoice.validationStatus === 'Approved' && !invoice.managerApproved) {
      return true;
    }
    if (user?.role === 'CEO') {
      return invoice.validationStatus !== 'Final Approved' && invoice.validationStatus !== 'Paid';
    }
    return false;
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <div className="flex items-center space-x-4 mb-6">
          <Button onClick={() => navigate('/dashboard')} variant="outline" size="sm" className="true-glass text-black">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-black">Invoice Details: {invoice.invoiceNo}</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="true-glass p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-black">Invoice Document</h2>
            <div className="flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg h-96">
              <div className="text-center p-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-4 text-sm text-gray-500 font-mono">{invoice.invoiceDoc}</p>
                <Button className="mt-4 true-glass text-black" variant="outline">View PDF Document</Button>
              </div>
            </div>
          </div>
          
          <div className="true-glass p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-black">Invoice Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Invoice No</label>
                  <Input 
                    value={invoice.invoiceNo} 
                    onChange={(e) => handleInputChange('invoiceNo', e.target.value)}
                    className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30 text-black"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Invoice Date</label>
                  <Input 
                    value={invoice.invoiceDate} 
                    onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                    className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30 text-black"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Title</label>
                  <Input 
                    value={invoice.title} 
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30 text-black"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">PO No</label>
                  <Input 
                    value={invoice.poNo} 
                    onChange={(e) => handleInputChange('poNo', e.target.value)}
                    className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30 text-black"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Supplier</label>
                  <Input 
                    value={invoice.supplierName} 
                    onChange={(e) => handleInputChange('supplierName', e.target.value)}
                    className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30 text-black"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Supplier Code</label>
                  <Input 
                    value={invoice.supplierCode} 
                    onChange={(e) => handleInputChange('supplierCode', e.target.value)}
                    className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30 text-black"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Currency</label>
                  <Input 
                    value="INR"
                    readOnly
                    className="bg-gray-100 border border-white/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Total Value</label>
                  <Input 
                    value={invoice.invoiceValue.toString()} 
                    onChange={(e) => handleInputChange('invoiceValue', parseFloat(e.target.value))}
                    className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30 text-black"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Status</label>
                  <div className={`px-3 py-2 rounded-md border border-white/30 font-medium ${
                    invoice.validationStatus === 'Approved' || invoice.validationStatus === 'Final Approved' ? 'bg-green-100/80 text-green-800' :
                    invoice.validationStatus === 'Rejected' || invoice.validationStatus === 'Manager Rejected' ? 'bg-red-100/80 text-red-800' :
                    invoice.validationStatus === 'Paid' ? 'bg-blue-100/80 text-blue-800' :
                    'bg-amber-100/80 text-amber-800'
                  }`}>
                    {invoice.validationStatus}
                  </div>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-black">Remarks</label>
                  <Textarea 
                    value={invoice.validationRemark} 
                    onChange={(e) => handleInputChange('validationRemark', e.target.value)}
                    className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30 text-black"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="true-glass p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4 text-black">Line Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/10 text-left">
                  <th className="p-2 border-b text-black">Description</th>
                  <th className="p-2 border-b text-right text-black">Quantity</th>
                  <th className="p-2 border-b text-right text-black">Rate</th>
                  <th className="p-2 border-b text-right text-black">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-white/10">
                    <td className="p-2">
                      <Input 
                        value={item.description} 
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30 text-black"
                      />
                    </td>
                    <td className="p-2">
                      <Input 
                        type="number"
                        value={item.quantity} 
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30 text-right text-black"
                      />
                    </td>
                    <td className="p-2">
                      <Input 
                        type="number"
                        value={item.rate} 
                        onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                        className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30 text-right text-black"
                      />
                    </td>
                    <td className="p-2 text-right font-medium text-black">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-white/10 font-bold">
                  <td colSpan={3} className="p-2 text-right text-black">Total:</td>
                  <td className="p-2 text-right text-black">
                    {formatCurrency(
                      items.reduce((sum, item) => sum + item.amount, 0)
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <Button 
            className="mt-4 true-glass text-black"
            variant="outline"
            onClick={() => setItems([...items, { description: '', quantity: 1, rate: 0, amount: 0 }])}
          >
            Add Item
          </Button>
        </div>
        
        <div className="flex justify-end space-x-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="true-glass text-black"
          >
            Cancel
          </Button>
          
          {showApprovalButtons() && (
            <>
              <Button 
                variant="destructive" 
                onClick={() => handleAction('reject')}
                className="bg-red-500 hover:bg-red-600"
              >
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
              
              <Button 
                variant="default" 
                onClick={() => handleAction('approve')}
                className="bg-green-500 hover:bg-green-600"
              >
                <Check className="mr-2 h-4 w-4" /> Approve
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
