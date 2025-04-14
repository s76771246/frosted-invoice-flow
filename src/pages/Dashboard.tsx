
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

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

  // Mock data for CEO dashboard charts
  const statusData = [
    { name: 'Received', value: 24 },
    { name: 'Approved', value: 16 },
    { name: 'Pending', value: 8 },
    { name: 'Rejected', value: 3 }
  ];

  const monthlyData = [
    { month: 'Jan', invoices: 30, amount: 45000 },
    { month: 'Feb', invoices: 25, amount: 38000 },
    { month: 'Mar', invoices: 35, amount: 52000 },
    { month: 'Apr', invoices: 40, amount: 60000 },
    { month: 'May', invoices: 28, amount: 42000 },
    { month: 'Jun', invoices: 32, amount: 48000 }
  ];

  const vendorData = [
    { name: 'MSD SUPPLIES', invoices: 20 },
    { name: 'IT RoundPoint', invoices: 15 },
    { name: 'PANTONE', invoices: 12 },
    { name: 'ECOSAVE', invoices: 8 },
    { name: 'Others', invoices: 25 }
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

  const renderCEODashboard = () => (
    <div className="space-y-8">
      <StatusTiles tiles={statusTiles} onClick={handleStatusClick} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glassmorphism p-6 rounded-lg col-span-4">
          <h2 className="text-xl font-bold mb-4">Invoice Status Overview</h2>
          <div className="h-80 w-full">
            <BarChart
              width={1000}
              height={300}
              data={statusData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} Invoices`, 'Count']} />
              <Legend />
              <Bar dataKey="value" name="Invoices" fill="#8884d8" />
            </BarChart>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glassmorphism p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Monthly Trends</h2>
          <div className="h-80 w-full">
            <LineChart
              width={500}
              height={300}
              data={monthlyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="invoices" stroke="#8884d8" name="Invoices" />
              <Line yAxisId="right" type="monotone" dataKey="amount" stroke="#82ca9d" name="Amount (₹)" />
            </LineChart>
          </div>
        </div>

        <div className="glassmorphism p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Vendor Distribution</h2>
          <div className="h-80 w-full flex justify-center">
            <PieChart width={400} height={300}>
              <Pie
                data={vendorData}
                cx={200}
                cy={150}
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="invoices"
              >
                {vendorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} Invoices`, 'Count']} />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClerkDashboard = () => (
    <>
      <StatusTiles tiles={statusTiles} onClick={handleStatusClick} />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Invoice Management</h1>
        <Button>Create New Invoice</Button>
      </div>
      
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
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
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
    </>
  );

  return (
    <div className={`min-h-screen ${currentTheme.gradient}`}>
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <main>
          {user?.role === 'CEO' ? renderCEODashboard() : renderClerkDashboard()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
