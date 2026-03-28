'use client';

import React, { useEffect } from 'react';
import RegisterForm from '@/components/RegisterForm';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      router.replace('/');
    }
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center relative bg-[#F8FAFC]">
      <div className="relative z-10 w-full flex flex-col items-center p-6">
        <RegisterForm />
      </div>
    </main>
  );
}
