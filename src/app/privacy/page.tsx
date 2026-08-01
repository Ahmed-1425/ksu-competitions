import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { ShieldCheck, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-ksu-mesh">
      <Header />
      <main className="flex-grow pt-36 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto glass-card p-8 md:p-12 border border-[#D7CFC1] bg-white shadow-xl space-y-8">
          <div className="border-b border-[#D7CFC1] pb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F5A46]/10 text-[#1F5A46] text-xs font-bold mb-3 border border-[#C9A96A]/30">
              <ShieldCheck className="w-4 h-4 text-[#C9A96A]" />
              <span>الخصوصية وحماية البيانات</span>
            </div>
            <h1 className="text-3xl font-bold text-[#142921]">سياسة الخصوصية</h1>
            <p className="text-sm text-[#62776D] mt-2">تاريخ التحديث: أغسطس 2026</p>
          </div>

          <div className="space-y-6 text-sm text-[#2D3E36] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#142921] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#1F5A46]" />
                <span>1. جمع البيانات والغرض منها</span>
              </h2>
              <p>
                تلتزم المنصة بحماية بيانات جميع المشاركين (الطلاب والمشرفين). نجمع فقط البيانات الأساسية الضرورية للتحقق من الأهلية وإدارة المشاركات، والتي تشمل: الاسم الكامل، رقم الجوال، الجامعة، والروابط الخاصة بالمشاركات.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#142921]">2. حماية البيانات وعدم المشاركة العامة</h2>
              <p>
                لا تتاح بيانات المتقدمين أو أرقام هواتفهم للعموم في أي صفحة من صفحات المنصة العامة، ولا يمكن الوصول إليها إلا بواسطة اللجنة التقنية والإداريين المصرح لهم عبر لوحة التحكم المحمية.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#142921]">3. روابط المشاركات (Google Drive)</h2>
              <p>
                يتحمل المتقدم مسؤولية ضبط صلاحية الرابط المرفق على Google Drive ليكون متاحاً للعرض فقط (Viewer) لأي شخص لديه الرابط، وتقتصر قراءة الروابط على أعضاء لجنة التقييم المعتمدين.
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
