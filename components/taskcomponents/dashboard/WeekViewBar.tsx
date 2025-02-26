import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekViewBarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const WeekViewBar: React.FC<WeekViewBarProps> = ({ selectedDate, onDateChange }) => {
  const getDaysOfWeek = () => {
    const days = [];
    const currentDay = new Date(selectedDate);
    currentDay.setDate(currentDay.getDate() - currentDay.getDay());

    for (let i = 0; i < 7; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    return days;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    onDateChange(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
      <div className="flex items-stretch h-12">
        <button
          onClick={() => navigateWeek('prev')}
          className="px-2 hover:bg-gray-50 flex items-center border-r"
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </button>
        
        <div className="grid grid-cols-7 divide-x flex-1">
          {getDaysOfWeek().map((date, index) => (
            <button
              key={index}
              onClick={() => onDateChange(date)}
              className={`
                flex items-center justify-center transition-colors relative
                ${isSelected(date) ? 'bg-blue-50' : 'hover:bg-gray-50'}
                ${isToday(date) ? 'font-bold' : ''}
              `}
            >
              <div className="text-xs text-center">
                <div className={`${isToday(date) ? 'text-blue-600' : 'text-gray-600'}`}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`${isToday(date) ? 'text-blue-600' : 'text-gray-900'}`}>
                  {date.getDate()}
                </div>
              </div>
              {isSelected(date) && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => navigateWeek('next')}
          className="px-2 hover:bg-gray-50 flex items-center border-l"
        >
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default WeekViewBar;