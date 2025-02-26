export interface Task {
    id: string;
    content: string;
    completed?: boolean;
  }
  
  export interface TaskWithDetails extends Task {
    type: 'assigned' | 'self';
    assignedBy?: string;
    assignedAt?: string;
    importance?: 'high' | 'normal';
    category: 'social-relationships' | 'learning-skills' | 'learning-knowledge' | 'teaching-others' | 'completing-project' | 'personal' | 'spiritual';
    dueDate: Date;
    lastUpdate?: string;
  }
  
  export interface WeeklyFocus {
    id: string;
    focus: string;
    completed: boolean;
  }
  
  export interface Message {
    id: string;
    from: string;
    to: string;
    content: string;
    type: 'inbound' | 'outbound' | 'info';
    timestamp: string;
  }
  
  export interface Person {
    id: string;
    name: string;
    tasks: {
      yesterday: TaskWithDetails[];
      today: TaskWithDetails[];
      tomorrow: TaskWithDetails[];
    };
  }
  
  export const taskCategories = {
    'social-relationships': {
      label: 'Social Relationships',
      color: 'bg-purple-500'
    },
    'learning-skills': {
      label: 'Learning Skills',
      color: 'bg-blue-500'
    },
    'learning-knowledge': {
      label: 'Learning Knowledge',
      color: 'bg-green-500'
    },
    'teaching-others': {
      label: 'Teaching Others',
      color: 'bg-yellow-500'
    },
    'completing-project': {
      label: 'Completing Project',
      color: 'bg-red-500'
    },
    'personal': {
      label: 'Personal',
      color: 'bg-pink-500'
    },
    'spiritual': {
      label: 'Spiritual',
      color: 'bg-indigo-500'
    }
  } as const;