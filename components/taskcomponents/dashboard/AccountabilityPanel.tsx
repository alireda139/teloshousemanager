import React, { useState } from 'react';
import { User, CheckCircle2, Bell } from 'lucide-react';
import { WeeklyFocus, TaskWithDetails } from '@/lib/types';

interface AccountabilityPanelProps {
  manager: {
    name: string;
    group: string;
    dailyCheckComplete: boolean;
    weeklyUpdateComplete: boolean;
  };
  weeklyFocus: WeeklyFocus[];
  recentTasks: TaskWithDetails[];
  onToggleFocus: (id: string) => void;
}

const AccountabilityPanel: React.FC<AccountabilityPanelProps> = ({ 
  manager, 
  weeklyFocus, 
  recentTasks,
  onToggleFocus 
}) => {
  const [activeTab, setActiveTab] = useState<'focus' | 'updates'>('focus');

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            manager.group === 'brahmin' 
              ? 'bg-green-100' 
              : manager.group === 'merchant'
              ? 'bg-yellow-100'
              : 'bg-blue-100'
          }`}>
            <User className={`w-5 h-5 ${
              manager.group === 'brahmin'
                ? 'text-green-600'
                : manager.group === 'merchant'
                ? 'text-yellow-600'
                : 'text-blue-600'
            }`} />
          </div>
          <div>
            <h2 className="text-base font-semibold">{manager.name}</h2>
            <p className="text-xs text-gray-600">Accountability Manager</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 
              className={manager.dailyCheckComplete ? 'text-green-500' : 'text-gray-300'} 
              size={18}
            />
            <span className="text-xs text-gray-600">Daily Check</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 
              className={manager.weeklyUpdateComplete ? 'text-green-500' : 'text-gray-300'} 
              size={18}
            />
            <span className="text-xs text-gray-600">Weekly Update</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setActiveTab('focus')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'focus'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <CheckCircle2 size={16} />
            Weekly Focus
          </button>
          <button
            onClick={() => setActiveTab('updates')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'updates'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Bell size={16} />
            Recent Updates
            {recentTasks.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {recentTasks.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'focus' ? (
          <div className="space-y-2">
            {weeklyFocus.map((focus) => (
              <div key={focus.id} className="flex items-center gap-2">
                <button
                  onClick={() => onToggleFocus(focus.id)}
                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                    focus.completed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300'
                  }`}
                >
                  {focus.completed && (
                    <CheckCircle2 className="text-white" size={16} />
                  )}
                </button>
                <span className={`text-sm ${focus.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {focus.focus}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  task.importance === 'high' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{task.content}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      Assigned by {task.assignedBy}
                    </span>
                    <span className="text-xs text-gray-400">
                      {task.assignedAt} ago
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {recentTasks.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No recent updates
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountabilityPanel;