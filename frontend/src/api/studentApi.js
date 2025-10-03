import api from './api'; // <-- IMPORT THE CENTRAL API HELPER

/**
 * Fetches a paginated and filtered list of students from the backend.
 * @param {object} filters - An object containing filter parameters like { page, limit, searchQuery, ... }
 * @returns {Promise<object>} A promise that resolves to the API response data.
 */
export const getStudents = async (filters) => {
    // Convert the filters object into URL query parameters
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/students?${params}`);
    return response.data;
};

/**
 * Fetches a single student's complete profile by their ID.
 * @param {string} id - The unique ID of the student.
 * @returns {Promise<object>} A promise that resolves to the student data.
 */
export const getStudentById = async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
};

/**
 * Sends a request to create a new student record.
 * @param {object} studentData - The new student's data from the form.
 * @returns {Promise<object>} A promise that resolves to the newly created student data.
 */
export const addStudent = async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
};

/**
 * Sends a request to update an existing student's record.
 * @param {string} id - The ID of the student to update.
 * @param {object} studentData - The updated student data from the form.
 * @returns {Promise<object>} A promise that resolves to the updated student data.
 */
export const updateStudent = async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
};

/**
 * Sends a request to change a student's status.
 * @param {{id: string, status: string}} statusUpdate - An object containing the student's ID and their new status.
 * @returns {Promise<object>} A promise that resolves to the updated student data.
 */
export const setStudentStatus = async ({ id, status }) => {
    // Using PATCH is conventional for partial updates like changing a status
    const response = await api.patch('/students/status', { id, status });
    return response.data;
};

/**
 * Deletes a single student record.
 * @param {string} id - The ID of the student to delete.
 * @returns {Promise<object>} A promise that resolves to the server's confirmation message.
 */
export const deleteStudent = async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
};

