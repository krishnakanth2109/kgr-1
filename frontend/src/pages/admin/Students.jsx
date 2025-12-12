// src/features/students/Students.jsx
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  deleteMultipleStudents,
} from '../../api/studentApi'; 
import { PlusCircle, Edit, Trash2, KeyRound, Eye, EyeOff, Loader2 } from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [filters, setFilters] = useState({
    globalSearch: '',
    program: '',
    status: '',
    admissionYear: ''
  });

  const [sortConfig, setSortConfig] = useState({ field: 'createdAt', order: 'desc' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Fetch Logic
  const loadStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { 
        page: currentPage, 
        limit: 10, 
        sortField: sortConfig.field, 
        sortOrder: sortConfig.order, 
        ...filters 
      };
      const data = await fetchStudents(params);
      setStudents(data.students);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch student data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [currentPage, filters, sortConfig]);

  // Handlers
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    const order = sortConfig.field === field && sortConfig.order === 'asc' ? 'desc' : 'asc';
    setSortConfig({ field, order });
  };

  const handleAdd = () => {
    setIsEditing(false);
    setCurrentItem(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (student) => {
    setIsEditing(true);
    setCurrentItem(student);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        setSelectedStudents(prev => prev.filter(sid => sid !== id));
        loadStudents();
      } catch (err) { 
        setError('Failed to delete student.'); 
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedStudents.length === 0) return alert('No students selected.');
    if (window.confirm(`Are you sure you want to delete ${selectedStudents.length} selected students?`)) {
      try {
        await deleteMultipleStudents({ ids: selectedStudents });
        setSelectedStudents([]);
        loadStudents();
      } catch (err) { 
        setError('Failed to delete selected students.'); 
      }
    }
  };
  
  const handleSelectStudent = (id) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(students.map(s => s._id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSuccess = () => {
    loadStudents();
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Students Directory</h1>
      
      <StudentFilters filters={filters} onFilterChange={handleFilterChange} />
      
      <div className="flex justify-end gap-2 mb-4">
        <button onClick={handleAdd} className="bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-700 shadow transition">
          <PlusCircle size={20} /> Add Student
        </button>
        {selectedStudents.length > 0 && (
          <button onClick={handleBulkDelete} className="bg-red-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-700 shadow transition">
            <Trash2 size={20} /> Delete ({selectedStudents.length})
          </button>
        )}
      </div>

      <StudentTable
        students={students} onSort={handleSort} onEdit={handleEdit} onDelete={handleDelete}
        selectedStudents={selectedStudents} onSelectStudent={handleSelectStudent} onSelectAll={handleSelectAll}
        sortConfig={sortConfig} loading={loading}
      />
      
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      
      <AnimatePresence>
        {isModalOpen && (
          <StudentModal
            isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isEditing={isEditing}
            student={currentItem} onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
      
      {error && <div className="text-red-500 mt-4 text-center p-3 bg-red-50 border border-red-200 rounded">{error}</div>}
    </div>
  );
};

// --- Sub Components ---

const StudentFilters = ({ filters, onFilterChange }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
    <input 
      type="text" 
      name="globalSearch" 
      value={filters.globalSearch} 
      onChange={onFilterChange} 
      placeholder="Search Name, Roll No, Email..." 
      className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2" 
    />
    <select name="program" value={filters.program} onChange={onFilterChange} className="p-2 border border-gray-300 rounded-md">
      <option value="">All Programs</option>
      <option value="MPHW">MPHW</option>
      <option value="MLT">MLT</option>
    </select>
    <select name="status" value={filters.status} onChange={onFilterChange} className="p-2 border border-gray-300 rounded-md">
      <option value="">All Status</option>
      <option value="Active">Active</option>
      <option value="Graduated">Graduated</option>
      <option value="Dropped Out">Dropped Out</option>
    </select>
  </div>
);

const StudentTable = ({ students, onSort, onEdit, onDelete, selectedStudents, onSelectStudent, onSelectAll, sortConfig, loading }) => (
  <div className="bg-white shadow-md rounded-lg overflow-x-auto border border-gray-200">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 w-10"><input type="checkbox" onChange={onSelectAll} /></th>
          <th onClick={() => onSort('admission_number')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">Adm. No</th>
          <th onClick={() => onSort('first_name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">Name</th>
          <th onClick={() => onSort('program')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">Program</th>
          <th onClick={() => onSort('phone_number')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
          <th onClick={() => onSort('status')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {loading ? (
          <tr><td colSpan="7" className="text-center py-8 text-gray-500">Loading students...</td></tr>
        ) : students.length === 0 ? (
          <tr><td colSpan="7" className="text-center py-8 text-gray-500">No students found.</td></tr>
        ) : (
          students.map(student => (
            <tr key={student._id} className="hover:bg-blue-50 transition-colors">
              <td className="px-6 py-4"><input type="checkbox" checked={selectedStudents.includes(student._id)} onChange={() => onSelectStudent(student._id)} /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.admission_number}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {student.first_name} {student.last_name}
                <div className="text-xs text-gray-500">{student.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.program}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.phone_number}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${student.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    student.status === 'Dropped Out' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'}`}>
                  {student.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                <button onClick={() => onEdit(student)} className="text-indigo-600 hover:text-indigo-900"><Edit size={18} /></button>
                <button onClick={() => onDelete(student._id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-between items-center mt-4 px-2">
    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100">Previous</button>
    <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100">Next</button>
  </div>
);

// --- MODAL with Validations (Includes Password Toggle & Data Validation) ---
const StudentModal = ({ isOpen, onClose, isEditing, student, onSuccess }) => {
  const [formData, setFormData] = useState({
    admission_number: student?.admission_number || '',
    roll_number: student?.roll_number || '',
    first_name: student?.first_name || '',
    middle_name: student?.middle_name || '',
    last_name: student?.last_name || '',
    email: student?.email || '',
    phone_number: student?.phone_number || '',
    gender: student?.gender || 'Male',
    dob: student?.dob ? new Date(student.dob).toISOString().split('T')[0] : '',
    program: student?.program || 'MPHW',
    admission_year: student?.admission_year || new Date().getFullYear(),
    status: student?.status || 'Active',
    category: student?.category || 'General',
    password: '' 
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // --- Validation 1: Phone Number (Numbers only, Max 10 digits) ---
    if (name === 'phone_number') {
      // If value is not numeric (and not empty), ignore the input
      if (value && !/^\d*$/.test(value)) return;
      // If value is more than 10 digits, ignore the input
      if (value.length > 10) return;
    }

    // --- Validation 2: Names (Alphabets and spaces only) ---
    // Applies to First, Middle, and Last Name
    if (['first_name', 'middle_name', 'last_name'].includes(name)) {
      // If value contains anything other than letters or spaces, ignore input
      // This prevents users from even typing numbers or special chars
      if (value && !/^[A-Za-z\s]*$/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // --- Final Submission Validations ---
    
    // 1. Check Required Fields
    const requiredFields = [
      'admission_number', 'first_name', 'last_name', 
      'email', 'phone_number', 'dob', 'admission_year'
    ];
    
    // Simple check to ensure required fields aren't empty
    const missingField = requiredFields.find(field => !formData[field]);
    if (missingField) {
       setErrorMsg("Please fill in all required fields marked with *.");
       return;
    }

    // 2. Check Phone Number Length (Must be exactly 10)
    if (formData.phone_number.length !== 10) {
      setErrorMsg("Phone number must be exactly 10 digits.");
      return;
    }

    // 3. Double Check Name Validity (Redundant but safe)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(formData.first_name) || !nameRegex.test(formData.last_name)) {
       setErrorMsg("Names must only contain alphabets.");
       return;
    }
    if (formData.middle_name && !nameRegex.test(formData.middle_name)) {
        setErrorMsg("Middle name must only contain alphabets.");
        return;
    }
    
    setIsSubmitting(true);

    try {
      // Clean up payload
      const payload = { ...formData };
      
      // Remove empty optional fields so backend doesn't receive empty strings
      if (!payload.roll_number?.trim()) delete payload.roll_number;
      if (!payload.middle_name?.trim()) delete payload.middle_name;
      if (!payload.password?.trim()) delete payload.password;

      if (isEditing) {
        await updateStudent(student._id, payload);
      } else {
        await createStudent(payload);
      }
      onSuccess();
    } catch (err) {
      console.error("Submit Error:", err);
      const msg = err.response?.data?.message || "Operation failed. Please check your inputs.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{isEditing ? 'Edit Student' : 'Add New Student'}</h2>
        
        {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded border border-red-200">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="col-span-1 md:col-span-2 text-sm font-semibold text-gray-500 uppercase mt-2">Personal Details</div>
          
          <input name="admission_number" value={formData.admission_number} onChange={handleChange} placeholder="Admission Number *" className="p-2 border rounded" required />
          <input name="roll_number" value={formData.roll_number} onChange={handleChange} placeholder="Roll Number (Optional)" className="p-2 border rounded" />
          
          {/* Names - Validation Enforced in handleChange */}
          <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name *" className="p-2 border rounded" required />
          <input name="middle_name" value={formData.middle_name} onChange={handleChange} placeholder="Middle Name (Optional)" className="p-2 border rounded" />
          <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name *" className="p-2 border rounded" required />
          
          <select name="gender" value={formData.gender} onChange={handleChange} className="p-2 border rounded">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="p-2 border rounded" required />
          
          <select name="category" value={formData.category} onChange={handleChange} className="p-2 border rounded">
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
          </select>

          <div className="col-span-1 md:col-span-2 text-sm font-semibold text-gray-500 uppercase mt-2">Contact Info</div>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email *" className="p-2 border rounded col-span-1 md:col-span-2" required />
          
          {/* Phone - Validation Enforced in handleChange + handleSubmit */}
          <input 
            type="tel" 
            name="phone_number" 
            value={formData.phone_number} 
            onChange={handleChange} 
            placeholder="Phone (10 digits) *" 
            className="p-2 border rounded" 
            required 
            maxLength={10} // Prevents typing more than 10
            title="Please enter exactly 10 digits" 
          />

          {/* Security Section */}
          <div className="col-span-1 md:col-span-2 text-sm font-semibold text-gray-500 uppercase mt-2 flex items-center gap-2">
            <KeyRound size={16} /> Security
          </div>
          <div className="col-span-1 md:col-span-2 relative">
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder={isEditing ? "New Password (Leave blank to keep current)" : "Password (Default: student123)"} 
              className="w-full p-2 pr-10 border rounded" 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <p className="text-xs text-gray-500 mt-1">
              {isEditing ? "Only enter a value if you want to reset the student's password." : "If left blank, password will default to 'student123'."}
            </p>
          </div>

          <div className="col-span-1 md:col-span-2 text-sm font-semibold text-gray-500 uppercase mt-2">Academic Details</div>
          <select name="program" value={formData.program} onChange={handleChange} className="p-2 border rounded">
            <option value="MPHW">MPHW</option>
            <option value="MLT">MLT</option>
          </select>
          <input type="number" name="admission_year" value={formData.admission_year} onChange={handleChange} placeholder="Admission Year *" className="p-2 border rounded" required min="1900" max="2100" />
          
          <select name="status" value={formData.status} onChange={handleChange} className="p-2 border rounded">
            <option value="Active">Active</option>
            <option value="Graduated">Graduated</option>
            <option value="Dropped Out">Dropped Out</option>
          </select>

          <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-4 border-t mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border hover:bg-gray-100">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
              {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : (isEditing ? 'Update' : 'Save')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Students;