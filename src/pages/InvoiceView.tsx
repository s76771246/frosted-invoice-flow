
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Send, ArrowLeft } from 'lucide-react';
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
    // In a real app, this would call an API
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
      <div className={`min-h-screen ${currentTheme.gradient}`}>
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
      // Update the amount
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    } else {
      // @ts-ignore
      newItems[index][field] = value;
    }
    
    setItems(newItems);
  };

  const handleAction = (action: 'approve' | 'reject' | 'submit') => {
    if (!invoice) return;
    
    let updatedInvoice = { ...invoice, items };
    
    if (action === 'approve') {
      updatedInvoice.validationStatus = 'Approved';
      updatedInvoice.validationRemark = 'Invoice approved by ' + user?.name;
    } else if (action === 'reject') {
      updatedInvoice.validationStatus = 'Rejected';
      updatedInvoice.validationRemark = 'Invoice rejected by ' + user?.name;
    }
    
    // In a real app, this would call an API
    // For now, we'll just show a toast
    toast({
      title: `Invoice ${action === 'submit' ? 'Updated' : action === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `Invoice ${updatedInvoice.invoiceNo} has been ${action === 'submit' ? 'updated' : action === 'approve' ? 'approved' : 'rejected'} successfully.`,
    });
    
    setInvoice(updatedInvoice);
    
    // Navigate back to dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className={`min-h-screen ${currentTheme.gradient}`}>
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <div className="flex items-center space-x-4 mb-6">
          <Button onClick={() => navigate('/dashboard')} variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Invoice Details: {invoice.invoiceNo}</h1>
        </div>
        
        <div className="glassmorphism p-6 rounded-lg mb-6">
          <div className="flex items-center justify-center bg-gray-200 rounded-lg h-96 mb-6">
            <div className="text-center p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-4 text-sm text-gray-500 font-mono">{invoice.invoiceDoc}</p>
              <Button className="mt-4" variant="outline">View PDF Document</Button>
            </div>
          </div>
          
          <div className="glassmorphism-dark p-6 rounded-lg">
            <Tabs defaultValue="details">
              <TabsList className="w-full bg-white/10">
                <TabsTrigger value="details" className="flex-1">Invoice Details</TabsTrigger>
                <TabsTrigger value="items" className="flex-1">Line Items</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Invoice No</label>
                    <Input 
                      value={invoice.invoiceNo} 
                      onChange={(e) => handleInputChange('invoiceNo', e.target.value)}
                      className="bg-white/10 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Invoice Date</label>
                    <Input 
                      value={invoice.invoiceDate} 
                      onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                      className="bg-white/10 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input 
                      value={invoice.title} 
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="bg-white/10 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">PO No</label>
                    <Input 
                      value={invoice.poNo} 
                      onChange={(e) => handleInputChange('poNo', e.target.value)}
                      className="bg-white/10 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Supplier</label>
                    <Input 
                      value={invoice.supplierName} 
                      onChange={(e) => handleInputChange('supplierName', e.target.value)}
                      className="bg-white/10 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Supplier Code</label>
                    <Input 
                      value={invoice.supplierCode} 
                      onChange={(e) => handleInputChange('supplierCode', e.target.value)}
                      className="bg-white/10 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Currency</label>
                    <Input 
                      value="INR"
                      readOnly
                      className="bg-gray-100 border border-gray-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Total Value</label>
                    <Input 
                      value={invoice.invoiceValue.toString()} 
                      onChange={(e) => handleInputChange('invoiceValue', parseFloat(e.target.value))}
                      className="bg-white/10 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <div className={`px-3 py-2 rounded-md border border-gray-300 font-medium ${
                      invoice.validationStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                      invoice.validationStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {invoice.validationStatus}
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Remarks</label>
                    <Textarea 
                      value={invoice.validationRemark} 
                      onChange={(e) => handleInputChange('validationRemark', e.target.value)}
                      className="bg-white/10 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="items" className="mt-4">
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
                              className="bg-white/10 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
                            />
                          </td>
                          <td className="p-2">
                            <Input 
                              type="number"
                              value={item.quantity} 
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              className="bg-white/10 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 text-right"
                            />
                          </td>
                          <td className="p-2">
                            <Input 
                              type="number"
                              value={item.rate} 
                              onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                              className="bg-white/10 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 text-right"
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
                  className="mt-4"
                  variant="outline"
                  onClick={() => setItems([...items, { description: '', quantity: 1, rate: 0, amount: 0 }])}
                >
                  Add Item
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          
          {invoice.validationStatus === 'Pending' && (
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
          
          <Button onClick={() => handleAction('submit')}>
            <Send className="mr-2 h-4 w-4" /> Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
