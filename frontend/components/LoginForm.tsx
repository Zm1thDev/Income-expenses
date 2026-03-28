'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/');
      } else {
        setError(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-10 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center">
      <div className="mb-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          เข้าสู่ระบบ
        </h1>
      </div>

      <form onSubmit={handleLogin} className="w-full space-y-5">
        {error && (
          <div className="text-red-500 text-xs font-bold">
            {error}
          </div>
        )}
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
          <span>เข้าสู่ระบบ</span>
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-gray-500 font-medium">ยังไม่มีบัญชี? </span>
        <button onClick={() => router.push('/register')} className="font-bold text-[#8B5CF6] hover:underline decoration-2 transition-all cursor-pointer bg-transparent border-none">สมัครสมาชิก</button>
      </div>
    </div>
  );
}
