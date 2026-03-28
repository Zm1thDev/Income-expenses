'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
        router.push('/login');
      } else {
        setError(data.message || 'การสมัครสมาชิกไม่สำเร็จ');
      }
    } catch (err) {
      console.error('Register Error:', err);
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-10 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center">
      <div className="mb-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          สมัครสมาชิก
        </h1>
      </div>

      <form onSubmit={handleRegister} className="w-full space-y-5">
        {error && (
          <div className="text-red-500 text-xs font-bold">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-600 ml-1">ชื่อ</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="กรุณากรอกชื่อ"
            className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-[#8B5CF6]/30 focus:ring-4 focus:ring-[#8B5CF6]/5 transition-all text-gray-800 placeholder:text-gray-400"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-600 ml-1">อีเมล</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="กรุณากรอกอีเมล"
            className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-[#8B5CF6]/30 focus:ring-4 focus:ring-[#8B5CF6]/5 transition-all text-gray-800 placeholder:text-gray-400"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-600 ml-1">รหัสผ่าน</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="กรุณากรอกรหัสผ่าน"
            className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:border-[#8B5CF6]/30 focus:ring-4 focus:ring-[#8B5CF6]/5 transition-all text-gray-800 placeholder:text-gray-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 mt-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold rounded-2xl shadow-[0_10px_25px_rgba(139,92,246,0.3)] transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>ยืนยันการสมัคร</span>
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-gray-500 font-medium">มีบัญชีอยู่แล้ว? </span>
        <button onClick={() => router.push('/login')} className="font-bold text-[#8B5CF6] hover:underline decoration-2 transition-all cursor-pointer bg-transparent border-none">เข้าสู่ระบบ</button>
      </div>
    </div>
  );
}
