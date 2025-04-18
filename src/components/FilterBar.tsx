
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar, 
  Filter, 
  Building2, 
  Clock
} from 'lucide-react';
import { FilterOption, FilterState } from '@/types';

interface FilterBarProps {
  monthOptions: FilterOption[];
  quarterOptions: FilterOption[];
  yearOptions: FilterOption[];
  vendorOptions: FilterOption[];
  filters: FilterState;
  onFilterChange: (type: keyof FilterState, value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  monthOptions,
  quarterOptions,
  yearOptions,
  vendorOptions,
  filters,
  onFilterChange,
}) => {
  return (
    <div className="glassmorphism p-4 mb-6 rounded-xl">
      <div className="flex items-center mb-3">
        <Filter className="h-5 w-5 mr-2 text-purple-600" />
        <h3 className="font-semibold text-gray-700">Filter Invoices</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-purple-500" />
            <span>Month</span>
          </label>
          <Select
            value={filters.month}
            onValueChange={(value) => onFilterChange('month', value)}
          >
            <SelectTrigger className="w-full bg-white/70 backdrop-blur-sm border border-purple-100/80 shadow-sm focus:ring-2 focus:ring-purple-200">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent className="bg-white/90 backdrop-blur-md border border-purple-100">
              {monthOptions.map((option) => (
                <SelectItem key={option.id} value={option.value} className="focus:bg-purple-50">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-purple-500" />
            <span>Quarter</span>
          </label>
          <Select
            value={filters.quarter}
            onValueChange={(value) => onFilterChange('quarter', value)}
          >
            <SelectTrigger className="w-full bg-white/70 backdrop-blur-sm border border-purple-100/80 shadow-sm focus:ring-2 focus:ring-purple-200">
              <SelectValue placeholder="Select Quarter" />
            </SelectTrigger>
            <SelectContent className="bg-white/90 backdrop-blur-md border border-purple-100">
              {quarterOptions.map((option) => (
                <SelectItem key={option.id} value={option.value} className="focus:bg-purple-50">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-purple-500" />
            <span>Year</span>
          </label>
          <Select
            value={filters.year}
            onValueChange={(value) => onFilterChange('year', value)}
          >
            <SelectTrigger className="w-full bg-white/70 backdrop-blur-sm border border-purple-100/80 shadow-sm focus:ring-2 focus:ring-purple-200">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent className="bg-white/90 backdrop-blur-md border border-purple-100">
              {yearOptions.map((option) => (
                <SelectItem key={option.id} value={option.value} className="focus:bg-purple-50">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-purple-500" />
            <span>Vendor</span>
          </label>
          <Select
            value={filters.vendor}
            onValueChange={(value) => onFilterChange('vendor', value)}
          >
            <SelectTrigger className="w-full bg-white/70 backdrop-blur-sm border border-purple-100/80 shadow-sm focus:ring-2 focus:ring-purple-200">
              <SelectValue placeholder="Select Vendor" />
            </SelectTrigger>
            <SelectContent className="bg-white/90 backdrop-blur-md border border-purple-100 max-h-48 overflow-y-auto">
              {vendorOptions.map((option) => (
                <SelectItem key={option.id} value={option.value} className="focus:bg-purple-50">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
