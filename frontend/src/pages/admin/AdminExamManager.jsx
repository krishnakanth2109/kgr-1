// src/pages/admin/AdminExamManager.jsx
import React, { useState } from 'react';
import { bulkCreateExams } from '../../api/adminStudentExtras'; // Import the new helper
import { Calendar, Plus, Save, Loader2, Users } from 'lucide-react';

const AdminExamManager = () => {
  const [loading, setLoading] = useState(false);
  const [batch, setBatch] = useState({ program: 'MPHW', admissionYear: new Date().getFullYear().toString() });
  
  const [examDetails, setExamDetails] = useState({
    subject: '',
    examDate: '',
    startTime: '',
    endTime: '',
    roomNo: '',
    examType: 'Theory',
    maxMarks: 100
  });

  const handlePublishExam = async (e) => {
    e.preventDefault();
    if (!window.confirm(`Publish this exam to ALL ${batch.program} students from batch ${batch.admissionYear}?`)) return;

    setLoading(true);
    try {
      // Use the new Bulk API
      const response = await bulkCreateExams({
        program: batch.program,
        admissionYear: Number(batch.admissionYear), // Ensure it's a number to match DB type
        examDetails: examDetails
      });

      alert(response.message);
      
      // Reset Form
      setExamDetails({ subject: '', examDate: '', startTime: '', endTime: '', roomNo: '', examType: 'Theory', maxMarks: 100 }); 

    } catch (err) {
      console.error(err);
      // Show specific error message from backend if available
      const msg = err.response?.data?.message || "Failed to publish exam schedule.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Calendar className="text-orange-600" /> Exam Scheduler
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Configuration Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Select Batch */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Users size={20} /> 1. Select Target Batch
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Program</label>
                <select 
                  className="w-full p-2 border rounded-lg bg-gray-50"
                  value={batch.program}
                  onChange={(e) => setBatch({...batch, program: e.target.value})}
                >
                  <option>MPHW</option>
                  <option>MLT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Admission Year</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg bg-gray-50"
                  value={batch.admissionYear}
                  onChange={(e) => setBatch({...batch, admissionYear: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Step 2: Exam Details */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Plus size={20} /> 2. Exam Details
            </h2>
            <form onSubmit={handlePublishExam} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-gray-600">Subject Name</label>
                  <input required className="w-full p-2 border rounded-lg" value={examDetails.subject} onChange={e => setExamDetails({...examDetails, subject: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Date</label>
                  <input type="date" required className="w-full p-2 border rounded-lg" value={examDetails.examDate} onChange={e => setExamDetails({...examDetails, examDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Type</label>
                  <select className="w-full p-2 border rounded-lg" value={examDetails.examType} onChange={e => setExamDetails({...examDetails, examType: e.target.value})}>
                    <option>Theory</option>
                    <option>Practical</option>
                    <option>Viva</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Start Time</label>
                  <input type="time" className="w-full p-2 border rounded-lg" value={examDetails.startTime} onChange={e => setExamDetails({...examDetails, startTime: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">End Time</label>
                  <input type="time" className="w-full p-2 border rounded-lg" value={examDetails.endTime} onChange={e => setExamDetails({...examDetails, endTime: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Room No</label>
                  <input className="w-full p-2 border rounded-lg" value={examDetails.roomNo} onChange={e => setExamDetails({...examDetails, roomNo: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Max Marks</label>
                  <input type="number" className="w-full p-2 border rounded-lg" value={examDetails.maxMarks} onChange={e => setExamDetails({...examDetails, maxMarks: e.target.value})} />
                </div>
              </div>

              <div className="pt-4">
                <button disabled={loading} className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 flex justify-center items-center gap-2 transition-all">
                  {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  Publish Exam Schedule
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Info Panel */}
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl h-fit">
          <h3 className="text-orange-900 font-bold mb-2">How this works</h3>
          <p className="text-orange-800 text-sm leading-relaxed mb-4">
            This tool allows you to create an exam event and automatically assign it to every student in the selected batch.
          </p>
          <ul className="text-orange-800 text-sm list-disc pl-4 space-y-2">
            <li>Select the Program (e.g., MPHW) and Year (e.g., 2023).</li>
            <li>Fill in the exam details (Subject, Date, Time).</li>
            <li>Click <strong>Publish</strong>.</li>
            <li>The system will find all students matching that batch and add this exam to their individual schedule.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default AdminExamManager;