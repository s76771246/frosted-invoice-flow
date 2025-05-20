import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import StatusTiles from '@/components/StatusTiles';
import FilterBar from '@/components/FilterBar';
import InvoiceTable from '@/components/InvoiceTable';
import InvoiceModal from '@/components/InvoiceModal';
import { formatDate } from '@/utils/formatters';
import { fetchInvoices, updateInvoice, calculateStatusCounts } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import useInvoices from '@/hooks/useInvoices';

const Dashboard = () => {
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  
  const { invoices: fetchedInvoices, isLoading, error: fetchError, refreshInvoices } = useInvoices();
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusTiles, setStatusTiles] = useState([]);
  
  // Filter state
  const [filters, setFilters] = useState({
    status: 'all',
    vendor: 'all',
    month: 'all',
    quarter: 'all',
    year: 'all',
    search: '',
  });

  // Load invoices on component mount
  useEffect(() => {
    // When fetchedInvoices changes, recalculate status counts and apply filters
    if (Array.isArray(fetchedInvoices)) {
      console.log('Invoices array in Dashboard:', fetchedInvoices);
      
      // Calculate status tiles
      const tiles = calculateStatusCounts(fetchedInvoices);
      setStatusTiles(tiles);
      
      // Apply initial filters
      applyFilters(fetchedInvoices, filters);
    } else {
      console.error('fetchedInvoices is not an array:', fetchedInvoices);
      // Set empty array as fallback
      setFilteredInvoices([]);
      setStatusTiles([
        { status: 'Received', count: 0, color: 'blue', icon: 'inbox' },
        { status: 'Approved', count: 0, color: 'green', icon: 'check-circle' },
        { status: 'Pending', count: 0, color: 'amber', icon: 'clock' },
        { status: 'Rejected', count: 0, color: 'red', icon: 'x-circle' },
      ]);
    }
    
    // Listen for invoice status changes
    const handleStatusChange = (event) => {
      const { invoice } = event.detail;
      if (Array.isArray(fetchedInvoices)) {
        const updatedInvoices = fetchedInvoices.map(inv => 
          inv.id === invoice.id ? invoice : inv
        );
        
        // Update status tiles
        const tiles = calculateStatusCounts(updatedInvoices);
        setStatusTiles(tiles);
        
        // Apply filters to updated invoices
        applyFilters(updatedInvoices, filters);
      }
    };
    
    window.addEventListener('invoice-status-change', handleStatusChange);
    
    return () => {
      window.removeEventListener('invoice-status-change', handleStatusChange);
    };
  }, [fetchedInvoices]);

  // Apply filters when filters state changes
  useEffect(() => {
    if (Array.isArray(fetchedInvoices)) {
      applyFilters(fetchedInvoices, filters);
    }
  }, [filters, fetchedInvoices]);

  const applyFilters = (invoiceList, currentFilters) => {
    // Ensure invoiceList is an array before filtering
    if (!Array.isArray(invoiceList)) {
      console.error('Cannot filter non-array invoiceList:', invoiceList);
      setFilteredInvoices([]);
      return;
    }
    
    let result = [...invoiceList];
    
    // Filter by status
    if (currentFilters.status !== 'all') {
      result = result.filter(inv => inv.validationStatus === currentFilters.status);
    }
    
    // Filter by vendor
    if (currentFilters.vendor !== 'all') {
      result = result.filter(inv => inv.supplierName === currentFilters.vendor);
    }
    
    // Filter by search term
    if (currentFilters.search) {
      const searchLower = currentFilters.search.toLowerCase();
      result = result.filter(inv => 
        (inv.invoiceNo && inv.invoiceNo.toLowerCase().includes(searchLower)) ||
        (inv.title && inv.title.toLowerCase().includes(searchLower)) ||
        (inv.supplierName && inv.supplierName.toLowerCase().includes(searchLower))
      );
    }
    
    // Filter by month
    if (currentFilters.month !== 'all') {
      result = result.filter(inv => {
        if (inv.invoiceDate) {
          const invoiceMonth = formatDate(inv.invoiceDate).split('/')[0];
          return invoiceMonth === currentFilters.month;
        }
        return false;
      });
    }
    
    // Filter by year
    if (currentFilters.year !== 'all') {
      result = result.filter(inv => {
        if (inv.invoiceDate) {
          const invoiceYear = formatDate(inv.invoiceDate).split('/')[2];
          return invoiceYear === currentFilters.year;
        }
        return false;
      });
    }
    
    // Filter by quarter
    if (currentFilters.quarter !== 'all') {
      result = result.filter(inv => {
        if (inv.invoiceDate) {
          const month = parseInt(formatDate(inv.invoiceDate).split('/')[0]);
          const quarter = Math.ceil(month / 3);
          return `Q${quarter}` === currentFilters.quarter;
        }
        return false;
      });
    }
    
    setFilteredInvoices(result);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [filterType]: value,
      };
      return newFilters;
    });
  };

  const handleInvoiceClick = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleSaveInvoice = async (updatedInvoice) => {
    try {
      await updateInvoice(updatedInvoice);
      
      // Update local state by calling refresh
      refreshInvoices();
      
      toast({
        title: "Success",
        description: "Invoice updated successfully.",
      });
      
      // Dispatch custom event to update other components
      const statusChangeEvent = new CustomEvent('invoice-status-change', {
        detail: { invoice: updatedInvoice }
      });
      window.dispatchEvent(statusChangeEvent);
      
    } catch (error) {
      console.error("Failed to save invoice:", error);
      toast({
        title: "Error",
        description: "Failed to update invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Define vendor options based on current invoices
  const vendorOptions = [
    { id: 'all', label: 'All Vendors', value: 'all' },
    ...(Array.isArray(fetchedInvoices) ? 
      Array.from(new Set(fetchedInvoices.map(invoice => invoice.supplierName)))
        .filter(Boolean)
        .map(name => ({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          label: name,
          value: name,
        })) : [])
  ];

  const monthOptions = [
    { id: 'all', label: 'All Months', value: 'all' },
    { id: '01', label: 'January', value: '01' },
    { id: '02', label: 'February', value: '02' },
    { id: '03', label: 'March', value: '03' },
    { id: '04', label: 'April', value: '04' },
    { id: '05', label: 'May', value: '05' },
    { id: '06', label: 'June', value: '06' },
    { id: '07', label: 'July', value: '07' },
    { id: '08', label: 'August', value: '08' },
    { id: '09', label: 'September', value: '09' },
    { id: '10', label: 'October', value: '10' },
    { id: '11', label: 'November', value: '11' },
    { id: '12', label: 'December', value: '12' },
  ];

  const quarterOptions = [
    { id: 'all', label: 'All Quarters', value: 'all' },
    { id: 'Q1', label: 'Q1 (Jan-Mar)', value: 'Q1' },
    { id: 'Q2', label: 'Q2 (Apr-Jun)', value: 'Q2' },
    { id: 'Q3', label: 'Q3 (Jul-Sep)', value: 'Q3' },
    { id: 'Q4', label: 'Q4 (Oct-Dec)', value: 'Q4' },
  ];

  const yearOptions = [
    { id: 'all', label: 'All Years', value: 'all' },
    { id: '2025', label: '2025', value: '2025' },
    { id: '2024', label: '2024', value: '2024' },
    { id: '2023', label: '2023', value: '2023' },
    { id: '2022', label: '2022', value: '2022' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-600">Loading invoices...</div>
          </div>
        ) : fetchError ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-red-600">Error: {fetchError}</div>
          </div>
        ) : (
          <>
            <div className="mt-8">
              <StatusTiles tiles={statusTiles} />
            </div>
            
            <div className="mt-8">
              <FilterBar 
                filters={filters}
                onFilterChange={handleFilterChange}
                vendorOptions={vendorOptions}
                monthOptions={monthOptions}
                quarterOptions={quarterOptions}
                yearOptions={yearOptions}
              />
              
              <div className="mt-6">
                <InvoiceTable 
                  invoices={filteredInvoices} 
                  onInvoiceClick={handleInvoiceClick}
                />
              </div>
            </div>
          </>
        )}
      </div>
      
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveInvoice}
        />
      )}
    </div>
  );
};

export default Dashboard;
