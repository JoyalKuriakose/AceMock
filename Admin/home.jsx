import React from 'react';
import { Users, Briefcase, ClipboardList, UserPlus } from 'lucide-react';

function AdminHome() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">Welcome, JOYAL KURIAKOSE 👋</h1>

        <p className="text-center text-gray-600 mb-10">
          Manage recruiters, assessments, mock interviews, and more from this dashboard.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Recruiters"
            icon={<UserPlus className="w-6 h-6 text-primary" />}
            description="Manage recruiter details and access"
          />

          <Card
            title="Assessments"
            icon={<ClipboardList className="w-6 h-6 text-blue-500" />}
            description="View assessments records"
          />

          <Card
            title="Mock Interviews"
            icon={<Briefcase className="w-6 h-6 text-green-600" />}
            description="View interview records"
          />

          
        </div>
      </div>
    </div>
  );
}

const Card = ({ title, icon, description }) => (
  <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition duration-300">
    <div className="flex items-center space-x-4 mb-4">
      <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

export default AdminHome;
