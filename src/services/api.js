
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
    console.log('API Response data:', data); // Debug log
    
    // Return the data directly from the external API
    return data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    toast({
      title: "Error",
      description: "Failed to load invoices. Please try again later.",
      variant: "destructive",
    });
    return { invoices: [], statusCounts: {} };
  }
};

// Fetch a specific invoice by ID
export const fetchInvoiceById = async (id) => {
  try {
    if (!id) {
      throw new Error("Invalid invoice ID: ID cannot be null or undefined");
    }
    
    // First try to get all invoices
    const data = await fetchInvoices();
    
    // Check if we have invoices data
    if (data && Array.isArray(data.invoices)) {
      // Find the invoice with the matching ID
      const invoice = data.invoices.find(inv => {
        // Handle cases where invoice ID might be in different formats
        if (!inv || !inv.id) return false;
        
        // If the ID parameter contains 'inv-' prefix but API data doesn't
        if (id.startsWith('inv-') && !inv.id.startsWith('inv-')) {
          return `inv-${inv.id}` === id;
        }
        
        // If the API data contains 'inv-' prefix but ID parameter doesn't
        if (!id.startsWith('inv-') && inv.id.startsWith('inv-')) {
          return inv.id === `inv-${id}`;
        }
        
        // Direct comparison
        return inv.id === id;
      });
      
      if (invoice) {
        console.log('Invoice found:', invoice);
        return invoice;
      } else {
        console.warn(`Invoice with ID ${id} not found in data`);
      }
    } else {
      console.warn('No invoices array in response data');
    }
    
    throw new Error(`Invoice with ID ${id} not found`);
  } catch (error) {
    console.error(`Error fetching invoice with ID ${id}:`, error);
    throw error;
  }
};

// Update an invoice using the same API endpoint with POST method
export const updateInvoice = async (invoice) => {
  try {
    if (!invoice || !invoice.id) {
      throw new Error("Invalid invoice data: Missing ID or data");
    }
    
    console.log('Updating invoice with data:', invoice);
    
    // Use the same API_ENDPOINT but with POST method for updating
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'update',
        invoice: invoice
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Update response:', result);
    
    // Dispatch a custom event to notify other components of the update
    const updateEvent = new CustomEvent('invoice-updated', { 
      detail: { invoice: invoice } 
    });
    window.dispatchEvent(updateEvent);
    
    // Show success toast
    toast({
      title: "Success",
      description: `Invoice ${invoice.invoiceNo} was updated successfully.`,
    });
    
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
  // Ensure invoices is always an array before trying to use forEach
  if (!Array.isArray(invoices)) {
    console.error('calculateStatusCounts received non-array:', invoices);
    return [
      { status: 'Received', count: 0, color: 'blue', icon: 'inbox' },
      { status: 'Approved', count: 0, color: 'green', icon: 'check-circle' },
      { status: 'Pending', count: 0, color: 'amber', icon: 'clock' },
      { status: 'Rejected', count: 0, color: 'red', icon: 'x-circle' },
    ];
  }
  
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
  
  // Return the invoices array from the API response, ensuring it's always an array
  const invoicesArray = data.invoices || data;
  return Array.isArray(invoicesArray) ? invoicesArray : [];
};
