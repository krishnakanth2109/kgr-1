import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Use central API to handle tokens automatically
import api from "../../api/api"; 

// --- NEW NOTIFICATION COMPONENT ---
import NotificationPanel from "./NotificationPanel";

import {
  Users,
  UserCog,
  LogOut,
  DollarSign,
  FileText,
  GraduationCap,
  UsersIcon,
  TrendingUp,
  TrendingDown,
  CreditCard,
  BookOpen,
  Bell // Kept for fallback if needed, but unused in main view now
} from "lucide-react";

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Stats State
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeFaculty: 0,
    pendingQueries: 0,
    totalRevenue: 0,
    courseEnrollments: 0,
    pendingApplications: 0
  });

  // Chart Data States
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [feeCollectionData, setFeeCollectionData] = useState([]);
  const [courseDistribution, setCourseDistribution] = useState([]);
  const [studentPerformance, setStudentPerformance] = useState([]);
  const [paymentStatusData, setPaymentStatusData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel using the 'api' instance (handles auth headers)
      const [
        studentsRes,
        facultyRes,
        contactRes,
        feesRes,
        coursesRes,
        applicationsRes,
        transactionsRes
      ] = await Promise.all([
        api.get('/students'),
        api.get('/faculty'),
        api.get('/contact'),
        api.get('/student-fees'),
        api.get('/courses'),
        api.get('/admissions'),
        // Fallback for transactions if endpoint doesn't exist yet, pass empty array
        api.get('/student-fees/transactions/recent').catch(() => ({ data: [] })) 
      ]);

      // Helper to safely get array length
      const getCount = (res) => {
        if (!res.data) return 0;
        if (Array.isArray(res.data)) return res.data.length;
        if (res.data.students) return res.data.students.length;
        if (res.data.faculty) return res.data.faculty.length;
        return 0;
      };

      const facultyList = facultyRes.data.faculty || (Array.isArray(facultyRes.data) ? facultyRes.data : []);
      const activeFacultyCount = facultyList.filter(f => f.status === 'Active').length;

      // Update Stats
      setStats({
        totalStudents: getCount(studentsRes),
        activeFaculty: activeFacultyCount,
        pendingQueries: getCount(contactRes),
        totalRevenue: calculateTotalRevenue(feesRes.data),
        courseEnrollments: getCount(studentsRes),
        pendingApplications: getCount(applicationsRes)
      });

      // Generate Charts (Mock generators used where backend aggregation isn't ready)
      setEnrollmentData(generateEnrollmentData());
      setFeeCollectionData(generateFeeCollectionData());
      setCourseDistribution(generateCourseDistribution());
      setStudentPerformance(generateStudentPerformance());
      setPaymentStatusData(generatePaymentStatusData());
      
      // Set Recent Transactions
      setRecentTransactions(transactionsRes.data?.slice(0, 5) || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Optional: Handle 401 specifically here if needed, though api.js handles it globally
    } finally {
      setLoading(false);
    }
  };

  // --- Helper Functions ---

  const calculateTotalRevenue = (fees) => {
    if (!fees || !Array.isArray(fees)) return 0;
    return fees.reduce((total, fee) => total + (fee.totalPaid || 0), 0);
  };

  // Mock Data Generators (Replace with real backend aggregation logic later)
  const generateEnrollmentData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      2024: Math.floor(Math.random() * 50) + 70,
      2023: Math.floor(Math.random() * 40) + 50
    }));
  };

  const generateFeeCollectionData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      collected: Math.floor(Math.random() * 200000) + 500000,
      pending: Math.floor(Math.random() * 100000) + 100000
    }));
  };

  const generateCourseDistribution = () => {
    const courses = ['GNM', 'MPHW', 'MLT'];
    return courses.map(course => ({
      name: course,
      value: Math.floor(Math.random() * 100) + 50,
      color: getRandomColor()
    }));
  };

  const generateStudentPerformance = () => {
    const subjects = ['Anatomy', 'Physiology', 'Pharmacology', 'Pathology', 'Microbiology'];
    return subjects.map(subject => ({
      subject,
      averageScore: Math.floor(Math.random() * 30) + 70,
      attendance: Math.floor(Math.random() * 20) + 80
    }));
  };

  const generatePaymentStatusData = () => {
    const statuses = ['Paid', 'Partial', 'Pending', 'Overdue'];
    return statuses.map(status => ({
      name: status,
      value: Math.floor(Math.random() * 30) + 10
    }));
  };

  const getRandomColor = () => {
    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'addStudent': navigate('/admin/students/new'); break; // Updated path
      case 'addFaculty': navigate('/admin/faculty/new'); break; // Updated path
      case 'feeStructure': navigate('/admin/fees/structure'); break; // Updated path
      case 'viewReports': navigate('/admin/fees/reports'); break; // Updated path
      case 'manageCourses': navigate('/admin/courses'); break;
      case 'viewApplications': navigate('/admin/admissions'); break;
      case 'gallery': navigate('/admin/gallery'); break;
      case 'sendNotification': alert("Feature coming soon!"); break;
      default: break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-token'); // Match your api.js token name
    sessionStorage.removeItem('admin-token');
    navigate('/login/admin');
  };

  const quickActions = [
    { id: 'addStudent', label: 'Add Student', icon: Users, color: 'bg-blue-500' },
    { id: 'addFaculty', label: 'Add Faculty', icon: UserCog, color: 'bg-purple-500' },
    { id: 'feeStructure', label: 'Fee Structure', icon: DollarSign, color: 'bg-emerald-500' },
    { id: 'viewReports', label: 'View Reports', icon: FileText, color: 'bg-amber-500' },
    { id: 'manageCourses', label: 'Manage Courses', icon: BookOpen, color: 'bg-indigo-500' },
    { id: 'viewApplications', label: 'Applications', icon: GraduationCap, color: 'bg-pink-500' },
    { id: 'gallery', label: 'Gallery', icon: UsersIcon, color: 'bg-cyan-500' },
    { id: 'sendNotification', label: 'Send Notification', icon: Bell, color: 'bg-red-500' }
  ];

  const statusColors = {
    Paid: 'bg-emerald-100 text-emerald-800',
    Partial: 'bg-amber-100 text-amber-800',
    Pending: 'bg-blue-100 text-blue-800',
    Overdue: 'bg-red-100 text-red-800'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-600 text-sm">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-4">
            
            {/* INTEGRATED NOTIFICATION PANEL */}
            <NotificationPanel />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Total Students',
              value: stats.totalStudents,
              change: '+12%',
              trend: 'up',
              icon: Users,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
              link: '/admin/students'
            },
            {
              title: 'Active Faculty',
              value: stats.activeFaculty,
              change: '+5%',
              trend: 'up',
              icon: UserCog,
              color: 'text-purple-600',
              bg: 'bg-purple-50',
              link: '/admin/faculty'
            },
            {
              title: 'Total Revenue',
              value: `₹${stats.totalRevenue.toLocaleString()}`,
              change: '+18%',
              trend: 'up',
              icon: DollarSign,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
              link: '/admin/fees/dashboard'
            },
            {
              title: 'Pending Applications',
              value: stats.pendingApplications,
              change: '-3%',
              trend: 'down',
              icon: GraduationCap,
              color: 'text-amber-600',
              bg: 'bg-amber-50',
              link: '/admin/admissions'
            }
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(stat.link)}
            >
              <div className="flex justify-between items-start">
                <div className={`p-3 ${stat.bg} rounded-lg`}>
                  <stat.icon size={24} className={stat.color} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mt-4">{stat.value}</h3>
              <p className="text-slate-600 text-sm mt-1">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* --- CHARTS ROW 1 --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enrollment Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Student Enrollment Trend</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg">Yearly</button>
                <button className="px-3 py-1 text-sm hover:bg-slate-100 rounded-lg">Monthly</button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="2024" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="2023" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fee Collection Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Fee Collection Overview</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feeCollectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="collected" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- CHARTS ROW 2 --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Course Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {courseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student Performance Radar */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Student Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={studentPerformance}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar name="Average Score" dataKey="averageScore" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  <Radar name="Attendance %" dataKey="attendance" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Payment Status Distribution</h3>
            <div className="space-y-4">
              {paymentStatusData.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getRandomColor() }}
                    />
                    <span className="text-slate-700">{status.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${(status.value / (paymentStatusData.reduce((a, b) => a + b.value, 0) || 1)) * 100}%`,
                          backgroundColor: getRandomColor()
                        }}
                      />
                    </div>
                    <span className="font-medium">{status.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- QUICK ACTIONS & TRANSACTIONS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.id)}
                  className="flex flex-col items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
                >
                  <div className={`p-3 ${action.color} rounded-lg mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon size={20} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Recent Transactions</h3>
            <div className="space-y-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">#{transaction.transactionId}</p>
                      <p className="text-sm text-slate-600">{transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">₹{transaction.amount}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${statusColors[transaction.status] || 'bg-slate-100 text-slate-800'}`}>
                        {transaction.mode || 'Paid'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <CreditCard size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No recent transactions</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;