
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
import { mockInvoices, monthOptions, quarterOptions, yearOptions, vendorOptions } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    month: 'all',
    quarter: 'all',
    year: 'all',
    vendor: 'all',
  });
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusTiles, setStatusTiles] = useState([]);
  
  // Set default filter to current month
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    
    setFilters(prev => ({
      ...prev,
      month: currentMonth
    }));
  }, []);

  // Calculate status counts whenever invoices or filters change
  useEffect(() => {
    const calculateStatusCounts = () => {
      // First apply the month filter for current month
      let filtered = mockInvoices;
      
      if (filters.month !== 'all') {
        filtered = filtered.filter(invoice => {
          const invoiceMonth = invoice.invoiceDate.split('/')[0];
          return invoiceMonth === filters.month;
        });
      }
      
      const receivedCount = filtered.length;
      const approvedCount = filtered.filter(inv => inv.validationStatus === 'Approved').length;
      const pendingCount = filtered.filter(inv => inv.validationStatus === 'Pending').length;
      const rejectedCount = filtered.filter(inv => inv.validationStatus === 'Rejected').length;
      
      setStatusTiles([
        {
          status: 'Received',
          count: receivedCount,
          color: 'purple',
          icon: 'inbox',
        },
        {
          status: 'Approved',
          count: approvedCount,
          color: 'green',
          icon: 'check-circle',
        },
        {
          status: 'Pending',
          count: pendingCount,
          color: 'amber',
          icon: 'clock',
        },
        {
          status: 'Rejected',
          count: rejectedCount,
          color: 'red',
          icon: 'x-circle',
        },
      ]);
    };
    
    calculateStatusCounts();
  }, [mockInvoices, filters.month]);

  useEffect(() => {
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

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleStatusClick = (status) => {
    setActiveTab(status.toLowerCase());
  };

  const handleInvoiceClick = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleSaveInvoice = (updatedInvoice) => {
    const index = mockInvoices.findIndex(inv => inv.id === updatedInvoice.id);
    if (index !== -1) {
      mockInvoices[index] = updatedInvoice;
    }
    
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

  const statusData = statusTiles.map(tile => ({
    name: tile.status,
    value: tile.count
  }));

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
      
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Invoice Status Overview</h2>
          <div className="h-80 w-full">
            <BarChart
              width={1000}
              height={300}
              data={statusData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="name" tick={{ fill: '#4B5563' }} />
              <YAxis tick={{ fill: '#4B5563' }} />
              <Tooltip 
                formatter={(value) => [`${value} Invoices`, 'Count']}
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.5)' }}
              />
              <Legend />
              <Bar dataKey="value" name="Invoices" fill="rgba(136, 132, 216, 0.8)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Monthly Trends</h2>
          <div className="h-80 w-full">
            <LineChart
              width={500}
              height={300}
              data={monthlyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="month" tick={{ fill: '#4B5563' }} />
              <YAxis yAxisId="left" tick={{ fill: '#4B5563' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#4B5563' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.5)' }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="invoices" stroke="rgba(136, 132, 216, 0.8)" strokeWidth={2} name="Invoices" dot={{ stroke: 'rgba(136, 132, 216, 1)', strokeWidth: 2, r: 4, fill: 'white' }} />
              <Line yAxisId="right" type="monotone" dataKey="amount" stroke="rgba(130, 202, 157, 0.8)" strokeWidth={2} name="Amount (₹)" dot={{ stroke: 'rgba(130, 202, 157, 1)', strokeWidth: 2, r: 4, fill: 'white' }} />
            </LineChart>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Vendor Distribution</h2>
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} Invoices`, 'Count']}
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.5)' }}
              />
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
        <h1 className="text-3xl font-bold text-gray-800">Invoice Management</h1>
        <Button className="bg-primary/90 hover:bg-primary backdrop-blur-sm transition-all duration-300">Create New Invoice</Button>
      </div>
      
      <div className="glass-panel p-6 mb-6">
        <FilterBar
          monthOptions={monthOptions}
          quarterOptions={quarterOptions}
          yearOptions={yearOptions}
          vendorOptions={vendorOptions}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="glass-panel p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-white/60">All Invoices</TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-white/60">Pending</TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-white/60">Approved</TabsTrigger>
          <TabsTrigger value="rejected" className="data-[state=active]:bg-white/60">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="glass-panel">
        <InvoiceTable 
          invoices={filteredInvoices}
          onInvoiceClick={handleInvoiceClick}
        />
      </div>
      
      <InvoiceModal
        invoice={selectedInvoice}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInvoice}
      />
    </>
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <main className="mt-8">
          {user?.role === 'CEO' ? renderCEODashboard() : renderClerkDashboard()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
