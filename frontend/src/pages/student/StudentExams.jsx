// src/pages/student/StudentExams.jsx
import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle, FileText, Loader2, AlertCircle } from 'lucide-react';
import { getStudentExams } from '../../api/adminStudentExtras';

const StudentExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const student = JSON.parse(sessionStorage.getItem('student-user'));

  useEffect(() => {
    const fetchExams = async () => {
      try {
        if (student?.id) {
            const data = await getStudentExams(student.id);
            setExams(data);
        }
      } catch (err) {
        console.error("Failed to load exams");
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const upcomingExams = exams.filter(e => new Date(e.examDate) >= new Date()).sort((a,b) => new Date(a.examDate) - new Date(b.examDate));
  const pastExams = exams.filter(e => new Date(e.examDate) < new Date() && e.isPublished).sort((a,b) => new Date(b.examDate) - new Date(a.examDate));

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800">My Examinations</h1>

      {/* Upcoming */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <Calendar className="text-blue-600" size={20} />
          <h2 className="text-lg font-bold text-gray-800">Upcoming Schedule</h2>
        </div>
        <div className="overflow-x-auto">
          {upcomingExams.length === 0 ? (
            <p className="p-6 text-gray-500 text-sm text-center">No upcoming exams scheduled.</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-blue-50 text-blue-900 font-semibold">
                <tr>
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Time</th>
                  <th className="py-4 px-6">Room</th>
                  <th className="py-4 px-6">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {upcomingExams.map(exam => (
                  <tr key={exam._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-800">{exam.subject}</td>
                    <td className="py-4 px-6">{new Date(exam.examDate).toLocaleDateString()}</td>
                    <td className="py-4 px-6 text-gray-500">{exam.startTime} - {exam.endTime}</td>
                    <td className="py-4 px-6">{exam.roomNo || 'TBA'}</td>
                    <td className="py-4 px-6"><span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">{exam.examType}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="text-green-600" size={20} /> 
            <h2 className="text-lg font-bold text-gray-800">Recent Results</h2>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {pastExams.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No results published yet.</p>
            ) : (
              pastExams.map(exam => (
                <div key={exam._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-800">{exam.subject}</p>
                    <p className="text-xs text-gray-500">{new Date(exam.examDate).toLocaleDateString()} • {exam.examType}</p>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-green-600 text-lg">{exam.marksObtained || '-'} / {exam.maxMarks}</span>
                    <span className="text-xs text-gray-400">Marks</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Generic Admit Card Info */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl shadow-lg p-6 text-white flex flex-col justify-center items-center text-center">
          <FileText size={48} className="mb-4 text-blue-200" />
          <h2 className="text-2xl font-bold mb-2">Exam Guidelines</h2>
          <p className="text-blue-100 mb-6 text-sm">
            Please ensure you carry your Hall Ticket and College ID card to the examination hall. Electronic gadgets are strictly prohibited.
          </p>
          <div className="flex gap-4 text-xs font-medium bg-white/10 p-3 rounded-lg">
             <span className="flex items-center gap-1"><AlertCircle size={14}/> Reporting Time: 30 mins before</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentExams;