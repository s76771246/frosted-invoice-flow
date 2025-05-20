
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
          // If the ID doesn't have the 'inv-' prefix, add it
          if (!invoice.id.startsWith('inv-')) {
            return {
              ...invoice,
              id: `inv-${invoice.id}`
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
