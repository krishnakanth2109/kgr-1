// --- START OF FILE src/api/adminStudentExtras.js ---
import api from './api';
// Import fee helpers for legacy support to keep existing components working
import { getStudentFeeDetails, assignStudentFee } from './feeApi';

// ==========================================
// DOCUMENTS
// Backend: routes/studentDocuments.js
// ==========================================

export const getStudentDocuments = async (studentId) => {
    // Corrected Path: /files/:studentId
    const res = await api.get(`/documents/files/${studentId}`);
    return res.data;
};

export const uploadStudentDocument = async (studentId, formData) => {
    // Corrected Path: /upload/:studentId
    // Note: formData must contain 'file', 'title', 'type'
    const res = await api.post(`/documents/upload/${studentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

export const deleteStudentDocument = async (docId) => {
    // Corrected Path: /files/:docId
    const res = await api.delete(`/documents/files/${docId}`);
    return res.data;
};

// Aliases for compatibility if needed
export const getStudentFiles = getStudentDocuments;
export const uploadStudentFile = uploadStudentDocument;
export const deleteStudentFile = deleteStudentDocument;

// ==========================================
// CHECKLIST
// Backend: routes/studentDocuments.js
// ==========================================

export const getChecklist = async (id) => {
    const res = await api.get(`/documents/checklist/${id}`);
    return res.data;
};

export const updateChecklist = async (id, data) => {
    const res = await api.post(`/documents/checklist/${id}`, data);
    return res.data;
};

// ==========================================
// EXAMS
// Backend: routes/studentExams.js
// ==========================================

// Get exams for a specific student (Student Profile View)
export const getStudentExams = async (studentId) => {
    const res = await api.get(`/exams/${studentId}`);
    return res.data;
};

// Add a single exam to a student
export const addStudentExam = async (studentId, data) => {
    const res = await api.post(`/exams/${studentId}`, data);
    return res.data;
};

// Delete a specific exam instance
export const deleteStudentExam = async (examId) => {
    const res = await api.delete(`/exams/${examId}`);
    return res.data;
};

// Bulk Create Exams (For Admin Exam Manager)
// data = { program, admissionYear, examDetails }
export const bulkCreateExams = async (data) => {
    const res = await api.post('/exams/bulk/create', data);
    return res.data;
};

// Fetch Exams by Batch (For Admin Exam Manager Table)
export const fetchBatchExams = async (program, year) => {
    try {
        const res = await api.get(`/exams/batch?program=${program}&year=${year}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching batch exams:", error);
        throw error;
    }
};

// ==========================================
// LEGACY FEE HELPERS (Redirects to feeApi)
// ==========================================

export const getStudentFees = getStudentFeeDetails;
export const updateStudentFees = assignStudentFee; // Mapping old update to new assign logic