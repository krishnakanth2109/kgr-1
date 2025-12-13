import React from 'react';
import { Bell, Megaphone, Info, AlertTriangle } from 'lucide-react';

const StudentNotifications = () => {
  const alerts = [
    { type: 'urgent', title: 'Fee Payment Deadline Extended', msg: 'Last date for Sem 2 fee is now 20th Dec.', date: 'Today' },
    { type: 'info', title: 'Library Maintenance', msg: 'Library will remain closed on Saturday for maintenance.', date: 'Yesterday' },
    { type: 'academic', title: 'Assignment Submission', msg: 'Community Health assignment due next Monday.', date: '10 Dec' },
  ];

  const getIcon = (type) => {
    switch(type) {
        case 'urgent': return <AlertTriangle className="text-red-500" />;
        case 'info': return <Info className="text-blue-500" />;
        default: return <Megaphone className="text-amber-500" />;
    }
  };

  return (
    <div className="p-6 animate-fade-in max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
            <Bell className="text-amber-500" size={28} />
            <h1 className="text-2xl font-bold text-gray-800">Notifications & Announcements</h1>
        </div>

        <div className="space-y-4">
            {alerts.map((alert, i) => (
                <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition">
                    <div className="flex gap-4">
                        <div className="mt-1">{getIcon(alert.type)}</div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-gray-800">{alert.title}</h3>
                                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded">{alert.date}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{alert.msg}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default StudentNotifications;