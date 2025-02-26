'use client';

import React, { useState, useEffect } from 'react';
import { TaskWithDetails, WeeklyFocus, taskCategories } from '@/lib/types';
import WeekViewBar from './dashboard/WeekViewBar';
import AccountabilityPanel from './dashboard/AccountabilityPanel';
import TaskSection from './dashboard/TaskSection';
import TaskFilter from './dashboard/TaskFilter';
import ProjectsPanel from './dashboard/ProjectsPanel';

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const getPanelDates = () => {
    const yesterday = new Date(selectedDate);
    yesterday.setDate(selectedDate.getDate() - 1);
    
    const tomorrow = new Date(selectedDate);
    tomorrow.setDate(selectedDate.getDate() + 1);
    
    return {
      yesterday,
      today: selectedDate,
      tomorrow,
    };
  };

  const [selectedCategories, setSelectedCategories] = useState<Set<keyof typeof taskCategories>>(new Set());

  const toggleCategory = (category: keyof typeof taskCategories) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const generateTasksForDate = (date: Date): TaskWithDetails[] => {
    const dateStr = date.toDateString();
    const hash = dateStr.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    
    const taskCount = (hash % 3) + 2; // 2-4 tasks per day
    const tasks: TaskWithDetails[] = [];
    
    const categories = Object.keys(taskCategories) as Array<keyof typeof taskCategories>;
    
    for (let i = 0; i < taskCount; i++) {
      const isAssigned = (hash + i) % 2 === 0;
      const assigners = ['William', 'Mikyas', 'Faizan', 'Simon'];
      const taskTypes = ['review', 'meeting', 'report', 'planning', 'coordination'];
      const taskType = taskTypes[(hash + i) % taskTypes.length];
      
      tasks.push({
        id: `${dateStr}-${i}`,
        content: `${taskType.charAt(0).toUpperCase() + taskType.slice(1)} task ${i + 1}`,
        completed: false,
        type: isAssigned ? 'assigned' : 'self',
        ...(isAssigned && {
          assignedBy: assigners[(hash + i) % assigners.length],
          assignedAt: `${((hash + i) % 12) + 1} hours`,
        }),
        importance: (hash + i) % 3 === 0 ? 'high' : 'normal',
        category: categories[(hash + i) % categories.length],
        dueDate: new Date(date.getTime() + (1000 * 60 * 60 * ((hash + i) % 24))),
      });
    }
    
    return tasks;
  };

  const [tasks, setTasks] = useState(() => {
    const dates = getPanelDates();
    return {
      yesterday: generateTasksForDate(dates.yesterday),
      today: generateTasksForDate(dates.today),
      tomorrow: generateTasksForDate(dates.tomorrow),
    };
  });

  useEffect(() => {
    const dates = getPanelDates();
    setTasks({
      yesterday: generateTasksForDate(dates.yesterday),
      today: generateTasksForDate(dates.today),
      tomorrow: generateTasksForDate(dates.tomorrow),
    });
  }, [selectedDate]);

  const [accountabilityManager] = useState({
    name: 'Rudi V',
    group: 'brahmin',
    dailyCheckComplete: true,
    weeklyUpdateComplete: false,
  });

  const [weeklyFocus, setWeeklyFocus] = useState<WeeklyFocus[]>([
    {
      id: '1',
      focus: 'Improve cross-team communication efficiency',
      completed: false,
    },
    {
      id: '2',
      focus: 'Implement new knowledge sharing protocols',
      completed: false,
    },
    {
      id: '3',
      focus: 'Enhance team collaboration metrics',
      completed: false,
    },
  ]);

  const toggleFocus = (id: string) => {
    setWeeklyFocus(prev =>
      prev.map(focus =>
        focus.id === id
          ? { ...focus, completed: !focus.completed }
          : focus
      )
    );
  };

  const [projects, setProjects] = useState([
    {
      id: '1',
      name: 'Communication Network Analysis',
      description: 'Analyze and optimize the communication patterns within the organization',
      assignedBy: 'Rudi V',
      progress: 65,
      subtasks: [
        { id: '1-1', content: 'Data collection from all departments', completed: true },
        { id: '1-2', content: 'Pattern analysis and visualization', completed: true },
        { id: '1-3', content: 'Optimization recommendations', completed: false },
        { id: '1-4', content: 'Implementation plan', completed: false },
      ],
    },
    {
      id: '2',
      name: 'Knowledge Transfer System',
      description: 'Develop a system for efficient knowledge sharing between groups',
      assignedBy: 'Mikyas',
      progress: 40,
      subtasks: [
        { id: '2-1', content: 'Current system assessment', completed: true },
        { id: '2-2', content: 'Requirements gathering', completed: true },
        { id: '2-3', content: 'System design', completed: false },
        { id: '2-4', content: 'Implementation phase', completed: false },
        { id: '2-5', content: 'User training', completed: false },
      ],
    },
    {
      id: '3',
      name: 'Cross-Group Integration',
      description: 'Improve collaboration between warriors, merchants, and brahmins',
      assignedBy: 'William',
      progress: 25,
      subtasks: [
        { id: '3-1', content: 'Current challenges documentation', completed: true },
        { id: '3-2', content: 'Integration strategy development', completed: false },
        { id: '3-3', content: 'Pilot program implementation', completed: false },
        { id: '3-4', content: 'Feedback collection and analysis', completed: false },
      ],
    },
  ]);

  const addTask = (section: keyof typeof tasks, content: string, type: 'assigned' | 'self') => {
    const newTask: TaskWithDetails = {
      id: Math.random().toString(),
      content,
      completed: false,
      type,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      ...(type === 'assigned' && {
        assignedBy: ['William', 'Mikyas', 'Faizan', 'Simon'][Math.floor(Math.random() * 4)],
        assignedAt: `${Math.floor(Math.random() * 3)} hours`,
      }),
    };

    setTasks((prev) => ({
      ...prev,
      [section]: [...prev[section], newTask],
    }));
  };

  const toggleTask = (section: keyof typeof tasks, id: string, updateMessage?: string) => {
    setTasks((prev) => ({
      ...prev,
      [section]: prev[section].map((task) =>
        task.id === id ? { 
          ...task, 
          completed: !task.completed,
          ...(updateMessage && { lastUpdate: updateMessage })
        } : task
      ),
    }));
  };

  const toggleSubtask = (projectId: string, subtaskId: string) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          const updatedSubtasks = project.subtasks.map((subtask) =>
            subtask.id === subtaskId
              ? { ...subtask, completed: !subtask.completed }
              : subtask
          );
          
          const completedCount = updatedSubtasks.filter((st) => st.completed).length;
          const progress = Math.round((completedCount / updatedSubtasks.length) * 100);
          
          return {
            ...project,
            subtasks: updatedSubtasks,
            progress,
          };
        }
        return project;
      })
    );
  };

  const panelDates = getPanelDates();
  
  const getRecentTasks = () => {
    const allTasks = [...tasks.today, ...tasks.tomorrow];
    return allTasks
      .filter(task => task.type === 'assigned' && !task.completed)
      .sort((a, b) => {
        const timeA = a.assignedAt?.split(' ')[0] || '0';
        const timeB = b.assignedAt?.split(' ')[0] || '0';
        return parseInt(timeA) - parseInt(timeB);
      })
      .slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <AccountabilityPanel
          manager={accountabilityManager}
          weeklyFocus={weeklyFocus}
          recentTasks={getRecentTasks()}
          onToggleFocus={toggleFocus}
        />

        <WeekViewBar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        <TaskFilter
          selectedCategories={selectedCategories}
          onToggleCategory={toggleCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TaskSection
            title="Yesterday"
            date={panelDates.yesterday}
            tasks={tasks.yesterday}
            onToggleTask={(id, message) => toggleTask('yesterday', id, message)}
            selectedCategories={selectedCategories}
          />
          <TaskSection
            title="Today"
            date={panelDates.today}
            tasks={tasks.today}
            onAddTask={(content, type) => addTask('today', content, type)}
            onToggleTask={(id, message) => toggleTask('today', id, message)}
            selectedCategories={selectedCategories}
          />
          <TaskSection
            title="Tomorrow"
            date={panelDates.tomorrow}
            tasks={tasks.tomorrow}
            onAddTask={(content, type) => addTask('tomorrow', content, type)}
            onToggleTask={(id, message) => toggleTask('tomorrow', id, message)}
            selectedCategories={selectedCategories}
          />
        </div>

        <ProjectsPanel
          projects={projects}
          onToggleSubtask={toggleSubtask}
        />
      </div>
    </div>
  );
};

export default Dashboard;