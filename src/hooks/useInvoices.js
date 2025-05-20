
import { useState, useEffect } from 'react';
import { fetchInvoices, formatApiData } from '../services/api';

const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadInvoices = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchInvoices();
      const formattedData = formatApiData(data);
      setInvoices(Array.isArray(formattedData) ? formattedData : []);
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
    isLoading,
    error,
    refreshInvoices
  };
};

export default useInvoices;
