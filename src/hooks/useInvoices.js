
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
      console.log('API Response:', data); // Log the data to see its structure
      
      // Extract invoices array and status counts from the API response
      if (data && data.invoices) {
        setInvoices(Array.isArray(data.invoices) ? data.invoices : []);
        
        // Store status counts for tile display
        if (data.statusCounts) {
          window.apiStatusCounts = data.statusCounts;
          setStatusCounts(data.statusCounts);
        }
      } else {
        // Fallback in case the API format changes
        const formattedData = formatApiData(data);
        setInvoices(Array.isArray(formattedData) ? formattedData : []);
      }
    } catch (err) {
      console.error("Error loading invoices:", err);
      setError(err.message || "Failed to load invoices");
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
