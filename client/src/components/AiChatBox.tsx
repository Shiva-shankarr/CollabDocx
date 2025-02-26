import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

// Types for Gemini API
interface Message {
  id: string;
  role: 'user' | 'model';
  parts: { text: string }[];
  timestamp: Date;
}

interface ChatboxProps {
  apiKey: string;
  model?: string;
  placeholder?: string;
  title?: string;
  maxTokens?: number;
  temperature?: number;
}

const GeminiChatbox: React.FC<ChatboxProps> = ({
  apiKey,
  model = "gemini-1.5-pro",
  placeholder = "Type your message here...",
  title = "Gemini AI Assistant",
  maxTokens = 2048,
  temperature = 0.7
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Generate a unique ID for messages
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      parts: [{ text: input }],
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Prepare content for Gemini API
      const geminiMessages = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: m.parts
      }));
      
      // Add the new user message
      geminiMessages.push({
        role: 'user',
        parts: [{ text: input }]
      });
      
      // Gemini API endpoint
      const apiEndpoint = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: temperature
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract the response text from Gemini API
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
      
      // Add AI response
      const assistantMessage: Message = {
        id: generateId(),
        role: 'model',
        parts: [{ text: responseText }],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching Gemini response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: generateId(),
        role: 'model',
        parts: [{ text: `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}` }],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full my-3 mx-auto h-96 flex flex-col overflow-hidden">
      <CardHeader className="py-5 border-b border-blue-200 bg-blue-50">
        <CardTitle>{"AI Assistant"}</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto px-4 pb-0">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-6">
              Start a conversation....
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg p-3",
                  message.role === 'model' ? "bg-muted" : "bg-primary/10"
                )}
              >
                <div className="mt-0.5">
                  {message.role === 'model' ? (
                    <Bot className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="whitespace-pre-wrap break-words text-sm">
                    {message.parts[0].text}
                  </p>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-2">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Textarea
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-10 flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
            className='bg-blue-600'
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default GeminiChatbox;