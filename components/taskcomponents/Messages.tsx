'use client';
import React from 'react';

const Messages: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-gray-600 mt-2">
            View and manage your communications
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Message list will be implemented here */}
            <div className="col-span-full text-center text-gray-500">
              <p>Message functionality coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;