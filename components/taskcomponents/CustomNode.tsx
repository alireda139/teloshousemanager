'use client';
import React from 'react';
import { Handle, Position } from 'reactflow';

interface CustomNodeProps {
  data: { 
    label: string;
    selected?: boolean;
    group: 'merchant' | 'warrior' | 'brahmin';
    stats?: {
      incoming: number;
      outgoing: number;
    };
  };
}

const groupColors = {
  merchant: 'bg-green-100',
  warrior: 'bg-red-100',
  brahmin: 'bg-blue-100',
};

const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  // Define shape classes and sizes based on group
  const getShapeClasses = () => {
    switch (data.group) {
      case 'merchant':
        return 'rounded-lg'; // Square
      case 'warrior':
        return 'clip-triangle scale-125'; // Triangle with increased size
      default:
        return 'rounded-full'; // Circle for brahmin
    }
  };

  return (
    <div className="relative group">
      <Handle type="target" position={Position.Top} />
      <div 
        className={`relative w-20 h-20 transition-transform duration-300 ${
          data.selected ? 'scale-125' : ''
        }`}
      >
        {/* Group background */}
        <div className={`absolute -inset-2 ${getShapeClasses()} ${groupColors[data.group]} opacity-50`}></div>
        {/* Outer ring - Soft pastel blue */}
        <div className={`absolute inset-0 ${getShapeClasses()} bg-[#A7C7E7] ${data.selected ? 'animate-pulse' : ''}`}></div>
        {/* Middle ring - Warm coral */}
        <div className={`absolute inset-2 ${getShapeClasses()} bg-[#FF6B6B] ${data.selected ? 'animate-pulse' : ''}`}></div>
        {/* Inner ring - Light cream */}
        <div className={`absolute inset-4 ${getShapeClasses()} bg-[#FFF3B0] ${data.selected ? 'animate-pulse' : ''}`}></div>
        {/* Center content - Name with deep navy text */}
        <div className={`absolute inset-0 ${getShapeClasses()} flex items-center justify-center`}>
          <span className="text-xs font-semibold text-[#1B1B3A] px-2 text-center">
            {data.label}
          </span>
        </div>
      </div>
      {/* Stats tooltip */}
      {data.stats && (
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 flex items-center gap-1">
                ↓ {data.stats.incoming}
                <span className="text-[10px] text-gray-500">
                  incoming/day
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 flex items-center gap-1">
                ↑ {data.stats.outgoing}
                <span className="text-[10px] text-gray-500">
                  outgoing/day
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;