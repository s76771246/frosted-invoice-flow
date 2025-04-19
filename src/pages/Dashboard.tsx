
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
import { Invoice, FilterState, StatusTile } from '@/types';
import { mockInvoices, monthOptions, quarterOptions, yearOptions, vendorOptions } from '@/data/mockData';
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
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusTiles, setStatusTiles] = useState<StatusTile[]>([]);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Force refresh of tiles when status changes
  useEffect(() => {
    const handleStatusChange = () => {
      setRefreshCounter(prev => prev + 1);
    };
    
    window.addEventListener('invoice-status-change', handleStatusChange);
    
    return () => {
      window.removeEventListener('invoice-status-change', handleStatusChange);
    };
  }, []);

  // Apply filters and role-based access
  useEffect(() => {
    let result = [...mockInvoices];

    // Filter based on user role
    if (user?.role === 'Manager') {
      // Managers only see clerk-approved invoices
      result = result.filter(inv => inv.clerkApproved === true);
    }

    // Apply tab filter
    if (activeTab !== 'all') {
      if (activeTab === 'approved') {
        result = result.filter(invoice => 
          invoice.validationStatus === 'Approved' || 
          invoice.validationStatus === 'Final Approved'
        );
      } else if (activeTab === 'rejected') {
        result = result.filter(invoice => 
          invoice.validationStatus === 'Rejected' || 
          invoice.validationStatus === 'Manager Rejected'
        );
      } else {
        result = result.filter(invoice => 
          invoice.validationStatus.toLowerCase() === activeTab.toLowerCase()
        );
      }
    }

    // Apply other filters
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
  }, [activeTab, filters, user, mockInvoices, refreshCounter]);

  // Calculate and update status counts
  useEffect(() => {
    // Get all invoices (not just filtered ones) for accurate counts
    let countableInvoices = [...mockInvoices];
    
    // Apply role-based filtering for countable invoices
    if (user?.role === 'Manager') {
      countableInvoices = countableInvoices.filter(inv => inv.clerkApproved === true);
    }
    
    // Apply other filters except status filter (to show correct counts for all statuses)
    if (filters.month !== 'all') {
      countableInvoices = countableInvoices.filter(invoice => {
        const invoiceMonth = invoice.invoiceDate.split('/')[0];
        return invoiceMonth === filters.month;
      });
    }

    if (filters.quarter !== 'all') {
      countableInvoices = countableInvoices.filter(invoice => {
        const month = parseInt(invoice.invoiceDate.split('/')[0]);
        const quarter = Math.ceil(month / 3);
        return `Q${quarter}` === filters.quarter;
      });
    }

    if (filters.year !== 'all') {
      countableInvoices = countableInvoices.filter(invoice => {
        const invoiceYear = invoice.invoiceDate.split('/')[2];
        return invoiceYear === filters.year;
      });
    }

    if (filters.vendor !== 'all') {
      countableInvoices = countableInvoices.filter(invoice => 
        invoice.supplierName === filters.vendor
      );
    }
    
    // Count by status
    const total = countableInvoices.length;
    const approved = countableInvoices.filter(inv => 
      inv.validationStatus === 'Approved' || 
      inv.validationStatus === 'Final Approved'
    ).length;
    const pending = countableInvoices.filter(inv => 
      inv.validationStatus === 'Pending'
    ).length;
    const rejected = countableInvoices.filter(inv => 
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
  }, [mockInvoices, filters, user, refreshCounter]);

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
    
    // Trigger a refresh of the status tiles
    setRefreshCounter(prev => prev + 1);
    
    // Show a toast notification
    toast({
      title: "Invoice Updated",
      description: `Invoice ${updatedInvoice.invoiceNo} has been ${updatedInvoice.validationStatus}.`,
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
        <div className="bg-gradient-to-br from-sky-300/30 to-purple-300/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg p-6">
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
        <div className="bg-gradient-to-br from-blue-200/30 to-green-200/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg p-6">
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

        <div className="bg-gradient-to-br from-purple-200/30 to-pink-200/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg p-6">
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
      
      <div className="bg-gradient-to-br from-sky-200/30 to-indigo-200/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg p-6 mb-6">
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
      
      <div className="bg-gradient-to-br from-blue-100/30 to-purple-100/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg">
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
        <Button className="bg-primary/90 hover:bg-primary backdrop-blur-sm transition-all duration-300">Create New Invoice</Button>
      </div>
      
      <div className="bg-gradient-to-br from-sky-200/30 to-purple-200/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg p-6 mb-6">
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
      
      <div className="bg-gradient-to-br from-blue-100/30 to-purple-100/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg">
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
