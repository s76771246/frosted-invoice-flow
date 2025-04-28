import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { mockInvoices } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ChevronLeft, FileText, Check, X, Building, Calendar, Tag, Landmark, CircleDollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
const InvoiceView = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remark, setRemark] = useState('');
  useEffect(() => {
    // Simulate loading invoice data
    const selectedInvoice = mockInvoices.find(inv => inv.id === id);
    if (selectedInvoice) {
      setInvoice(selectedInvoice);
      setRemark(selectedInvoice.validationRemark || '');
    }
    setLoading(false);
  }, [id]);
  const handleRemarkChange = e => {
    setRemark(e.target.value);
  };
  const handleAction = action => {
    if (!invoice || !user) return;
    let updatedStatus;
    let updateInfo = {};
    if (action === 'approve') {
      if (user.role === 'Clerk') {
        updatedStatus = 'Approved';
        updateInfo = {
          clerkApproved: true
        };
      } else if (user.role === 'Manager') {
        updatedStatus = 'Final Approved';
        updateInfo = {
          managerApproved: true
        };
      } else {
        updatedStatus = 'Approved';
      }
    } else {
      if (user.role === 'Manager') {
        updatedStatus = 'Manager Rejected';
      } else {
        updatedStatus = 'Rejected';
      }
    }
    const updatedInvoice = {
      ...invoice,
      validationStatus: updatedStatus,
      validationRemark: remark || `${action === 'approve' ? 'Approved' : 'Rejected'} by ${user.role}`,
      ...updateInfo
    };

    // Find and update the invoice in the mockInvoices array
    const index = mockInvoices.findIndex(inv => inv.id === invoice.id);
    if (index !== -1) {
      mockInvoices[index] = updatedInvoice;
    }

    // Show toast notification
    toast({
      title: `Invoice ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `Invoice ${invoice.invoiceNo} has been ${action === 'approve' ? 'approved' : 'rejected'}.`
    });
    setInvoice(updatedInvoice);

    // This causes a window event to be dispatched that will force the tiles to update
    const statusChangeEvent = new CustomEvent('invoice-status-change', {
      detail: {
        invoice: updatedInvoice
      }
    });
    window.dispatchEvent(statusChangeEvent);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };
  const renderStatus = status => {
    const statusClasses = {
      'Approved': 'bg-green-100 text-green-800 border-green-200',
      'Final Approved': 'bg-blue-100 text-blue-800 border-blue-200',
      'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200',
      'Manager Rejected': 'bg-red-200 text-red-900 border-red-300',
      'Received': 'bg-purple-100 text-purple-800 border-purple-200',
      'Paid': 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    const className = statusClasses[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    return <Badge variant="outline" className={`${className} px-3 py-1 text-xs rounded-full`}>
        {status}
      </Badge>;
  };
  const canActOnInvoice = () => {
    if (!invoice || !user) return false;
    if (user.role === 'CEO') {
      return true;
    } else if (user.role === 'Manager') {
      return invoice.validationStatus === 'Approved' && invoice.clerkApproved;
    } else {
      return invoice.validationStatus === 'Pending' || invoice.validationStatus === 'Received';
    }
  };
  if (loading) {
    return <div>Loading invoice...</div>;
  }
  if (!invoice) {
    return <div>Invoice not found.</div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <main className="mt-8">
          <div className="mb-4">
            <Link to="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-800">
              <ChevronLeft className="mr-2 h-5 w-5" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{invoice.title}</h1>
                <div className="flex items-center gap-2 text-gray-500">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">{invoice.invoiceNo}</span>
                  <span className="text-sm">from</span>
                  <span className="text-sm font-medium">{invoice.supplierName}</span>
                </div>
              </div>
              
              {renderStatus(invoice.validationStatus)}
            </div>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-3">Invoice Information</h2>
                
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Date:</span>
                  <span className="text-sm font-medium">{formatDate(invoice.invoiceDate)}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">PO Number:</span>
                  <span className="text-sm font-medium">{invoice.poNo || 'N/A'}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <CircleDollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Invoice Value:</span>
                  <span className="text-sm font-medium">{formatCurrency(invoice.invoiceValue, invoice.invoiceCurrency)}</span>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-3">Supplier Details</h2>
                
                <div className="flex items-center gap-2 mb-2">
                  <Landmark className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Supplier Code:</span>
                  <span className="text-sm font-medium">{invoice.supplierCode}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Supplier Name:</span>
                  <span className="text-sm font-medium">{invoice.supplierName}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Unique ID:</span>
                  <span className="text-sm font-mono text-xs">{invoice.uniqueId}</span>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">Validation Remark</h2>
              <textarea className="w-full h-24 p-3 border rounded-md text-gray-700 bg-white/70 border-purple-100/80 focus:border-purple-300 focus:ring-0" placeholder="Add or edit a validation remark..." value={remark} onChange={handleRemarkChange} />
            </div>
          </div>
          
          {/* Action Buttons */}
          {canActOnInvoice() && <div className="flex justify-end gap-4 mt-8">
              <Button variant="destructive" onClick={() => handleAction('reject')} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-none text-red-500 bg-sky-400 hover:bg-sky-300">
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
              
              <Button onClick={() => handleAction('approve')} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-none bg-sky-400 hover:bg-sky-300 text-green-500 rounded-2xl">
                <Check className="mr-2 h-4 w-4" /> Approve
              </Button>
            </div>}
        </main>
      </div>
    </div>;
};
export default InvoiceView;