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
  RefreshCw,
  User,
  Download,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const AdminAdmissions = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'submissionDate', direction: 'desc' });

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterAndSortApplications();
  }, [applications, searchTerm, selectedCourse, sortConfig]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admissions');
      setApplications(res.data);
    } catch (error) {
      console.error("Error fetching admissions:", error);
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

  const filterAndSortApplications = () => {
    let filtered = applications.filter(app => {
      const matchesSearch = 
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone.includes(searchTerm);
      
      const matchesCourse = selectedCourse === 'all' || app.course === selectedCourse;
      
      return matchesSearch && matchesCourse;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (sortConfig.key === 'submissionDate') {
        const dateA = new Date(a.submissionDate);
        const dateB = new Date(b.submissionDate);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (sortConfig.key === 'name') {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sortConfig.direction === 'asc' 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      
      return 0;
    });

    setFilteredApps(filtered);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getUniqueCourses = () => {
    const courses = applications.map(app => app.course);
    return ['all', ...new Set(courses)];
  };

  const downloadDocument = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ChevronDown size={14} className="opacity-30" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm">
            <FileText className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admission Applications</h1>
            <p className="text-gray-500 text-sm mt-1">Review and manage student applications</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{applications.length}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="text-blue-500" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Displaying</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{filteredApps.length}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <Filter className="text-green-500" size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search applications by name, email, phone, or course..." 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <select 
                className="appearance-none bg-gray-50 border border-gray-300 rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer min-w-[140px]"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="all">All Courses</option>
                {getUniqueCourses().slice(1).map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            
            <button 
              onClick={fetchApplications}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow"
            >
              <RefreshCw size={18} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500">Loading applications...</p>
          </div>
        ) : filteredApps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left">
                    <button 
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
                      onClick={() => handleSort('name')}
                    >
                      <span>Applicant</span>
                      <SortIcon columnKey="name" />
                    </button>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Course</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th className="p-4 text-left">
                    <button 
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
                      onClick={() => handleSort('submissionDate')}
                    >
                      <span>Applied On</span>
                      <SortIcon columnKey="submissionDate" />
                    </button>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app, index) => (
                  <React.Fragment key={app._id}>
                    <tr className={`hover:bg-blue-50/30 transition duration-150 ${index % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {app.photo ? (
                            <img 
                              src={app.photo} 
                              alt={app.name} 
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentNode.querySelector('.avatar-fallback').style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="avatar-fallback hidden w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white items-center justify-center font-semibold">
                            {app.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{app.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">ID: {app._id.slice(-8).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold 
                          ${app.course === 'MPHW' ? 'bg-teal-100 text-teal-800 border border-teal-200' : 
                            app.course === 'Nursing' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                            'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                          {app.course}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-700 truncate max-w-[180px]">{app.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-700">{app.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar size={14} className="text-gray-400" />
                          {new Date(app.submissionDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExpandedRow(expandedRow === app._id ? null : app._id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View details"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(app._id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete application"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Details Row */}
                    {expandedRow === app._id && (
                      <tr className="bg-blue-50/20 border-b border-blue-100">
                        <td colSpan="5" className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white rounded-lg border border-gray-200">
                            <div>
                              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <User size={16} /> Application Details
                              </h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Application ID:</span>
                                  <span className="font-medium">{app._id}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Submitted:</span>
                                  <span className="font-medium">
                                    {new Date(app.submissionDate).toLocaleString('en-US', {
                                      dateStyle: 'medium',
                                      timeStyle: 'short'
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-semibold text-gray-800 mb-3">Documents</h3>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => downloadDocument(app.idProof, `ID_Proof_${app.name.replace(/\s+/g, '_')}.pdf`)}
                                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200 border border-blue-200"
                                >
                                  <Download size={14} />
                                  <span className="text-sm font-medium">ID Proof</span>
                                </button>
                                <button
                                  onClick={() => downloadDocument(app.marksheet, `Marksheet_${app.name.replace(/\s+/g, '_')}.pdf`)}
                                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 rounded-lg hover:from-indigo-100 hover:to-indigo-200 transition-all duration-200 border border-indigo-200"
                                >
                                  <Download size={14} />
                                  <span className="text-sm font-medium">Marksheet</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <FileText size={48} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No applications found</h3>
            <p className="text-gray-500 text-center max-w-md">
              {searchTerm || selectedCourse !== 'all' 
                ? "No applications match your current filters. Try adjusting your search criteria."
                : "There are no admission applications yet. Applications will appear here once submitted."}
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      {filteredApps.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
          <div>
            Showing {filteredApps.length} of {applications.length} applications
          </div>
          <div className="text-xs">
            Click <Eye size={12} className="inline mx-1" /> to view details • Click <Trash2 size={12} className="inline mx-1" /> to delete
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdmissions;