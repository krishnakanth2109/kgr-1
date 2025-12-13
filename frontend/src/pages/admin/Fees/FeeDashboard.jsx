import React, { useEffect, useState } from 'react';
import { getFeeDashboardStats } from '../../../api/feeApi';
import { DollarSign, AlertCircle, Users, CheckCircle, Loader2 } from 'lucide-react';

const FeeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeeDashboardStats().then(data => {
      setStats(data);
      setLoading(false);
    }).catch(err => setLoading(false));
  }, []);

  if(loading) return <div className="p-10"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-800">Fee Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Collected */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Collected</p>
              <h3 className="text-2xl font-bold text-green-700">₹ {stats?.collected?.toLocaleString() || 0}</h3>
            </div>
            <div className="p-3 bg-green-100 text-green-600 rounded-full"><DollarSign/></div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Pending</p>
              <h3 className="text-2xl font-bold text-red-600">₹ {stats?.pending?.toLocaleString() || 0}</h3>
            </div>
            <div className="p-3 bg-red-100 text-red-600 rounded-full"><AlertCircle/></div>
          </div>
        </div>

        {/* Fully Paid Students */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
           <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Paid Students</p>
              <h3 className="text-2xl font-bold text-blue-700">{stats?.totalStudentsPaid || 0}</h3>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><CheckCircle/></div>
          </div>
        </div>

        {/* Students with Dues */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
           <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Defaulters</p>
              <h3 className="text-2xl font-bold text-orange-600">{stats?.totalStudentsPending || 0}</h3>
            </div>
            <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><Users/></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeDashboard;