
import { toast } from '@/hooks/use-toast';

const API_ENDPOINT = "YOUR_API_ENDPOINT_URL"; // Replace this with your actual endpoint

export const fetchInvoices = async () => {
  try {
    const response = await fetch(`${API_ENDPOINT}?action=read`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
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
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'write',
        data: invoice
      }),
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
