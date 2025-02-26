'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Map, MessageSquare } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-around py-3">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              pathname?.includes('/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard size={24} />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              pathname === '/' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Map size={24} />
            <span className="text-sm font-medium">Communication Map</span>
          </Link>
          <Link
            href="/messages"
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              pathname === '/messages' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MessageSquare size={24} />
            <span className="text-sm font-medium">Messages</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 