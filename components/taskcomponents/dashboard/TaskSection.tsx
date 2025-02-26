import React, { useState, useEffect } from 'react';
import { Plus, Clock, User, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { TaskWithDetails, taskCategories } from '@/lib/types';
import AddTaskModal from './modals/AddTaskModal';
import UpdateMessageModal from './modals/UpdateMessageModal';

interface TaskSectionProps {
  title: string;
  date: Date;
  tasks: TaskWithDetails[];
  onAddTask?: (content: string, type: 'assigned' | 'self') => void;
  onToggleTask: (id: string, updateMessage?: string) => void;
  selectedCategories: Set<keyof typeof taskCategories>;
}

const TaskSection: React.FC<TaskSectionProps> = ({ 
  title, 
  date, 
  tasks, 
  onAddTask, 
  onToggleTask,
  selectedCategories
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeRemaining = (dueDate: Date) => {
    const diff = dueDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { diff, display: `${hours}h ${minutes}m` };
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleTaskToggle = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task?.type === 'assigned' && !task.completed) {
      setSelectedTaskId(taskId);
      setIsUpdateModalOpen(true);
    } else {
      onToggleTask(taskId);
    }
  };

  const handleUpdateSubmit = (message: string) => {
    if (selectedTaskId) {
      onToggleTask(selectedTaskId, message);
      setSelectedTaskId(null);
    }
  };

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks(prev => 
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const filteredTasks = tasks.filter(task => 
    selectedCategories.size === 0 || selectedCategories.has(task.category)
  );

  const incompleteTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-sm text-gray-400">{formatDate(date)}</span>
        </div>
        {onAddTask && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {incompleteTasks.map((task) => {
          const timeInfo = getTimeRemaining(task.dueDate);
          const isOverdue = timeInfo.diff < 0;

          return (
            <div
              key={task.id}
              className={`relative border rounded-lg hover:bg-gray-50 ${isOverdue ? 'task-overdue' : ''}`}
            >
              <div 
                className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-lg ${taskCategories[task.category].color}`}
              />
              
              <div className="p-3 pl-4">
                <div className="flex items-start gap-3">
                  {task.type === 'self' ? (
                    <button
                      onClick={() => handleTaskToggle(task.id)}
                      className={`mt-1 ${task.completed ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                    >
                      <Star size={14} />
                    </button>
                  ) : (
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleTaskToggle(task.id)}
                      className="mt-1 h-4 w-4 rounded border-gray-300"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{task.content}</p>
                    <span className="text-xs text-gray-500 mt-1">
                      {taskCategories[task.category].label}
                    </span>
                    {task.lastUpdate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Last update: {task.lastUpdate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-2 rounded-b-lg border-t flex justify-between items-center text-xs">
                {task.type === 'assigned' && task.assignedBy && (
                  <span className="flex items-center gap-1.5 font-bold text-gray-600">
                    <User size={12} className="text-gray-500" />
                    {task.assignedBy}
                  </span>
                )}
                <div 
                  className="flex items-center gap-1 ml-auto"
                  title={`Created ${task.assignedAt} ago`}
                >
                  <Clock size={12} className="text-gray-500" />
                  <span className={`font-medium ${
                    isOverdue
                      ? 'text-red-500'
                      : timeInfo.diff < 1000 * 60 * 60 * 2
                      ? 'text-orange-500'
                      : 'text-gray-500'
                  }`}>
                    {timeInfo.display}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {completedTasks.map((task) => (
          <div
            key={task.id}
            className="border rounded-lg bg-gray-50"
          >
            <button
              onClick={() => toggleTaskExpansion(task.id)}
              className="w-full p-2 flex items-center gap-3 text-sm text-gray-500"
            >
              {task.type === 'self' ? (
                <Star size={14} className="text-yellow-500" />
              ) : (
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => handleTaskToggle(task.id)}
                  className="h-4 w-4 rounded border-gray-300"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              <span className="line-through flex-1 text-left">{task.content}</span>
              {expandedTasks.includes(task.id) ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
            
            {expandedTasks.includes(task.id) && (
              <div className="p-3 border-t bg-white">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  {task.type === 'assigned' && task.assignedBy && (
                    <span className="flex items-center gap-1.5 font-bold">
                      <User size={12} className="text-gray-500" />
                      {task.assignedBy}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    Created {task.assignedAt} ago
                  </span>
                </div>
                <span className="text-xs text-gray-500 mt-2 block">
                  {taskCategories[task.category].label}
                </span>
                {task.lastUpdate && (
                  <p className="text-xs text-gray-500 mt-2">
                    Last update: {task.lastUpdate}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {onAddTask && (
        <AddTaskModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={onAddTask}
        />
      )}

      <UpdateMessageModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          if (selectedTaskId) {
            onToggleTask(selectedTaskId);
            setSelectedTaskId(null);
          }
        }}
        onSubmit={handleUpdateSubmit}
      />
    </div>
  );
};

export default TaskSection;