'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

interface EdgeLabelProps {
  volume: number;
  isIncoming: boolean;
}

const EdgeLabel: React.FC<EdgeLabelProps> = ({ volume, isIncoming }) => {
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [isIncreasing, setIsIncreasing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVolume(prev => {
        const change = Math.random() > 0.7 ? 1 : -1;
        const newVolume = Math.max(1, Math.min(50, prev + change));
        setIsIncreasing(change > 0);
        return newVolume;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-md">
      <MessageCircle 
        size={14} 
        className={`${isIncoming ? 'text-blue-600' : 'text-green-600'} ${
          isIncreasing ? 'animate-pulse' : ''
        }`}
      />
      <span className="text-xs font-medium">
        {currentVolume}
        <span className="ml-1 text-gray-500 text-[10px]">
          {isIncreasing ? '↑' : '↓'}
        </span>
      </span>
    </div>
  );
};

export default EdgeLabel;