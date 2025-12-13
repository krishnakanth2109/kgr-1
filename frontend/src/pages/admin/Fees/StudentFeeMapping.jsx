import React, { useState, useEffect } from 'react';
import { getAllFeeStructures, assignStudentFee } from '../../../api/feeApi';
import api from '../../../api/api'; // direct axios for searching students
import { Search, Save, CheckCircle } from 'lucide-react';

const StudentFeeMapping = () => {
  const [structures, setStructures] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [foundStudent, setFoundStudent] = useState(null);
  const [selectedStructure, setSelectedStructure] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    getAllFeeStructures().then(setStructures);
  }, []);

  const searchStudent = async () => {
    try {
      // Assuming you have an endpoint like /students?search=... or similar
      // Here we filter by admission_number for simplicity
      const res = await api.get(`/students?globalSearch=${studentSearch}`);
      if(res.data.students && res.data.students.length > 0) {
        setFoundStudent(res.data.students[0]); // Take first match
      } else {
        alert("Student not found");
        setFoundStudent(null);
      }
    } catch (err) { alert("Search failed"); }
  };

  const handleAssign = async () => {
    if(!foundStudent || !selectedStructure) return;
    
    const struct = structures.find(s => s._id === selectedStructure);
    if(!struct) return;

    try {
      await assignStudentFee({
        studentId: foundStudent._id,
        feeStructureId: struct._id,
        totalPayable: struct.totalAmount,
        discount: Number(discount)
      });
      alert("Fee Structure Assigned Successfully!");
      setFoundStudent(null);
      setStudentSearch('');
    } catch (err) {
      alert("Assignment failed.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Assign Fees to Student</h2>

      <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl">
        <div className="flex gap-2 mb-6">
          <input 
            className="flex-1 p-2 border rounded" 
            placeholder="Enter Admission Number" 
            value={studentSearch}
            onChange={e => setStudentSearch(e.target.value)}
          />
          <button onClick={searchStudent} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"><Search size={18}/></button>
        </div>

        {foundStudent && (
          <div className="border p-4 rounded-lg bg-gray-50 space-y-4 animate-fade-in">
            <div className="flex justify-between border-b pb-2">
              <div>
                <h3 className="font-bold text-lg">{foundStudent.first_name} {foundStudent.last_name}</h3>
                <p className="text-sm text-gray-500">{foundStudent.program} • {foundStudent.admission_number}</p>
              </div>
              <CheckCircle className="text-green-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Select Fee Structure</label>
              <select 
                className="w-full p-2 border rounded bg-white"
                value={selectedStructure}
                onChange={e => setSelectedStructure(e.target.value)}
              >
                <option value="">-- Choose Plan --</option>
                {structures.map(s => (
                  <option key={s._id} value={s._id}>{s.name} (₹{s.totalAmount})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Discount / Concession (₹)</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded" 
                value={discount}
                onChange={e => setDiscount(e.target.value)}
              />
            </div>

            <button onClick={handleAssign} className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">
              Confirm Assignment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentFeeMapping;