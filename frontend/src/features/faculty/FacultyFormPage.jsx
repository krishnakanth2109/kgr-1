// src/features/faculty/FacultyFormPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetFacultyById, useAddFaculty, useUpdateFaculty } from './facultyQueries';
import { Save, Loader2, ArrowLeft, Upload, UserCircle, PlusCircle, XCircle } from 'lucide-react';

// A default state for a new faculty form, matching the schema
const initialFormState = {
    faculty_id: '',
    first_name: '',
    last_name: '',
    gender: 'Male',
    dob: '',
    email: '',
    phone_number: '',
    department: 'MLT',
    designation: 'Lecturer',
    date_of_joining: '',
    status: 'Active',
    qualifications: [],
    address: {
        address_line1: '',
        city: '',
        state: '',
        postal_code: ''
    },
    extras: {
        profile_photo_url: '',
    }
};

const FacultyFormPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const isEditing = !!id;

    const { data: existingFaculty, isLoading: isLoadingFaculty } = useGetFacultyById(id);
    const addMutation = useAddFaculty();
    const updateMutation = useUpdateFaculty();
    
    const [formData, setFormData] = useState(initialFormState);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (isEditing && existingFaculty) {
            const mergedData = {
                ...initialFormState,
                ...existingFaculty,
                dob: existingFaculty.dob ? new Date(existingFaculty.dob).toISOString().split('T')[0] : '',
                date_of_joining: existingFaculty.date_of_joining ? new Date(existingFaculty.date_of_joining).toISOString().split('T')[0] : '',
            };
            setFormData(mergedData);
            if (existingFaculty.extras?.profile_photo_url) {
                setImagePreview(existingFaculty.extras.profile_photo_url);
            }
        }
    }, [isEditing, existingFaculty]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Handle nested state for address
        if (name.includes('.')) {
            const [outerKey, innerKey] = name.split('.');
            setFormData(prev => ({ ...prev, [outerKey]: { ...prev[outerKey], [innerKey]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleArrayChange = (index, arrayName, e) => {
        const { name, value } = e.target;
        const newArray = [...formData[arrayName]];
        newArray[index] = { ...newArray[index], [name]: value };
        setFormData(prev => ({ ...prev, [arrayName]: newArray }));
    };

    const addQualificationRecord = () => {
        setFormData(prev => ({
            ...prev,
            qualifications: [ ...prev.qualifications, { degree: '', institution: '', year: '' } ]
        }));
    };

    const removeQualificationRecord = (index) => {
        setFormData(prev => ({
            ...prev,
            qualifications: prev.qualifications.filter((_, i) => i !== index)
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setFormData(prev => ({ ...prev, extras: { ...prev.extras, profile_photo_url: previewUrl } }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            updateMutation.mutate({ id, data: formData }, {
                onSuccess: () => navigate(`/admin/faculty/view/${id}`),
            });
        } else {
            addMutation.mutate(formData, {
                onSuccess: () => navigate('/admin/faculty'),
            });
        }
    };
    
    if (isLoadingFaculty) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /><p className="ml-4">Loading Faculty Details...</p></div>;
    }

    const isSubmitting = addMutation.isLoading || updateMutation.isLoading;

    return (
        <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md max-w-5xl mx-auto">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 mr-4" title="Go Back"><ArrowLeft size={20} /></button>
                <h1 className="text-2xl font-bold text-gray-800">{isEditing ? 'Edit Faculty Information' : 'Add New Faculty Member'}</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-1 flex flex-col items-center">
                            {imagePreview ? (<img src={imagePreview} alt="Profile Preview" className="h-32 w-32 rounded-full object-cover mb-4" />) : (<UserCircle className="h-32 w-32 text-gray-300 mb-4" />)}
                            <label htmlFor="profile-picture" className="cursor-pointer bg-gray-200 text-sm text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 flex items-center gap-2">
                                <Upload size={16} /> Upload Photo
                            </label>
                            <input id="profile-picture" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </div>
                        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input name="faculty_id" value={formData.faculty_id} onChange={handleChange} placeholder="Faculty ID" required className="p-2 border rounded-md" />
                            <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" required className="p-2 border rounded-md" />
                            <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" required className="p-2 border rounded-md" />
                            <select name="gender" value={formData.gender} onChange={handleChange} required className="p-2 border rounded-md bg-white"><option>Male</option><option>Female</option><option>Other</option></select>
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="p-2 border rounded-md" />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required className="p-2 border rounded-md" />
                            <input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" required className="p-2 border rounded-md" />
                        </div>
                    </div>
                </section>
                
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Professional Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select name="department" value={formData.department} onChange={handleChange} required className="p-2 border rounded-md bg-white"><option value="MLT">MLT</option><option value="MPHW">MPHW</option></select>
                        <input name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation (e.g., HOD)" required className="p-2 border rounded-md" />
                        <input type="date" name="date_of_joining" value={formData.date_of_joining} onChange={handleChange} required className="p-2 border rounded-md" />
                        {isEditing && <select name="status" value={formData.status} onChange={handleChange} className="p-2 border rounded-md bg-white"><option>Active</option><option>On Leave</option><option>Resigned</option></select>}
                    </div>
                </section>
                
                <section>
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-lg font-semibold text-gray-700">Qualifications</h2>
                        <button type="button" onClick={addQualificationRecord} className="flex items-center gap-1 text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                            <PlusCircle size={16} /> Add Qualification
                        </button>
                    </div>
                    <div className="space-y-4">
                        {formData.qualifications.map((qual, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 border p-3 rounded-lg relative bg-gray-50">
                                <input name="degree" value={qual.degree} onChange={(e) => handleArrayChange(index, 'qualifications', e)} placeholder="Degree / Certificate" className="p-2 border rounded-md" />
                                <input name="institution" value={qual.institution} onChange={(e) => handleArrayChange(index, 'qualifications', e)} placeholder="Institution Name" className="p-2 border rounded-md" />
                                <input type="number" name="year" value={qual.year} onChange={(e) => handleArrayChange(index, 'qualifications', e)} placeholder="Year of Completion" className="p-2 border rounded-md" />
                                <button type="button" onClick={() => removeQualificationRecord(index)} className="absolute -top-2 -right-2 text-red-500 hover:text-red-700 bg-white rounded-full"><XCircle size={20} /></button>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={() => navigate(-1)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50 hover:bg-blue-700">
                        {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : <Save size={18} />}
                        {isSubmitting ? 'Saving...' : (isEditing ? 'Update Faculty' : 'Save Faculty')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FacultyFormPage;