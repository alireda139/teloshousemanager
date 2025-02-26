'use client';
import React from 'react';
import { MessageSquare, CheckCircle, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { communicationData } from '../data/communication';

interface Activity {
  type: 'message_sent' | 'message_received' | 'task_completed';
  timestamp: string;
  description: string;
}

const mockActivities: Record<string, Activity[]> = {
  yesterday: [
    { type: 'message_sent', timestamp: '09:15', description: 'Sent report to William' },
    { type: 'task_completed', timestamp: '11:30', description: 'Completed project review' },
    { type: 'message_received', timestamp: '14:45', description: 'Received feedback from Mikyas' },
  ],
  today: [
    { type: 'message_sent', timestamp: '08:00', description: 'Morning update to team' },
    { type: 'task_completed', timestamp: '10:00', description: 'Code review completed' },
    { type: 'message_received', timestamp: '13:15', description: 'New task from Faizan' },
  ],
  tomorrow: [
    { type: 'task_completed', timestamp: '09:00', description: 'Team meeting preparation' },
    { type: 'message_sent', timestamp: '11:00', description: 'Project deadline reminder' },
    { type: 'message_received', timestamp: '15:30', description: 'Sprint planning discussion' },
  ],
};

const ActivityPanel: React.FC<{ title: string; activities: Activity[] }> = ({ title, activities }) => (
  <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start gap-3">
          {activity.type === 'message_sent' && (
            <ArrowUpRight className="w-5 h-5 text-green-500 mt-1" />
          )}
          {activity.type === 'message_received' && (
            <ArrowDownLeft className="w-5 h-5 text-blue-500 mt-1" />
          )}
          {activity.type === 'task_completed' && (
            <CheckCircle className="w-5 h-5 text-purple-500 mt-1" />
          )}
          <div className="flex-1">
            <p className="text-sm text-gray-900">{activity.description}</p>
            <p className="text-xs text-gray-500">{activity.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

interface UserProfileProps {
  userId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const userData = userId ? communicationData[userId] : null;

  if (!userData || !userId) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <p className="text-gray-600">User not found</p>
      </div>
    );
  }

  const totalIncoming = Object.values(userData.incoming).reduce((sum, val) => sum + val, 0);
  const totalOutgoing = Object.values(userData.outgoing).reduce((sum, val) => sum + val, 0);
  const completedTasks = Math.floor(Math.random() * 50) + 20; // Mock data
  const responseRate = Math.floor(Math.random() * 30) + 70; // Mock data

  return (
    <div className="min-h-screen bg-gray-100 p-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ArrowDownLeft className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Incoming Messages</p>
                <p className="text-2xl font-bold">{totalIncoming}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <ArrowUpRight className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Outgoing Messages</p>
                <p className="text-2xl font-bold">{totalOutgoing}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tasks Completed</p>
                <p className="text-2xl font-bold">{completedTasks}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold">{responseRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActivityPanel title="Yesterday" activities={mockActivities.yesterday} />
          <ActivityPanel title="Today" activities={mockActivities.today} />
          <ActivityPanel title="Tomorrow" activities={mockActivities.tomorrow} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;