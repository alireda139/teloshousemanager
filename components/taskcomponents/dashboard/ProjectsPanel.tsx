import React from 'react';
import { User } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  assignedBy: string;
  progress: number;
  subtasks: {
    id: string;
    content: string;
    completed: boolean;
  }[];
}

interface ProjectsPanelProps {
  projects: Project[];
  onToggleSubtask: (projectId: string, subtaskId: string) => void;
}

const ProjectsPanel: React.FC<ProjectsPanelProps> = ({ projects, onToggleSubtask }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mt-8">
      <h2 className="text-xl font-bold mb-6">Ongoing Projects</h2>
      <div className="space-y-8">
        {projects.map((project) => (
          <div key={project.id} className="border-2 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-gray-600 mt-1">{project.description}</p>
              </div>
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <User size={14} />
                {project.assignedBy}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              {project.subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
                >
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => onToggleSubtask(project.id, subtask.id)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className={subtask.completed ? 'line-through text-gray-500' : ''}>
                    {subtask.content}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPanel;