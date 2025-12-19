import React, { useState, useEffect } from 'react';
import { 
  Search, CheckCircle, X, Layers, DollarSign, Loader2, 
  GraduationCap, MoreVertical, FileText, CreditCard, 
  History, AlertCircle, RefreshCw, Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Ensure this is installed via npm install jspdf-autotable

// --- FIXED IMPORT PATH ---
import api from '../../../api/api'; 

const StudentFeeGenerator = () => {
  // --- State ---
  const [students, setStudents] = useState([]);
  const [feeMap, setFeeMap] = useState({});
  const [structures, setStructures] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [generateModal, setGenerateModal] = useState(null);
  const [paymentModal, setPaymentModal] = useState(null);
  const [historyModal, setHistoryModal] = useState(null);
  
  // Forms
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // --- 1. Fetching Logic ---
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async (forceRefresh = false) => {
    setLoading(true);
    try {
      // 1. STUDENTS
      let studentList = [];
      const cachedStudents = sessionStorage.getItem('kgr_students');
      if (cachedStudents && !forceRefresh) {
        studentList = JSON.parse(cachedStudents);
        setStudents(studentList);
      } else {
        const studentRes = await api.get('/students');
        studentList = studentRes.data.students || [];
        setStudents(studentList);
        sessionStorage.setItem('kgr_students', JSON.stringify(studentList));
      }

      // 2. FEE STRUCTURES
      let structData = [];
      const cachedStructs = sessionStorage.getItem('kgr_structures');
      if (cachedStructs && !forceRefresh) {
        structData = JSON.parse(cachedStructs);
        setStructures(structData);
      } else {
        try {
          const structRes = await api.get('/fee-structures'); 
          structData = structRes.data;
          setStructures(structData);
          sessionStorage.setItem('kgr_structures', JSON.stringify(structData));
        } catch (err) {
          console.warn("Fee structures endpoint failed.");
        }
      }

      // 3. STUDENT FEES
      const cachedFees = sessionStorage.getItem('kgr_feeMap');
      if (cachedFees && !forceRefresh) {
        setFeeMap(JSON.parse(cachedFees));
      } else {
        const fees = {};
        await Promise.all(studentList.map(async (stu) => {
          try {
            const res = await api.get(`/student-fees/${stu._id}`);
            fees[stu._id] = res.data;
          } catch (e) {
            fees[stu._id] = null;
          }
        }));
        setFeeMap(fees);
        sessionStorage.setItem('kgr_feeMap', JSON.stringify(fees));
      }

    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateFeeCache = (studentId, newFeeRecord) => {
    setFeeMap(prev => {
        const newMap = { ...prev, [studentId]: newFeeRecord };
        sessionStorage.setItem('kgr_feeMap', JSON.stringify(newMap));
        return newMap;
    });
  };

  // --- 2. HELPER: Number to Words ---
  const numberToWords = (num) => {
    if (!num || num === 0) return "Zero Only";
    const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
    const b = ['', '', 'Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
    
    const inWords = (n) => {
        if ((n = n.toString()).length > 9) return 'overflow';
        const n_array = ('000000000' + n).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n_array) return; 
        let str = '';
        str += (n_array[1] != 0) ? (a[Number(n_array[1])] || b[n_array[1][0]] + ' ' + a[n_array[1][1]]) + 'Crore ' : '';
        str += (n_array[2] != 0) ? (a[Number(n_array[2])] || b[n_array[2][0]] + ' ' + a[n_array[2][1]]) + 'Lakh ' : '';
        str += (n_array[3] != 0) ? (a[Number(n_array[3])] || b[n_array[3][0]] + ' ' + a[n_array[3][1]]) + 'Thousand ' : '';
        str += (n_array[4] != 0) ? (a[Number(n_array[4])] || b[n_array[4][0]] + ' ' + a[n_array[4][1]]) + 'Hundred ' : '';
        str += (n_array[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n_array[5])] || b[n_array[5][0]] + ' ' + a[n_array[5][1]]) : '';
        return str;
    }
    return inWords(num) + " Rupees Only";
  };

  // --- 3. PDF GENERATOR (A6 SIZE - PROFESSIONAL STYLE) ---
  const generateReceiptPDF = (student, feeRecord) => {
    if (!feeRecord) return alert("No fee record found.");

    // PDF Config
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a6' // 105mm x 148mm
    });

    // Colors & Fonts
    const blueColor = [30, 58, 138];   // Deep Blue #1e3a8a
    const orangeColor = [234, 88, 12]; // Orange #ea580c
    const grayColor = [107, 114, 128]; // Gray
    const lightBg = [243, 244, 246];   // Light Gray BG

    // --- A. HEADER ---
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...blueColor);
    doc.setFontSize(12);
    // Center Align Helper
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerText = (text, y) => {
        const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        doc.text(text, (pageWidth - textWidth) / 2, y);
    };

    centerText("KGR VOCATIONAL JUNIOR COLLEGE", 10);
    
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayColor);
    centerText("Recognized by Govt. of AP | 12-34-56, Main Road, Guntur", 14);

    // Orange Line
    doc.setDrawColor(...orangeColor);
    doc.setLineWidth(0.5);
    doc.line(5, 17, 100, 17);

    // Title Box
    doc.setFillColor(...blueColor);
    doc.roundedRect(30, 17, 45, 6, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("FEE RECEIPT", 52.5, 21, { align: 'center' });

    // --- B. STUDENT DETAILS (Box) ---
    const startY = 26;
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(5, startY, 95, 28, 2, 2); // Container

    // Photo Placeholder
    doc.setDrawColor(...orangeColor);
    doc.rect(78, startY + 3, 18, 22);
    doc.setFontSize(6);
    doc.setTextColor(...grayColor);
    doc.text("PHOTO", 87, startY + 15, { align: 'center' });

    // Fields Helper
    const drawField = (label, value, x, y) => {
        doc.setFontSize(7);
        doc.setTextColor(...grayColor);
        doc.text(label, x, y);
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text(value || "-", x, y + 3.5);
    };

    // 5 Key Fields
    const col1 = 8;
    const col2 = 45;
    
    // Row 1
    drawField("Admission No.", student.admission_number, col1, startY + 5);
    drawField("Date", new Date().toLocaleDateString(), col2, startY + 5);

    // Row 2
    drawField("Student Name", student.student_name, col1, startY + 13);
    
    // Row 3
    drawField("Father's Name", student.father_name, col1, startY + 21);
    drawField("Course / Group", student.course_type, col2, startY + 21);

    // --- C. FINANCIAL SUMMARY (Table) ---
    const tableY = startY + 32;
    
    // Calculations
    const total = feeRecord.totalPayable;
    const paid = feeRecord.totalPaid;
    const due = (total - feeRecord.discount) - paid;
    
    // Using autoTable for clean layout
    doc.autoTable({
        startY: tableY,
        head: [['Description', 'Amount (Rs)']],
        body: [
            ['Total Fee Payable', total.toLocaleString()],
            ['Scholarship / Discount', feeRecord.discount ? `-${feeRecord.discount}` : '0'],
            ['Net Payable', (total - feeRecord.discount).toLocaleString()],
            ['Total Paid (Till Date)', paid.toLocaleString()],
            ['Balance Due', due.toLocaleString()]
        ],
        theme: 'grid',
        headStyles: { fillColor: blueColor, fontSize: 8, halign: 'left' },
        bodyStyles: { fontSize: 8, textColor: 50 },
        columnStyles: { 
            0: { cellWidth: 60 },
            1: { cellWidth: 35, halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: 5, right: 5 },
        tableWidth: 95
    });

    // --- D. PAYMENT DETAILS (Current Transaction) ---
    let finalY = doc.lastAutoTable.finalY + 5;
    
    doc.setFillColor(...lightBg);
    doc.rect(5, finalY, 95, 12, 'F'); // Background box
    
    doc.setFontSize(8);
    doc.setTextColor(...blueColor);
    doc.setFont("helvetica", "bold");
    doc.text("CURRENT PAYMENT DETAILS:", 8, finalY + 4);

    // Get last transaction info
    const lastTxn = feeRecord.transactions && feeRecord.transactions.length > 0 
        ? feeRecord.transactions[feeRecord.transactions.length - 1] 
        : { amount: 0, mode: 'N/A' };

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`Amount Paid: Rs. ${lastTxn.amount}/-`, 8, finalY + 9);
    doc.text(`Mode: ${lastTxn.mode}`, 60, finalY + 9);

    // Amount in Words
    finalY += 16;
    doc.setFontSize(7);
    doc.setTextColor(...grayColor);
    doc.text("Amount in words:", 5, finalY);
    
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "italic");
    const words = numberToWords(lastTxn.amount);
    doc.text(words, 25, finalY);
    
    // Underline words
    doc.setDrawColor(200, 200, 200);
    doc.line(25, finalY + 1, 100, finalY + 1);

    // --- E. FOOTER & SIGNATURE ---
    const footerY = 138;
    
    // Signature Line
    doc.setDrawColor(0, 0, 0);
    doc.line(70, footerY, 100, footerY);
    
    doc.setFontSize(6);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Authorized Signature", 85, footerY + 3, { align: 'center' });

    // Disclaimer / Timestamp
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayColor);
    doc.text("* Computer generated receipt, no seal required.", 5, footerY + 3);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 5, footerY + 6);

    // Save
    doc.save(`${student.admission_number}_FeeReceipt.pdf`);
  };

  // --- 4. Handlers ---
  const handleGenerateFee = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const selectedStruct = structures.find(s => s._id === formData.feeStructureId);
      const payload = {
        studentId: generateModal._id,
        feeStructureId: formData.feeStructureId,
        totalPayable: selectedStruct.totalAmount,
        discount: Number(formData.discount || 0)
      };
      
      const res = await api.post('/student-fees/assign', payload);
      updateFeeCache(generateModal._id, res.data);
      setGenerateModal(null);
      alert("Fee Structure Generated!");
    } catch (error) {
      console.error(error);
      alert("Failed to assign fee.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        studentId: paymentModal._id,
        amount: Number(formData.amount),
        mode: formData.mode,
        remarks: formData.remarks,
        transactionId: formData.transactionId
      };
      const res = await api.post('/student-fees/pay', payload);
      updateFeeCache(paymentModal._id, res.data);
      setPaymentModal(null);
      alert("Payment Recorded!");
    } catch (error) {
      console.error(error);
      alert("Payment failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const getFilteredStudents = () => {
    const q = searchQuery.toLowerCase();
    return students.filter(s => 
      (s.student_name && s.student_name.toLowerCase().includes(q)) || 
      (s.admission_number && s.admission_number.toLowerCase().includes(q))
    );
  };

  const calculateStatus = (feeRecord) => {
    if (!feeRecord) return { label: 'Not Generated', color: 'bg-gray-100 text-gray-500' };
    const net = feeRecord.totalPayable - (feeRecord.discount || 0);
    const paid = feeRecord.totalPaid;
    if (paid >= net && net > 0) return { label: 'Paid', color: 'bg-green-100 text-green-700 border-green-200' };
    if (paid > 0) return { label: 'Partial', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
    return { label: 'Pending', color: 'bg-red-100 text-red-700 border-red-200' };
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50/50 font-sans" onClick={() => setActiveDropdown(null)}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <DollarSign className="text-indigo-600" size={32} /> Student Fee Manager
          </h1>
          <p className="text-gray-500 mt-1 ml-10">Manage fees, payments, and print A6 Receipts.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
            <button 
                onClick={() => { sessionStorage.clear(); fetchInitialData(true); }} 
                className="p-2.5 bg-white border rounded-xl hover:bg-gray-50 text-gray-600 transition"
                title="Refresh Data"
            >
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
            <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-3 text-gray-400" size={18}/>
                <input
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white"
                    placeholder="Search Student..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-100 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-5">Student Info</th>
                <th className="p-5">Course</th>
                <th className="p-5">Fee Structure</th>
                <th className="p-5 text-right">Total Payable</th>
                <th className="p-5 text-right">Paid</th>
                <th className="p-5 text-right">Balance</th>
                <th className="p-5 text-center">Status</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="8" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" size={32}/></td></tr>
              ) : getFilteredStudents().length === 0 ? (
                <tr><td colSpan="8" className="p-10 text-center text-gray-400">No students found.</td></tr>
              ) : (
                getFilteredStudents().map((stu) => {
                  const fee = feeMap[stu._id];
                  const structName = fee?.feeStructureId?.name || "Not Assigned";
                  const total = fee ? (fee.totalPayable - fee.discount) : 0;
                  const paid = fee?.totalPaid || 0;
                  const due = total - paid;
                  const statusInfo = calculateStatus(fee);

                  return (
                    <tr key={stu._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-5">
                        <div className="font-bold text-gray-900">{stu.student_name}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">{stu.admission_number}</div>
                      </td>
                      <td className="p-5">
                        <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded text-xs font-medium">{stu.course_type}</span>
                      </td>
                      <td className="p-5">
                        {fee ? (
                           <div className="flex items-center gap-1.5 text-indigo-700 font-medium"><Layers size={14}/> {structName}</div>
                        ) : (<span className="text-gray-400 italic text-xs">--</span>)}
                      </td>
                      <td className="p-5 text-right font-medium text-gray-900">{fee ? `₹${total.toLocaleString()}` : '-'}</td>
                      <td className="p-5 text-right text-green-600 font-medium">{fee ? `₹${paid.toLocaleString()}` : '-'}</td>
                      <td className="p-5 text-right font-bold text-red-500">{fee ? `₹${due.toLocaleString()}` : '-'}</td>
                      <td className="p-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}>{statusInfo.label}</span>
                      </td>
                      <td className="p-5 text-center relative">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === stu._id ? null : stu._id); }}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                        >
                            <MoreVertical size={18}/>
                        </button>

                        {activeDropdown === stu._id && (
                             <div className="absolute right-10 top-2 w-56 bg-white shadow-xl rounded-lg border border-gray-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <button 
                                    onClick={() => { setGenerateModal(stu); setFormData({ feeStructureId: '', discount: fee?.discount || 0 }); }}
                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50"
                                >
                                    <GraduationCap size={16} className="text-indigo-500"/> {fee ? 'Update Structure' : 'Generate Fee'}
                                </button>
                                
                                {fee && (
                                    <>
                                        <button 
                                            onClick={() => { setPaymentModal(stu); setFormData({ amount: '', mode: 'Cash', remarks: '' }); }}
                                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <CreditCard size={16} className="text-green-500"/> Collect Payment
                                        </button>
                                        <button 
                                            onClick={() => generateReceiptPDF(stu, fee)}
                                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <Printer size={16} className="text-blue-500"/> Print Receipt (A6)
                                        </button>
                                        <button 
                                            onClick={() => setHistoryModal(stu)}
                                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <History size={16} className="text-orange-500"/> View History
                                        </button>
                                    </>
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
      </div>

      {/* --- MODALS (Generate, Payment, History) --- */}
      {/* 1. Generate Fee Modal */}
      <AnimatePresence>
        {generateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
               <div className="bg-indigo-600 p-6 flex justify-between items-center text-white">
                  <h3 className="text-lg font-bold flex items-center gap-2"><FileText/> Generate Fee Structure</h3>
                  <button onClick={() => setGenerateModal(null)} className="hover:bg-indigo-500 p-1 rounded"><X/></button>
               </div>
               <form onSubmit={handleGenerateFee} className="p-6 space-y-4">
                  <div className="bg-indigo-50 p-3 rounded-lg text-sm text-indigo-900 mb-2">
                     Generating fee for <span className="font-bold">{generateModal.student_name}</span>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Structure</label>
                     <select required className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-500" value={formData.feeStructureId} onChange={e => setFormData({...formData, feeStructureId: e.target.value})}>
                        <option value="">-- Select --</option>
                        {structures.map(s => <option key={s._id} value={s._id}>{s.name} (₹{s.totalAmount})</option>)}
                     </select>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount (₹)</label>
                     <input type="number" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-500" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} placeholder="0"/>
                  </div>
                  <button disabled={submitting} type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 flex justify-center gap-2">{submitting ? <Loader2 className="animate-spin"/> : <CheckCircle/>} Save Fee Structure</button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Payment Modal */}
      <AnimatePresence>
        {paymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
               <div className="bg-green-600 p-6 flex justify-between items-center text-white">
                  <h3 className="text-lg font-bold flex items-center gap-2"><CreditCard/> Collect Payment</h3>
                  <button onClick={() => setPaymentModal(null)} className="hover:bg-green-500 p-1 rounded"><X/></button>
               </div>
               <form onSubmit={handlePayment} className="p-6 space-y-4">
                  <div className="bg-green-50 p-3 rounded-lg text-sm text-green-900 mb-2 flex justify-between">
                     <span>Student: <b>{paymentModal.student_name}</b></span>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount (₹)</label>
                     <div className="relative">
                        <DollarSign className="absolute left-3 top-3 text-gray-400" size={16}/>
                        <input required type="number" className="w-full pl-9 p-3 border border-gray-300 rounded-lg outline-none focus:border-green-500 font-bold text-lg" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0.00"/>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mode</label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg outline-none" value={formData.mode} onChange={e => setFormData({...formData, mode: e.target.value})}>
                            <option value="Cash">Cash</option>
                            <option value="Online">Online</option>
                            <option value="UPI">UPI</option>
                            <option value="Cheque">Cheque</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Txn ID</label>
                        <input type="text" className="w-full p-3 border border-gray-300 rounded-lg outline-none" placeholder="Auto-gen if empty" value={formData.transactionId || ''} onChange={e => setFormData({...formData, transactionId: e.target.value})}/>
                     </div>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Remarks</label>
                     <textarea className="w-full p-3 border border-gray-300 rounded-lg outline-none" rows="2" placeholder="Optional details..." value={formData.remarks || ''} onChange={e => setFormData({...formData, remarks: e.target.value})}/>
                  </div>
                  <button disabled={submitting} type="submit" className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 flex justify-center gap-2">{submitting ? <Loader2 className="animate-spin"/> : <CheckCircle/>} Confirm Payment</button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. History Modal */}
      <AnimatePresence>
        {historyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
               <div className="bg-gray-800 p-5 flex justify-between items-center text-white">
                  <h3 className="text-lg font-bold flex items-center gap-2"><History/> Transaction History</h3>
                  <div className="flex gap-2">
                    <button onClick={() => generateReceiptPDF(historyModal, feeMap[historyModal._id])} className="hover:bg-gray-700 p-2 rounded text-xs flex items-center gap-1 bg-gray-700 border border-gray-600"><Printer size={14}/> Print Receipt (A6)</button>
                    <button onClick={() => setHistoryModal(null)} className="hover:bg-gray-700 p-2 rounded"><X/></button>
                  </div>
               </div>
               <div className="p-4 bg-gray-50 border-b flex justify-between text-sm">
                  <span className="font-bold text-gray-700">{historyModal.student_name}</span>
                  <span className="text-gray-500">{historyModal.admission_number}</span>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {feeMap[historyModal._id]?.transactions?.length > 0 ? (
                      feeMap[historyModal._id].transactions.slice().reverse().map((txn, idx) => (
                        <div key={idx} className="flex justify-between items-start p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                            <div>
                                <div className="text-green-600 font-bold text-lg">₹{txn.amount.toLocaleString()}</div>
                                <div className="text-xs text-gray-400 mt-1">{new Date(txn.date).toLocaleString()}</div>
                                {txn.remarks && <div className="text-xs text-gray-600 mt-1 italic">"{txn.remarks}"</div>}
                            </div>
                            <div className="text-right">
                                <span className="block text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded mb-1">{txn.mode}</span>
                                <span className="text-[10px] text-gray-400 font-mono">{txn.transactionId}</span>
                            </div>
                        </div>
                      ))
                  ) : (
                      <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                          <AlertCircle size={32} className="mb-2 opacity-50"/>
                          <p>No transactions found.</p>
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

export default StudentFeeGenerator;