import React from 'react';
import { BookOpen, Calendar, Clock, Award, Bell } from 'lucide-react';

const StudentDashboard = () => {
  // Mock Data
  const studentName = JSON.parse(sessionStorage.getItem('student-user'))?.name || "Student";
  const announcements = [
    { id: 1, title: "Mid-Term Exam Dates Announced", date: "Oct 05, 2023", type: "Exam" },
    { id: 2, title: "Holiday on Oct 2nd (Gandhi Jayanti)", date: "Sep 30, 2023", type: "General" },
    { id: 3, title: "Scholarship Applications Open", date: "Sep 25, 2023", type: "Fee" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {studentName}! 👋</h1>
          <p className="text-blue-100 max-w-xl">
            You have 2 upcoming exams this week and your attendance is looking great. Keep up the good work!
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
          <BookOpen size={200} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Overall Attendance</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">85%</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-600">
              <Clock size={24} />
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Next Exam</p>
              <h3 className="text-xl font-bold text-gray-800 mt-2">Physics</h3>
              <p className="text-sm text-blue-600 font-medium">Oct 10, 10:00 AM</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Calendar size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Fees Status</p>
              <h3 className="text-xl font-bold text-green-600 mt-2">Paid</h3>
              <p className="text-sm text-gray-400">No dues pending</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
              <Award size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Announcements */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Bell className="text-blue-600" size={20} /> Notice Board
            </h2>
            <button className="text-sm text-blue-600 hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {announcements.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 bg-white border rounded-lg flex flex-col items-center justify-center text-xs font-bold text-gray-500">
                  <span>{item.date.split(' ')[0]}</span>
                  <span className="text-lg text-gray-800">{item.date.split(' ')[1].replace(',','')}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{item.title}</h4>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {item.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timetable/Extra */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Schedule</h2>
          <div className="space-y-4 relative">
            <div className="border-l-2 border-gray-200 ml-3 space-y-6 pb-2">
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-1 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow"></div>
                <p className="text-xs text-gray-500">09:00 AM - 10:30 AM</p>
                <h4 className="font-bold text-gray-700">Anatomy & Physiology</h4>
                <p className="text-sm text-gray-500">Room 302 • Mr. Sharma</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-1 w-4 h-4 bg-gray-300 rounded-full border-4 border-white"></div>
                <p className="text-xs text-gray-500">11:00 AM - 12:30 PM</p>
                <h4 className="font-bold text-gray-700">Community Health</h4>
                <p className="text-sm text-gray-500">Lab A • Mrs. Das</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-1 w-4 h-4 bg-green-400 rounded-full border-4 border-white"></div>
                <p className="text-xs text-gray-500">02:00 PM - 03:30 PM</p>
                <h4 className="font-bold text-gray-700">Practical Session</h4>
                <p className="text-sm text-gray-500">Biology Lab</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;