import React from 'react';
import { FiDownload, FiX } from 'react-icons/fi';

interface ExportCSV {
  isOpen: boolean;
  onClose: () => void;
  transactions: any[];
  summary: { income: number; expense: number; balance: number };
}

export default function ExportCSVModal({ isOpen, onClose, transactions, summary }: ExportCSV) {
  if (!isOpen) return null;

  const handleExport = () => {
    if (transactions.length === 0) {
      alert("ไม่มีข้อมูลให้ส่งออก");
      return;
    }

    const headers = ["วันที่", "ประเภท", "หมวดหมู่", "จำนวนเงิน(บาท)", "บันทึกช่วยจำ", "", "", "รายรับ", "รายจ่าย", "คงเหลือ"];
    const rows = transactions.map((t, index) => {
      const baseRow = [
        new Date(t.transactionDate).toLocaleDateString('th-TH', { year: '2-digit', month: 'short', day: 'numeric' }),
        t.type === 'income' ? 'รายรับ' : 'รายจ่าย',
        t.category?.name || '-',
        t.amount,
        t.note || '-'
      ];
      if (index === 0) {
        return [...baseRow, "", "", summary.income, summary.expense, summary.balance];
      }
      return [...baseRow, "", "", "", "", ""];
    });

    const csvContent = "\uFEFF" + [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `รายรับรายจ่าย_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-500/20 backdrop-blur-xs transition-all p-4">
      <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-gray-800 transition-all cursor-pointer">
          <FiX size={18} />
        </button>
        <div className="w-14 h-14 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] mb-6 mx-auto">
          <FiDownload size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Export CSV</h2>
        <p className="text-gray-500 text-center mb-8 text-sm">
          ระบบจะดาวน์โหลดรายการปัจจุบันทั้งหมด {transactions.length} รายการ <br />
          ออกมาเป็นไฟล์ .csv
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-bold transition-all cursor-pointer">
            ยกเลิก
          </button>
          <button onClick={handleExport} className="flex-1 py-3.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-2xl font-bold transition-all cursor-pointer">
            ดาวน์โหลด
          </button>
        </div>
      </div>
    </div>
  );
}
