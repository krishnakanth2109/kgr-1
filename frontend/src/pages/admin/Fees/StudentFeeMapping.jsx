import React, { useState, useEffect } from 'react';
import { 
  Search, CheckCircle, X, Layers, DollarSign, Loader2, 
  GraduationCap, MoreVertical, Edit, Trash2,
  History, CreditCard, Save, AlertCircle 
} from 'lucide-react';
import { getAllFeeStructures, assignStudentFee, getStudentFeeDetails, processPayment } from '../../../api/feeApi';
import { fetchStudents } from '../../../api/studentApi';
import { motion, AnimatePresence } from 'framer-motion';

const StudentFeeMapping = () => {
  // --- State Management ---
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [structures, setStructures] = useState([]);
  const [feeMap, setFeeMap] = useState({}); 
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [assignModal, setAssignModal] = useState(null); // Student Object
  const [historyModal, setHistoryModal] = useState(null); // Student Object
  const [statusModal, setStatusModal] = useState(null);   // Student Object for Status/Payment Update

  // Assignment Form State
  const [assignmentData, setAssignmentData] = useState({
    structureId: '',
    discount: 0
  });

  // Payment/Status Update Form State
  const [statusForm, setStatusForm] = useState({
    amount: '',
    mode: 'Cash',
    remarks: '',
    year: '1st' // Default year
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // --- 1. Fetch Data ---
  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    try {
      setLoading(true);
      const structRes = await getAllFeeStructures();
      setStructures(structRes);

      const studentRes = await fetchStudents({ limit: 100, status: 'Active' });
      const studentList = studentRes.students || [];
      setStudents(studentList);
      setFilteredStudents(studentList);

      // Fetch Fee Status (Join)
      const fees = {};
      await Promise.all(studentList.map(async (stu) => {
        try {
          const feeData = await getStudentFeeDetails(stu._id);
          if (feeData) fees[stu._id] = feeData;
        } catch (e) {}
      }));
      setFeeMap(fees);

    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Filter ---
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = students.filter(stu => 
      stu.first_name.toLowerCase().includes(lowerQuery) ||
      stu.admission_number.toLowerCase().includes(lowerQuery)
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  // --- 3. Handlers ---

  // ASSIGN STRUCTURE
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignmentData.structureId) return alert("Please select a fee structure");

    setIsSubmitting(true);
    try {
      const selectedStruct = structures.find(s => s._id === assignmentData.structureId);
      
      const result = await assignStudentFee({
        studentId: assignModal._id,
        feeStructureId: assignmentData.structureId,
        totalPayable: selectedStruct.totalAmount,
        discount: Number(assignmentData.discount)
      });

      setFeeMap(prev => ({ ...prev, [assignModal._id]: result }));
      alert("Fee Structure Updated!");
      setAssignModal(null);
    } catch (error) {
      alert("Assignment failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // UPDATE STATUS / RECORD PAYMENT
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!statusForm.amount) return alert("Please enter an amount.");

    setIsSubmitting(true);
    try {
      // This uses the processPayment API which updates the totalPaid and status automatically in backend
      const result = await processPayment({
        studentId: statusModal._id,
        amount: Number(statusForm.amount),
        mode: statusForm.mode,
        year: statusForm.year,
        remarks: statusForm.remarks || 'Admin Manual Update'
      });

      setFeeMap(prev => ({ ...prev, [statusModal._id]: result }));
      alert("Payment Recorded & Status Updated!");
      setStatusModal(null);
      setStatusForm({ amount: '', mode: 'Cash', remarks: '', year: '1st' }); // Reset
    } catch (error) {
      console.error(error);
      alert("Failed to update status.");
    } finally {
      setIsSubmitting(false);
    }
  };


  // Modal Openers
  const openAssignModal = (student) => {
    const existingFee = feeMap[student._id];
    setAssignModal(student);
    setAssignmentData({
      structureId: existingFee?.feeStructureId?._id || existingFee?.feeStructureId || '',
      discount: existingFee?.discount || 0
    });
    setActiveDropdown(null);
  };

  const openStatusModal = (student) => {
    setStatusModal(student);
    setActiveDropdown(null);
  };

  const openHistoryModal = (student) => {
    setHistoryModal(student);
    setActiveDropdown(null);
  };

  // --- UI Helpers ---
  const getStatusBadge = (status) => {
    const styles = {
      Paid: "bg-green-100 text-green-700 border-green-200",
      Partial: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Pending: "bg-red-100 text-red-700 border-red-200",
      Unassigned: "bg-gray-100 text-gray-500 border-gray-200"
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || styles.Unassigned}`}>
        {status || 'Unassigned'}
      </span>
    );
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50 font-sans" onClick={() => setActiveDropdown(null)}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Student Fee Management</h1>
          <p className="text-gray-500 mt-1">Assign structures, record payments, and track status.</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 text-gray-400" size={18}/>
          <input
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
            placeholder="Search Name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* --- TABLE VIEW --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4 w-10"><input type="checkbox" className="rounded border-gray-300"/></th>
                <th className="p-4">Student</th>
                <th className="p-4">Program / Batch</th>
                <th className="p-4">Fee Structure</th>
                <th className="p-4 text-right">Total</th>
                <th className="p-4 text-right">Paid</th>
                <th className="p-4 text-right">Due</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="9" className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600"/></td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan="9" className="p-10 text-center text-gray-400">No students found.</td></tr>
              ) : (
                filteredStudents.map((stu) => {
                  const fee = feeMap[stu._id];
                  const status = fee?.paymentStatus || 'Unassigned';
                  const total = (fee?.totalPayable || 0) - (fee?.discount || 0);
                  const paid = fee?.totalPaid || 0;
                  const due = total - paid;

                  return (
                    <tr key={stu._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-4"><input type="checkbox" className="rounded border-gray-300"/></td>
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{stu.first_name} {stu.last_name}</div>
                        <div className="text-xs text-gray-500 font-mono">{stu.admission_number}</div>
                      </td>
                      <td className="p-4 text-gray-600">
                        {stu.program} <span className="text-xs text-gray-400">({stu.admission_year})</span>
                      </td>
                      <td className="p-4">
                        {fee?.feeStructureId?.name ? (
                          <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-medium border border-indigo-100">
                            {fee.feeStructureId.name}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic text-xs">Not Assigned</span>
                        )}
                      </td>
                      <td className="p-4 text-right font-medium">₹{total.toLocaleString()}</td>
                      <td className="p-4 text-right text-green-600">₹{paid.toLocaleString()}</td>
                      <td className="p-4 text-right font-bold text-red-600">₹{due.toLocaleString()}</td>
                      <td className="p-4 text-center">{getStatusBadge(status)}</td>
                      <td className="p-4 text-center relative">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === stu._id ? null : stu._id); }}
                          className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition"
                        >
                          <MoreVertical size={18}/>
                        </button>
                        
                        {/* Dropdown Menu */}
                        {activeDropdown === stu._id && (
                          <div className="absolute right-8 top-8 w-56 bg-white shadow-xl rounded-lg border border-gray-100 z-10 py-1 animate-fade-in">
                            <button onClick={() => openStatusModal(stu)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center gap-2 font-medium">
                              <CreditCard size={16}/> Update Payment/Status
                            </button>
                            <button onClick={() => openAssignModal(stu)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2">
                              <Edit size={16}/> {fee ? 'Change Structure' : 'Assign Structure'}
                            </button>
                            {fee && (
                              <button onClick={() => openHistoryModal(stu)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <History size={16}/> View History
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
           <span>Showing {filteredStudents.length} records</span>
           <div className="flex gap-2">
             <button className="px-3 py-1 bg-white border rounded hover:bg-gray-100">Previous</button>
             <button className="px-3 py-1 bg-white border rounded hover:bg-gray-100">Next</button>
           </div>
        </div>
      </div>

      {/* --- 1. ASSIGNMENT MODAL --- */}
      <AnimatePresence>
        {assignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-indigo-900 text-white p-6 flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-bold flex items-center gap-2"><GraduationCap/> Assign Fees</h3>
                    <p className="text-indigo-200 text-sm mt-1">{assignModal.first_name} {assignModal.last_name}</p>
                 </div>
                 <button onClick={() => setAssignModal(null)} className="p-2 hover:bg-white/10 rounded-full"><X/></button>
              </div>

              <form onSubmit={handleAssignSubmit} className="p-6 space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Fee Structure</label>
                    <div className="relative">
                      <Layers className="absolute left-3 top-3 text-gray-400" size={18}/>
                      <select 
                        required
                        className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        value={assignmentData.structureId}
                        onChange={(e) => setAssignmentData({ ...assignmentData, structureId: e.target.value })}
                      >
                        <option value="">-- Choose Structure --</option>
                        {structures.map(s => (
                          <option key={s._id} value={s._id}>{s.name} - ₹{s.totalAmount.toLocaleString()}</option>
                        ))}
                      </select>
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Discount (₹)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 text-gray-400" size={18}/>
                      <input 
                        type="number"
                        className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={assignmentData.discount}
                        onChange={(e) => setAssignmentData({ ...assignmentData, discount: e.target.value })}
                      />
                    </div>
                 </div>
                 <button 
                   type="submit"
                   disabled={isSubmitting}
                   className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex justify-center items-center gap-2"
                 >
                   {isSubmitting ? <Loader2 className="animate-spin"/> : <CheckCircle size={20}/>} Confirm Assignment
                 </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- 2. UPDATE PAYMENT/STATUS MODAL (NEW) --- */}
      <AnimatePresence>
        {statusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-green-700 text-white p-6 flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-bold flex items-center gap-2"><CreditCard/> Record Payment</h3>
                    <p className="text-green-100 text-sm mt-1">{statusModal.first_name} {statusModal.last_name}</p>
                 </div>
                 <button onClick={() => setStatusModal(null)} className="p-2 hover:bg-white/10 rounded-full"><X/></button>
              </div>
              
              <form onSubmit={handleStatusSubmit} className="p-6 space-y-5">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Year</label>
                        <select 
                            className="w-full p-3 border rounded-xl"
                            value={statusForm.year}
                            onChange={e => setStatusForm({...statusForm, year: e.target.value})}
                        >
                            <option value="1st">1st Year</option>
                            <option value="2nd">2nd Year</option>
                            <option value="3rd">3rd Year</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mode</label>
                        <select 
                            className="w-full p-3 border rounded-xl"
                            value={statusForm.mode}
                            onChange={e => setStatusForm({...statusForm, mode: e.target.value})}
                        >
                            <option>Cash</option>
                            <option>UPI</option>
                            <option>Razorpay</option>
                            <option>Cheque</option>
                        </select>
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Amount Received (₹)</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-3.5 text-gray-400" size={18}/>
                        <input 
                            type="number"
                            className="w-full pl-10 p-3 border-2 border-green-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-lg font-bold text-gray-800"
                            placeholder="0.00"
                            value={statusForm.amount}
                            onChange={e => setStatusForm({...statusForm, amount: e.target.value})}
                        />
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Remarks / Transaction ID</label>
                    <textarea 
                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                        placeholder="Optional note..."
                        rows="2"
                        value={statusForm.remarks}
                        onChange={e => setStatusForm({...statusForm, remarks: e.target.value})}
                    />
                 </div>

                 <button 
                   type="submit"
                   disabled={isSubmitting}
                   className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition flex justify-center items-center gap-2 shadow-lg"
                 >
                   {isSubmitting ? <Loader2 className="animate-spin"/> : <CheckCircle size={20}/>} Record Payment
                 </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- 3. HISTORY MODAL --- */}
      <AnimatePresence>
        {historyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[80vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                 <h3 className="font-bold text-lg text-gray-800">Payment History: {historyModal.first_name}</h3>
                 <button onClick={() => setHistoryModal(null)} className="p-2 hover:bg-gray-200 rounded-full"><X size={20}/></button>
              </div>
              <div className="p-6 overflow-y-auto">
                 {/* Transactions from feeMap */}
                 {feeMap[historyModal._id]?.transactions?.length > 0 ? (
                    <div className="space-y-3">
                       {feeMap[historyModal._id].transactions.slice().reverse().map((txn, i) => (
                          <div key={i} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                             <div>
                                <p className="font-bold text-gray-800">₹ {txn.amount.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">{new Date(txn.date).toLocaleDateString()} • {txn.mode} • {txn.year}</p>
                                {txn.remarks && <p className="text-xs text-gray-400 mt-1 italic">{txn.remarks}</p>}
                             </div>
                             <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{txn.transactionId}</span>
                          </div>
                       ))}
                    </div>
                 ) : (
                    <div className="text-center py-10">
                        <AlertCircle className="mx-auto text-gray-300 mb-2" size={32}/>
                        <p className="text-gray-400">No payments recorded yet.</p>
                    </div>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default StudentFeeMapping;