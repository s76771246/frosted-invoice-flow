import { toast } from '@/hooks/use-toast';
import env from '@/config/env';

// Use the API endpoint from environment config
const API_ENDPOINT = env.API_ENDPOINT;

export const fetchInvoices = async () => {
  try {
    const response = await fetch(API_ENDPOINT);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    
    // Check if the response has the expected format
    if (data && Array.isArray(data.invoices)) {
      return data.invoices;
    } else if (Array.isArray(data)) {
      // Handle case where API returns just an array of invoices
      return data;
    } else {
      console.error('Unexpected API response format:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching invoices:', error);
    toast({
      title: "Error",
      description: "Failed to load invoices. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

export const updateInvoice = async (invoice) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${invoice.id}`, {
      method: 'PUT', // or PATCH depending on your API
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoice),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating invoice:', error);
    toast({
      title: "Error",
      description: "Failed to update invoice. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
};

// Helper function to calculate status counts from invoice data
export const calculateStatusCounts = (invoices) => {
  // If the API already provides status counts, use those instead
  if (window.apiStatusCounts) {
    return [
      { status: 'Received', count: window.apiStatusCounts['Received'] || 0, color: 'blue', icon: 'inbox' },
      { status: 'Approved', count: (window.apiStatusCounts['Approved'] || 0) + (window.apiStatusCounts['Final Approved'] || 0), color: 'green', icon: 'check-circle' },
      { status: 'Pending', count: window.apiStatusCounts['Pending'] || 0, color: 'amber', icon: 'clock' },
      { status: 'Rejected', count: (window.apiStatusCounts['Rejected'] || 0) + (window.apiStatusCounts['Manager Rejected'] || 0), color: 'red', icon: 'x-circle' },
    ];
  }
  
  // Otherwise calculate from the invoices
  const statusCounts = {
    'Received': 0,
    'Pending': 0,
    'Approved': 0,
    'Final Approved': 0,
    'Rejected': 0,
    'Manager Rejected': 0,
    'Paid': 0
  };
  
  invoices.forEach(invoice => {
    if (statusCounts[invoice.validationStatus] !== undefined) {
      statusCounts[invoice.validationStatus]++;
    }
  });
  
  return [
    { status: 'Received', count: statusCounts['Received'], color: 'blue', icon: 'inbox' },
    { status: 'Approved', count: statusCounts['Approved'] + statusCounts['Final Approved'], color: 'green', icon: 'check-circle' },
    { status: 'Pending', count: statusCounts['Pending'], color: 'amber', icon: 'clock' },
    { status: 'Rejected', count: statusCounts['Rejected'] + statusCounts['Manager Rejected'], color: 'red', icon: 'x-circle' },
  ];
};

// Additional helper function to format API data if needed
export const formatApiData = (data) => {
  if (!data) return [];
  
  // Store status counts globally if they exist in the API response
  if (data.statusCounts) {
    window.apiStatusCounts = data.statusCounts;
  }
  
  // Return the invoices array from the API response
  return Array.isArray(data.invoices) ? data.invoices : data;
};
