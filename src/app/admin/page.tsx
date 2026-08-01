import React from 'react';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { Submission } from '@/types/database';
import {
  FileSpreadsheet,
  MailCheck,
  Clock,
  CheckCircle2,
  Compass,
  AlertCircle,
  ArrowLeft,
  Building2,
  FileText,
  Camera,
} from 'lucide-react';

async function getDashboardStats() {
  try {
    const supabase = createAdminClient();

    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('*, university:universities(*)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error || !submissions) {
      return {
        total: 0,
        unread: 0,
        underReview: 0,
        acceptedCompleted: 0,
        pendingPassportReceipt: 0,
        recentSubmissions: [],
        competitionCounts: { report: 0, photo: 0, passport: 0 },
        universityCounts: {} as Record<string, number>,
        pendingPassportsList: [],
      };
    }

    const subList = submissions as Submission[];

    const total = subList.length;
    const unread = subList.filter((s) => !s.read_at).length;
    const underReview = subList.filter((s) => s.status === 'under_review').length;
    const acceptedCompleted = subList.filter((s) => s.status === 'accepted' || s.status === 'completed').length;
    const pendingPassportReceipt = subList.filter(
      (s) => s.competition_type === 'passport' && !s.receipt_confirmed_at
    ).length;

    const pendingPassportsList = subList.filter(
      (s) => s.competition_type === 'passport' && !s.receipt_confirmed_at
    );

    const competitionCounts = {
      report: subList.filter((s) => s.competition_type === 'report').length,
      photo: subList.filter((s) => s.competition_type === 'photo').length,
      passport: subList.filter((s) => s.competition_type === 'passport').length,
    };

    const universityCounts: Record<string, number> = {};
    subList.forEach((s) => {
      const name = s.university
        ? s.university.name_ar
        : s.university_other_name || 'أخرى';
      universityCounts[name] = (universityCounts[name] || 0) + 1;
    });

    return {
      total,
      unread,
      underReview,
      acceptedCompleted,
      pendingPassportReceipt,
      recentSubmissions: subList.slice(0, 5),
      competitionCounts,
      universityCounts,
      pendingPassportsList: pendingPassportsList.slice(0, 3),
    };
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    return {
      total: 0,
      unread: 0,
      underReview: 0,
      acceptedCompleted: 0,
      pendingPassportReceipt: 0,
      recentSubmissions: [],
      competitionCounts: { report: 0, photo: 0, passport: 0 },
      universityCounts: {},
      pendingPassportsList: [],
    };
  }
}

export default async function AdminOverviewPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Page Title Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1B2B]">نظرة عامة والتحليلات</h1>
        <p className="text-xs sm:text-sm text-[#5A6E7F] mt-1">
          ملخص إحصائيات المشاركات المستلمة في مسابقات جامعة الملك سعود
        </p>
      </div>

      {/* Prominent Alert Box for Pending Passport Deliveries */}
      {stats.pendingPassportReceipt > 0 && (
        <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500 text-white shrink-0">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-amber-950 text-base">
                تنبيه: يوجد {stats.pendingPassportReceipt} جواز سفر بانتظار تأكيد الاستلام اليدوي!
              </h3>
              <p className="text-xs text-amber-900 mt-1">
                قام بعض الطلاب بتسليم الجوازات يدويًا والإقرار بذلك. يرجى تأكيد استلام الجوازات لإتمام تسجيل مشاركتهم.
              </p>
            </div>
          </div>
          <Link
            href="/admin/submissions/passport"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs shrink-0"
          >
            <span>استعراض الجوازات لتأكيد الاستلام</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total */}
        <div className="glass-card p-5 border border-[#E2EEF5] bg-white flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5A6E7F]">إجمالي المشاركات</span>
            <div className="p-2 rounded-xl bg-[#F4FBFD] text-[#008DC3]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-[#0B1B2B]">{stats.total}</span>
            <span className="text-[10px] text-[#5A6E7F] block mt-1">مشاركة مسجلة</span>
          </div>
        </div>

        {/* Unread */}
        <div className="glass-card p-5 border border-[#E2EEF5] bg-white flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5A6E7F]">غير مقروءة</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <MailCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-blue-700">{stats.unread}</span>
            <span className="text-[10px] text-[#5A6E7F] block mt-1">طلب جديد</span>
          </div>
        </div>

        {/* Under Review */}
        <div className="glass-card p-5 border border-[#E2EEF5] bg-white flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5A6E7F]">قيد المراجعة</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-amber-700">{stats.underReview}</span>
            <span className="text-[10px] text-[#5A6E7F] block mt-1">تحت التدقيق</span>
          </div>
        </div>

        {/* Accepted / Completed */}
        <div className="glass-card p-5 border border-[#E2EEF5] bg-white flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5A6E7F]">مقبولة / مكتملة</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-emerald-700">{stats.acceptedCompleted}</span>
            <span className="text-[10px] text-[#5A6E7F] block mt-1">تم قبولها</span>
          </div>
        </div>

        {/* Pending Passport Confirmation */}
        <div className="glass-card p-5 border border-amber-200 bg-amber-50/50 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900">بانتظار استلام الجواز</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Compass className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-amber-900">{stats.pendingPassportReceipt}</span>
            <span className="text-[10px] text-amber-800 block mt-1">تستوجب الاستلام</span>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Track Distribution Breakdown */}
        <div className="lg:col-span-6 glass-card p-6 border border-[#E2EEF5] bg-white space-y-4">
          <h2 className="text-base font-bold text-[#0B1B2B] border-b border-[#E2EEF5] pb-3">
            توزيع المشاركات حسب المسار
          </h2>

          <div className="space-y-4 pt-2">
            {/* Report */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2 text-[#0B1B2B]">
                  <FileText className="w-4 h-4 text-[#008DC3]" />
                  <span>أفضل تقرير</span>
                </span>
                <span className="text-[#008DC3]">{stats.competitionCounts.report} مشاركة</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#F4FBFD] overflow-hidden border border-[#E2EEF5]">
                <div
                  className="h-full bg-[#008DC3] rounded-full transition-all"
                  style={{
                    width: `${stats.total > 0 ? (stats.competitionCounts.report / stats.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Photo */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2 text-[#0B1B2B]">
                  <Camera className="w-4 h-4 text-[#0098D8]" />
                  <span>أفضل صورة فوتوغرافية</span>
                </span>
                <span className="text-[#0098D8]">{stats.competitionCounts.photo} مشاركة</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#F4FBFD] overflow-hidden border border-[#E2EEF5]">
                <div
                  className="h-full bg-[#0098D8] rounded-full transition-all"
                  style={{
                    width: `${stats.total > 0 ? (stats.competitionCounts.photo / stats.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Passport */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2 text-[#0B1B2B]">
                  <Compass className="w-4 h-4 text-[#4EB6DD]" />
                  <span>أفضل جواز سفر</span>
                </span>
                <span className="text-[#4EB6DD]">{stats.competitionCounts.passport} مشاركة</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#F4FBFD] overflow-hidden border border-[#E2EEF5]">
                <div
                  className="h-full bg-[#4EB6DD] rounded-full transition-all"
                  style={{
                    width: `${stats.total > 0 ? (stats.competitionCounts.passport / stats.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* University Breakdown */}
        <div className="lg:col-span-6 glass-card p-6 border border-[#E2EEF5] bg-white space-y-4">
          <h2 className="text-base font-bold text-[#0B1B2B] border-b border-[#E2EEF5] pb-3 flex items-center justify-between">
            <span>ترتيب الجامعات المشاركة</span>
            <Building2 className="w-4 h-4 text-[#5A6E7F]" />
          </h2>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {Object.keys(stats.universityCounts).length === 0 ? (
              <p className="text-xs text-[#5A6E7F] text-center py-8">لا توجد بيانات مشاركات حتى الآن</p>
            ) : (
              Object.entries(stats.universityCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([uniName, count]) => (
                  <div
                    key={uniName}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F4FBFD] border border-[#E2EEF5] text-xs"
                  >
                    <span className="font-bold text-[#0B1B2B]">{uniName}</span>
                    <span className="px-2.5 py-1 rounded-full bg-[#008DC3] text-white font-mono font-bold">
                      {count}
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="glass-card p-6 border border-[#E2EEF5] bg-white space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2EEF5] pb-4">
          <h2 className="text-base font-bold text-[#0B1B2B]">آخر المشاركات المستلمة</h2>
          <Link
            href="/admin/submissions"
            className="text-xs font-semibold text-[#008DC3] hover:underline flex items-center gap-1"
          >
            <span>عرض الجميع</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recentSubmissions.length === 0 ? (
          <div className="text-center py-12 text-[#5A6E7F]">
            <AlertCircle className="w-8 h-8 mx-auto text-[#83CAE7] mb-2" />
            <p className="text-sm font-semibold">لم يتم إرسال أي مشاركات في النظام بعد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E2EEF5] text-[#5A6E7F] bg-[#F4FBFD]">
                  <th className="p-3 text-start">الرقم المرجعي</th>
                  <th className="p-3 text-start">الاسم</th>
                  <th className="p-3 text-start">الجامعة</th>
                  <th className="p-3 text-start">الفئة</th>
                  <th className="p-3 text-start">الحالة</th>
                  <th className="p-3 text-start">التاريخ</th>
                  <th className="p-3 text-start">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EEF5]">
                {stats.recentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#F4FBFD]/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#008DC3]">{sub.reference_code}</td>
                    <td className="p-3 font-semibold text-[#0B1B2B]">{sub.full_name}</td>
                    <td className="p-3 text-[#2A3F55]">
                      {sub.university ? sub.university.name_ar : sub.university_other_name}
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full bg-[#CDEAF5]/40 text-[#008DC3] font-semibold text-[11px]">
                        {sub.competition_type === 'report' && 'أفضل تقرير'}
                        {sub.competition_type === 'photo' && 'أفضل صورة'}
                        {sub.competition_type === 'passport' && 'أفضل جواز'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E2EEF5] text-[#2A3F55]">
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-3 text-[#5A6E7F]">
                      {new Date(sub.created_at).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/admin/submissions/${sub.id}`}
                        className="px-3 py-1 rounded-lg bg-[#008DC3] text-white font-semibold text-[11px] hover:bg-[#0076A5]"
                      >
                        التفاصيل
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
