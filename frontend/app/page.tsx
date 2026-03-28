'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoMdLogOut, IoMdAdd } from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FiAlignLeft, FiTrash2, FiPieChart, FiDownload } from "react-icons/fi";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import Dashboard from '../components/Dashboard';
import ExportCSV from '../components/ExportCSV';

export default function Home() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [activeType, setActiveType] = useState('income');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLogged, setIsLogged] = useState<boolean | null>(null);
  const [categories, setCategories] = useState<{ id: number, name: string, type: string }[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'transactions' | 'dashboard'>('transactions');
  const [showExportCSV, setShowExportCSV] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.replace('/login');
    } else {
      const parsedUser = JSON.parse(user);
      setUserName(parsedUser.name);
      setUserEmail(parsedUser.email);
      setIsLogged(true);
      fetchCategories();
    }
  }, [router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = filter === 'all'
        ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/transactions`
        : `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/transactions?type=${filter}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log("data", data)
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  useEffect(() => {
    if (isLogged) {
      fetchTransactions();
      fetchSummary();
    }
  }, [isLogged, filter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !selectedCategory || !transactionDate) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: activeType,
          amount: parseFloat(amount),
          note: note,
          categoryName: selectedCategory,
          transactionDate: transactionDate
        })
      });

      if (response.ok) {
        alert('บันทึกรายการสำเร็จ');
        setAmount('');
        setNote('');
        setSelectedCategory('');
        setTransactionDate('');
        fetchTransactions();
        fetchSummary();
      } else {
        const error = await response.json();
        alert(error.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Submit Error:', error);
      alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchTransactions();
        fetchSummary();
      } else {
        const error = await response.json();
        alert(error.message || 'เกิดข้อผิดพลาดในการลบ');
      }
    } catch (error) {
      console.error('Delete Error:', error);
      alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (isLogged === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#8B5CF6]/30 border-t-[#8B5CF6] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-gray-800 pb-10">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold tracking-tight text-gray-800">บันทึกรายรับรายจ่าย</h1>
            <div className="flex bg-gray-100 p-1.5 rounded-lg">
              <button
                onClick={() => setCurrentView('transactions')}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-bold transition-all cursor-pointer ${currentView === 'transactions' ? 'bg-white text-[#8B5CF6]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <FiAlignLeft size={16} /> รายการ
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-bold transition-all cursor-pointer ${currentView === 'dashboard' ? 'bg-white text-[#8B5CF6]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <FiPieChart size={16} /> แดชบอร์ด
              </button>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => setShowExportCSV(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/10 text-[#8B5CF6] hover:bg-[#8B5CF6]/20 rounded-xl font-bold text-sm transition-all cursor-pointer"
            >
              <FiDownload size={16} /> CSV
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-gray-800">{userName}</p>
                <p className="text-xs font-bold text-gray-800">{userEmail}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all flex items-center justify-center cursor-pointer"
              >
                <IoMdLogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-8">
        {/* Left */}
        <div className="lg:col-span-4 space-y-6">
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#ECFDF5] p-4 rounded-3xl text-center">
              <h1 className="font-bold text-[#065F46] uppercase mb-1">รายรับ</h1>
              <p className="text-xl font-black text-[#059669]">฿{Math.round(summary.income).toLocaleString()}</p>
            </div>
            <div className="bg-[#FEF2F2] p-4 rounded-3xl text-center">
              <h1 className="font-bold text-[#991B1B] uppercase mb-1">รายจ่าย</h1>
              <p className="text-xl font-black text-[#DC2626]">฿{Math.round(summary.expense).toLocaleString()}</p>
            </div>
            <div className="bg-[#EFF6FF] p-4 rounded-3xl text-center">
              <h1 className="font-bold text-[#1E40AF] uppercase mb-1">คงเหลือ</h1>
              <p className="text-xl font-black text-[#2563EB]">{summary.balance >= 0 ? '' : '-'}฿{Math.round(Math.abs(summary.balance)).toLocaleString()}</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
                <IoMdAdd size={20} />
              </div>
              <h3 className="font-bold text-gray-800">เพิ่มรายการใหม่</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setActiveType('income')}
                className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all cursor-pointer ${activeType === 'income' ? 'bg-[#10B981] text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
              >
                รายรับ
              </button>
              <button
                onClick={() => setActiveType('expense')}
                className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all cursor-pointer ${activeType === 'expense' ? 'bg-[#EF4444] text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
              >
                รายจ่าย
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-400 ml-1 mb-1 block">หมวดหมู่</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-[#8B5CF6]/30 focus:ring-4 focus:ring-[#8B5CF6]/5 transition-all text-gray-800 placeholder:text-gray-400 cursor-pointer"
                >
                  <option value="">เลือกหมวดหมู่</option>
                  {categories
                    .filter(cat => cat.type === activeType)
                    .map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-400 ml-1 mb-1 block">จำนวนเงิน (บาท)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-[#8B5CF6]/30 focus:ring-4 focus:ring-[#8B5CF6]/5 transition-all text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-400 ml-1 mb-1 block">บันทึกช่วยจำ</label>
                <input
                  type="text"
                  placeholder="เช่น ค่าอาหาร, ค่ารถ"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-[#8B5CF6]/30 focus:ring-4 focus:ring-[#8B5CF6]/5 transition-all text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-400 ml-1 mb-1 block">วันที่</label>
                <input
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-[#8B5CF6]/30 focus:ring-4 focus:ring-[#8B5CF6]/5 transition-all text-gray-800 placeholder:text-gray-400 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 mt-4 text-white rounded-2xl font-bold font-sans shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer ${loading ? 'opacity-70 cursor-not-allowed' : ''} ${activeType === 'income' ? 'bg-[#10B981] hover:bg-[#059669]' : 'bg-[#EF4444] hover:bg-[#DC2626]'}`}
              >
                {loading ? 'กำลังบันทึก...' : 'บันทึกรายการ'}
              </button>
            </form>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
          {currentView === 'transactions' ? (
            <>
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
                    <FiAlignLeft size={20} />
                  </div>
                  <h3 className="font-bold text-gray-800">รายการทั้งหมด</h3>
                  <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full ml-1">
                    {transactions.length}
                  </span>
                </div>

            <div className="flex bg-gray-100 p-1.5 rounded-2xl">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${filter === 'all' ? 'bg-[#8B5CF6] text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setFilter('income')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${filter === 'income' ? 'bg-[#8B5CF6] text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                รายรับ
              </button>
              <button
                onClick={() => setFilter('expense')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${filter === 'expense' ? 'bg-[#8B5CF6] text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                รายจ่าย
              </button>
            </div>
          </div>
          {/* Show Transaction */}
          <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 transition-all">
            {transactions.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-white border border-[#8B5CF6]/30 rounded-[2rem]">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-[2rem] flex items-center justify-center text-2xl ${item.type === 'income' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                    {item.type === 'income' ? <FaArrowDown /> : <FaArrowUp />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-800 text-lg">{item.category?.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${item.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {item.type === 'income' ? 'รับ' : 'จ่าย'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-400">
                      {new Date(item.transactionDate).toLocaleDateString('th-TH', { year: '2-digit', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pr-2">
                  <div className="text-right">
                    <p className={`text-xl font-bold ${item.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                      {item.type === 'income' ? '+' : '-'}฿{Math.round(Number(item.amount)).toLocaleString()}
                    </p>
                    <p className="text-sm font-bold text-gray-800 uppercase mt-1">
                      {item.note || '-'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center justify-center text-red-500 cursor-pointer"
                    title="ลบรายการ"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <IoDocumentTextOutline size={45} />
                </div>
                <p className="font-bold text-gray-400">ยังไม่มีรายการบันทึก</p>
              </div>
            )}
          </div>
            </>
          ) : (
            <Dashboard summary={summary} transactions={transactions} />
          )}

        </div>
      </div>

      <ExportCSV 
        isOpen={showExportCSV}
        onClose={() => setShowExportCSV(false)}
        transactions={transactions}
        summary={summary}
      />
    </main>
  );
}

