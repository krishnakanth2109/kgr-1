// --- START OF FILE src/pages/admin/AdminAdmissions.jsx ---

import React, { useEffect, useState } from 'react';
import api from '../../api/api'; 
import { 
  FileText, 
  Search, 
  Trash2, 
  Calendar, 
  Phone, 
  Mail,
  Eye,
  RefreshCw
} from 'lucide-react';

const AdminAdmissions = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // This matches the GET route in the backend file above
      const res = await api.get('/admissions');
      setApplications(res.data);
    } catch (error) {
      console.error("Error fetching admissions:", error);
      // Optional: Add a toast notification here
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      try {
        await api.delete(`/admissions/${id}`);
        setApplications(applications.filter(app => app._id !== id));
      } catch (error) {
        alert("Failed to delete application");
      }
    }
  };

  // Filter based on search
  const filteredApps = applications.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.phone.includes(searchTerm)
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-blue-600" /> Admission Applications
          </h1>
          <p className="text-gray-500 text-sm mt-1">Review and manage online student applications</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, phone..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchApplications}
            className="p-2 bg-white border rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition"
            title="Refresh Data"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="p-4 border-b">Applicant Details</th>
                  <th className="p-4 border-b">Contact Info</th>
                  <th className="p-4 border-b">Course</th>
                  <th className="p-4 border-b">Documents</th>
                  <th className="p-4 border-b">Applied On</th>
                  <th className="p-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApps.length > 0 ? (
                  filteredApps.map((app) => (
                    <tr key={app._id} className="hover:bg-blue-50/50 transition duration-150">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={app.photo} 
                            alt={app.name} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">{app.name}</p>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wide">ID: {app._id.slice(-6)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1.5 text-sm text-gray-600">
                          <div className="flex items-center gap-2" title={app.email}>
                            <Mail size={14} className="text-gray-400 shrink-0" /> 
                            <span className="truncate max-w-[150px]">{app.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400 shrink-0" /> {app.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${app.course === 'MPHW' ? 'bg-teal-100 text-teal-800' : 'bg-purple-100 text-purple-800'}`}>
                          {app.course}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <a 
                            href={app.idProof} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1.5 rounded hover:bg-blue-100 transition"
                            title="View ID Proof"
                          >
                            <Eye size={12} /> ID Proof
                          </a>
                          <a 
                            href={app.marksheet} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-1 text-xs font-medium bg-indigo-50 text-indigo-600 px-2 py-1.5 rounded hover:bg-indigo-100 transition"
                            title="View Marksheet"
                          >
                            <Eye size={12} /> Marksheet
                          </a>
                        </div>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          {new Date(app.submissionDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDelete(app._id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                          title="Delete Application"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FileText size={40} className="text-gray-300 mb-2" />
                        <p>No applications found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAdmissions;