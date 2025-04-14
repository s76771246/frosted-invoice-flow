
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import StatusTiles from '@/components/StatusTiles';
import FilterBar from '@/components/FilterBar';
import InvoiceTable from '@/components/InvoiceTable';
import InvoiceModal from '@/components/InvoiceModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Invoice, FilterState } from '@/types';
import { statusTiles, mockInvoices, monthOptions, quarterOptions, yearOptions, vendorOptions } from '@/data/mockData';

const Dashboard = () => {
  const { user, hasPermission } = useAuth();
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<FilterState>({
    month: 'all',
    quarter: 'all',
    year: 'all',
    vendor: 'all',
  });
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(mockInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Apply filters
    let result = mockInvoices;

    if (activeTab !== 'all') {
      result = result.filter(invoice => 
        invoice.validationStatus.toLowerCase() === activeTab.toLowerCase()
      );
    }

    if (filters.month !== 'all') {
      result = result.filter(invoice => {
        const invoiceMonth = invoice.invoiceDate.split('/')[0];
        return invoiceMonth === filters.month;
      });
    }

    if (filters.quarter !== 'all') {
      result = result.filter(invoice => {
        const month = parseInt(invoice.invoiceDate.split('/')[0]);
        const quarter = Math.ceil(month / 3);
        return `Q${quarter}` === filters.quarter;
      });
    }

    if (filters.year !== 'all') {
      result = result.filter(invoice => {
        const invoiceYear = invoice.invoiceDate.split('/')[2];
        return invoiceYear === filters.year;
      });
    }

    if (filters.vendor !== 'all') {
      result = result.filter(invoice => 
        invoice.supplierName === filters.vendor
      );
    }

    setFilteredInvoices(result);
  }, [activeTab, filters]);

  const handleFilterChange = (type: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleStatusClick = (status: string) => {
    setActiveTab(status.toLowerCase());
  };

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleSaveInvoice = (updatedInvoice: Invoice) => {
    // In a real app, this would call an API
    setFilteredInvoices(prevInvoices => 
      prevInvoices.map(invoice => 
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice
      )
    );
    
    toast({
      title: "Invoice Updated",
      description: `Invoice ${updatedInvoice.invoiceNo} has been updated successfully.`,
    });
  };

  return (
    <div className={`min-h-screen ${currentTheme.gradient}`}>
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <main>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Account Payable Dashboard</h1>
            <Button>Create New Invoice</Button>
          </div>
          
          {hasPermission('CEO') && (
            <StatusTiles tiles={statusTiles} onClick={handleStatusClick} />
          )}
          
          <FilterBar
            monthOptions={monthOptions}
            quarterOptions={quarterOptions}
            yearOptions={yearOptions}
            vendorOptions={vendorOptions}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="glassmorphism border-0">
              <TabsTrigger value="all">All Invoices</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
              <TabsTrigger value="processed">Processed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="not matched">Not Matched</TabsTrigger>
              <TabsTrigger value="matched">Matched</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <InvoiceTable 
            invoices={filteredInvoices}
            onInvoiceClick={handleInvoiceClick}
          />
          
          <InvoiceModal
            invoice={selectedInvoice}
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveInvoice}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
