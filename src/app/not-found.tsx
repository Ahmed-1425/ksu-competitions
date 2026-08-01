import React from 'react';
import Link from 'next/link';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-ksu-mesh">
      <Header />
      <main className="flex-grow pt-36 pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="glass-card p-8 md:p-12 border border-[#CDEAF5] bg-white shadow-xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-4xl font-extrabold text-[#0B1B2B]">404</h1>
            <h2 className="text-xl font-bold text-[#0B1B2B]">الصفحة غير موجودة</h2>
            <p className="text-sm text-[#5A6E7F]">
              نأسف، الرابط الذي تحاول الوصول إليه غير موجود أو تم نقله.
            </p>

            <div className="pt-4 flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#008DC3] text-white font-bold text-sm hover:bg-[#0076A5] transition-all shadow-md"
              >
                <Home className="w-4 h-4" />
                <span>العودة للصفحة الرئيسية</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
