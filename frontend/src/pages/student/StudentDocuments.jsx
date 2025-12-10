// src/pages/student/StudentDocuments.jsx
import React, { useEffect, useState } from 'react';
import { FileText, Download, Loader2, AlertCircle, UploadCloud, Trash2 } from 'lucide-react';
import { getStudentDocuments, uploadStudentDocument, deleteStudentDocument } from '../../api/adminStudentExtras';

const StudentDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Upload State
  const [newFile, setNewFile] = useState({ title: '', type: 'Certificate', file: null });
  const [uploading, setUploading] = useState(false);

  const student = JSON.parse(sessionStorage.getItem('student-user'));

  // Initial Fetch
  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    if (!student || !student.id) {
      setError("Student session not found. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      const data = await getStudentDocuments(student.id);
      setDocuments(data);
    } catch (err) {
      console.error("Failed to load docs", err);
      setError("Unable to fetch documents. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newFile.file) return alert("Please select a file to upload.");
    if (!newFile.title) return alert("Please enter a document title.");

    setUploading(true);
    const formData = new FormData();
    formData.append('title', newFile.title);
    formData.append('type', newFile.type); // e.g., 'ID', 'Marksheet'
    formData.append('file', newFile.file);

    try {
      await uploadStudentDocument(student.id, formData);
      // Reset form
      setNewFile({ title: '', type: 'Certificate', file: null });
      document.getElementById('fileInput').value = ""; 
      // Refresh list
      await fetchDocs();
      alert("Document uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload document. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Handle Delete (Optional: allow students to delete their own docs?)
  const handleDelete = async (docId) => {
    if(!window.confirm("Are you sure you want to delete this document?")) return;
    try {
        await deleteStudentDocument(docId);
        setDocuments(prev => prev.filter(d => d._id !== docId));
    } catch (err) {
        alert("Failed to delete document.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">My Documents</h1>
            <p className="text-gray-500 text-sm">Upload your Aadhaar, PAN, Marksheets, etc.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* --- Upload Section --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <UploadCloud className="text-blue-600" /> Upload New Document
        </h2>
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                <input 
                    placeholder="e.g. Aadhaar Card" 
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newFile.title}
                    onChange={e => setNewFile({ ...newFile, title: e.target.value })}
                    required
                />
            </div>
            <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={newFile.type}
                    onChange={e => setNewFile({ ...newFile, type: e.target.value })}
                >
                    <option value="Certificate">Certificate</option>
                    <option value="Marksheet">Marksheet</option>
                    <option value="ID">ID Proof</option>
                    <option value="Official">Official</option>
                </select>
            </div>
            <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                <input 
                    id="fileInput" 
                    type="file" 
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={e => setNewFile({ ...newFile, file: e.target.files[0] })}
                    required
                />
            </div>
            <div className="md:col-span-1">
                <button 
                    disabled={uploading} 
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition flex justify-center items-center gap-2 disabled:opacity-50"
                >
                    {uploading ? <Loader2 className="animate-spin" size={18} /> : "Upload"}
                </button>
            </div>
        </form>
      </div>

      {/* --- Documents Grid --- */}
      {documents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-500 font-medium">No documents uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div 
              key={doc._id} 
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group relative"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full uppercase font-bold tracking-wide">
                  {doc.type}
                </span>
              </div>
              
              <div className="mb-4">
                <h3 className="font-bold text-gray-800 mb-1 truncate" title={doc.title}>
                  {doc.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex gap-2">
                  <a 
                    href={doc.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <Download size={16} /> View
                  </a>
                  <button 
                    onClick={() => handleDelete(doc._id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 size={18} />
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDocuments;