
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Invoice, InvoiceItem } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface InvoiceModalProps {
  invoice: Invoice | null;
  open: boolean;
  onClose: () => void;
  onSave: (invoice: Invoice) => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
  invoice,
  open,
  onClose,
  onSave,
}) => {
  const [editedInvoice, setEditedInvoice] = useState<Invoice | null>(invoice);
  const [items, setItems] = useState<InvoiceItem[]>(
    invoice?.items || [
      { description: 'Item 1', quantity: 1, rate: 100, amount: 100 },
      { description: 'Item 2', quantity: 2, rate: 200, amount: 400 },
    ]
  );

  React.useEffect(() => {
    if (invoice) {
      setEditedInvoice(invoice);
      setItems(
        invoice.items || [
          { description: 'Item 1', quantity: 1, rate: 100, amount: 100 },
          { description: 'Item 2', quantity: 2, rate: 200, amount: 400 },
        ]
      );
    }
  }, [invoice]);

  if (!editedInvoice) return null;

  const handleInputChange = (field: keyof Invoice, value: string | number) => {
    if (editedInvoice) {
      setEditedInvoice({
        ...editedInvoice,
        [field]: value,
      });
    }
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

  const handleSave = () => {
    if (editedInvoice) {
      onSave({
        ...editedInvoice,
        items: items,
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-auto glassmorphism p-0 border-0">
        <DialogHeader className="p-6 bg-white/20 backdrop-blur-lg sticky top-0 z-10">
          <DialogTitle className="text-2xl font-bold">
            Invoice Details: {editedInvoice.invoiceNo}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="glassmorphism-dark p-6 rounded-lg flex flex-col h-full">
            <h3 className="text-xl font-bold mb-4">Invoice Document</h3>
            <div className="flex-1 flex items-center justify-center bg-gray-200 rounded-lg">
              <div className="text-center p-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-4 text-sm text-gray-500 font-mono">{editedInvoice.invoiceDoc}</p>
                <Button className="mt-4" variant="outline">View Document</Button>
              </div>
            </div>
          </div>
          
          <div className="glassmorphism-dark p-6 rounded-lg">
            <Tabs defaultValue="details">
              <TabsList className="w-full bg-white/10">
                <TabsTrigger value="details" className="flex-1">Invoice Details</TabsTrigger>
                <TabsTrigger value="items" className="flex-1">Line Items</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Invoice No</label>
                    <Input 
                      value={editedInvoice.invoiceNo} 
                      onChange={(e) => handleInputChange('invoiceNo', e.target.value)}
                      className="bg-white/10 border-0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Invoice Date</label>
                    <Input 
                      value={editedInvoice.invoiceDate} 
                      onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                      className="bg-white/10 border-0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input 
                      value={editedInvoice.title} 
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="bg-white/10 border-0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">PO No</label>
                    <Input 
                      value={editedInvoice.poNo} 
                      onChange={(e) => handleInputChange('poNo', e.target.value)}
                      className="bg-white/10 border-0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Supplier</label>
                    <Input 
                      value={editedInvoice.supplierName} 
                      onChange={(e) => handleInputChange('supplierName', e.target.value)}
                      className="bg-white/10 border-0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Supplier Code</label>
                    <Input 
                      value={editedInvoice.supplierCode} 
                      onChange={(e) => handleInputChange('supplierCode', e.target.value)}
                      className="bg-white/10 border-0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Currency</label>
                    <Input 
                      value={editedInvoice.invoiceCurrency} 
                      onChange={(e) => handleInputChange('invoiceCurrency', e.target.value)}
                      className="bg-white/10 border-0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Total Value</label>
                    <Input 
                      value={editedInvoice.invoiceValue.toString()} 
                      onChange={(e) => handleInputChange('invoiceValue', parseFloat(e.target.value))}
                      className="bg-white/10 border-0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Validation Status</label>
                    <Input 
                      value={editedInvoice.validationStatus} 
                      onChange={(e) => handleInputChange('validationStatus', e.target.value)}
                      className="bg-white/10 border-0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Validation Remark</label>
                    <Input 
                      value={editedInvoice.validationRemark} 
                      onChange={(e) => handleInputChange('validationRemark', e.target.value)}
                      className="bg-white/10 border-0"
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
                              className="bg-white/10 border-0"
                            />
                          </td>
                          <td className="p-2">
                            <Input 
                              type="number"
                              value={item.quantity} 
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              className="bg-white/10 border-0 text-right"
                            />
                          </td>
                          <td className="p-2">
                            <Input 
                              type="number"
                              value={item.rate} 
                              onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                              className="bg-white/10 border-0 text-right"
                            />
                          </td>
                          <td className="p-2 text-right font-medium">
                            {formatCurrency(item.amount, editedInvoice.invoiceCurrency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-white/10 font-bold">
                        <td colSpan={3} className="p-2 text-right">Total:</td>
                        <td className="p-2 text-right">
                          {formatCurrency(
                            items.reduce((sum, item) => sum + item.amount, 0),
                            editedInvoice.invoiceCurrency
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
        
        <DialogFooter className="p-6 bg-white/20 backdrop-blur-lg sticky bottom-0">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
