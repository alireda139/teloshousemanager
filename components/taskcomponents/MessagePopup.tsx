'use client';
import React from 'react';
import { X } from 'lucide-react';
import { Message } from '@/lib/types';

interface MessagePopupProps {
  messages: Message[];
  onClose: () => void;
  from: string;
  to: string;
}

const MessagePopup: React.FC<MessagePopupProps> = ({ messages, onClose, from, to }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Messages between {from} and {to}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg ${
                message.type === 'inbound'
                  ? 'bg-blue-100'
                  : message.type === 'outbound'
                  ? 'bg-green-100'
                  : 'bg-yellow-100'
              }`}
            >
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{message.type}</span>
                <span>{message.timestamp}</span>
              </div>
              <p>{message.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessagePopup;