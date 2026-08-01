'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Submission, University, CompetitionType, SubmissionStatus } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  FileSpreadsheet,
  X,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Mail,
  MailCheck,
  Compass,
} from 'lucide-react';

interface SubmissionsTableProps {
  initialSubmissions: Submission[];
  universities: University[];
  forcedCompetitionType?: CompetitionType;
}

export default function SubmissionsTable({
  initialSubmissions,
  universities,
  forcedCompetitionType,
}: SubmissionsTableProps) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [competitionFilter, setCompetitionFilter] = useState<string>(forcedCompetitionType || 'all');
  const [universityFilter, setUniversityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<string>('all');

  const [sortField, setSortField] = useState<'created_at' | 'full_name' | 'university'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  // Filter Logic
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      if (forcedCompetitionType && sub.competition_type !== forcedCompetitionType) {
        return false;
      }
      if (!forcedCompetitionType && competitionFilter !== 'all' && sub.competition_type !== competitionFilter) {
        return false;
      }

      if (universityFilter !== 'all') {
        if (universityFilter === 'other' && sub.university_id !== null) {
          return false;
        }
        if (universityFilter !== 'other' && sub.university_id !== universityFilter) {
          return false;
        }
      }

      if (statusFilter !== 'all' && sub.status !== statusFilter) {
        return false;
      }

      if (readFilter === 'read' && !sub.read_at) return false;
      if (readFilter === 'unread' && sub.read_at) return false;

      if (searchTerm.trim() !== '') {
        const q = searchTerm.trim().toLowerCase();
        const nameMatch = sub.full_name.toLowerCase().includes(q);
        const refMatch = sub.reference_code.toLowerCase().includes(q);
        const phoneMatch = sub.phone.includes(q);
        const uniMatch = (sub.university?.name_ar || sub.university_other_name || '').toLowerCase().includes(q);

        if (!nameMatch && !refMatch && !phoneMatch && !uniMatch) {
          return false;
        }
      }

      return true;
    });
  }, [submissions, forcedCompetitionType, competitionFilter, universityFilter, statusFilter, readFilter, searchTerm]);

  // Sort Logic
  const sortedSubmissions = useMemo(() => {
    return [...filteredSubmissions].sort((a, b) => {
      if (sortField === 'created_at') {
        const tA = new Date(a.created_at).getTime();
        const tB = new Date(b.created_at).getTime();
        return sortOrder === 'desc' ? tB - tA : tA - tB;
      }
      if (sortField === 'full_name') {
        return sortOrder === 'desc'
          ? b.full_name.localeCompare(a.full_name, 'ar')
          : a.full_name.localeCompare(b.full_name, 'ar');
      }
      return 0;
    });
  }, [filteredSubmissions, sortField, sortOrder]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedSubmissions.length / pageSize) || 1;
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedSubmissions.slice(start, start + pageSize);
  }, [sortedSubmissions, currentPage, pageSize]);

  const handleClearFilters = () => {
    setSearchTerm('');
    if (!forcedCompetitionType) setCompetitionFilter('all');
    setUniversityFilter('all');
    setStatusFilter('all');
    setReadFilter('all');
    setCurrentPage(1);
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const queryParams = new URLSearchParams();
      if (competitionFilter !== 'all') queryParams.set('competition_type', competitionFilter);
      if (universityFilter !== 'all') queryParams.set('university_id', universityFilter);
      if (statusFilter !== 'all') queryParams.set('status', statusFilter);
      if (readFilter !== 'all') queryParams.set('read_status', readFilter);
      if (searchTerm) queryParams.set('search', searchTerm);

      const res = await fetch(`/api/admin/export?${queryParams.toString()}`);
      if (!res.ok) throw new Error('فشل تصدير CSV');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ksu_submissions_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      alert('حدث خطأ أثناء تصدير CSV.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleBulkMarkRead = async () => {
    if (selectedIds.length === 0 || isBulkUpdating) return;
    setIsBulkUpdating(true);

    try {
      const supabase = createClient();
      const now = new Date().toISOString();

      const { error } = await supabase
        .from('submissions')
        .update({ read_at: now })
        .in('id', selectedIds);

      if (error) throw error;

      setSubmissions((prev) =>
        prev.map((s) => (selectedIds.includes(s.id) ? { ...s, read_at: now } : s))
      );
      setSelectedIds([]);
    } catch {
      alert('حدث خطأ أثناء تحديث حالة القراءة للمحدد.');
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedSubmissions.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Toolbar */}
      <div className="glass-card p-6 border border-[#D7CFC1] bg-white space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="بحث بالاسم، الرقم المرجعي، الجوال..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-[#D7CFC1] bg-[#F8F7F4]/50 text-xs text-[#142921] focus:bg-white focus:border-[#1F5A46]"
            />
            <Search className="w-4 h-4 text-[#62776D] absolute top-1/2 right-3 -translate-y-1/2" />
          </div>

          {/* Category Filter */}
          {!forcedCompetitionType && (
            <select
              value={competitionFilter}
              onChange={(e) => {
                setCompetitionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-[#D7CFC1] bg-[#F8F7F4]/50 text-xs text-[#142921] focus:bg-white focus:border-[#1F5A46]"
            >
              <option value="all">جميع المسابقات</option>
              <option value="report">أفضل تقرير</option>
              <option value="photo">أفضل صورة فوتوغرافية</option>
              <option value="passport">أفضل جواز سفر</option>
            </select>
          )}

          {/* University Filter */}
          <select
            value={universityFilter}
            onChange={(e) => {
              setUniversityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2.5 rounded-xl border border-[#D7CFC1] bg-[#F8F7F4]/50 text-xs text-[#142921] focus:bg-white focus:border-[#1F5A46]"
          >
            <option value="all">جميع الجامعات</option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name_ar}
              </option>
            ))}
            <option value="other">جامعات أخرى</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2.5 rounded-xl border border-[#D7CFC1] bg-[#F8F7F4]/50 text-xs text-[#142921] focus:bg-white focus:border-[#1F5A46]"
          >
            <option value="all">جميع الحالات</option>
            <option value="new">جديد (New)</option>
            <option value="under_review">قيد المراجعة</option>
            <option value="accepted">مقبولة</option>
            <option value="rejected">مستبعدة</option>
            <option value="completed">مكتملة</option>
            <option value="pending_receipt">بانتظار تأكيد استلام الجواز</option>
            <option value="received">تم استلام الجواز</option>
          </select>

          {/* Read Filter */}
          <select
            value={readFilter}
            onChange={(e) => {
              setReadFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2.5 rounded-xl border border-[#D7CFC1] bg-[#F8F7F4]/50 text-xs text-[#142921] focus:bg-white focus:border-[#1F5A46]"
          >
            <option value="all">حالة القراءة (الكل)</option>
            <option value="unread">غير مقروءة فقط</option>
            <option value="read">مقروءة فقط</option>
          </select>
        </div>

        {/* Action bar (Clear filters, Bulk actions, Export CSV) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#D7CFC1]">
          <div className="flex items-center gap-3 text-xs text-[#62776D]">
            <span className="font-bold text-[#142921]">
              إجمالي النتائج المفلترة: {filteredSubmissions.length} مشاركة
            </span>
            {(searchTerm || competitionFilter !== 'all' || universityFilter !== 'all' || statusFilter !== 'all' || readFilter !== 'all') && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 text-red-600 hover:underline font-semibold"
              >
                <X className="w-3.5 h-3.5" />
                <span>مسح الفلاتر</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkMarkRead}
                disabled={isBulkUpdating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F5A46]/10 text-[#1F5A46] font-bold text-xs border border-[#1F5A46]/20 hover:bg-[#1F5A46]/20"
              >
                {isBulkUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MailCheck className="w-3.5 h-3.5" />}
                <span>تعليم ({selectedIds.length}) كمقروءة</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F5A46] text-white text-xs font-bold hover:bg-[#174535] transition-all shadow-xs disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-[#C9A96A]" />}
              <span>تصدير CSV النتائج المفلترة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-card border border-[#D7CFC1] bg-white overflow-hidden shadow-sm">
        {paginatedSubmissions.length === 0 ? (
          <div className="text-center py-16 text-[#62776D] space-y-2">
            <FileSpreadsheet className="w-10 h-10 mx-auto text-[#C9A96A]" />
            <p className="font-bold text-sm">لا توجد مشاركات تطابق الفلاتر المحددة حالياً</p>
            <button
              onClick={handleClearFilters}
              className="text-xs text-[#1F5A46] underline font-semibold mt-1"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#D7CFC1] text-[#62776D] bg-[#F8F7F4]">
                  <th className="p-3 text-start w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === paginatedSubmissions.length && paginatedSubmissions.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="accent-[#1F5A46] w-4 h-4"
                    />
                  </th>
                  <th className="p-3 text-start">الرقم المرجعي</th>
                  <th className="p-3 text-start">الاسم الكامل</th>
                  <th className="p-3 text-start">الجوال</th>
                  <th className="p-3 text-start">الجامعة</th>
                  <th className="p-3 text-start">المسابقة</th>
                  <th className="p-3 text-start">الحالة</th>
                  <th className="p-3 text-start">القراءة</th>
                  <th className="p-3 text-start">التاريخ</th>
                  <th className="p-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D7CFC1]/60">
                {paginatedSubmissions.map((sub) => {
                  const isRead = Boolean(sub.read_at);
                  const isPendingPassport = sub.competition_type === 'passport' && !sub.receipt_confirmed_at;

                  return (
                    <tr
                      key={sub.id}
                      className={`hover:bg-[#F8F7F4]/80 transition-colors ${
                        !isRead ? 'bg-[#1F5A46]/5 font-semibold' : ''
                      }`}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(sub.id)}
                          onChange={() => handleToggleSelect(sub.id)}
                          className="accent-[#1F5A46] w-4 h-4"
                        />
                      </td>
                      <td className="p-3 font-mono font-bold text-[#1F5A46]">
                        {sub.reference_code}
                      </td>
                      <td className="p-3 font-bold text-[#142921]">{sub.full_name}</td>
                      <td className="p-3 text-[#2D3E36]" dir="ltr">
                        {sub.phone}
                      </td>
                      <td className="p-3 text-[#2D3E36]">
                        {sub.university ? sub.university.name_ar : sub.university_other_name || 'أخرى'}
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full bg-[#1F5A46]/10 text-[#1F5A46] font-semibold text-[11px]">
                          {sub.competition_type === 'report' && 'أفضل تقرير'}
                          {sub.competition_type === 'photo' && 'أفضل صورة'}
                          {sub.competition_type === 'passport' && 'أفضل جواز'}
                        </span>
                      </td>
                      <td className="p-3">
                        {isPendingPassport ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
                            <Compass className="w-3 h-3 text-amber-700 animate-pulse" />
                            <span>بانتظار استلام الجواز</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D7CFC1]/40 text-[#2D3E36]">
                            {sub.status}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {isRead ? (
                          <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>مقروءة</span>
                          </span>
                        ) : (
                          <span className="text-[#1F5A46] font-bold text-[11px] flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-[#C9A96A]" />
                            <span>جديدة</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-[#62776D]">
                        {new Date(sub.created_at).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="p-3 text-center">
                        <Link
                          href={`/admin/submissions/${sub.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1F5A46] text-white font-bold text-[11px] hover:bg-[#174535] transition-all shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#C9A96A]" />
                          <span>التفاصيل</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#D7CFC1] bg-[#F8F7F4] flex items-center justify-between text-xs text-[#62776D]">
            <span>
              الصفحة {currentPage} من {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-[#D7CFC1] bg-white font-semibold hover:bg-[#F8F7F4] disabled:opacity-40"
              >
                السابق
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-[#D7CFC1] bg-white font-semibold hover:bg-[#F8F7F4] disabled:opacity-40"
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
