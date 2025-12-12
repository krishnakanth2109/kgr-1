import React from 'react';
import { Download, CheckCircle, Search, Filter } from 'lucide-react';

const StudentFeesHistory = () => {
  // Mock Data
  const history = [
    { id: 'INV-001', title: 'Semester 1 Tuition', date: '2023-06-10', amount: 45000, method: 'Online Banking' },
    { id: 'INV-002', title: 'Admission Fee', date: '2023-05-22', amount: 15000, method: 'UPI' },
    { id: 'INV-003', title: 'Library Fine', date: '2023-08-15', amount: 250, method: 'Cash' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Payment History</h1>
           <p className="text-slate-500 text-sm">View and download receipts for past payments.</p>
        </div>
        
        <div className="flex gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search transaction..." 
                    className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                />
            </div>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                <Filter size={20} />
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Transaction ID</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Description</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Receipt</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {history.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 text-sm font-medium text-slate-600">{item.id}</td>
                            <td className="p-4 text-sm text-slate-800 font-semibold">{item.title}</td>
                            <td className="p-4 text-sm text-slate-500">{item.date}</td>
                            <td className="p-4 text-sm font-bold text-slate-800">₹{item.amount.toLocaleString()}</td>
                            <td className="p-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                    <CheckCircle size={12} /> Paid
                                </span>
                            </td>
                            <td className="p-4 text-center">
                                <button className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-full transition-colors">
                                    <Download size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        {history.length === 0 && (
            <div className="p-8 text-center text-slate-500">
                No payment history found.
            </div>
        )}
      </div>
    </div>
  );
};

export default StudentFeesHistory;