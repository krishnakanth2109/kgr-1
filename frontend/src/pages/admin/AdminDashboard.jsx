import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCog,
  Bell,
  Download,
  Filter,
  LogOut,
  MessageSquare,
  Plus,
  Settings,
  CreditCard,
  PieChart as PieIcon
} from "lucide-react";

// Recharts
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // --- DATA SECTIONS ---

  const studentEnrollmentData = [
    { month: 'Jan', enrolled: 65, previous: 40 },
    { month: 'Feb', enrolled: 78, previous: 45 },
    { month: 'Mar', enrolled: 90, previous: 55 },
    { month: 'Apr', enrolled: 85, previous: 60 },
    { month: 'May', enrolled: 95, previous: 70 },
    { month: 'Jun', enrolled: 110, previous: 85 },
    { month: 'Jul', enrolled: 115, previous: 90 },
    { month: 'Aug', enrolled: 130, previous: 95 },
  ];

  const feeCollectionData = [
    { month: 'Jan', collected: 45, pending: 12 },
    { month: 'Feb', collected: 52, pending: 8 },
    { month: 'Mar', collected: 61, pending: 5 },
    { month: 'Apr', collected: 58, pending: 7 },
    { month: 'May', collected: 72, pending: 3 },
  ];

  const departmentData = [
    { name: 'CS', value: 35, color: '#3B82F6' },
    { name: 'Eng', value: 25, color: '#10B981' },
    { name: 'Bus', value: 20, color: '#8B5CF6' },
    { name: 'Arts', value: 20, color: '#F59E0B' },
  ];

  // Stats Data
  const stats = [
    { 
      title: 'Total Students', 
      value: '2,847', 
      change: '+12.5%', 
      trend: 'up',
      icon: Users, 
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    { 
      title: 'Active Faculty', 
      value: '184', 
      change: '+5.2%', 
      trend: 'up',
      icon: UserCog, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      border: 'border-purple-100'
    },
    { 
      title: 'Pending Queries', 
      value: '23', 
      change: '-3.4%', 
      trend: 'down',
      icon: MessageSquare, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      border: 'border-amber-100'
    },
  ];

  const handleLogout = () => {
    navigate("/login/admin");
  };

  // Shared Tooltip Style
  const customTooltipStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    padding: '12px',
    fontSize: '12px'
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
      
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-100/50 blur-[120px]" />
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex justify-between items-end bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-sm">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">Welcome back, Administrator</p>
          </div>
          
          <div className="text-sm font-medium text-slate-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="group relative bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100 transition-all duration-300 overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-colors`}>
                    <Icon size={24} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-emerald-600 bg-emerald-50'} px-2.5 py-1 rounded-full`}>
                    {stat.change}
                  </div>
                </div>
                <div>
                  <h3 className="text-4xl font-extrabold text-slate-800 mb-1 tracking-tight">{stat.value}</h3>
                  <p className="text-slate-500 font-medium">{stat.title}</p>
                </div>
                <div className={`absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-10 transition-opacity duration-500`}>
                   <Icon size={100} className="text-slate-50" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Charts) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Student Enrollment Chart */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Enrollment Overview</h2>
                  <p className="text-slate-500 text-sm mt-1">Comparision with previous year</p>
                </div>
                <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors">
                  <Download size={18} />
                </button>
              </div>

              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={studentEnrollmentData}>
                    <defs>
                      <linearGradient id="colorEnrolled" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                    <Tooltip contentStyle={customTooltipStyle} cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area type="monotone" dataKey="enrolled" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorEnrolled)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. Dual Charts Grid (Fee & Departments) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Fee Collection Bar Chart */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col h-[350px]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Fee Collection</h3>
                    <p className="text-xs text-slate-500">In Thousands ($)</p>
                  </div>
                </div>
                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={feeCollectionData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 11}} dy={10} />
                      <Tooltip contentStyle={customTooltipStyle} cursor={{fill: '#f1f5f9'}} />
                      <Bar dataKey="collected" fill="#10B981" radius={[4, 4, 0, 0]} stackId="a" />
                      <Bar dataKey="pending" fill="#EF4444" radius={[4, 4, 0, 0]} stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Department Distribution Pie Chart */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col h-[350px]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <PieIcon size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Department Split</h3>
                    <p className="text-xs text-slate-500">Students per Dept</p>
                  </div>
                </div>
                <div className="flex-1 w-full min-h-0 relative">
                   <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={customTooltipStyle} />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle"
                        formatter={(value) => <span className="text-slate-500 text-xs font-medium ml-1">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text for Donut */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
                     <p className="text-2xl font-bold text-slate-800">4</p>
                     <p className="text-xs text-slate-400">Depts</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Quick Actions Only */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Quick Actions</h3>
                <div className="bg-white/10 p-2 rounded-lg cursor-pointer hover:bg-white/20 transition-colors">
                  <Settings size={18} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Add Student', icon: Plus },
                  { label: 'Add Faculty', icon: UserCog },
                  { label: 'New Event', icon: Bell },
                  { label: 'Reports', icon: Download },
                ].map((action, i) => (
                  <button key={i} className="flex flex-col items-center justify-center p-4 bg-white/10 hover:bg-white/20 border border-white/5 rounded-2xl transition-all duration-200 group">
                    <action.icon size={24} className="mb-2 text-indigo-100 group-hover:text-white group-hover:scale-110 transition-all" />
                    <span className="text-xs font-medium text-indigo-100 group-hover:text-white">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* "Pending Queries" List widget removed here */}

          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 mt-12 py-6 border-t border-slate-200">
          <p>© 2024 Institution Admin Portal. All rights reserved.</p>
          <div className="flex gap-6 mt-2 md:mt-0">
            <button className="hover:text-slate-600 transition-colors">Privacy Policy</button>
            <button className="hover:text-slate-600 transition-colors">Terms of Service</button>
            <button className="hover:text-slate-600 transition-colors flex items-center gap-1" onClick={handleLogout}>
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;