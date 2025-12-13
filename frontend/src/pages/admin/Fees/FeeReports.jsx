import React from 'react';
import { Download, FileText, PieChart as PieIcon, TrendingUp } from 'lucide-react';

const FeeReports = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-sm transition">
          <Download size={18} /> Download All Reports (Excel)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Daily Collection */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
                <h3 className="font-bold text-gray-700 text-lg">Daily Collection Report</h3>
                <p className="text-sm text-gray-400">Revenue overview for today</p>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <FileText size={24} />
            </div>
          </div>
          <div className="h-48 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
            <TrendingUp size={32} className="mb-2 opacity-50"/>
            <span>[Bar Chart Placeholder]</span>
          </div>
          <button className="mt-4 w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition font-medium">View Detailed Statement</button>
        </div>

        {/* Mode of Payment */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
                <h3 className="font-bold text-gray-700 text-lg">Payment Modes</h3>
                <p className="text-sm text-gray-400">Distribution of payment methods</p>
            </div>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <PieIcon size={24} />
            </div>
          </div>
          <div className="space-y-4">
            <div>
                <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">UPI / Online</span>
                <span className="font-bold text-purple-600">60%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
            </div>
            
            <div>
                <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Cash</span>
                <span className="font-bold text-green-600">30%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Cheque/DD</span>
                <span className="font-bold text-yellow-600">10%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
            </div>
          </div>
        </div>

        {/* Course-wise Collection */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
          <h3 className="font-bold text-gray-700 mb-4 text-lg">Course-wise Collection Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
                <tr>
                  <th className="p-4">Course</th>
                  <th className="p-4">Total Students</th>
                  <th className="p-4">Total Collected</th>
                  <th className="p-4">Total Pending</th>
                  <th className="p-4 text-center">Export</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium">MPHW</td>
                  <td className="p-4">120</td>
                  <td className="p-4 text-green-600 font-bold bg-green-50 w-fit rounded px-2">₹ 15,00,000</td>
                  <td className="p-4 text-red-600 font-bold">₹ 2,00,000</td>
                  <td className="p-4 text-center"><button className="text-gray-400 hover:text-blue-600 transition"><Download size={18}/></button></td>
                </tr>
                <tr className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium">MLT</td>
                  <td className="p-4">80</td>
                  <td className="p-4 text-green-600 font-bold bg-green-50 w-fit rounded px-2">₹ 10,00,000</td>
                  <td className="p-4 text-red-600 font-bold">₹ 1,50,000</td>
                  <td className="p-4 text-center"><button className="text-gray-400 hover:text-blue-600 transition"><Download size={18}/></button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FeeReports;