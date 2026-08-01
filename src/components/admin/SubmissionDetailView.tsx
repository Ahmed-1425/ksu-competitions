'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Submission, SubmissionActivity, SubmissionStatus } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Clock,
  Compass,
  FileText,
  User,
  Phone,
  Building2,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

interface SubmissionDetailViewProps {
  submission: Submission;
  activityLogs: SubmissionActivity[];
  currentUserId: string;
}

export default function SubmissionDetailView({
  submission: initialSubmission,
  activityLogs: initialLogs,
  currentUserId,
}: SubmissionDetailViewProps) {
  const router = useRouter();
  const [submission, setSubmission] = useState<Submission>(initialSubmission);
  const [logs, setLogs] = useState<SubmissionActivity[]>(initialLogs);
  const [status, setStatus] = useState<SubmissionStatus>(initialSubmission.status);

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isConfirmingPassport, setIsConfirmingPassport] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    async function markAsRead() {
      if (!initialSubmission.read_at) {
        const supabase = createClient();
        const now = new Date().toISOString();
        const { error } = await supabase
          .from('submissions')
          .update({ read_at: now, read_by: currentUserId })
          .eq('id', initialSubmission.id);

        if (!error) {
          setSubmission((prev) => ({ ...prev, read_at: now, read_by: currentUserId }));
          await supabase.from('submission_activity').insert([
            {
              submission_id: initialSubmission.id,
              actor_id: currentUserId,
              event_type: 'submission_read',
              metadata: { read_at: now },
            },
          ]);
        }
      }
    }
    markAsRead();
  }, [initialSubmission.id, initialSubmission.read_at, currentUserId]);

  const handleStatusChange = async (newStatus: SubmissionStatus) => {
    setIsUpdatingStatus(true);
    setActionMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('submissions')
        .update({ status: newStatus })
        .eq('id', submission.id);

      if (error) throw error;

      setSubmission((prev) => ({ ...prev, status: newStatus }));
      setStatus(newStatus);

      const { data: logData } = await supabase
        .from('submission_activity')
        .insert([
          {
            submission_id: submission.id,
            actor_id: currentUserId,
            event_type: 'status_updated',
            metadata: { old_status: submission.status, new_status: newStatus },
          },
        ])
        .select('*')
        .single();

      if (logData) {
        setLogs((prev) => [logData as SubmissionActivity, ...prev]);
      }

      setActionMessage('تم تحديث حالة المشاركة بنجاح');
      setTimeout(() => setActionMessage(null), 3000);
    } catch {
      alert('حدث خطأ أثناء تحديث الحالة');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleConfirmPassportReceipt = async () => {
    setIsConfirmingPassport(true);
    setActionMessage(null);

    try {
      const supabase = createClient();
      const now = new Date().toISOString();

      const { error } = await supabase
        .from('submissions')
        .update({
          receipt_confirmed_at: now,
          receipt_confirmed_by: currentUserId,
          status: 'received',
        })
        .eq('id', submission.id);

      if (error) throw error;

      setSubmission((prev) => ({
        ...prev,
        receipt_confirmed_at: now,
        receipt_confirmed_by: currentUserId,
        status: 'received',
      }));
      setStatus('received');

      const { data: logData } = await supabase
        .from('submission_activity')
        .insert([
          {
            submission_id: submission.id,
            actor_id: currentUserId,
            event_type: 'passport_receipt_confirmed',
            metadata: { confirmed_at: now },
          },
        ])
        .select('*')
        .single();

      if (logData) {
        setLogs((prev) => [logData as SubmissionActivity, ...prev]);
      }

      setShowPassportModal(false);
      setActionMessage('تم تأكيد استلام جواز السفر بنجاح في المنصة!');
      setTimeout(() => setActionMessage(null), 3000);
    } catch {
      alert('حدث خطأ أثناء تأكيد استلام الجواز');
    } finally {
      setIsConfirmingPassport(false);
    }
  };

  const handleDeleteSubmission = async () => {
    setIsDeleting(true);

    try {
      const supabase = createClient();
      const now = new Date().toISOString();

      const { error } = await supabase
        .from('submissions')
        .update({ deleted_at: now })
        .eq('id', submission.id);

      if (error) throw error;

      await supabase.from('submission_activity').insert([
        {
          submission_id: submission.id,
          actor_id: currentUserId,
          event_type: 'submission_deleted',
          metadata: { deleted_at: now },
        },
      ]);

      router.push('/admin/submissions');
    } catch {
      alert('حدث خطأ أثناء حذف المشاركة');
      setIsDeleting(false);
    }
  };

  const isPassport = submission.competition_type === 'passport';
  const isPassportConfirmed = Boolean(submission.receipt_confirmed_at);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D7CFC1] pb-6">
        <div>
          <Link
            href="/admin/submissions"
            className="inline-flex items-center gap-1 text-xs text-[#1F5A46] font-bold hover:underline mb-2"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة لقائمة المشاركات</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#142921]">
              مشاركة: {submission.full_name}
            </h1>
            <span className="font-mono text-sm font-extrabold text-[#1F5A46] bg-[#C9A96A]/20 px-3 py-1 rounded-full border border-[#C9A96A]/40">
              {submission.reference_code}
            </span>
          </div>
        </div>

        {isPassport && (
          <div>
            {isPassportConfirmed ? (
              <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>تم تأكيد استلام الجواز يدويًا</span>
              </div>
            ) : (
              <button
                onClick={() => setShowPassportModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all active:scale-98"
              >
                <Compass className="w-4 h-4 text-[#C9A96A]" />
                <span>تأكيد استلام الجواز يدويًا</span>
              </button>
            )}
          </div>
        )}
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Data Details */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card p-6 border border-[#D7CFC1] bg-white space-y-6">
            <h2 className="text-base font-bold text-[#142921] border-b border-[#D7CFC1] pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[#1F5A46]" />
              <span>البيانات الأساسية للمشارك</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-[#F8F7F4] border border-[#D7CFC1]">
                <span className="text-[#62776D] block">الاسم الكامل:</span>
                <span className="font-bold text-[#142921] text-sm mt-0.5 block">
                  {submission.full_name}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F7F4] border border-[#D7CFC1]">
                <span className="text-[#62776D] block">رقم الجوال:</span>
                <span className="font-bold text-[#142921] text-sm mt-0.5 block font-mono" dir="ltr">
                  {submission.phone}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F7F4] border border-[#D7CFC1]">
                <span className="text-[#62776D] block">الجامعة المشاركة:</span>
                <span className="font-bold text-[#142921] text-sm mt-0.5 block">
                  {submission.university ? submission.university.name_ar : submission.university_other_name}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F7F4] border border-[#D7CFC1]">
                <span className="text-[#62776D] block">مسار المسابقة:</span>
                <span className="font-bold text-[#1F5A46] text-sm mt-0.5 block">
                  {submission.competition_type === 'report' && 'أفضل تقرير (Report)'}
                  {submission.competition_type === 'photo' && 'أفضل صورة فوتوغرافية (Photography)'}
                  {submission.competition_type === 'passport' && 'أفضل جواز سفر (Passport)'}
                </span>
              </div>

              {submission.submitter_role && (
                <div className="p-3 rounded-xl bg-[#F8F7F4] border border-[#D7CFC1] sm:col-span-2">
                  <span className="text-[#62776D] block">صفة المقدّم:</span>
                  <span className="font-bold text-[#142921] text-sm mt-0.5 block">
                    {submission.submitter_role}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Submission Payload */}
          <div className="glass-card p-6 border border-[#D7CFC1] bg-white space-y-4">
            <h2 className="text-base font-bold text-[#142921] border-b border-[#D7CFC1] pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#1F5A46]" />
              <span>محتوى المشاركة المرفق</span>
            </h2>

            {submission.drive_url ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#F8F7F4] border border-[#D7CFC1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="truncate">
                    <span className="text-xs text-[#62776D] block">رابط Google Drive المرفق:</span>
                    <span className="font-mono text-xs text-[#1F5A46] underline truncate block mt-0.5">
                      {submission.drive_url}
                    </span>
                  </div>

                  <a
                    href={submission.drive_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F5A46] text-white font-bold text-xs hover:bg-[#174535] transition-all shadow-xs shrink-0"
                  >
                    <span>فتح الرابط في نافذة جديدة</span>
                    <ExternalLink className="w-4 h-4 text-[#C9A96A]" />
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    تنبيه أمني: تأكد دائماً من معاينة الروابط الخارجية بحذر والتثبت من مطابقة ملف التقرير/الصورة لشروط الفئة.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-[#F8F7F4] border border-[#D7CFC1] space-y-2 text-xs">
                <span className="font-bold text-[#142921] block">مسار جواز السفر (تسليم يدوي):</span>
                <p className="text-[#62776D]">
                  تمت المشاركة في مسار جواز السفر عبر الإقرار بالتسليم اليدوي للمشرف.
                </p>
                {isPassportConfirmed ? (
                  <div className="pt-2 text-emerald-700 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم تأكيد الاستلام اليدوي بتاريخ: {new Date(submission.receipt_confirmed_at!).toLocaleString('ar-SA')}</span>
                  </div>
                ) : (
                  <div className="pt-2 text-amber-700 font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>بانتظار تأكيد استلام الجواز من الإدارة.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Activity Logs */}
          <div className="glass-card p-6 border border-[#D7CFC1] bg-white space-y-4">
            <h2 className="text-base font-bold text-[#142921] border-b border-[#D7CFC1] pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1F5A46]" />
              <span>سجل الأنشطة والأحداث (Audit Trail)</span>
            </h2>

            <div className="space-y-3">
              {logs.length === 0 ? (
                <p className="text-xs text-[#62776D]">لا توجد أحداث مسجلة بعد</p>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-[#F8F7F4] border border-[#D7CFC1] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#142921] block">
                        {log.event_type === 'submission_created' && 'أنشئت المشاركة في النظام'}
                        {log.event_type === 'submission_read' && 'تم فتح وعرض المشاركة من الإدارة'}
                        {log.event_type === 'status_updated' && 'تم تحديث حالة المشاركة'}
                        {log.event_type === 'passport_receipt_confirmed' && 'تم تأكيد استلام الجواز يدويًا'}
                        {log.event_type === 'submission_deleted' && 'تم إجراء حذف ناعم للمشاركة'}
                        {!['submission_created', 'submission_read', 'status_updated', 'passport_receipt_confirmed', 'submission_deleted'].includes(log.event_type) && log.event_type}
                      </span>
                      <span className="text-[10px] text-[#62776D]">
                        {JSON.stringify(log.metadata)}
                      </span>
                    </div>

                    <span className="text-[10px] text-[#62776D] font-mono">
                      {new Date(log.created_at).toLocaleString('ar-SA')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar Control */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 border border-[#D7CFC1] bg-white space-y-4">
            <h3 className="text-sm font-bold text-[#142921] border-b border-[#D7CFC1] pb-2">
              إدارة حالة المشاركة
            </h3>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#2D3E36]">
                تغيير حالة الطلب:
              </label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as SubmissionStatus)}
                disabled={isUpdatingStatus}
                className="w-full px-3 py-2.5 rounded-xl border border-[#D7CFC1] bg-[#F8F7F4] text-xs font-bold text-[#142921] focus:border-[#1F5A46]"
              >
                <option value="new">جديد (New)</option>
                <option value="under_review">قيد المراجعة (Under Review)</option>
                <option value="accepted">مقبولة (Accepted)</option>
                <option value="rejected">مستبعدة (Rejected)</option>
                <option value="completed">مكتملة (Completed)</option>
                <option value="pending_receipt">بانتظار تأكيد الاستلام</option>
                <option value="received">تم الاستلام (Received)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-[#D7CFC1] text-[11px] text-[#62776D] space-y-1">
              <div className="flex items-center justify-between">
                <span>تاريخ التقديم:</span>
                <span className="font-semibold">{new Date(submission.created_at).toLocaleDateString('ar-SA')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>تاريخ القراءة:</span>
                <span className="font-semibold">
                  {submission.read_at ? new Date(submission.read_at).toLocaleDateString('ar-SA') : 'غير مقروءة'}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border border-red-200 bg-red-50/30 space-y-4">
            <h3 className="text-sm font-bold text-red-900 border-b border-red-200 pb-2">
              منطقة العمليات الحساسة
            </h3>
            <p className="text-xs text-red-700">
              يمكنك حذف هذه المشاركة بالحذف الناعم (Soft Delete) بحيث تُخفى من جميع القوائم والتقارير العامة.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>حذف المشاركة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPassportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-card p-6 md:p-8 max-w-md w-full bg-white border border-[#D7CFC1] shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-[#1F5A46]/10 text-[#1F5A46] flex items-center justify-center mx-auto border border-[#C9A96A]/40">
              <Compass className="w-7 h-7 text-[#C9A96A]" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-[#142921]">
                هل تؤكد استلام جواز السفر يدويًا؟
              </h3>
              <p className="text-xs text-[#62776D]">
                سيتم تغيير حالة مشاركة <span className="font-bold text-[#142921]">{submission.full_name}</span> إلى (تم الاستلام - Received) وتسجيل تاريخ واسم المسؤول المؤكِد بالمنصة.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D7CFC1]">
              <button
                type="button"
                onClick={() => setShowPassportModal(false)}
                className="px-5 py-2.5 rounded-xl border border-[#D7CFC1] text-xs font-semibold text-[#2D3E36]"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmPassportReceipt}
                disabled={isConfirmingPassport}
                className="px-6 py-2.5 rounded-xl bg-[#1F5A46] hover:bg-[#174535] text-white text-xs font-bold shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {isConfirmingPassport ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-[#C9A96A]" />}
                <span>نعم، تأكيد الاستلام</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-card p-6 md:p-8 max-w-md w-full bg-white border border-red-200 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-red-900">
                تأكيد حذف المشاركة
              </h3>
              <p className="text-xs text-red-700">
                هل أنت متأكد من حذف مشاركة <span className="font-bold">{submission.full_name}</span>؟ سيتم نقلها للأرشيف المحذوف.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-red-100">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5 rounded-xl border border-[#D7CFC1] text-xs font-semibold text-[#2D3E36]"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmission}
                disabled={isDeleting}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md disabled:opacity-50"
              >
                {isDeleting ? 'جاري الحذف...' : 'حذف المشاركة'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
