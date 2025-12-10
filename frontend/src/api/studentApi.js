// --- START OF FILE src/api/studentApi.js ---
import api from './api'; // Imports the central API helper with the token interceptor

// =========================================================
// Core Functions (Used by Students.jsx)
// =========================================================

export const fetchStudents = async (params) => {
    // Axios params automatically handle ?page=1&limit=10...
    const response = await api.get('/students', { params });
    return response.data;
};

export const getStudentById = async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
};

export const createStudent = async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
};

export const updateStudent = async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
};

export const deleteStudent = async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
};

export const deleteMultipleStudents = async (data) => {
    // data structure: { ids: ["id1", "id2"] }
    const response = await api.post('/students/bulk-delete', data);
    return response.data;
};

// =========================================================
// Additional Functions (Used by studentQueries.js / Dashboard)
// =========================================================

export const setStudentStatus = async ({ id, status }) => {
    const response = await api.patch('/students/status', { id, status });
    return response.data;
};

// =========================================================
// Aliases (For compatibility with old code)
// =========================================================

// If studentQueries.js asks for 'getStudents', we give them 'fetchStudents'
export const getStudents = fetchStudents; 

// If studentQueries.js asks for 'addStudent', we give them 'createStudent'
export const addStudent = createStudent;