import React, { Suspense } from 'react';
import Link from 'next/link';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import NoticeBanner from '@/components/landing/NoticeBanner';
import RegistrationForm from '@/components/registration/RegistrationForm';
import { createAdminClient } from '@/lib/supabase/admin';
import { University } from '@/types/database';
import { Loader2, Lock, Home } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const fallbackUniversities: University[] = [
  { id: 'ksu-id', name_ar: 'جامعة الملك سعود', name_en: 'King Saud University', slug: 'ksu', logo_path: null, sort_order: 1, is_active: true, created_at: '', updated_at: '' },
  { id: 'almaarefa-id', name_ar: 'جامعة المعرفة', name_en: 'Almaarefa University', slug: 'almaarefa', logo_path: null, sort_order: 2, is_active: true, created_at: '', updated_at: '' },
  { id: 'kau-id', name_ar: 'جامعة الملك عبدالعزيز', name_en: 'King Abdulaziz University', slug: 'kau', logo_path: null, sort_order: 3, is_active: true, created_at: '', updated_at: '' },
  { id: 'qu-id', name_ar: 'جامعة القصيم', name_en: 'Qassim University', slug: 'qu', logo_path: null, sort_order: 4, is_active: true, created_at: '', updated_at: '' },
  { id: 'iu-id', name_ar: 'الجامعة الإسلامية بالمدينة المنورة', name_en: 'Islamic University of Madinah', slug: 'iu', logo_path: null, sort_order: 5, is_active: true, created_at: '', updated_at: '' },
  { id: 'kku-id', name_ar: 'جامعة الملك خالد', name_en: 'King Khalid University', slug: 'kku', logo_path: null, sort_order: 6, is_active: true, created_at: '', updated_at: '' },
  { id: 'uoh-id', name_ar: 'جامعة حائل', name_en: 'University of Ha\'il', slug: 'uoh', logo_path: null, sort_order: 7, is_active: true, created_at: '', updated_at: '' },
  { id: 'nu-id', name_ar: 'جامعة نجران', name_en: 'Najran University', slug: 'nu', logo_path: null, sort_order: 8, is_active: true, created_at: '', updated_at: '' },
  { id: 'psau-id', name_ar: 'جامعة الأمير سطام بن عبدالعزيز', name_en: 'Prince Sattam Bin Abdulaziz University', slug: 'psau', logo_path: null, sort_order: 9, is_active: true, created_at: '', updated_at: '' },
  { id: 'uj-id', name_ar: 'جامعة جدة', name_en: 'University of Jeddah', slug: 'uj', logo_path: null, sort_order: 10, is_active: true, created_at: '', updated_at: '' },
];

async function getInitialData() {
  try {
    const supabase = createAdminClient();

    const [uniRes, settingsRes] = await Promise.all([
      supabase.from('universities').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
      supabase.from('app_settings').select('*'),
    ]);

    const universities = (uniRes.data && uniRes.data.length > 0) ? (uniRes.data as University[]) : fallbackUniversities;

    let registrationOpen = true;
    let noticeText = { ar: '', en: '' };

    if (settingsRes.data) {
      settingsRes.data.forEach((item) => {
        if (item.key === 'registration_open') {
          registrationOpen = item.value === true || item.value === 'true' || JSON.stringify(item.value) === 'true';
        }
        if (item.key === 'notice_text' && typeof item.value === 'object' && item.value !== null) {
          noticeText = item.value as { ar: string; en: string };
        }
      });
    }

    return { universities, registrationOpen, noticeText };
  } catch {
    return { universities: fallbackUniversities, registrationOpen: true, noticeText: { ar: '', en: '' } };
  }
}

export default async function RegisterPage() {
  const { universities, registrationOpen, noticeText } = await getInitialData();

  return (
    <div className="flex flex-col min-h-screen bg-ksu-mesh">
      <NoticeBanner registrationOpen={registrationOpen} noticeText={noticeText} />
      <Header />
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F5A46] bg-white border border-[#D7CFC1] px-3.5 py-1.5 rounded-full shadow-xs">
            لجنة عمداء شؤون الطلاب للجامعات السعودية
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#142921] mt-4">
            {registrationOpen ? 'تسجيل مشاركة جديدة' : 'فترة التسجيل مغلقة حالياً'}
          </h1>
          <p className="text-sm sm:text-base text-[#62776D] mt-2 max-w-2xl mx-auto">
            {registrationOpen
              ? 'يرجى تعبئة النموذج أدناه بدقة. لن تستغرق العملية أكثر من دقيقتين.'
              : 'نود إحاطتكم بنهاية الفترة المحددة لاستقبال المشاركات في مسابقات هذا الموسم.'}
          </p>
        </div>

        {registrationOpen ? (
          <Suspense fallback={
            <div className="flex items-center justify-center py-20 text-[#1F5A46]">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          }>
            <RegistrationForm initialUniversities={universities} />
          </Suspense>
        ) : (
          /* REGISTRATION CLOSED DISPLAY CARD */
          <div className="max-w-2xl mx-auto glass-card p-8 sm:p-12 border border-red-200 bg-white shadow-2xl text-center space-y-6 animate-in fade-in duration-300">
            <div className="w-20 h-20 rounded-full bg-red-100 border border-red-300 text-red-700 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-red-950">
                تم إغلاق استقبال المشاركات
              </h2>
              <p className="text-sm text-[#62776D] leading-relaxed max-w-lg mx-auto">
                نشكر جميع الطلاب والطالبات والجامعات السعودية المشاركة على تفاعلهم المتميز في مسابقات هذا الموسم. تم إغلاق باب التقديم وبدأت مرحلة التقييم والتدقيق من قِبل اللجنة المختصة.
              </p>
            </div>

            {noticeText?.ar && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 font-bold">
                📢 {noticeText.ar}
              </div>
            )}

            <div className="pt-4 flex justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1F5A46] text-white font-bold text-sm hover:bg-[#174535] transition-all shadow-md"
              >
                <Home className="w-4 h-4 text-[#C9A96A]" />
                <span>العودة للصفحة الرئيسية</span>
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
