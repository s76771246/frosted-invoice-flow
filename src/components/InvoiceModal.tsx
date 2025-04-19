
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useAuth } from '@/contexts/AuthContext';
import { Check, X, FileText, Clipboard, CheckCircle, XCircle } from 'lucide-react';
import { Invoice, InvoiceStatus } from '@/types';

interface InvoiceModalProps {
  invoice: Invoice | null;
  open: boolean;
  onClose: () => void;
  onSave: (invoice: Invoice) => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, open, onClose, onSave }) => {
  const { user } = useAuth();
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState<InvoiceStatus>('Pending');

  React.useEffect(() => {
    if (invoice) {
      setRemarks(invoice.validationRemark || '');
      setStatus(invoice.validationStatus);
    }
  }, [invoice]);

  if (!invoice) return null;

  const handleSave = () => {
    const updatedInvoice: Invoice = {
      ...invoice,
      validationStatus: status,
      validationRemark: remarks,
    };
    
    onSave(updatedInvoice);
    onClose();
  };

  const handleApprove = () => {
    setStatus('Approved');
    
    const updatedInvoice: Invoice = {
      ...invoice,
      validationStatus: 'Approved',
      validationRemark: remarks || 'Approved by ' + user?.role,
    };
    
    onSave(updatedInvoice);
    onClose();
  };

  const handleReject = () => {
    setStatus('Rejected');
    
    const updatedInvoice: Invoice = {
      ...invoice,
      validationStatus: 'Rejected',
      validationRemark: remarks || 'Rejected by ' + user?.role,
    };
    
    onSave(updatedInvoice);
    onClose();
  };

  const renderStatus = (status: string) => {
    const statusClasses = {
      'Approved': 'bg-green-100 text-green-800 border-green-200',
      'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200',
      'Received': 'bg-purple-100 text-purple-800 border-purple-200',
    };
    
    const className = statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800 border-gray-200';
    
    return (
      <Badge variant="outline" className={`${className} px-3 py-1 text-xs rounded-full`}>
        {status}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white/90 backdrop-blur-md border border-purple-100/50 shadow-xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">Invoice Details</DialogTitle>
            {renderStatus(invoice.validationStatus)}
          </div>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-1">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">{invoice.invoiceNo}</span>
              <span className="text-sm text-gray-500">from</span>
              <span className="text-sm font-medium">{invoice.supplierName}</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-500">Invoice Title</Label>
              <div className="font-medium">{invoice.title}</div>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">Invoice Date</Label>
              <div className="font-medium">{formatDate(invoice.invoiceDate)}</div>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">PO Number</Label>
              <div className="font-medium">{invoice.poNo || 'N/A'}</div>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">Invoice Value</Label>
              <div className="font-medium">{formatCurrency(invoice.invoiceValue, invoice.invoiceCurrency)}</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-500">Supplier Code</Label>
              <div className="font-medium">{invoice.supplierCode}</div>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">Supplier Name</Label>
              <div className="font-medium">{invoice.supplierName}</div>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">Received Date</Label>
              <div className="font-medium">{formatDate(invoice.createdAt)}</div>
            </div>
            
            <div>
              <Label className="text-sm text-gray-500">Unique ID</Label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs">{invoice.uniqueId}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-6 px-2"
                  onClick={() => {
                    navigator.clipboard.writeText(invoice.uniqueId);
                  }}
                >
                  <Clipboard className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div>
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <Select 
              value={status} 
              onValueChange={(value: InvoiceStatus) => setStatus(value)}
            >
              <SelectTrigger id="status" className="w-full bg-white/70 border-purple-100/80 mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="remarks" className="text-sm font-medium">
              Remarks
            </Label>
            <Textarea 
              id="remarks" 
              value={remarks} 
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add remarks about this invoice..."
              className="mt-1 bg-white/70 border-purple-100/80"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center gap-2 sm:gap-0 mt-6">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-purple-200 hover:bg-purple-50"
            >
              Cancel
            </Button>
            
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleReject}
              className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
            
            <Button 
              onClick={handleApprove}
              className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1"
            >
              <CheckCircle className="h-4 w-4" />
              Approve
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
