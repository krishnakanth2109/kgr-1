// src/features/students/StudentFeeManager.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentFees, updateFeeStructure, addPayment } from '../../api/feeApi';
import { getStudentById } from '../../api/studentApi';
import { 
    Save, ArrowLeft, Loader2, Printer, PlusCircle, History, 
    CreditCard, User, BookOpen 
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

// --- UTILS: Number to Words ---
const numToWords = (num) => {
    if (!num) return "";
    const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
    const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
    
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; 
    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str + 'Rupees Only';
};

const StudentFeeManager = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Fee Structure State
    const [structure, setStructure] = useState({
        year1: { admissionFee: 0, collegeFee: 0, hostelFee: 0, scholarship: 0, booksFee: 0, uniformFee: 0, clinicalFee: 0, cautionDeposit: 0, busFee: 0 },
        year2: { collegeFee: 0, hostelFee: 0, scholarship: 0, booksFee: 0, clinicalFee: 0, cautionDeposit: 0, busFee: 0 },
        year3: { collegeFee: 0, hostelFee: 0, scholarship: 0, booksFee: 0, uniformFee: 0, clinicalFee: 0, busFee: 0 }
    });

    // Payment Form State
    const [payment, setPayment] = useState({
        year: '1st',
        feeTowards: 'College Fee',
        amount: '',
        mode: 'Cash'
    });
    const [paymentsHistory, setPaymentsHistory] = useState([]);
    const [lastReceipt, setLastReceipt] = useState(null); // For printing

    const componentRef = useRef(); // For printing

    useEffect(() => {
        const loadData = async () => {
            try {
                const [studentData, feeData] = await Promise.all([
                    getStudentById(id),
                    getStudentFees(id)
                ]);
                setStudent(studentData);
                
                // Merge structure if exists
                if (feeData.structure) {
                    setStructure(prev => ({
                        year1: { ...prev.year1, ...feeData.structure.year1 },
                        year2: { ...prev.year2, ...feeData.structure.year2 },
                        year3: { ...prev.year3, ...feeData.structure.year3 },
                    }));
                }
                if (feeData.payments) {
                    setPaymentsHistory(feeData.payments.reverse()); // Show newest first
                }
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    // --- HANDLERS ---

    const handleStructureChange = (year, field, value) => {
        setStructure(prev => ({
            ...prev,
            [year]: { ...prev[year], [field]: Number(value) }
        }));
    };

    const handleSaveStructure = async () => {
        setSaving(true);
        try {
            await updateFeeStructure(id, structure);
            alert('Fee Structure Saved!');
        } catch (error) {
            alert('Failed to save structure.');
        } finally {
            setSaving(false);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if(!payment.amount || payment.amount <= 0) return alert("Enter valid amount");

        setSaving(true);
        try {
            const res = await addPayment(id, payment);
            setPaymentsHistory(res.payments.reverse());
            
            // Set last receipt for printing
            const newPayment = res.payments[0]; // Since we reversed, it's index 0, or check logic
            setLastReceipt({ ...payment, receiptNo: newPayment.receiptNo, date: new Date() });
            
            // Reset Form
            setPayment({ ...payment, amount: '' }); 
            alert('Payment Recorded Successfully!');
        } catch (error) {
            alert("Payment Failed");
        } finally {
            setSaving(false);
        }
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Receipt_${student?.admission_number}`,
        pageStyle: `
            @page { size: A6; margin: 10mm; }
            @media print { body { -webkit-print-color-adjust: exact; } }
        `
    });

    const InputRow = ({ label, year, field }) => (
        <div className="flex items-center justify-between gap-2 mb-2">
            <label className="text-xs font-semibold text-gray-600 w-1/3">{label}:</label>
            <input 
                type="number" 
                value={structure[year][field]} 
                onChange={(e) => handleStructureChange(year, field, e.target.value)}
                className="w-2/3 p-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            />
        </div>
    );

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* 1. Header & Student Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft /></button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Fee Manager</h1>
                                <p className="text-sm text-gray-500">Manage Structure & Payments</p>
                            </div>
                        </div>
                        <div className="flex gap-4 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 mt-4 md:mt-0">
                            <div>
                                <span className="block text-xs text-blue-500 uppercase font-bold">Admission No</span>
                                <span className="font-mono text-gray-800 font-bold">{student?.admission_number}</span>
                            </div>
                            <div className="border-l border-blue-200 pl-4">
                                <span className="block text-xs text-blue-500 uppercase font-bold">Student Name</span>
                                <span className="text-gray-800 font-medium">{student?.first_name} {student?.last_name}</span>
                            </div>
                            <div className="border-l border-blue-200 pl-4">
                                <span className="block text-xs text-blue-500 uppercase font-bold">Group/Course</span>
                                <span className="text-gray-800 font-medium">{student?.program}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* 2. Fee Structure Inputs (Left Column) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold flex items-center gap-2"><BookOpen size={20} className="text-blue-600"/> Fee Structure Input</h2>
                                <button onClick={handleSaveStructure} disabled={saving} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700">
                                    {saving ? <Loader2 className="animate-spin h-4 w-4"/> : <Save size={16} />} Save Structure
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* 1st Year */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="font-bold text-gray-700 border-b pb-2 mb-3">1st Year</h3>
                                    <InputRow year="year1" field="admissionFee" label="Admission Fee" />
                                    <InputRow year="year1" field="collegeFee" label="College Fee" />
                                    <InputRow year="year1" field="hostelFee" label="Hostel Fee" />
                                    <InputRow year="year1" field="scholarship" label="Scholarship" />
                                    <InputRow year="year1" field="booksFee" label="Books Fee" />
                                    <InputRow year="year1" field="uniformFee" label="Uniform Fee" />
                                    <InputRow year="year1" field="clinicalFee" label="Clinical Fee" />
                                    <InputRow year="year1" field="cautionDeposit" label="Caution Deposit" />
                                    <InputRow year="year1" field="busFee" label="Bus Fee" />
                                </div>

                                {/* 2nd Year */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="font-bold text-gray-700 border-b pb-2 mb-3">2nd Year</h3>
                                    <InputRow year="year2" field="collegeFee" label="College Fee" />
                                    <InputRow year="year2" field="hostelFee" label="Hostel Fee" />
                                    <InputRow year="year2" field="scholarship" label="Scholarship" />
                                    <InputRow year="year2" field="booksFee" label="Books Fee" />
                                    <InputRow year="year2" field="clinicalFee" label="Clinical Fee" />
                                    <InputRow year="year2" field="cautionDeposit" label="Caution Deposit" />
                                    <InputRow year="year2" field="busFee" label="Bus Fee" />
                                </div>

                                {/* 3rd Year */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="font-bold text-gray-700 border-b pb-2 mb-3">3rd Year</h3>
                                    <InputRow year="year3" field="collegeFee" label="College Fee" />
                                    <InputRow year="year3" field="hostelFee" label="Hostel Fee" />
                                    <InputRow year="year3" field="scholarship" label="Scholarship" />
                                    <InputRow year="year3" field="booksFee" label="Books Fee" />
                                    <InputRow year="year3" field="uniformFee" label="Uniform Fee" />
                                    <InputRow year="year3" field="clinicalFee" label="Clinical Fee" />
                                    <InputRow year="year3" field="busFee" label="Bus Fee" />
                                </div>
                            </div>
                        </div>

                        {/* 4. Payment History Table */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><History size={20} className="text-orange-600"/> Payment History</h2>
                            <div className="overflow-x-auto max-h-60">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-gray-600 sticky top-0">
                                        <tr>
                                            <th className="py-2 px-3">Date</th>
                                            <th className="py-2 px-3">Receipt No</th>
                                            <th className="py-2 px-3">Year</th>
                                            <th className="py-2 px-3">Fee Towards</th>
                                            <th className="py-2 px-3">Mode</th>
                                            <th className="py-2 px-3 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {paymentsHistory.map((pay, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="py-2 px-3">{new Date(pay.date).toLocaleDateString()}</td>
                                                <td className="py-2 px-3 font-mono text-xs">{pay.receiptNo}</td>
                                                <td className="py-2 px-3">{pay.year}</td>
                                                <td className="py-2 px-3">{pay.feeTowards}</td>
                                                <td className="py-2 px-3">{pay.mode}</td>
                                                <td className="py-2 px-3 text-right font-bold">₹{pay.amount}</td>
                                            </tr>
                                        ))}
                                        {paymentsHistory.length === 0 && <tr><td colSpan="6" className="text-center py-4 text-gray-400">No payments recorded.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* 3. Fee Payment Form (Right Column) */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 h-fit">
                            <h2 className="text-lg font-bold mb-4 text-blue-800 flex items-center gap-2">
                                <CreditCard size={20} /> Fee Payment
                            </h2>
                            <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
                                    <input type="text" value={new Date().toLocaleDateString()} disabled className="w-full p-2 bg-gray-100 border rounded text-gray-500" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Year</label>
                                        <select 
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                            value={payment.year}
                                            onChange={(e) => setPayment({...payment, year: e.target.value})}
                                        >
                                            <option>1st</option><option>2nd</option><option>3rd</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Mode</label>
                                        <select 
                                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                            value={payment.mode}
                                            onChange={(e) => setPayment({...payment, mode: e.target.value})}
                                        >
                                            <option>Cash</option><option>Online</option><option>Cheque</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Fee Towards</label>
                                    <select 
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                        value={payment.feeTowards}
                                        onChange={(e) => setPayment({...payment, feeTowards: e.target.value})}
                                    >
                                        <option>Admission Fee</option>
                                        <option>College Fee</option>
                                        <option>Hostel Fee</option>
                                        <option>Scholarship</option>
                                        <option>Books Fee</option>
                                        <option>Uniform Fee</option>
                                        <option>Clinical Fee</option>
                                        <option>Caution Deposit</option>
                                        <option>Bus Fee</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Amount (₹)</label>
                                    <input 
                                        type="number" 
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 font-bold text-lg"
                                        placeholder="0.00"
                                        value={payment.amount}
                                        onChange={(e) => setPayment({...payment, amount: e.target.value})}
                                    />
                                </div>

                                <div className="bg-gray-50 p-2 rounded border border-gray-200 min-h-[40px]">
                                    <span className="text-xs text-gray-400 block">Amount in words:</span>
                                    <span className="text-sm font-medium text-gray-700 italic">
                                        {payment.amount ? numToWords(payment.amount) : "..."}
                                    </span>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={saving}
                                    className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition flex justify-center items-center gap-2"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={18}/> : <PlusCircle size={18} />} 
                                    Record Payment
                                </button>
                            </form>
                        </div>

                        {/* Print Button (Only active if receipt exists) */}
                        {lastReceipt && (
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                                <p className="text-sm text-gray-600 mb-3">Receipt Generated: <strong>{lastReceipt.receiptNo}</strong></p>
                                <button 
                                    onClick={handlePrint}
                                    className="w-full bg-gray-800 text-white py-2 rounded-lg font-bold hover:bg-black transition flex justify-center items-center gap-2"
                                >
                                    <Printer size={18} /> Print Receipt (A6)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- HIDDEN RECEIPT COMPONENT (FOR PRINTING) --- */}
            <div style={{ display: 'none' }}>
                <div ref={componentRef} className="p-4 border font-sans text-sm" style={{ width: '105mm', height: '148mm' }}>
                    <div className="text-center border-b pb-2 mb-2">
                        <h2 className="text-xl font-bold">KGR COLLEGE</h2>
                        <p className="text-xs">Vivek St, Sri Vidya Colony, Kakinada</p>
                        <h3 className="font-bold mt-1 text-md underline">FEE RECEIPT</h3>
                    </div>
                    
                    <div className="flex justify-between text-xs mb-2">
                        <span><strong>No:</strong> {lastReceipt?.receiptNo}</span>
                        <span><strong>Date:</strong> {new Date().toLocaleDateString()}</span>
                    </div>

                    <div className="space-y-2 text-xs">
                        <div className="flex"><strong className="w-24">Name:</strong> <span>{student?.first_name} {student?.last_name}</span></div>
                        <div className="flex"><strong className="w-24">Adm No:</strong> <span>{student?.admission_number}</span></div>
                        <div className="flex"><strong className="w-24">Course:</strong> <span>{student?.program}</span></div>
                        <div className="flex"><strong className="w-24">Year:</strong> <span>{lastReceipt?.year} Year</span></div>
                        <div className="flex"><strong className="w-24">Towards:</strong> <span>{lastReceipt?.feeTowards}</span></div>
                        <div className="flex"><strong className="w-24">Payment Mode:</strong> <span>{lastReceipt?.mode}</span></div>
                    </div>

                    <div className="mt-4 border-t border-b py-2 flex justify-between items-center">
                        <strong className="text-sm">Amount Paid:</strong>
                        <span className="text-lg font-bold">₹ {lastReceipt?.amount}/-</span>
                    </div>

                    <div className="mt-2 text-xs italic text-gray-600">
                        {numToWords(lastReceipt?.amount)}
                    </div>

                    <div className="mt-8 flex justify-between text-xs">
                        <span>Student Sig.</span>
                        <span>Cashier Sig.</span>
                    </div>
                    
                    <div className="mt-4 text-[10px] text-center text-gray-400">
                        This is a computer generated receipt.
                    </div>
                </div>
            </div>

        </div>
    );
};

export default StudentFeeManager;