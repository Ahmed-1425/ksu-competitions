import { Submission } from '@/types/database';

function sanitizeCellValue(val: unknown): string {
  if (val === null || val === undefined) return '';
  let str = String(val).trim();
  
  // Protect against CSV Formula Injection in Excel
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  
  // Double quotes escaping
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  
  return str;
}

export function generateSubmissionsCSV(submissions: Submission[], locale: 'ar' | 'en' = 'ar'): string {
  const isAr = locale === 'ar';

  const headers = isAr
    ? [
        'الرقم المرجعي',
        'الاسم الكامل',
        'رقم الجوال',
        'الجامعة',
        'اسم الجامعة الأخرى',
        'نوع المسابقة',
        'رابط Google Drive',
        'صفة المشارك',
        'تم استلام الجواز',
        'تاريخ تأكيد استلام الجواز',
        'حالة القراءة',
        'الحالة',
        'تاريخ الإرسال',
      ]
    : [
        'Reference Code',
        'Full Name',
        'Phone Number',
        'University',
        'Other University Name',
        'Competition Type',
        'Google Drive URL',
        'Submitter Role',
        'Passport Delivered',
        'Receipt Confirmed Date',
        'Read Status',
        'Status',
        'Submission Date',
      ];

  const competitionLabels: Record<string, { ar: string; en: string }> = {
    report: { ar: 'أفضل تقرير', en: 'Best Report' },
    photo: { ar: 'أفضل صورة فوتوغرافية', en: 'Best Photography' },
    passport: { ar: 'أفضل جواز سفر', en: 'Best Passport' },
  };

  const statusLabels: Record<string, { ar: string; en: string }> = {
    new: { ar: 'جديد', en: 'New' },
    under_review: { ar: 'قيد المراجعة', en: 'Under Review' },
    accepted: { ar: 'مقبول', en: 'Accepted' },
    rejected: { ar: 'مستبعد', en: 'Rejected' },
    completed: { ar: 'مكتمل', en: 'Completed' },
    pending_receipt: { ar: 'بانتظار تأكيد الاستلام', en: 'Pending Receipt' },
    received: { ar: 'تم الاستلام', en: 'Received' },
  };

  const rows = submissions.map((sub) => {
    const universityName = sub.university
      ? (isAr ? sub.university.name_ar : sub.university.name_en || sub.university.name_ar)
      : (sub.university_other_name || (isAr ? 'أخرى' : 'Other'));

    const compLabel = competitionLabels[sub.competition_type]
      ? (isAr ? competitionLabels[sub.competition_type].ar : competitionLabels[sub.competition_type].en)
      : sub.competition_type;

    const statusLabel = statusLabels[sub.status]
      ? (isAr ? statusLabels[sub.status].ar : statusLabels[sub.status].en)
      : sub.status;

    const readStatus = sub.read_at
      ? (isAr ? 'مقروءة' : 'Read')
      : (isAr ? 'غير مقروءة' : 'Unread');

    const passportDeliveredText = sub.passport_delivered
      ? (isAr ? 'نعم' : 'Yes')
      : (isAr ? 'لا' : 'No');

    const createdDateStr = new Date(sub.created_at).toLocaleString(isAr ? 'ar-SA' : 'en-US');
    const receiptDateStr = sub.receipt_confirmed_at
      ? new Date(sub.receipt_confirmed_at).toLocaleString(isAr ? 'ar-SA' : 'en-US')
      : '';

    return [
      sub.reference_code,
      sub.full_name,
      sub.phone,
      universityName,
      sub.university_other_name || '',
      compLabel,
      sub.drive_url || '',
      sub.submitter_role || '',
      passportDeliveredText,
      receiptDateStr,
      readStatus,
      statusLabel,
      createdDateStr,
    ].map(sanitizeCellValue).join(',');
  });

  // Include UTF-8 BOM byte order mark (\uFEFF) so Excel opens Arabic correctly
  const csvContent = '\uFEFF' + [headers.map(sanitizeCellValue).join(','), ...rows].join('\r\n');
  return csvContent;
}
