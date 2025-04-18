
import React, { useState } from 'react';
import { Bot, Send, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: 'Hello! I\'m your invoice assistant. How can I help you today?' 
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: message }]);
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          type: 'bot', 
          text: `I'll help you with "${message}". Please note that I'm still in training and can provide basic assistance with invoice management.` 
        }
      ]);
    }, 1000);
    
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            size="icon" 
            className="h-12 w-12 rounded-full bg-purple-500/90 backdrop-blur-sm hover:bg-purple-600/90 shadow-lg animate-bounce"
          >
            <Bot className="h-6 w-6 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[320px] sm:w-[400px] backdrop-blur-lg bg-white/90 border-purple-200/50">
          <SheetHeader className="flex flex-row items-center justify-between">
            <SheetTitle className="text-purple-900 flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-500" />
              AI Assistant
            </SheetTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetHeader>
          <div className="h-full flex flex-col mt-4">
            <ScrollArea className="flex-grow rounded-lg bg-white/50 backdrop-blur-sm border border-purple-100/50 p-4 h-[calc(100vh-200px)]">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-3 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div 
                    className={`inline-block px-3 py-2 rounded-lg ${
                      msg.type === 'user' 
                        ? 'bg-purple-500 text-white rounded-tr-none' 
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="mt-4 flex gap-2">
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-grow p-2 rounded-lg border border-purple-200 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <Button 
                className="bg-purple-500 hover:bg-purple-600 text-white"
                onClick={handleSendMessage}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChatBot;
