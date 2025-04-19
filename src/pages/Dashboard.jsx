
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  // Force refresh when invoice status changes
  useEffect(() => {
    const handleStatusChange = () => {
      setRefreshCounter(prev => prev + 1);
    };
    
    window.addEventListener('invoice-status-change', handleStatusChange);
    
    return () => {
      window.removeEventListener('invoice-status-change', handleStatusChange);
    };
  }, []);

  // Apply filters and calculate status counts
  useEffect(() => {
    // Get all invoices for counting
    let allInvoices = [...mockInvoices];
    
    // Apply role-based filtering
    if (user?.role === 'Manager') {
      allInvoices = allInvoices.filter(inv => inv.clerkApproved === true);
    }
    
    // Apply other filters except status
    if (filters.month !== 'all') {
      allInvoices = allInvoices.filter(invoice => {
        const invoiceMonth = invoice.invoiceDate.split('/')[0];
        return invoiceMonth === filters.month;
      });
    }
    
    if (filters.quarter !== 'all') {
      allInvoices = allInvoices.filter(invoice => {
        const month = parseInt(invoice.invoiceDate.split('/')[0]);
        const quarter = Math.ceil(month / 3);
        return `Q${quarter}` === filters.quarter;
      });
    }
    
    if (filters.year !== 'all') {
      allInvoices = allInvoices.filter(invoice => {
        const invoiceYear = invoice.invoiceDate.split('/')[2];
        return invoiceYear === filters.year;
      });
    }
    
    if (filters.vendor !== 'all') {
      allInvoices = allInvoices.filter(invoice => 
        invoice.supplierName === filters.vendor
      );
    }
    
    // Count by status
    const total = allInvoices.length;
    const approved = allInvoices.filter(inv => 
      inv.validationStatus === 'Approved' || 
      inv.validationStatus === 'Final Approved'
    ).length;
    const pending = allInvoices.filter(inv => 
      inv.validationStatus === 'Pending'
    ).length;
    const rejected = allInvoices.filter(inv => 
      inv.validationStatus === 'Rejected' || 
      inv.validationStatus === 'Manager Rejected'
    ).length;
    
    setStatusTiles([
      {
        status: 'Received',
        count: total,
        color: 'purple',
        icon: 'inbox',
      },
      {
        status: 'Approved',
        count: approved,
        color: 'green',
        icon: 'check-circle',
      },
      {
        status: 'Pending',
        count: pending,
        color: 'amber',
        icon: 'clock',
      },
      {
        status: 'Rejected',
        count: rejected,
        color: 'red',
        icon: 'x-circle',
      },
    ]);
    
    // Filter invoices for the table view
    let filteredResult = [...allInvoices];
    
    // Apply tab filter
    if (activeTab !== 'all') {
      if (activeTab === 'approved') {
        filteredResult = filteredResult.filter(invoice => 
          invoice.validationStatus === 'Approved' || 
          invoice.validationStatus === 'Final Approved'
        );
      } else if (activeTab === 'rejected') {
        filteredResult = filteredResult.filter(invoice => 
          invoice.validationStatus === 'Rejected' || 
          invoice.validationStatus === 'Manager Rejected'
        );
      } else {
        filteredResult = filteredResult.filter(invoice => 
          invoice.validationStatus.toLowerCase() === activeTab.toLowerCase()
        );
      }
    }
    
    setFilteredInvoices(filteredResult);
  }, [activeTab, filters, user, mockInvoices, refreshCounter]);

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
    // Find and update the invoice in the mockInvoices array
    const index = mockInvoices.findIndex(inv => inv.id === updatedInvoice.id);
    if (index !== -1) {
      mockInvoices[index] = updatedInvoice;
    }
    
    // Update the filtered invoices list
    setFilteredInvoices(prevInvoices => 
      prevInvoices.map(invoice => 
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice
      )
    );
    
    // Force a recalculation of the status tiles
    setRefreshCounter(prev => prev + 1);
    
    // Dispatch a status change event to notify other components
    const statusChangeEvent = new CustomEvent('invoice-status-change', {
      detail: { invoice: updatedInvoice }
    });
    window.dispatchEvent(statusChangeEvent);
    
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
        <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl p-6 shadow-lg">
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
        <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl p-6 shadow-lg">
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

        <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl p-6 shadow-lg">
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

  const renderManagerDashboard = () => (
    <>
      <StatusTiles tiles={statusTiles} onClick={handleStatusClick} />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manager Approval Queue</h1>
      </div>
      
      <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl p-6 shadow-lg mb-6">
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
        <TabsList className="bg-white/30 backdrop-blur-md border border-white/40 p-1 rounded-lg">
          <TabsTrigger value="all" className="data-[state=active]:bg-white/60">All Invoices</TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-white/60">Awaiting Approval</TabsTrigger>
          <TabsTrigger value="final approved" className="data-[state=active]:bg-white/60">Approved</TabsTrigger>
          <TabsTrigger value="manager rejected" className="data-[state=active]:bg-white/60">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg">
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

  const renderClerkDashboard = () => (
    <>
      <StatusTiles tiles={statusTiles} onClick={handleStatusClick} />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Invoice Management</h1>
        <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-none text-white">
          Create New Invoice
        </Button>
      </div>
      
      <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl p-6 shadow-lg mb-6">
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
        <TabsList className="bg-white/30 backdrop-blur-md border border-white/40 p-1 rounded-lg">
          <TabsTrigger value="all" className="data-[state=active]:bg-white/60">All Invoices</TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-white/60">Pending</TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-white/60">Approved</TabsTrigger>
          <TabsTrigger value="rejected" className="data-[state=active]:bg-white/60">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg">
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <main className="mt-8">
          {user?.role === 'CEO' 
            ? renderCEODashboard() 
            : user?.role === 'Manager'
              ? renderManagerDashboard()
              : renderClerkDashboard()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
