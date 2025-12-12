import React, { useState, useEffect } from 'react';
import { 
  CreditCard, AlertCircle, CheckCircle, ArrowRight, FileText,
  Loader2, DollarSign, Calendar, Building2, Download
} from 'lucide-react';

const StudentFeesPay = () => {
  const student = JSON.parse(sessionStorage.getItem('student-user') || '{}');
  const token = sessionStorage.getItem('student-token');
  
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    year: '',
    feeTowards: '',
    amount: 0,
    mode: 'Online Banking'
  });
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/fees/${student.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setFees(data);
    } catch (error) {
      console.error('Failed to fetch fees:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDueInvoices = () => {
    if (!fees || !fees.structure) return [];
    
    const invoices = [];
    const currentYear = new Date().getFullYear();
    
    Object.entries(fees.structure).forEach(([yearKey, yearFees]) => {
      Object.entries(yearFees || {}).forEach(([feeType, amount]) => {
        if (amount > 0) {
          const paid = fees.payments?.filter(p => 
            p.year === yearKey && p.feeTowards === feeType
          ).reduce((sum, p) => sum + p.amount, 0) || 0;
          
          const balance = amount - paid;
          
          if (balance > 0) {
            invoices.push({
              id: `${yearKey}-${feeType}`,
              year: yearKey,
              title: feeType.replace(/([A-Z])/g, ' $1').trim(),
              dueDate: `${currentYear}-12-31`,
              amount: balance,
              originalAmount: amount,
              paid: paid,
              status: balance > 0 ? 'Pending' : 'Paid'
            });
          }
        }
      });
    });
    
    return invoices;
  };

  const handlePayNow = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentForm({
      year: invoice.year,
      feeTowards: invoice.title.replace(/\s+/g, ''),
      amount: invoice.amount,
      mode: 'Online Banking'
    });
    setShowPaymentModal(true);
    setMessage({ type: '', text: '' });
  };

  const processPayment = async () => {
    setProcessing(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await fetch(`/api/fees/payment/${student.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentForm)
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Payment successful! Receipt generated.' });
        await fetchFees();
        setTimeout(() => {
          setShowPaymentModal(false);
          setSelectedInvoice(null);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: 'Payment failed. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check your connection.' });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-amber-500" size={48} />
      </div>
    );
  }

  const dueFees = calculateDueInvoices();
  const totalDue = dueFees.reduce((acc, curr) => acc + curr.amount, 0);
  const nextDueDate = dueFees.length > 0 ? new Date(dueFees[0].dueDate) : null;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Fee Payments</h1>
          <p className="text-gray-500 text-sm">Manage your outstanding tuition and fees.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl border-2 border-red-200 shadow-lg">
          <p className="text-red-600 font-medium text-sm flex items-center gap-2">
            <AlertCircle size={16} /> Total Outstanding
          </p>
          <p className="text-4xl font-bold text-gray-800 mt-2">₹{totalDue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{dueFees.length} pending invoice(s)</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-lg">
          <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
            <Calendar size={16} /> Next Due Date
          </p>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {nextDueDate ? nextDueDate.toLocaleDateString() : 'N/A'}
          </p>
          <p className="text-xs text-orange-500 mt-1 font-medium">
            {nextDueDate && Math.ceil((nextDueDate - new Date()) / (1000 * 60 * 60 * 24))} Days Remaining
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-lg">
          <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
            <Building2 size={16} /> Payment Method
          </p>
          <div className="flex items-center gap-3 mt-3">
            <div className="h-10 w-16 bg-gradient-to-r from-amber-400 to-yellow-500 rounded flex items-center justify-center text-xs font-bold text-white shadow-md">
              UPI
            </div>
            <span className="text-sm text-gray-600">Online / Card / Cash</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border-2 border-amber-100 overflow-hidden">
        <div className="p-6 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
          <h3 className="font-bold text-xl text-gray-800">Pending Invoices</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {dueFees.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">All Paid Up!</h3>
              <p className="text-gray-500">You have no pending fee payments.</p>
            </div>
          ) : (
            dueFees.map((fee) => (
              <div 
                key={fee.id} 
                className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-amber-50 transition-colors"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="p-3 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 text-amber-600">
                    <FileText size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-lg">{fee.title}</h4>
                    <p className="text-sm text-gray-500">
                      Year: {fee.year.replace('year', 'Year ')} • Due: {fee.dueDate}
                    </p>
                    <div className="mt-1">
                      <div className="text-xs text-gray-400">
                        Paid: ₹{fee.paid.toLocaleString()} / ₹{fee.originalAmount.toLocaleString()}
                      </div>
                      <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
                          style={{ width: `${(fee.paid / fee.originalAmount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-600 uppercase">
                      {fee.status}
                    </span>
                    <p className="font-bold text-2xl text-gray-800 mt-1">₹{fee.amount.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => handlePayNow(fee)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <CreditCard size={28} /> Payment Details
              </h2>
              <p className="text-amber-100 text-sm mt-1">Complete your fee payment securely</p>
            </div>
            
            {message.text && (
              <div className={`mx-6 mt-6 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message.text}
              </div>
            )}
            
            <div className="p-6 space-y-4">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Invoice</span>
                  <span className="font-bold text-gray-800">{selectedInvoice?.title}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Academic Year</span>
                  <span className="font-bold text-gray-800">{selectedInvoice?.year.replace('year', 'Year ')}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-amber-300">
                  <span className="text-lg font-semibold text-gray-700">Amount to Pay</span>
                  <span className="text-3xl font-bold text-amber-600">₹{paymentForm.amount.toLocaleString()}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount</label>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseInt(e.target.value) || 0 })}
                  max={selectedInvoice?.amount}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-lg font-semibold"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can pay partial amount. Max: ₹{selectedInvoice?.amount.toLocaleString()}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
                <select
                  value={paymentForm.mode}
                  onChange={(e) => setPaymentForm({ ...paymentForm, mode: e.target.value })}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                >
                  <option value="Online Banking">Online Banking</option>
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedInvoice(null);
                  }}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  disabled={processing || paymentForm.amount <= 0}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg font-bold hover:from-amber-600 hover:to-yellow-600 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                  {processing ? (
                    <><Loader2 className="animate-spin" size={20} /> Processing...</>
                  ) : (
                    <><CheckCircle size={20} /> Confirm Payment</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFeesPay;