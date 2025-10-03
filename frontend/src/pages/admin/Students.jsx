import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  deleteMultipleStudents,
} from '../../api/studentApi'; // Make sure this path is correct for your project
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

// Main Component that manages state and logic
const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    globalSearch: '', rollNo: '', name: '', email: '', phone: '',
    course: '', courseType: '', admissionYear: '', status: ''
  });
  const [sortConfig, setSortConfig] = useState({ field: 'createdAt', order: 'desc' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Fetch data from API whenever page, filters, or sorting changes
  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      setError('');
      try {
        const params = { page: currentPage, limit: 10, sortField: sortConfig.field, sortOrder: sortConfig.order, ...filters };
        const data = await fetchStudents(params);
        setStudents(data.students);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError('Failed to fetch student data.');
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, [currentPage, filters, sortConfig]);

  // Handler for all filter input changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1); // Go back to the first page when filters change
  };

  // Handler for table header clicks to sort
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
        fetchFreshData(); // Refresh list
      } catch (err) { setError('Failed to delete student.'); }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedStudents.length === 0) return alert('No students selected.');
    if (window.confirm(`Are you sure you want to delete ${selectedStudents.length} selected students?`)) {
        try {
            await deleteMultipleStudents(selectedStudents);
            fetchFreshData(); // Refresh list
        } catch (err) { setError('Failed to delete selected students.'); }
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

  // A helper function to easily refresh the table after an action
  const fetchFreshData = () => {
      setSelectedStudents([]);
      if (currentPage !== 1) {
          setCurrentPage(1);
      } else {
          // If already on page 1, changing filters slightly will trigger useEffect
          setFilters(prev => ({...prev})); 
      }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Students</h1>
      <StudentFilters filters={filters} onFilterChange={handleFilterChange} />
      <div className="flex justify-end gap-2 mb-4">
        <button onClick={handleAdd} className="bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-700">
            <PlusCircle size={20} /> Add Student
        </button>
        <button onClick={handleBulkDelete} className="bg-red-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-700">
            <Trash2 size={20} /> Delete Selected
        </button>
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
            student={currentItem} onSuccess={fetchFreshData}
          />
        )}
      </AnimatePresence>
      {error && <div className="text-red-500 mt-4 text-center p-2 bg-red-100 rounded">{error}</div>}
    </div>
  );
};

// --- Child Components for clean code ---

const StudentFilters = ({ filters, onFilterChange }) => (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <input type="text" name="globalSearch" value={filters.globalSearch} onChange={onFilterChange} placeholder="Global Search..." className="p-2 border rounded-md col-span-2 md:col-span-4 lg:col-span-6" />
        <input type="text" name="rollNo" value={filters.rollNo} onChange={onFilterChange} placeholder="Filter Roll No." className="p-2 border rounded-md" />
        <input type="text" name="name" value={filters.name} onChange={onFilterChange} placeholder="Filter Name" className="p-2 border rounded-md" />
        <input type="text" name="email" value={filters.email} onChange={onFilterChange} placeholder="Filter Email" className="p-2 border rounded-md" />
        <input type="text" name="phone" value={filters.phone} onChange={onFilterChange} placeholder="Filter Phone" className="p-2 border rounded-md" />
        <input type="text" name="course" value={filters.course} onChange={onFilterChange} placeholder="Filter Course" className="p-2 border rounded-md" />
        <select name="status" value={filters.status} onChange={onFilterChange} className="p-2 border rounded-md">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
        </select>
    </div>
);

const StudentTable = ({ students, onSort, onEdit, onDelete, selectedStudents, onSelectStudent, onSelectAll, sortConfig, loading }) => (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 w-12"><input type="checkbox" onChange={onSelectAll} /></th>
                    {['rollNo', 'name', 'email', 'phone', 'course', 'courseType', 'admissionYear', 'status'].map(field => (
                        <th key={field} onClick={() => onSort(field)} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                            {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            {sortConfig.field === field && (sortConfig.order === 'asc' ? ' ▲' : ' ▼')}
                        </th>
                    ))}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                    <tr><td colSpan="10" className="text-center py-4 text-gray-500">Loading students...</td></tr>
                ) : students.length === 0 ? (
                    <tr><td colSpan="10" className="text-center py-4 text-gray-500">No students found.</td></tr>
                ) : (
                    students.map(student => (
                        <tr key={student._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4"><input type="checkbox" checked={selectedStudents.includes(student._id)} onChange={() => onSelectStudent(student._id)} /></td>
                            <td className="px-6 py-4 whitespace-nowrap">{student.rollNo}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{student.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{student.course}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{student.courseType}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{student.admissionYear}</td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{student.status}</span></td>
                            <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-4">
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
    <div className="flex justify-between items-center mt-4">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50">Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50">Next</button>
    </div>
);

const StudentModal = ({ isOpen, onClose, isEditing, student, onSuccess }) => {
    const [formData, setFormData] = useState(
        isEditing ? student : {
            rollNo: '', name: '', email: '', phone: '',
            course: '', courseType: 'Full-Time', admissionYear: new Date().getFullYear(), status: 'Active'
        }
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (isEditing) {
                await updateStudent(student._id, formData);
            } else {
                await createStudent(formData);
            }
            onSuccess(); // This refreshes the data in the main component
            onClose();   // This closes the modal
        } catch (err) {
            const errorMsg = err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} student.`;
            alert(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
                <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Student' : 'Add New Student'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="rollNo" value={formData.rollNo} onChange={handleChange} placeholder="Roll No" required className="w-full p-2 border rounded-md" />
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required className="w-full p-2 border rounded-md" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded-md" />
                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required className="w-full p-2 border rounded-md" />
                    <input name="course" value={formData.course} onChange={handleChange} placeholder="Course" required className="w-full p-2 border rounded-md" />
                    <select name="courseType" value={formData.courseType} onChange={handleChange} className="w-full p-2 border rounded-md">
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                    </select>
                    <input type="number" name="admissionYear" value={formData.admissionYear} onChange={handleChange} placeholder="Admission Year" required className="w-full p-2 border rounded-md" />
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded-md">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-md">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50">
                            {isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Add')}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default Students;