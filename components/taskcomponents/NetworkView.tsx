'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import MessagePopup from './MessagePopup';
import { Message } from '@/lib/types';
import { communicationData } from '@/data/communication';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const createCircularLayout = () => {
  const nodes: Node[] = [];
  const centerX = 600;
  const centerY = 400;
  const radius = 300;
  const totalNodes = Object.keys(communicationData).length;

  Object.entries(communicationData).forEach(([name, data], index) => {
    const angle = (2 * Math.PI * index) / totalNodes;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    const totalIncoming = Object.values(data.incoming).reduce((sum, val) => sum + val, 0);
    const totalOutgoing = Object.values(data.outgoing).reduce((sum, val) => sum + val, 0);

    nodes.push({
      id: name,
      type: 'custom',
      data: { 
        label: name,
        group: data.group,
        stats: {
          incoming: totalIncoming,
          outgoing: totalOutgoing,
        },
      },
      position: { x, y },
    });
  });

  return nodes;
};

const createEdges = (selectedNode: string): Edge[] => {
  const edges: Edge[] = [];
  const nodeData = communicationData[selectedNode];

  if (!nodeData) return edges;

  Object.entries(nodeData.incoming).forEach(([source, volume]) => {
    edges.push({
      id: `${source}-${selectedNode}`,
      source,
      target: selectedNode,
      data: { volume, isIncoming: true },
      type: 'custom',
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#3b82f6', // blue-500
      },
    });
  });

  Object.entries(nodeData.outgoing).forEach(([target, volume]) => {
    edges.push({
      id: `${selectedNode}-${target}`,
      source: selectedNode,
      target,
      data: { volume, isIncoming: false },
      type: 'custom',
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#22c55e', // green-500
      },
    });
  });

  return edges;
};

const initialNodes = createCircularLayout();

const Flow = () => {
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedEdge, setSelectedEdge] = useState<{
    from: string;
    to: string;
    messages: Message[];
  } | null>(null);

  // Track click timing for double click detection
  const lastClickTime = useRef<number>(0);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastClickTime.current;
    
    // Clear any pending single click timeout
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }

    if (timeDiff < 300) { // Double click detected
      // Navigate to user profile
      router.push(`/user/${node.id}`);
    } else {
      // Single click - wait briefly to ensure it's not a double click
      clickTimeout.current = setTimeout(() => {
        setSelectedNode((prev) => {
          if (prev === node.id) {
            setEdges([]);
            setNodes(nodes => nodes.map(n => ({
              ...n,
              data: { ...n.data, selected: false }
            })));
            return null;
          }
          const newEdges = createEdges(node.id);
          setEdges(newEdges);
          setNodes(nodes => nodes.map(n => ({
            ...n,
            data: { ...n.data, selected: n.id === node.id }
          })));
          return node.id;
        });
      }, 300);
    }

    lastClickTime.current = currentTime;
  }, [setEdges, setNodes, nodes, router]);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    const messages: Message[] = [
      {
        id: '1',
        from: edge.source,
        to: edge.target,
        content: 'Sample message content',
        type: edge.data.isIncoming ? 'inbound' : 'outbound',
        timestamp: new Date().toLocaleString(),
      },
    ];

    setSelectedEdge({
      from: edge.source,
      to: edge.target,
      messages,
    });
  }, []);

  return (
    <>
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">Groups</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded"></div>
              <span className="text-sm">Merchant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 rounded"></div>
              <span className="text-sm">Warrior</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 rounded"></div>
              <span className="text-sm">Brahmin</span>
            </div>
          </div>
        </div>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
      >
        <Controls />
        <Background />
      </ReactFlow>
      {selectedEdge && (
        <MessagePopup
          messages={selectedEdge.messages}
          from={selectedEdge.from}
          to={selectedEdge.to}
          onClose={() => setSelectedEdge(null)}
        />
      )}
    </>
  );
};

const NetworkView = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden pb-20">
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  );
};

export default NetworkView;