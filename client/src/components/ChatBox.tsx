import { Send } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

type Chat = {
  message: string;
  userId: string;
  time: string;
  name: string;
}

interface ChatBoxProps {
  recipientName?: string;
  initialMessages?: Chat[];
  onSendMessage?: (message: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ 
  recipientName = 'Chat',
  initialMessages = [],
  onSendMessage = () => {},
}) => {
  const [newMessage, setNewMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    // Only scroll the message container, not the entire page
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [initialMessages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    onSendMessage(newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 5) return "Just now";
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    // If older than a week, return the full date
    return "at " + date.toLocaleString(); // Formats it as "MM/DD/YYYY, HH:MM AM/PM"
  }

  return (
    <div className="flex flex-col h-96 rounded-xl shadow-lg bg-white overflow-hidden border border-blue-200">
      {/* Chat header */}
      <div className="px-5 py-4 bg-blue-50 text-white border-b border-blue-200">
        <h3 className="text-xl font-semibold text-blue-800">ChatBox</h3>
        <p className='text-blue-700 text-sm'>Chat with the collaborators</p>
      </div>

      {/* Messages container - this is the only part that should scroll */}
      <div 
        ref={messageContainerRef}
        className="flex-1 flex flex-col p-2 overflow-y-auto bg-gray-50"
        style={{ maxHeight: 'calc(100% - 140px)' }} // Ensure this container doesn't expand beyond available space
      >
        {initialMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          initialMessages.map((message, index) => (
            <div
              key={`${message.userId}-${index}`}
              className={`mb-4 ${
                message.userId === 'user' ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div className="flex items-end">
                {message.userId !== 'user' && (
                  <div className="flex-shrink-0 mr-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {message.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl shadow-sm mr-2 ${
                    message.userId === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                  }`}
                >
                  {message.message}
                </div>
                {message.userId === 'user' && (
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm ${
                  message.userId === 'user' ? 'text-right' : 'text-left'
                }`}>
                      {message.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
              <div
                className={`text-xs mt-1 text-gray-500 ${
                  message.userId === 'user' ? 'text-right mr-10' : 'text-left ml-10'
                }`}
              >
                {formatTimeAgo(message.time)}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex rounded-full bg-gray-100 overflow-hidden pr-1">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-gray-100 focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={newMessage.trim() === ''}
            className="py-2 px-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;