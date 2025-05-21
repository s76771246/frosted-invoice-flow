
import { useState, useEffect } from 'react';
import { fetchInvoices, formatApiData } from '../services/api';

const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadInvoices = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchInvoices();
      console.log('API Response in useInvoices:', data); // Log the data to see its structure
      
      // Extract invoices array and status counts from the API response
      if (data && data.invoices) {
        // Ensure we always have an array of invoices
        const formattedInvoices = Array.isArray(data.invoices) ? data.invoices : [];
        console.log('Formatted invoices:', formattedInvoices);
        
        // Make sure each invoice has an ID that matches the URL parameter format
        const processedInvoices = formattedInvoices.map(invoice => {
          // Check if invoice and invoice.id exist before accessing startsWith
          if (invoice && invoice.id && typeof invoice.id === 'string' && !invoice.id.startsWith('inv-')) {
            return {
              ...invoice,
              id: `inv-${invoice.id}`
            };
          }
          
          // If invoice.id is null/undefined, generate a fallback ID
          if (!invoice.id) {
            console.warn('Invoice with missing ID found:', invoice);
            return {
              ...invoice,
              id: `inv-unknown-${Math.random().toString(36).substring(2, 10)}`
            };
          }
          
          return invoice;
        });
        
        setInvoices(processedInvoices);
        
        // Store status counts for tile display
        if (data.statusCounts) {
          window.apiStatusCounts = data.statusCounts;
          setStatusCounts(data.statusCounts);
        }
      } else {
        // Fallback in case the API format changes
        const formattedData = formatApiData(data);
        console.log('Fallback formatted data:', formattedData);
        setInvoices(formattedData);
      }
    } catch (err) {
      console.error("Error loading invoices:", err);
      setError(err.message || "Failed to load invoices");
      // Set empty array as fallback
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
    
    // Listen for invoice update events
    const handleInvoiceUpdated = (event) => {
      console.log('Invoice updated event received:', event.detail);
      // Refresh the invoice list to reflect changes
      loadInvoices();
    };
    
    window.addEventListener('invoice-updated', handleInvoiceUpdated);
    window.addEventListener('invoice-status-change', handleInvoiceUpdated);
    
    return () => {
      window.removeEventListener('invoice-updated', handleInvoiceUpdated);
      window.removeEventListener('invoice-status-change', handleInvoiceUpdated);
    };
  }, []);

  const refreshInvoices = () => {
    return loadInvoices();
  };

  return {
    invoices,
    statusCounts,
    isLoading,
    error,
    refreshInvoices
  };
};

export default useInvoices;
