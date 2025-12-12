// --- START OF FILE src/api/adminStudentExtras.js ---
import api from './api';

// --- DOCUMENTS ---
export const getStudentDocuments = async (studentId) => {
    const res = await api.get(`/documents/${studentId}`);
    return res.data;
};

export const uploadStudentDocument = async (studentId, formData) => {
    // Note: formData must contain 'file', 'title', 'type'
    const res = await api.post(`/documents/${studentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

export const deleteStudentDocument = async (docId) => {
    const res = await api.delete(`/documents/${docId}`);
    return res.data;
};

// --- EXAMS ---
export const getStudentExams = async (studentId) => {
    const res = await api.get(`/exams/${studentId}`);
    return res.data;
};

export const addStudentExam = async (studentId, data) => {
    const res = await api.post(`/exams/${studentId}`, data);
    return res.data;
};

export const deleteStudentExam = async (examId) => {
    const res = await api.delete(`/exams/${examId}`);
    return res.data;
};

// NEW: Bulk Create Exams
export const bulkCreateExams = async (data) => {
    // data = { program, admissionYear, examDetails }
    const res = await api.post('/exams/bulk/create', data);
    return res.data;
};

// --- FEES & CHECKLIST ---
export const getStudentFees = async (id) => (await api.get(`/fees/${id}`)).data;

// ✅ FIXED: Added '/structure' to the URL to match backend route
export const updateStudentFees = async (id, data) => (await api.post(`/fees/structure/${id}`, data)).data;

export const getChecklist = async (id) => (await api.get(`/documents/checklist/${id}`)).data;
export const updateChecklist = async (id, data) => (await api.post(`/documents/checklist/${id}`, data)).data;

export const getStudentFiles = async (id) => (await api.get(`/documents/files/${id}`)).data;
export const deleteStudentFile = async (id) => (await api.delete(`/documents/files/${id}`)).data;
export const uploadStudentFile = async (id, formData) => (await api.post(`/documents/upload/${id}`, formData)).data;