
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <div className="glassmorphism p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Month</label>
          <Select
            value={filters.month}
            onValueChange={(value) => onFilterChange('month', value)}
          >
            <SelectTrigger className="w-full bg-white/50 backdrop-blur-sm border-0">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Quarter</label>
          <Select
            value={filters.quarter}
            onValueChange={(value) => onFilterChange('quarter', value)}
          >
            <SelectTrigger className="w-full bg-white/50 backdrop-blur-sm border-0">
              <SelectValue placeholder="Select Quarter" />
            </SelectTrigger>
            <SelectContent>
              {quarterOptions.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Year</label>
          <Select
            value={filters.year}
            onValueChange={(value) => onFilterChange('year', value)}
          >
            <SelectTrigger className="w-full bg-white/50 backdrop-blur-sm border-0">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Vendor</label>
          <Select
            value={filters.vendor}
            onValueChange={(value) => onFilterChange('vendor', value)}
          >
            <SelectTrigger className="w-full bg-white/50 backdrop-blur-sm border-0">
              <SelectValue placeholder="Select Vendor" />
            </SelectTrigger>
            <SelectContent>
              {vendorOptions.map((option) => (
                <SelectItem key={option.id} value={option.value}>
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
