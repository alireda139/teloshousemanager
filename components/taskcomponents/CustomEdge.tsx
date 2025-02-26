'use client';
import React from 'react';
import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow';
import { communicationData } from '@/data/communication';

const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
  markerEnd,
  source,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const volume = data?.volume || 1;
  const isIncoming = data?.isIncoming;
  const strokeWidth = Math.max(1, Math.min(8, volume / 5));
  
  // Get the source node's group
  const sourceGroup = communicationData[source]?.group;
  
  // Define colors based on group
  const getGroupColor = (group: string) => {
    switch (group) {
      case 'brahmin':
        return '#22c55e'; // green-500
      case 'merchant':
        return '#eab308'; // yellow-500
      case 'warrior':
        return '#3b82f6'; // blue-500
      default:
        return '#3b82f6';
    }
  };

  const edgeStyle = {
    ...style,
    strokeWidth,
    stroke: getGroupColor(sourceGroup),
    opacity: 0.8,
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={edgeStyle}
        className={`react-flow__edge-path ${isIncoming ? 'animate-flowLeft' : 'animate-flowRight'}`}
      />
      <foreignObject
        width={80}
        height={40}
        x={labelX - 40}
        y={labelY - 20}
        className="overflow-visible"
      >
        <div className="flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
            <span className={`text-xs font-medium text-${sourceGroup === 'brahmin' ? 'green' : sourceGroup === 'merchant' ? 'yellow' : 'blue'}-600`}>
              {volume}
            </span>
          </div>
        </div>
      </foreignObject>
    </>
  );
};

export default CustomEdge;