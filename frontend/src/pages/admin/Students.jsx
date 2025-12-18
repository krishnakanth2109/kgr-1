import React, { useState, useEffect } from 'react';
import { 
  fetchStudents, createStudent, updateStudent, deleteStudent 
} from '../../api/studentApi'; 
import { 
  Plus, Edit3, Trash2, Search, ArrowLeft, Printer, Save, 
  User, MapPin, BookOpen, CreditCard, Loader2, GraduationCap, 
  Key, Check, AlertCircle, Phone, Calendar, Mail, FileText,
  BadgeCheck, School
} from 'lucide-react';

const Students = () => {
  const [view, setView] = useState('list'); 
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [newCredentials, setNewCredentials] = useState(null); 
  const [filters, setFilters] = useState({ search: '', course_type: '' });

  useEffect(() => { if (view === 'list') loadData(); }, [view, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchStudents(filters);
      setStudents(Array.isArray(data) ? data : data.students || []);
    } catch (err) { 
      console.error("Load Error:", err);
      setStudents([]); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleEdit = (s) => { setCurrentStudent(s); setView('form'); };
  const handleCreate = () => { setCurrentStudent(null); setView('form'); };
  const handlePrint = (s) => { setCurrentStudent(s); setView('print'); };
  
  const handleDelete = async (id) => { 
    if (window.confirm("Are you sure you want to delete this student record?")) { 
      try { await deleteStudent(id); loadData(); } catch (err) { alert("Delete failed"); }
    } 
  };

  const handleFormSuccess = (responseData) => {
    if (responseData && responseData.generatedPassword) {
      setNewCredentials({
        name: responseData.student_name || responseData.first_name,
        id: responseData.admission_number,
        password: responseData.generatedPassword,
        fullData: responseData
      });
      setView('credentials'); 
    } else {
      setView('list');
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-700">
      {view === 'list' && (
        <ListView 
          students={students} loading={loading} filters={filters} setFilters={setFilters}
          onCreate={handleCreate} onEdit={handleEdit} onDelete={handleDelete} onPrint={handlePrint}
        />
      )}
      {view === 'form' && (
        <FormView 
          initialData={currentStudent} onCancel={() => setView('list')} onSuccess={handleFormSuccess}
        />
      )}
      {view === 'credentials' && newCredentials && (
        <CredentialsModal 
          data={newCredentials} onClose={() => { setNewCredentials(null); setView('list'); }}
          onPrint={() => handlePrint(newCredentials.fullData)}
        />
      )}
      {view === 'print' && <PrintView student={currentStudent} onBack={() => setView('list')} />}
    </div>
  );
};

/* ==========================
   1. MODERN LIST VIEW
   ========================== */
const ListView = ({ students, loading, filters, setFilters, onCreate, onEdit, onDelete, onPrint }) => (
  <div className="p-6 max-w-[1600px] mx-auto space-y-8">
    
    {/* Hero Header */}
    <div className="relative bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 shadow-2xl shadow-indigo-200 overflow-hidden text-white">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <GraduationCap size={40} className="text-indigo-200" /> KGR Admissions
          </h1>
          <p className="text-indigo-100 mt-2 font-medium">Manage student records, fees, and documentation.</p>
        </div>
        <button onClick={onCreate} className="group bg-white text-indigo-600 px-7 py-3.5 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300"/> New Admission
        </button>
      </div>
    </div>

    {/* Filters */}
    <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-2">
      <div className="relative flex-1 group">
        <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
        <input 
          type="text" placeholder="Search by Name, Ad. No, or Mobile..." value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
          className="w-full pl-12 pr-4 py-3 bg-transparent rounded-xl focus:bg-slate-50 outline-none transition-all placeholder:text-slate-400 font-medium"
        />
      </div>
      <select 
        value={filters.course_type} onChange={(e) => setFilters({...filters, course_type: e.target.value})}
        className="px-6 py-3 bg-slate-50 border-l border-slate-100 outline-none font-bold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors rounded-xl md:rounded-l-none md:w-64"
      >
        <option value="">All Courses</option><option value="GNM">GNM</option><option value="Vocational">Vocational</option>
      </select>
    </div>

    {/* Modern Table */}
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <th className="p-6">Student Profile</th>
              <th className="p-6">Course Info</th>
              <th className="p-6">Contact</th>
              <th className="p-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? <tr><td colSpan="4" className="p-16 text-center text-slate-400"><Loader2 className="animate-spin mx-auto mb-2 w-8 h-8"/>Loading Records...</td></tr> : 
            students.length === 0 ? <tr><td colSpan="4" className="p-16 text-center text-slate-400 font-medium">No students found. Add one to get started.</td></tr> :
            students.map((s) => {
              const dName = s.student_name || s.first_name || '?';
              return (
                <tr key={s._id} className="hover:bg-indigo-50/30 transition-colors duration-200 group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                        {dName[0]}
                      </div>
                      <div>
                          <div className="font-bold text-slate-800 text-base">{dName}</div>
                          <div className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-1 border border-slate-200">{s.admission_number || 'No ID'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold w-fit ${s.course_type === 'GNM' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                        {s.course_type}
                      </span>
                      {s.course_name && <span className="text-xs font-semibold text-slate-500 pl-1">{s.course_name}</span>}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <Phone size={14} className="text-slate-400"/> {s.student_mobile || '-'}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        <ActionButton icon={<Printer size={18}/>} onClick={() => onPrint(s)} className="text-slate-600 bg-slate-100 hover:bg-slate-200" />
                        <ActionButton icon={<Edit3 size={18}/>} onClick={() => onEdit(s)} className="text-blue-600 bg-blue-50 hover:bg-blue-100" />
                        <ActionButton icon={<Trash2 size={18}/>} onClick={() => onDelete(s._id)} className="text-red-600 bg-red-50 hover:bg-red-100" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const ActionButton = ({ icon, onClick, className }) => (
  <button onClick={onClick} className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm ${className}`}>
    {icon}
  </button>
);

/* ==========================
   2. BRILLIANT FORM VIEW
   ========================== */
const FormView = ({ initialData, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    password: '', photo_url: '', 
    course_type: '', course_name: '',
    student_name: '', father_name: '', mother_name: '', dob: '', age: '', gender: '',
    postal_address: '', district: '', mandal: '', sachivalayam_name: '', pincode: '',
    nationality: 'Indian', religion: '', caste: '', sub_caste: '',
    ssc_hall_ticket: '', ssc_total_marks: '', ssc_pass_year: '', study_cert_ssc: false,
    inter_hall_ticket: '', inter_total_marks: '', inter_pass_year: '', study_cert_inter: false, transfer_cert_inter: false,
    student_aadhar: '', mother_aadhar: '', father_aadhar: '', mother_bank_acc: '', bank_ifsc: '',
    student_mobile: '', parent_mobile: '', rice_card_no: '', caste_cert_no: '',
    mole_1: '', mole_2: '',
    fees: { year_1_fee: 0, year_2_fee: 0, year_3_fee: 0, total_fee: 0, fee_paid: 0 }
  });
  
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { 
    if (initialData) {
      const safeData = {
        ...initialData,
        student_name: initialData.student_name || initialData.first_name || '',
      };
      setFormData(prev => ({ ...prev, ...safeData })); 
    } 
  }, [initialData]);

  // Auto Calculations
  useEffect(() => {
    if (formData.dob) {
      const age = Math.floor((new Date() - new Date(formData.dob)) / 31557600000);
      setFormData(prev => ({ ...prev, age: isNaN(age) ? '' : age }));
    }
  }, [formData.dob]);

  useEffect(() => {
    const total = Number(formData.fees?.year_1_fee || 0) + Number(formData.fees?.year_2_fee || 0) + Number(formData.fees?.year_3_fee || 0);
    setFormData(prev => ({ ...prev, fees: { ...prev.fees, total_fee: total } }));
  }, [formData.fees?.year_1_fee, formData.fees?.year_2_fee, formData.fees?.year_3_fee]);

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === 'checkbox' ? checked : value;
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'course_type') {
        if (newVal === 'GNM') setFormData(prev => ({ ...prev, course_type: 'GNM', course_name: 'GNM' }));
        else setFormData(prev => ({ ...prev, course_type: 'Vocational', course_name: '' }));
    } else {
        setFormData(prev => ({ ...prev, [name]: newVal }));
    }
  };

  const handleFeeChange = (e) => {
    const newFees = { ...formData.fees, [e.target.name]: e.target.value };
    setFormData({ ...formData, fees: newFees });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.student_name) newErrors.student_name = "Required";
    if (!formData.father_name) newErrors.father_name = "Required";
    if (!formData.course_type) newErrors.course_type = "Required";
    if (!formData.course_name) newErrors.course_name = "Required";
    if (!formData.gender) newErrors.gender = "Required";
    if (!formData.dob) newErrors.dob = "Required";
    if (formData.student_mobile && !/^\d{10}$/.test(formData.student_mobile)) newErrors.student_mobile = "Must be 10 digits";
    if (formData.student_aadhar && !/^\d{12}$/.test(formData.student_aadhar)) newErrors.student_aadhar = "Must be 12 digits";
    if (formData.course_name === 'MPHW' && formData.gender !== 'Female') {
        newErrors.course_name = "Female Only";
        newErrors.gender = "Change Gender";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return alert("Please check the form for errors.");
    setSaving(true);
    try {
      let response;
      if (initialData) {
        response = await updateStudent(initialData._id, formData);
        onSuccess(); 
      } else {
        response = await createStudent(formData);
        onSuccess(response); 
      }
    } catch (err) { alert("Error: " + (err.response?.data?.message || err.message)); } 
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Sticky Form Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-xl z-30">
          <div>
             <h2 className="text-2xl font-black text-slate-800 tracking-tight">{initialData ? 'Edit Student' : 'New Admission'}</h2>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
               <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Active Session
             </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-70 disabled:scale-100">
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Save Record
            </button>
          </div>
        </div>
        
        <form className="p-8 space-y-10">
          
          {/* Top Section: Credentials & Course */}
          <div className="grid md:grid-cols-2 gap-8">
             <SectionCard title="Course & Credentials" icon={<Key size={20} className="text-amber-500"/>} color="amber">
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <ModernInput label="Student ID" value={initialData ? initialData.admission_number : "Auto-Generated"} disabled icon={<BadgeCheck size={18}/>} />
                      <ModernInput label="Password" name="password" value={formData.password} onChange={handleChange} placeholder={initialData ? "Hidden" : "student123"} icon={<Key size={18}/>} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <ModernSelect label="Course Type *" name="course_type" value={formData.course_type} onChange={handleChange} options={['GNM', 'Vocational']} error={errors.course_type} icon={<BookOpen size={18}/>} />
                      {formData.course_type === 'GNM' ? 
                        <ModernInput label="Sub Course" value="GNM" disabled icon={<School size={18}/>} /> :
                        <div className="relative">
                           <ModernSelect label="Sub Course *" name="course_name" value={formData.course_name} onChange={handleChange} options={['MPHW', 'MLT']} error={errors.course_name} disabled={!formData.course_type} icon={<School size={18}/>} />
                           {formData.course_name === 'MPHW' && <span className="absolute -bottom-5 left-1 text-[10px] font-bold text-pink-500">Female Candidates Only</span>}
                        </div>
                      }
                   </div>
                   <ModernInput label="Photo URL" name="photo_url" value={formData.photo_url} onChange={handleChange} icon={<User size={18}/>} />
                </div>
             </SectionCard>

             <SectionCard title="Personal Information" icon={<User size={20} className="text-purple-500"/>} color="purple">
                <div className="space-y-5">
                   <ModernInput label="Full Name *" name="student_name" value={formData.student_name} onChange={handleChange} error={errors.student_name} />
                   <div className="grid grid-cols-2 gap-4">
                      <ModernInput label="Father Name *" name="father_name" value={formData.father_name} onChange={handleChange} error={errors.father_name} />
                      <ModernInput label="Mother Name" name="mother_name" value={formData.mother_name} onChange={handleChange} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <ModernInput label="DOB *" type="date" name="dob" value={formData.dob?.split('T')[0] || ''} onChange={handleChange} error={errors.dob} icon={<Calendar size={18}/>} />
                      <ModernInput label="Age" value={formData.age} readOnly />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <ModernSelect label="Gender *" name="gender" value={formData.gender} onChange={handleChange} options={['Male', 'Female', 'Transgender']} error={errors.gender} />
                      <ModernSelect label="Caste" name="caste" value={formData.caste} onChange={handleChange} options={['OC', 'BC-A', 'BC-B', 'BC-C', 'BC-D', 'SC', 'ST']} />
                   </div>
                </div>
             </SectionCard>
          </div>

          <SectionCard title="Contact & Address" icon={<MapPin size={20} className="text-blue-500"/>} color="blue">
             <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                   <ModernInput label="Full Postal Address" name="postal_address" value={formData.postal_address} onChange={handleChange} />
                </div>
                <ModernInput label="District" name="district" value={formData.district} onChange={handleChange} />
                <ModernInput label="Mandal" name="mandal" value={formData.mandal} onChange={handleChange} />
                <ModernInput label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
                <ModernInput label="Student Mobile" name="student_mobile" value={formData.student_mobile} onChange={handleChange} error={errors.student_mobile} maxLength={10} icon={<Phone size={18}/>} />
                <ModernInput label="Parent Mobile" name="parent_mobile" value={formData.parent_mobile} onChange={handleChange} maxLength={10} icon={<Phone size={18}/>} />
             </div>
          </SectionCard>

          <SectionCard title="Identification & Bank" icon={<BadgeCheck size={20} className="text-slate-600"/>} color="slate">
             <div className="grid md:grid-cols-4 gap-6">
                <ModernInput label="Student Aadhar" name="student_aadhar" value={formData.student_aadhar} onChange={handleChange} error={errors.student_aadhar} maxLength={12} />
                <ModernInput label="Rice Card" name="rice_card_no" value={formData.rice_card_no} onChange={handleChange} />
                <ModernInput label="Bank A/C (Mother)" name="mother_bank_acc" value={formData.mother_bank_acc} onChange={handleChange} />
                <ModernInput label="IFSC Code" name="bank_ifsc" value={formData.bank_ifsc} onChange={handleChange} />
                <div className="md:col-span-2"><ModernInput label="Mole 1" name="mole_1" value={formData.mole_1} onChange={handleChange} /></div>
                <div className="md:col-span-2"><ModernInput label="Mole 2" name="mole_2" value={formData.mole_2} onChange={handleChange} /></div>
             </div>
          </SectionCard>

          <SectionCard title="Fee Details" icon={<CreditCard size={20} className="text-emerald-500"/>} color="emerald">
             <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-end">
                <ModernInput label="1st Year" name="year_1_fee" value={formData.fees?.year_1_fee} onChange={handleFeeChange} type="number" />
                <ModernInput label="2nd Year" name="year_2_fee" value={formData.fees?.year_2_fee} onChange={handleFeeChange} type="number" />
                <ModernInput label="3rd Year" name="year_3_fee" value={formData.fees?.year_3_fee} onChange={handleFeeChange} type="number" />
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 shadow-inner">
                   <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide mb-1">Total Fee</div>
                   <div className="text-2xl font-black text-emerald-800">₹{formData.fees?.total_fee}</div>
                </div>
                <ModernInput label="Fee Paid" name="fee_paid" value={formData.fees?.fee_paid} onChange={handleFeeChange} type="number" className="border-emerald-400 bg-emerald-50/50 focus:border-emerald-600 focus:ring-emerald-200" />
             </div>
          </SectionCard>

        </form>
      </div>
    </div>
  );
};

/* --- UI COMPONENTS --- */

const SectionCard = ({ title, icon, children, color }) => (
  <div className={`bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-${color}-100/50 transition-shadow duration-300`}>
    <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
      <div className={`p-2 rounded-xl bg-${color}-50`}>{icon}</div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
    </div>
    {children}
  </div>
);

const ModernInput = ({ label, icon, error, className, ...props }) => (
  <div className="w-full group">
    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-wide group-focus-within:text-indigo-500 transition-colors">{label}</label>
    <div className="relative">
        {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">{icon}</div>}
        <input 
            {...props} 
            className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300 font-semibold text-slate-700 placeholder-slate-300 disabled:opacity-60 disabled:cursor-not-allowed ${error ? 'border-red-500 bg-red-50 focus:ring-red-200' : ''} ${className}`} 
        />
    </div>
    {error && <p className="text-red-500 text-[10px] font-bold mt-1.5 flex items-center gap-1 ml-1"><AlertCircle size={10}/> {error}</p>}
  </div>
);

const ModernSelect = ({ label, options, error, icon, ...props }) => (
  <div className="w-full group">
    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-wide group-focus-within:text-indigo-500 transition-colors">{label}</label>
    <div className="relative">
        {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">{icon}</div>}
        <select 
            {...props} 
            className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300 font-semibold text-slate-700 cursor-pointer appearance-none ${error ? 'border-red-500 bg-red-50' : ''}`}
        >
            <option value="">Select...</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l border-slate-200 pl-2">
            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
        </div>
    </div>
    {error && <p className="text-red-500 text-[10px] font-bold mt-1.5 flex items-center gap-1 ml-1"><AlertCircle size={10}/> {error}</p>}
  </div>
);

/* ==========================
   CREDENTIALS MODAL
   ========================== */
const CredentialsModal = ({ data, onClose, onPrint }) => (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20">
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-30 pattern-dots"></div>
        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner ring-4 ring-white/10">
            <Check size={40} strokeWidth={4} />
        </div>
        <h2 className="text-3xl font-black tracking-tight">Success!</h2>
        <p className="text-emerald-100 font-medium mt-2">Student has been enrolled.</p>
      </div>
      
      <div className="p-8 space-y-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 shadow-inner">
           <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student ID</span>
              <span className="text-2xl font-mono font-bold text-indigo-600 tracking-tight">{data.id}</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</span>
              <span className="text-2xl font-mono font-bold text-slate-800 tracking-tight">{data.password}</span>
           </div>
        </div>
        
        <p className="text-center text-xs text-slate-400 font-medium px-4">
            Please share these login credentials with the student immediately.
        </p>

        <div className="flex gap-3 pt-2">
          <button onClick={onPrint} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold flex justify-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95"><Printer size={18} /> Print Form</button>
          <button onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-xl font-bold transition-all active:scale-95">Close</button>
        </div>
      </div>
    </div>
  </div>
);

/* ==========================
   PRINT VIEW
   ========================== */
const PrintView = ({ student, onBack }) => {
  if (!student) return null;
  const today = new Date().toLocaleDateString('en-GB');
  const sName = student.student_name || student.first_name || '';
  const sDob = student.dob ? new Date(student.dob).toLocaleDateString() : '';

  return (
    <div className="bg-slate-800 min-h-screen p-8 flex flex-col items-center">
      <div className="w-full max-w-[210mm] flex justify-between mb-6 print:hidden">
        <button onClick={onBack} className="text-white font-bold flex gap-2 hover:text-indigo-300 transition-colors"><ArrowLeft/> Back to List</button>
        <button onClick={() => window.print()} className="bg-indigo-500 text-white px-8 py-2.5 rounded-full font-bold flex gap-2 hover:bg-indigo-400 shadow-lg shadow-indigo-500/30 transition-all"><Printer/> Print Form</button>
      </div>

      <div className="bg-white w-[210mm] min-h-[297mm] shadow-2xl print:shadow-none mx-auto relative overflow-hidden p-12 print:p-8 print:m-0">
        {/* Print Header */}
        <div className="text-center border-b-2 border-indigo-900 pb-6 mb-10">
           <h1 className="text-4xl font-black text-indigo-900 font-serif uppercase tracking-tight mb-2">KGR Vocational Junior College</h1>
           <p className="text-slate-600 font-bold tracking-[0.3em] text-xs uppercase">Recognized by Govt. of Andhra Pradesh</p>
           <p className="text-slate-500 text-xs mt-1 font-medium">12-34-56, Main Road, Guntur, Andhra Pradesh - 522001</p>
           <div className="mt-6 bg-indigo-900 text-white px-12 py-2 inline-block rounded-full text-sm font-bold uppercase print:bg-black print:text-white print:border-none tracking-widest shadow-md">Student Admission Form</div>
        </div>

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
           <h1 className="text-[200px] font-black -rotate-45">KGR</h1>
        </div>

        {/* Top Info */}
        <div className="flex justify-between items-start mb-12 relative z-10">
           <div className="space-y-3">
              <InfoRow label="Admission No" value={student.admission_number} big />
              <InfoRow label="Academic Year" value={student.academic_year || student.admission_year} />
              <InfoRow label="Course Applied" value={`${student.course_type} ${student.course_name ? '- ' + student.course_name : ''}`} bold />
              <InfoRow label="Date of Issue" value={today} />
           </div>
           <div className="w-36 h-44 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center bg-slate-50 rounded-lg overflow-hidden">
              {student.photo_url ? <img src={student.photo_url} className="w-full h-full object-cover"/> : <span className="text-[10px] text-slate-400 font-bold uppercase">Affix Photo</span>}
           </div>
        </div>

        {/* Main Details */}
        <SectionHeader title="01. Personal Information" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8 relative z-10 text-sm">
             <GridRow label="Full Name" value={sName} full />
             <GridRow label="Father's Name" value={student.father_name} />
             <GridRow label="Mother's Name" value={student.mother_name} />
             <GridRow label="Date of Birth" value={`${sDob} (Age: ${student.age})`} />
             <GridRow label="Gender" value={student.gender} />
             <GridRow label="Nationality / Religion" value={`${student.nationality} / ${student.religion || '-'}`} />
             <GridRow label="Caste / Sub-Caste" value={`${student.caste} ${student.sub_caste ? '(' + student.sub_caste + ')' : ''}`} />
        </div>

        <SectionHeader title="02. Contact Information" />
        <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg print:bg-white print:border-slate-300 text-sm relative z-10">
             <p className="mb-3"><span className="font-bold text-slate-500 text-xs uppercase">Permanent Address:</span><br/><span className="font-semibold">{student.postal_address}, {student.mandal} (M), {student.district} (Dt) - {student.pincode}.</span></p>
             <div className="flex gap-12">
                <p><span className="font-bold text-slate-500 text-xs uppercase">Student Mobile:</span> <span className="font-mono font-bold">{student.student_mobile}</span></p>
                <p><span className="font-bold text-slate-500 text-xs uppercase">Parent Mobile:</span> <span className="font-mono font-bold">{student.parent_mobile}</span></p>
             </div>
        </div>

        <SectionHeader title="03. Educational Details" />
        <table className="w-full border-collapse border border-slate-300 text-xs text-center mb-8 relative z-10">
           <thead className="bg-slate-100 print:bg-gray-100 text-slate-700 font-bold uppercase">
               <tr>
                   <th className="border border-slate-300 p-2">Qualification</th>
                   <th className="border border-slate-300 p-2">Hall Ticket No</th>
                   <th className="border border-slate-300 p-2">Total Marks</th>
                   <th className="border border-slate-300 p-2">Pass Year</th>
               </tr>
           </thead>
           <tbody>
              <tr><td className="border border-slate-300 p-2 font-bold text-left pl-4">SSC / 10th</td><td className="border border-slate-300 p-2">{student.ssc_hall_ticket}</td><td className="border border-slate-300 p-2">{student.ssc_total_marks}</td><td className="border border-slate-300 p-2">{student.ssc_pass_year}</td></tr>
              <tr><td className="border border-slate-300 p-2 font-bold text-left pl-4">Intermediate</td><td className="border border-slate-300 p-2">{student.inter_hall_ticket}</td><td className="border border-slate-300 p-2">{student.inter_total_marks}</td><td className="border border-slate-300 p-2">{student.inter_pass_year}</td></tr>
           </tbody>
        </table>

        <SectionHeader title="04. Identification & Official" />
        <div className="grid grid-cols-3 gap-4 mb-8 relative z-10 text-xs">
            <BoxItem label="Aadhar No" value={student.student_aadhar} />
            <BoxItem label="Rice Card" value={student.rice_card_no} />
            <BoxItem label="Bank A/C" value={student.mother_bank_acc} />
            <div className="col-span-3 mt-2">
                <p className="font-bold text-slate-500 uppercase text-[10px]">Identification Marks:</p>
                <p>1. {student.mole_1 || '-'}</p>
                <p>2. {student.mole_2 || '-'}</p>
            </div>
        </div>

        {/* --- ADDED: FEE DETAILS SECTION --- */}
        <div className="mb-16 pt-4 border-t border-dashed border-slate-300 relative z-10">
            <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg print:bg-gray-100 print:border print:border-gray-300">
                <div>
                    <span className="block text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Total Course Fee</span>
                    <span className="text-xl font-black text-indigo-900">₹{student.fees?.total_fee || '0'}</span>
                </div>
                <div className="text-right">
                    <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Fee Paid (At Admission)</span>
                    <span className="text-xl font-black text-emerald-700">₹{student.fees?.fee_paid || '0'}</span>
                </div>
            </div>
        </div>

        {/* Signatures */}
        <div className="mt-auto pt-8 border-t-2 border-slate-200 flex justify-between items-end relative z-10">
           <div className="text-center w-40">
               <span className="font-bold text-xs uppercase tracking-wider text-slate-600">Student Signature</span>
           </div>
           
           <div className="text-center w-40 flex flex-col items-center">
              <img 
                src="https://image2url.com/images/1766057638901-c61ca0e6-738b-45f4-a250-12ba7ec982ee.jpeg" 
                alt="Principal Sign" 
                className="h-16 object-contain mb-2 mix-blend-multiply" 
              />
              <span className="font-bold text-xs uppercase tracking-wider text-slate-600">Principal Seal & Sign</span>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- PDF Helpers ---
const SectionHeader = ({ title }) => (
    <h3 className="text-indigo-900 font-bold uppercase tracking-widest text-[10px] border-b border-indigo-100 pb-1.5 mb-4 mt-6 print:text-black print:border-gray-300">{title}</h3>
);
const InfoRow = ({ label, value, big, bold }) => (
    <div className="flex items-center gap-3 mb-2">
      <span className="w-28 text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}:</span>
      <span className={`text-slate-800 ${big ? 'text-xl font-black tracking-tight text-indigo-900' : 'text-sm'} ${bold ? 'font-bold' : 'font-medium'}`}>{value || '-'}</span>
    </div>
);
const GridRow = ({ label, value, full }) => (
    <div className={`border-b border-slate-100 pb-1.5 ${full ? 'col-span-2' : ''}`}>
      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">{label}</div>
      <div className="text-sm font-semibold text-slate-800">{value || '-'}</div>
    </div>
);
const BoxItem = ({ label, value }) => (
    <div className="bg-slate-50 border border-slate-200 p-2 rounded print:bg-white print:border-slate-300">
      <div className="text-[9px] font-bold text-slate-400 uppercase">{label}</div>
      <div className="font-mono font-bold text-slate-800 text-sm">{value || '-'}</div>
    </div>
);

export default Students;