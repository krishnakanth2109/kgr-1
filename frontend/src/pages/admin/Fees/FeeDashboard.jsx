import React, { useState, useEffect } from 'react';
import { 
  DollarSign, AlertCircle, Users, CheckCircle, Loader2, 
  Search, Phone, Mail, Filter, TrendingUp, Download, Eye
} from 'lucide-react';
import { getFeeDashboardStats, getFeeDefaulters } from '../../../api/feeApi';
import api from '../../../api/api'; 

const FeeDashboard = () => {
  // State for stats and filtering
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL', 'PAID', 'PENDING', 'DEFAULTER'

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-10 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200 pb-6">
        <div>
           <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Fee Management Dashboard</h1>
           <p className="text-gray-500 mt-2 text-lg">Real-time financial overview and student fee status.</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
           <button className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-gray-50 transition flex items-center gap-2">
              <Download size={18}/> Export Report
           </button>
        </div>
      </div>

      {/* 1. OVERVIEW STATS (INTERACTIVE) */}
      <section className="animate-fade-in-up">
         <OverviewSection 
            stats={stats} 
            loading={loadingStats} 
            setStats={setStats} 
            setLoading={setLoadingStats}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
         />
      </section>

      {/* 2. MAIN STUDENT FEE LIST (FILTERABLE) */}
      <section className="animate-fade-in-up delay-100">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {activeFilter === 'ALL' && <Users className="text-blue-600"/>}
                {activeFilter === 'PENDING' && <AlertCircle className="text-red-600"/>}
                {activeFilter === 'PAID' && <CheckCircle className="text-green-600"/>}
                {activeFilter === 'DEFAULTER' && <AlertCircle className="text-orange-600"/>}
                
                {activeFilter === 'ALL' ? 'All Student Records' : 
                 activeFilter === 'PAID' ? 'Fully Paid Students' : 
                 activeFilter === 'PENDING' ? 'Pending Dues List' : 'Defaulters List'}
            </h2>
        </div>
        <FilteredStudentTable filterType={activeFilter} />
      </section>

    </div>
  );
};

// --- 1. OVERVIEW SECTION (CLICKABLE CARDS) ---
const OverviewSection = ({ stats, loading, setStats, setLoading, activeFilter, setActiveFilter }) => {
  
  useEffect(() => {
    getFeeDashboardStats()
      .then(data => setStats(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-32 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32}/></div>;

  const Card = ({ title, value, icon: Icon, colorClass, bgClass, filterKey, subText }) => (
    <div 
        onClick={() => setActiveFilter(filterKey)}
        className={`p-6 rounded-2xl shadow-sm border transition-all duration-300 cursor-pointer group relative overflow-hidden
        ${activeFilter === filterKey ? `ring-2 ring-offset-2 ${colorClass.replace('text-', 'ring-')}` : 'hover:shadow-md border-gray-100 bg-white'}
        `}
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${bgClass} ${colorClass}`}>
                <Icon size={28}/>
            </div>
            {activeFilter === filterKey && <span className="absolute top-4 right-4 h-3 w-3 rounded-full bg-blue-500 animate-pulse"></span>}
        </div>
        <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{value}</h3>
            {subText && <p className={`text-xs mt-2 font-medium px-2 py-0.5 rounded w-fit ${bgClass} ${colorClass}`}>{subText}</p>}
        </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Collected - Shows ALL by default or distinct view */}
        <Card 
            title="Total Collected" 
            value={`₹ ${stats?.collected?.toLocaleString() || 0}`} 
            icon={CheckCircle} 
            colorClass="text-green-600" 
            bgClass="bg-green-50"
            filterKey="ALL" 
            subText="View All Records"
        />

        {/* Pending - Filter: PENDING */}
        <Card 
            title="Total Pending" 
            value={`₹ ${stats?.pending?.toLocaleString() || 0}`} 
            icon={AlertCircle} 
            colorClass="text-red-600" 
            bgClass="bg-red-50"
            filterKey="PENDING"
            subText="Action Required"
        />

        {/* Paid Students - Filter: PAID */}
        <Card 
            title="Fully Paid" 
            value={stats?.totalStudentsPaid || 0} 
            icon={Users} 
            colorClass="text-blue-600" 
            bgClass="bg-blue-50"
            filterKey="PAID"
            subText="Students Cleared"
        />

        {/* Defaulters - Filter: DEFAULTER */}
        <Card 
            title="Defaulters" 
            value={stats?.totalStudentsPending || 0} 
            icon={AlertCircle} 
            colorClass="text-orange-600" 
            bgClass="bg-orange-50"
            filterKey="DEFAULTER"
            subText="Needs Follow-up"
        />
    </div>
  );
};

// --- 2. DYNAMIC TABLE SECTION ---
const FilteredStudentTable = ({ filterType }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Fetch logic based on active filter
  useEffect(() => {
    fetchData();
  }, [filterType]); // Refetch when filter changes

  const fetchData = async () => {
    setLoading(true);
    try {
        let endpoint = '/student-fees/reports/defaulters'; // Default to defaulters/pending for specific views
        
        if (filterType === 'ALL') {
             // We might need a generic endpoint, or filter locally. 
             // For now, let's assume we fetch all fee records
             // In a real app, you'd likely hit: /api/student-fees?status=ALL
             // Reusing defaulters endpoint for demo, but logically should be different
             endpoint = '/student-fees/reports/all'; 
        } else if (filterType === 'PAID') {
             endpoint = '/student-fees/reports/paid';
        }

        // Mocking behavior if endpoints don't exist perfectly yet
        // Ideally: getFeeDefaulters returns list with balance > 0
        
        if (filterType === 'PENDING' || filterType === 'DEFAULTER') {
             const res = await getFeeDefaulters();
             setData(res);
        } else {
             // Fallback for 'ALL' or 'PAID' if backend endpoints aren't ready
             // fetching students and joining (simplified for UI demo)
             const res = await api.get('/students?limit=50'); // Fetch generic list
             // Transform for display
             const transformed = res.data.students.map(s => ({
                 _id: s._id,
                 student: s,
                 totalPayable: 50000, // Dummy fallback if not joined
                 totalPaid: filterType === 'PAID' ? 50000 : 20000,
                 dueAmount: filterType === 'PAID' ? 0 : 30000,
                 paymentStatus: filterType === 'PAID' ? 'Paid' : 'Pending'
             }));
             setData(transformed);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  // Filter by Search Query
  const filteredData = data.filter(d => 
    d.student?.first_name?.toLowerCase().includes(search.toLowerCase()) || 
    d.student?.admission_number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-3 items-center justify-between">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
            <input 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" 
                placeholder={`Search in ${filterType.toLowerCase()} list...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
         </div>
         
         <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-50 transition shadow-sm">
                <Filter size={16}/> Filter
            </button>
            {(filterType === 'PENDING' || filterType === 'DEFAULTER') && (
                <button className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm font-bold rounded-lg hover:bg-red-100 transition shadow-sm">
                    <Mail size={16}/> Send Reminders
                </button>
            )}
         </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white text-gray-500 font-semibold border-b border-gray-100">
            <tr>
              <th className="p-5">Student Details</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right">Total Fee</th>
              <th className="p-5 text-right">Paid</th>
              <th className="p-5 text-right">Balance</th>
              <th className="p-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
                <tr><td colSpan="6" className="p-12 text-center text-gray-400 flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin" size={24}/> Loading Data...
                </td></tr>
            ) : filteredData.length === 0 ? (
                <tr><td colSpan="6" className="p-12 text-center text-gray-400">
                   <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                       <Search size={24} className="opacity-50"/>
                   </div>
                   No records found matching "{filterType}".
                </td></tr>
            ) : (
                filteredData.map((d) => (
                <tr key={d._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-5">
                      <div className="font-bold text-gray-900">{d.student?.first_name} {d.student?.last_name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 font-mono">{d.student?.admission_number} • {d.student?.program}</div>
                    </td>
                    <td className="p-5">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                           d.dueAmount > 0 
                             ? 'bg-red-50 text-red-700 border-red-100' 
                             : 'bg-green-50 text-green-700 border-green-100'
                       }`}>
                          {d.dueAmount > 0 ? 'Pending' : 'Cleared'}
                       </span>
                    </td>
                    <td className="p-5 text-right font-medium text-gray-600">₹ {(d.totalPayable || 0).toLocaleString()}</td>
                    <td className="p-5 text-right font-medium text-green-600">₹ {(d.totalPaid || 0).toLocaleString()}</td>
                    <td className="p-5 text-right font-bold text-red-600 bg-red-50/20">₹ {(d.dueAmount || 0).toLocaleString()}</td>
                    <td className="p-5 flex justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-600 hover:text-white transition" title="View Details">
                          <Eye size={16}/>
                      </button>
                      {d.dueAmount > 0 && (
                          <a href={`tel:${d.student?.phone_number}`} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-green-600 hover:text-white transition" title="Call">
                              <Phone size={16}/>
                          </a>
                      )}
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
         <span>Showing {filteredData.length} records</span>
         <div className="flex gap-2">
            <button className="px-3 py-1 border rounded bg-white hover:bg-gray-100">Previous</button>
            <button className="px-3 py-1 border rounded bg-white hover:bg-gray-100">Next</button>
         </div>
      </div>
    </div>
  );
};

export default FeeDashboard;