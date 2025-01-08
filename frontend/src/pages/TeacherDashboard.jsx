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
import { Calendar, Clock, Users, BookOpen, CheckSquare } from "lucide-react";

// Sample data - replace with your JSON data later
const mockAttendanceData = [
  { month: "Jan", attendance: 92, absent: 8 },
  { month: "Feb", attendance: 88, absent: 12 },
  { month: "Mar", attendance: 95, absent: 5 },
  { month: "Apr", attendance: 90, absent: 10 },
  { month: "May", attendance: 93, absent: 7 },
];

const mockClassPerformance = [
  { subject: "Math", average: 85 },
  { subject: "Science", average: 78 },
  { subject: "English", average: 82 },
  { subject: "History", average: 88 },
];

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const StatCard = ({ icon: Icon, title, value, change }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          <p
            className={`text-sm mt-2 ${
              change >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {change >= 0 ? "↑" : "↓"} {Math.abs(change)}% from last month
          </p>
        </div>
        <Icon size={24} className="text-blue-500" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, Professor</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Total Students"
          value="156"
          change={2.5}
        />
        <StatCard
          icon={CheckSquare}
          title="Average Attendance"
          value="92%"
          change={-1.2}
        />
        <StatCard icon={BookOpen} title="Classes Today" value="5" change={0} />
        <StatCard
          icon={Clock}
          title="Teaching Hours"
          value="26h"
          change={4.8}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6">
        {["overview", "attendance", "performance", "schedule"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === tab
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trends */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Attendance Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#3B82F6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="absent"
                stroke="#EF4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Class Performance */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Class Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockClassPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="average" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { time: "2h ago", action: "Marked attendance for Class 10-A" },
              { time: "3h ago", action: "Updated test scores for Physics" },
              { time: "5h ago", action: "Created new assignment for Math" },
              { time: "1d ago", action: "Scheduled parent meeting" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b"
              >
                <span className="text-gray-800">{activity.action}</span>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Upcoming Schedule</h3>
          <div className="space-y-4">
            {[
              { time: "09:00 AM", subject: "Mathematics", class: "10-A" },
              { time: "10:30 AM", subject: "Physics", class: "11-B" },
              { time: "12:00 PM", subject: "Chemistry", class: "12-A" },
              { time: "02:00 PM", subject: "Staff Meeting", class: "Room 101" },
            ].map((schedule, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {schedule.subject}
                  </p>
                  <p className="text-sm text-gray-500">
                    Class {schedule.class}
                  </p>
                </div>
                <span className="text-blue-500">{schedule.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
