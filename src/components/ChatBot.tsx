
import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            size="icon" 
            className="h-12 w-12 rounded-full bg-purple-500/90 backdrop-blur-sm hover:bg-purple-600/90 shadow-lg"
          >
            <Bot className="h-6 w-6 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px] backdrop-blur-lg bg-white/30 border-purple-200/50">
          <SheetHeader>
            <SheetTitle className="text-purple-900">AI Assistant</SheetTitle>
          </SheetHeader>
          <div className="h-full flex flex-col mt-4">
            <div className="flex-grow overflow-y-auto p-4 rounded-lg bg-white/50 backdrop-blur-sm">
              <p className="text-purple-900">Hello! How can I help you today?</p>
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-grow p-2 rounded-lg border border-purple-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button className="bg-purple-500/90 hover:bg-purple-600/90">Send</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChatBot;
