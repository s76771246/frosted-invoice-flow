
import React, { useState, useEffect } from 'react';
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

const InvoiceModal = ({ invoice, open, onClose, onSave }) => {
  const { user } = useAuth();
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('Pending');

  useEffect(() => {
    if (invoice) {
      setRemarks(invoice.validationRemark || '');
      setStatus(invoice.validationStatus);
    }
  }, [invoice]);

  if (!invoice) return null;

  const handleSave = () => {
    const updatedInvoice = {
      ...invoice,
      validationStatus: status,
      validationRemark: remarks,
    };
    
    onSave(updatedInvoice);
    onClose();
  };

  const handleApprove = () => {
    // Different behavior based on user role
    let updatedStatus = 'Approved';
    let updateInfo = {};
    
    if (user?.role === 'Clerk') {
      updatedStatus = 'Approved';
      updateInfo = { clerkApproved: true };
    } else if (user?.role === 'Manager') {
      updatedStatus = 'Final Approved';
      updateInfo = { managerApproved: true };
    }
    
    const updatedInvoice = {
      ...invoice,
      validationStatus: updatedStatus,
      validationRemark: remarks || `Approved by ${user?.role}`,
      ...updateInfo
    };
    
    onSave(updatedInvoice);
    onClose();
  };

  const handleReject = () => {
    // Different behavior based on user role
    let updatedStatus = 'Rejected';
    
    if (user?.role === 'Manager') {
      updatedStatus = 'Manager Rejected';
    }
    
    const updatedInvoice = {
      ...invoice,
      validationStatus: updatedStatus,
      validationRemark: remarks || `Rejected by ${user?.role}`,
    };
    
    onSave(updatedInvoice);
    onClose();
  };

  const renderStatus = (status) => {
    const statusClasses = {
      'Approved': 'bg-green-100 text-green-800 border-green-200',
      'Final Approved': 'bg-blue-100 text-blue-800 border-blue-200',
      'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200',
      'Manager Rejected': 'bg-red-200 text-red-900 border-red-300',
      'Received': 'bg-purple-100 text-purple-800 border-purple-200',
      'Paid': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
    
    const className = statusClasses[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    
    return (
      <Badge variant="outline" className={`${className} px-3 py-1 text-xs rounded-full`}>
        {status}
      </Badge>
    );
  };

  const renderStatusOptions = () => {
    if (user?.role === 'CEO') {
      return (
        <>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Approved">Approved</SelectItem>
          <SelectItem value="Final Approved">Final Approved</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
        </>
      );
    } else if (user?.role === 'Manager') {
      return (
        <>
          <SelectItem value="Approved">Approved</SelectItem>
          <SelectItem value="Final Approved">Final Approved</SelectItem>
          <SelectItem value="Manager Rejected">Rejected</SelectItem>
        </>
      );
    } else {
      return (
        <>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Approved">Approved</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
        </>
      );
    }
  };

  const shouldShowActions = () => {
    if (user?.role === 'CEO') {
      return true; // CEO can see all actions
    } else if (user?.role === 'Manager') {
      return invoice.validationStatus === 'Approved' && invoice.clerkApproved;
    } else {
      return invoice.validationStatus === 'Pending' || invoice.validationStatus === 'Received';
    }
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
              onValueChange={(value) => setStatus(value)}
            >
              <SelectTrigger id="status" className="w-full bg-white/70 border-purple-100/80 mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {renderStatusOptions()}
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
            
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              Save Changes
            </Button>
          </div>
          
          {shouldShowActions() && (
            <div className="flex gap-2">
              <Button 
                onClick={handleReject}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex items-center gap-1"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              
              <Button 
                onClick={handleApprove}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
