// --- START OF FILE src/api/feeApi.js ---
import api from './api';

// Get all fees and payments for a student
export const getStudentFees = async (studentId) => {
    const response = await api.get(`/fees/${studentId}`);
    return response.data;
};

// Update the fee structure (Admin)
export const updateFeeStructure = async (studentId, structureData) => {
    const response = await api.post(`/fees/structure/${studentId}`, structureData);
    return response.data;
};

// Add a new payment (Student or Admin)
export const addPayment = async (studentId, paymentData) => {
    const response = await api.post(`/fees/payment/${studentId}`, paymentData);
    return response.data;
};