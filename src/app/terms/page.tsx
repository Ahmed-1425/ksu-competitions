import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { FileText, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-ksu-mesh">
      <Header />
      <main className="flex-grow pt-36 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto glass-card p-8 md:p-12 border border-[#D7CFC1] bg-white shadow-xl space-y-8">
          <div className="border-b border-[#D7CFC1] pb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F5A46]/10 text-[#1F5A46] text-xs font-bold mb-3 border border-[#C9A96A]/30">
              <FileText className="w-4 h-4 text-[#C9A96A]" />
              <span>الشروط والأحكام التنظيمية</span>
            </div>
            <h1 className="text-3xl font-bold text-[#142921]">شروط المشاركة في المسابقات</h1>
            <p className="text-sm text-[#62776D] mt-2">لجنة عمداء شؤون الطلاب - بتنظيم جامعة الملك سعود</p>
          </div>

          <div className="space-y-6 text-sm text-[#2D3E36] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#142921] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F5A46]" />
                <span>1. شروط مسار أفضل تقرير (report)</span>
              </h2>
              <p>
                تُقدم المشاركة باسم الجامعة المشاركة عبر مشرف أو طالب ممثل. يلزم تسليم رابط Google Drive مفتوح للعرض يتضمن التقرير الشامل.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#142921] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F5A46]" />
                <span>2. شروط مسار أفضل صورة فوتوغرافية (photo)</span>
              </h2>
              <p>
                المشاركة فردية لجميع طلاب الجامعات المشاركة. يُسمح بصورة واحدة فقط داخل الرابط. يُستبعد أي رابط يحتوي ألبوماً أو أكثر من صورة واحدة.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#142921] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F5A46]" />
                <span>3. شروط مسار أفضل جواز سفر (passport)</span>
              </h2>
              <p>
                تسليم الجواز يكون يدويًا للمشرف المختص مع كتابة الاسم عليه بوضوح، ويتم تأكيد استلامه إلكترونياً من قِبل إدارة المنصة.
              </p>
            </section>

            <section className="space-y-2 border-t border-[#D7CFC1] pt-6 text-xs text-[#62776D]">
              <p>لجنة عمداء شؤون الطلاب للجامعات السعودية | جامعة الملك سعود</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
