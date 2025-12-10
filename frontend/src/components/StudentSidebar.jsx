// --- START OF FILE src/components/StudentSidebar.jsx ---
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Banknote, 
  FileText, 
  GraduationCap, 
  LogOut,
  User
} from 'lucide-react';

const StudentSidebar = () => {
  const navigate = useNavigate();
  const student = JSON.parse(sessionStorage.getItem('student-user') || '{}');

  const handleLogout = () => {
    sessionStorage.removeItem('student-token');
    sessionStorage.removeItem('student-user');
    navigate('/student/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Fees', path: '/student/fees', icon: <Banknote size={20} /> },
    { name: 'Exams & Results', path: '/student/exams', icon: <GraduationCap size={20} /> },
    { name: 'Documents', path: '/student/documents', icon: <FileText size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold flex items-center gap-2">
           <GraduationCap className="text-blue-400" />
           Student Portal
        </h2>
        <div className="mt-4 flex items-center gap-3 bg-slate-800 p-3 rounded-lg">
            <div className="bg-blue-500 rounded-full p-2">
                <User size={16} />
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{student.name || 'Student'}</p>
                <p className="text-xs text-slate-400 truncate">{student.admission_number}</p>
            </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;