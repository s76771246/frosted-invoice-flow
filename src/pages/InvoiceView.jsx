
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
import { formatCurrency, formatDate } from '@/utils/formatters';
import { mockInvoices } from '@/data/mockData';

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const [invoice, setInvoice] = useState(null);
  const [items, setItems] = useState([]);
  
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
            <Button onClick={() => navigate('/dashboard')} variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Invoice Not Found</h1>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setInvoice(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    
    if (field === 'quantity' || field === 'rate') {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      newItems[index][field] = numValue;
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    } else {
      newItems[index][field] = value;
    }
    
    setItems(newItems);
  };

  const handleAction = (action) => {
    if (!invoice) return;
    
    let updatedInvoice = { ...invoice, items };
    
    if (user?.role === 'Clerk') {
      if (action === 'approve') {
        updatedInvoice.validationStatus = 'Approved';
        updatedInvoice.validationRemark = 'Invoice approved by Clerk: ' + user?.name;
        updatedInvoice.clerkApproved = true;
        updatedInvoice.managerApproved = false;
      } else if (action === 'reject') {
        updatedInvoice.validationStatus = 'Rejected';
        updatedInvoice.validationRemark = 'Invoice rejected by Clerk: ' + user?.name;
        updatedInvoice.clerkApproved = false;
        updatedInvoice.managerApproved = false;
      }
    } else if (user?.role === 'Manager') {
      if (action === 'approve') {
        updatedInvoice.validationStatus = 'Final Approved';
        updatedInvoice.validationRemark = 'Invoice approved by Manager: ' + user?.name;
        updatedInvoice.managerApproved = true;
      } else if (action === 'reject') {
        updatedInvoice.validationStatus = 'Manager Rejected';
        updatedInvoice.validationRemark = 'Invoice rejected by Manager: ' + user?.name;
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
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  // Determine if approval/rejection buttons should be shown based on user role
  const showApprovalButtons = () => {
    if (user?.role === 'Clerk' && invoice.validationStatus === 'Pending') {
      return true;
    }
    if (user?.role === 'Manager' && invoice.validationStatus === 'Approved' && !invoice.managerApproved) {
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <div className="flex items-center space-x-4 mb-6">
          <Button onClick={() => navigate('/dashboard')} variant="outline" size="sm" className="true-glass">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Invoice Details: {invoice.invoiceNo}</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="true-glass p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Invoice Document</h2>
            <div className="flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg h-96">
              <div className="text-center p-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-4 text-sm text-gray-500 font-mono">{invoice.invoiceDoc}</p>
                <Button className="mt-4 true-glass" variant="outline">View PDF Document</Button>
              </div>
            </div>
          </div>
          
          <div className="true-glass p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Invoice Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Invoice No</label>
                  <Input 
                    value={invoice.invoiceNo} 
                    onChange={(e) => handleInputChange('invoiceNo', e.target.value)}
                    className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Invoice Date</label>
                  <Input 
                    value={invoice.invoiceDate} 
                    onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                    className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input 
                    value={invoice.title} 
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">PO No</label>
                  <Input 
                    value={invoice.poNo} 
                    onChange={(e) => handleInputChange('poNo', e.target.value)}
                    className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Supplier</label>
                  <Input 
                    value={invoice.supplierName} 
                    onChange={(e) => handleInputChange('supplierName', e.target.value)}
                    className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Supplier Code</label>
                  <Input 
                    value={invoice.supplierCode} 
                    onChange={(e) => handleInputChange('supplierCode', e.target.value)}
                    className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Currency</label>
                  <Input 
                    value="INR"
                    readOnly
                    className="bg-white/10 border border-white/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total Value</label>
                  <Input 
                    value={invoice.invoiceValue.toString()} 
                    onChange={(e) => handleInputChange('invoiceValue', parseFloat(e.target.value))}
                    className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <div className={`px-3 py-2 rounded-md border border-white/30 font-medium ${
                    invoice.validationStatus === 'Approved' || invoice.validationStatus === 'Final Approved' ? 'bg-green-100/80 text-green-800' :
                    invoice.validationStatus === 'Rejected' || invoice.validationStatus === 'Manager Rejected' ? 'bg-red-100/80 text-red-800' :
                    'bg-amber-100/80 text-amber-800'
                  }`}>
                    {invoice.validationStatus}
                  </div>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Remarks</label>
                  <Textarea 
                    value={invoice.validationRemark} 
                    onChange={(e) => handleInputChange('validationRemark', e.target.value)}
                    className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="true-glass p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Line Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/10 text-left">
                  <th className="p-2 border-b">Description</th>
                  <th className="p-2 border-b text-right">Quantity</th>
                  <th className="p-2 border-b text-right">Rate</th>
                  <th className="p-2 border-b text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-white/10">
                    <td className="p-2">
                      <Input 
                        value={item.description} 
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30"
                      />
                    </td>
                    <td className="p-2">
                      <Input 
                        type="number"
                        value={item.quantity} 
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30 text-right"
                      />
                    </td>
                    <td className="p-2">
                      <Input 
                        type="number"
                        value={item.rate} 
                        onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                        className="bg-white/10 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30 text-right"
                      />
                    </td>
                    <td className="p-2 text-right font-medium">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-white/10 font-bold">
                  <td colSpan={3} className="p-2 text-right">Total:</td>
                  <td className="p-2 text-right">
                    {formatCurrency(
                      items.reduce((sum, item) => sum + item.amount, 0)
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <Button 
            className="mt-4 true-glass"
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
            className="true-glass"
          >
            Cancel
          </Button>
          
          {showApprovalButtons() && (
            <>
              <Button 
                variant="destructive" 
                onClick={() => handleAction('reject')}
              >
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
              
              <Button 
                variant="default" 
                onClick={() => handleAction('approve')}
                className="bg-green-600 hover:bg-green-700"
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
