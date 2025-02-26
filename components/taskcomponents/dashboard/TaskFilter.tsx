import React from 'react';
import { taskCategories } from '@/lib/types';

interface TaskFilterProps {
  selectedCategories: Set<keyof typeof taskCategories>;
  onToggleCategory: (category: keyof typeof taskCategories) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ selectedCategories, onToggleCategory }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
      <div className="flex flex-wrap gap-3">
        {Object.entries(taskCategories).map(([key, { label, color }]) => (
          <label
            key={key}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedCategories.has(key as keyof typeof taskCategories)}
              onChange={() => onToggleCategory(key as keyof typeof taskCategories)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${color}`} />
              <span className="text-sm text-gray-700">{label}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default TaskFilter;