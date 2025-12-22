// AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users,
  UserCog,
  Bell,
  Download,
  LogOut,
  MessageSquare,
  Plus,
  Settings,
  CreditCard,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  BookOpen,
  DollarSign,
  FileText,
  GraduationCap,
  UsersIcon,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  XCircle
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
  Legend,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeFaculty: 0,
    pendingQueries: 0,
    totalRevenue: 0,
    courseEnrollments: 0,
    pendingApplications: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [feeCollectionData, setFeeCollectionData] = useState([]);
  const [courseDistribution, setCourseDistribution] = useState([]);
  const [studentPerformance, setStudentPerformance] = useState([]);
  const [paymentStatusData, setPaymentStatusData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch all data in parallel
      const [
        studentsRes,
        facultyRes,
        contactRes,
        feesRes,
        coursesRes,
        applicationsRes,
        transactionsRes
      ] = await Promise.all([
        axios.get('/api/students', config),
        axios.get('/api/faculty', config),
        axios.get('/api/contact', config),
        axios.get('/api/student-fees', config),
        axios.get('/api/courses', config),
        axios.get('/api/admissions', config),
        axios.get('/api/student-fees/transactions/recent', config)
      ]);

      // Process and set stats
      setStats({
        totalStudents: studentsRes.data?.length || 0,
        activeFaculty: facultyRes.data?.faculty?.filter(f => f.status === 'Active').length || 0,
        pendingQueries: contactRes.data?.length || 0,
        totalRevenue: calculateTotalRevenue(feesRes.data),
        courseEnrollments: studentsRes.data?.length || 0,
        pendingApplications: applicationsRes.data?.length || 0
      });

      // Generate charts data
      setEnrollmentData(generateEnrollmentData(studentsRes.data));
      setFeeCollectionData(generateFeeCollectionData(feesRes.data));
      setCourseDistribution(generateCourseDistribution(studentsRes.data));
      setStudentPerformance(generateStudentPerformance(studentsRes.data));
      setPaymentStatusData(generatePaymentStatusData(feesRes.data));
      setRecentTransactions(transactionsRes.data?.slice(0, 5) || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalRevenue = (fees) => {
    if (!fees) return 0;
    return fees.reduce((total, fee) => total + (fee.totalPaid || 0), 0);
  };

  const generateEnrollmentData = (students) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    
    return months.map(month => ({
      month,
      [currentYear]: Math.floor(Math.random() * 50) + 70,
      [lastYear]: Math.floor(Math.random() * 40) + 50
    }));
  };

  const generateFeeCollectionData = (fees) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      collected: Math.floor(Math.random() * 200000) + 500000,
      pending: Math.floor(Math.random() * 100000) + 100000
    }));
  };

  const generateCourseDistribution = (students) => {
    const courses = ['GNM', 'MPHW', 'MLT'];
    return courses.map(course => ({
      name: course,
      value: Math.floor(Math.random() * 100) + 50,
      color: getRandomColor()
    }));
  };

  const generateStudentPerformance = (students) => {
    const subjects = ['Anatomy', 'Physiology', 'Pharmacology', 'Pathology', 'Microbiology'];
    return subjects.map(subject => ({
      subject,
      averageScore: Math.floor(Math.random() * 30) + 70,
      attendance: Math.floor(Math.random() * 20) + 80
    }));
  };

  const generatePaymentStatusData = (fees) => {
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
      case 'addStudent':
        navigate('/admin/students/add');
        break;
      case 'addFaculty':
        navigate('/admin/faculty/add');
        break;
      case 'feeStructure':
        navigate('/admin/fees/structures');
        break;
      case 'viewReports':
        navigate('/admin/reports');
        break;
      case 'manageCourses':
        navigate('/admin/courses');
        break;
      case 'viewApplications':
        navigate('/admin/admissions');
        break;
      case 'gallery':
        navigate('/admin/gallery');
        break;
      case 'sendNotification':
        navigate('/admin/notifications');
        break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
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
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-600 text-sm">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin/notifications')}
              className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Bell size={20} className="text-slate-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
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
              link: '/admin/fees'
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

        {/* Charts Section */}
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

        {/* Additional Charts */}
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
                          width: `${(status.value / paymentStatusData.reduce((a, b) => a + b.value, 0)) * 100}%`,
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

        {/* Quick Actions & Recent Transactions */}
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
                      <p className="text-sm text-slate-600">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">₹{transaction.amount}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${statusColors[transaction.status] || 'bg-slate-100 text-slate-800'}`}>
                        {transaction.status}
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

        {/* System Status */}
       
        </div>
      </div>
    
  );
};

export default AdminDashboard;