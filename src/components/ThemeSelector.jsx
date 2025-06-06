
import React from 'react';
import { Paintbrush } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from '@/contexts/ThemeContext';

const ThemeSelector = () => {
  const { currentTheme, setTheme, themeOptions } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9 true-glass border-white/40">
          <Paintbrush className="h-4 w-4 text-white" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="true-glass border-white/40">
        <DropdownMenuLabel className="text-white/90">Theme</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/20" />
        <DropdownMenuRadioGroup
          value={currentTheme.id}
          onValueChange={setTheme}
        >
          {themeOptions.map((theme) => (
            <DropdownMenuRadioItem
              key={theme.id}
              value={theme.id}
              className="cursor-pointer hover:bg-white/30 text-white/90"
            >
              <div className="flex items-center gap-2">
                <div className={`h-4 w-4 rounded-full ${theme.gradient}`} />
                <span>{theme.name}</span>
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
