
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Invoice } from '@/types';

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
  const navigate = useNavigate();
  
  const handleViewFullPage = () => {
    if (invoice) {
      navigate(`/invoice/${invoice.id}`);
    }
    onClose();
  };

  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md glassmorphism p-6 border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Invoice: {invoice.invoiceNo}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm mb-4">
            Click below to view this invoice in full page mode to see all details and take actions.
          </p>
        </div>
        
        <DialogFooter className="space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleViewFullPage}>
            View Full Page
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
