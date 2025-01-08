import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Clock, BookOpen, Users, ChartBar } from "lucide-react";

// Sample data - replace with your JSON data later
const sampleAttendanceData = [
  { month: "Jan", present: 85, absent: 15 },
  { month: "Feb", present: 88, absent: 12 },
  { month: "Mar", present: 92, absent: 8 },
  { month: "Apr", present: 90, absent: 10 },
];

const sampleMarksData = [
  { subject: "Math", marks: 85, average: 75 },
  { subject: "Science", marks: 78, average: 72 },
  { subject: "English", marks: 88, average: 70 },
  { subject: "History", marks: 92, average: 78 },
];

const sampleSubmissionData = [
  { value: 85, name: "Submitted" },
  { value: 15, name: "Pending" },
];

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const StatCard = ({ icon: Icon, title, value, change }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          <span
            className={`text-sm ${
              change >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
          </span>
        </div>
        <Icon className="text-blue-500" size={24} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Student Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, Student</p>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Clock}
            title="Attendance Rate"
            value="92%"
            change={2.5}
          />
          <StatCard
            icon={BookOpen}
            title="Average Grade"
            value="85/100"
            change={-1.2}
          />
          <StatCard icon={Users} title="Class Rank" value="#12" change={3} />
          <StatCard icon={Users} title="Class Size" value="45" change={0} />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-4 border-b">
            {["overview", "attendance", "marks", "submissions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Monthly Attendance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sampleAttendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="present" stroke="#3b82f6" />
                <Line type="monotone" dataKey="absent" stroke="#ef4444" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Academic Performance */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Academic Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sampleMarksData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="marks" fill="#3b82f6" />
                <Bar dataKey="average" fill="#93c5fd" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Submission Status */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Submission Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sampleSubmissionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#3b82f6"
                  label
                ></Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center p-3 bg-gray-50 rounded-lg"
                >
                  <ChartBar className="text-blue-500 mr-3" size={20} />
                  <div>
                    <p className="text-sm font-medium">Assignment Submitted</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
