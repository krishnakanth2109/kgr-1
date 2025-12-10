import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  Building2,
  CreditCard,
  Bell,
  FileText,
  BarChart,
  PieChart,
  TrendingUp,
  UserCog,
  Calendar,
  MessageSquare,
  Search,
  Download,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ChevronRight,
  LogOut,
  Shield,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  AlertCircle
} from "lucide-react";

// Recharts for charts
import {
  BarChart as ReBarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for charts
  const studentEnrollmentData = [
    { month: 'Jan', enrolled: 65 },
    { month: 'Feb', enrolled: 78 },
    { month: 'Mar', enrolled: 90 },
    { month: 'Apr', enrolled: 85 },
    { month: 'May', enrolled: 95 },
    { month: 'Jun', enrolled: 110 },
  ];

  const departmentDistributionData = [
    { name: 'CS', value: 35, color: '#3B82F6' },
    { name: 'Engineering', value: 25, color: '#10B981' },
    { name: 'Business', value: 20, color: '#8B5CF6' },
    { name: 'Arts', value: 15, color: '#F59E0B' },
    { name: 'Science', value: 5, color: '#EF4444' },
  ];

  const feeCollectionData = [
    { month: 'Jan', collected: 45000, pending: 12000 },
    { month: 'Feb', collected: 52000, pending: 8000 },
    { month: 'Mar', collected: 61000, pending: 5000 },
    { month: 'Apr', collected: 58000, pending: 7000 },
    { month: 'May', collected: 72000, pending: 3000 },
    { month: 'Jun', collected: 69000, pending: 4000 },
  ];

  const facultyPerformanceData = [
    { name: 'Dr. Smith', rating: 4.8, students: 45, courses: 4 },
    { name: 'Prof. Johnson', rating: 4.6, students: 38, courses: 3 },
    { name: 'Dr. Williams', rating: 4.9, students: 52, courses: 5 },
    { name: 'Prof. Brown', rating: 4.4, students: 32, courses: 3 },
    { name: 'Dr. Davis', rating: 4.7, students: 41, courses: 4 },
  ];

  // Recent Activities
  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Registered for Spring 2024', time: '10 min ago', type: 'student' },
    { id: 2, user: 'Dr. Sarah Miller', action: 'Uploaded new course material', time: '25 min ago', type: 'faculty' },
    { id: 3, user: 'Finance Dept', action: 'Processed fee payments', time: '1 hour ago', type: 'finance' },
    { id: 4, user: 'System', action: 'New announcement posted', time: '2 hours ago', type: 'system' },
    { id: 5, user: 'Exam Cell', action: 'Schedule updated for Finals', time: '3 hours ago', type: 'exam' },
  ];

  // Statistics Cards
  const stats = [
    { title: 'Total Students', value: '2,847', change: '+12%', icon: Users, color: 'bg-blue-500', chart: studentEnrollmentData },
    { title: 'Active Faculty', value: '184', change: '+5%', icon: UserCog, color: 'bg-green-500' },
    { title: 'Courses Offered', value: '64', change: '+8%', icon: BookOpen, color: 'bg-purple-500' },
    { title: 'Departments', value: '12', change: '+2%', icon: Building2, color: 'bg-amber-500' },
    { title: 'Fee Collected', value: '$284.7K', change: '+15%', icon: CreditCard, color: 'bg-emerald-500' },
    { title: 'Pending Queries', value: '23', change: '-3%', icon: MessageSquare, color: 'bg-red-500' },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login/admin");
  };

  const StatCard = ({ stat }) => {
    const Icon = stat.icon;
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:scale-[1.02]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
            <h3 className="text-3xl font-bold mt-2 text-gray-800">{stat.value}</h3>
          </div>
          <div className={`${stat.color} p-3 rounded-xl text-white`}>
            <Icon size={24} />
          </div>
        </div>
        <div className="flex items-center">
          <span className={`text-sm font-medium ${parseInt(stat.change) > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stat.change}
          </span>
          <span className="text-gray-400 text-sm ml-2">from last month</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 p-4 md:p-8">
      {/* Top Navigation */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage your institution efficiently</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search anything..."
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bell size={22} className="text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
            
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Admin User</p>
                <p className="text-sm text-gray-500">Super Admin</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Student Enrollment Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Student Enrollment Trend</h3>
                <p className="text-gray-500">Monthly enrollment statistics</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                <Download size={16} />
                Export
              </button>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={studentEnrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="enrolled" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fee Collection & Department Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Fee Collection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Fee Collection Overview</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={feeCollectionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="collected" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Department Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={departmentDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Faculty Performance */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Faculty Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Faculty</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Rating</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Students</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Courses</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {facultyPerformanceData.map((faculty, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                            <UserCog size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{faculty.name}</p>
                            <p className="text-sm text-gray-500">Professor</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-amber-600 font-bold">{faculty.rating}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < Math.floor(faculty.rating) ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-800">{faculty.students}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {faculty.courses} courses
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <Eye size={16} className="text-gray-600" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-blue-50 transition-colors">
                            <Edit size={16} className="text-blue-600" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Recent Activity */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { icon: Users, label: 'Add New Student', color: 'hover:bg-white/20' },
                { icon: UserCog, label: 'Manage Faculty', color: 'hover:bg-white/20' },
                { icon: BookOpen, label: 'Create Course', color: 'hover:bg-white/20' },
                { icon: CreditCard, label: 'Process Fees', color: 'hover:bg-white/20' },
                { icon: Calendar, label: 'Schedule Exams', color: 'hover:bg-white/20' },
                { icon: Bell, label: 'Post Announcement', color: 'hover:bg-white/20' },
              ].map((action, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${action.color} group`}
                >
                  <div className="flex items-center gap-3">
                    <action.icon size={20} />
                    <span className="font-medium">{action.label}</span>
                  </div>
                  <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'student' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'faculty' ? 'bg-green-100 text-green-600' :
                    activity.type === 'finance' ? 'bg-emerald-100 text-emerald-600' :
                    activity.type === 'system' ? 'bg-purple-100 text-purple-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    {activity.type === 'student' && <Users size={16} />}
                    {activity.type === 'faculty' && <UserCog size={16} />}
                    {activity.type === 'finance' && <CreditCard size={16} />}
                    {activity.type === 'system' && <Bell size={16} />}
                    {activity.type === 'exam' && <FileText size={16} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Queries */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Pending Queries</h3>
              <div className="relative">
                <Filter size={18} className="text-gray-400" />
              </div>
            </div>
            <div className="space-y-4">
              {[
                { student: 'Michael Chen', query: 'Course registration issue', time: '2 hours ago', priority: 'high' },
                { student: 'Sarah Wilson', query: 'Fee payment confirmation', time: '4 hours ago', priority: 'medium' },
                { student: 'Robert Kim', query: 'Exam schedule clarification', time: '1 day ago', priority: 'low' },
              ].map((query, index) => (
                <div key={index} className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-800">{query.student}</p>
                      <p className="text-sm text-gray-600 mt-1">{query.query}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      query.priority === 'high' ? 'bg-red-100 text-red-700' :
                      query.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {query.priority}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{query.time}</span>
                    <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                      Respond
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Institution Management System. All rights reserved.</p>
        <p className="mt-1">v2.1.0 • Last updated: Today, 10:30 AM</p>
      </div>
    </div>
  );
};

export default AdminDashboard;