import { NextRequest, NextResponse } from 'next/server';
import { submissionFormSchema } from '@/lib/validation/submission';
import { createAdminClient } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';
import { revalidatePath } from 'next/cache';

function generateReferenceCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'KSU-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const rateCheck = rateLimit(ip, 10, 60000);

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'تم تجاوز حد الطلبات المسموح به. يرجى الانتظار دقيقة وتكرار المحاولة.' },
        { status: 429 }
      );
    }

    const supabase = createAdminClient();

    // 2. Check if Registration is Open in App Settings
    const { data: settingsData } = await supabase
      .from('app_settings')
      .select('*')
      .eq('key', 'registration_open')
      .maybeSingle();

    if (settingsData) {
      const isOpen = settingsData.value === true || settingsData.value === 'true' || JSON.stringify(settingsData.value) === 'true';
      if (!isOpen) {
        return NextResponse.json(
          { error: 'عذراً، تم إغلاق فترة استقبال المشاركات حالياً من قِبل إدارة النظام.' },
          { status: 403 }
        );
      }
    }

    const body = await req.json();

    // 3. Anti-Spam Honeypot check
    if (body.honeypot && body.honeypot.trim() !== '') {
      return NextResponse.json({
        success: true,
        reference_code: generateReferenceCode(),
      });
    }

    // 4. Zod Validation
    const validationResult = submissionFormSchema.safeParse(body);
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0]?.message || 'البيانات المدخلة غير صالحة';
      return NextResponse.json({ error: firstIssue, issues: validationResult.error.issues }, { status: 400 });
    }

    const data = validationResult.data;

    // 5. Determine University values
    const university_id = data.university_id === 'other' ? null : (data.university_id || null);
    const university_other_name = data.university_id === 'other' ? data.university_other_name : null;

    // 6. Generate Reference Code
    const reference_code = generateReferenceCode();

    const insertPayload = {
      reference_code,
      full_name: data.full_name,
      phone: data.phone,
      university_id: university_id,
      university_other_name: university_other_name,
      competition_type: data.competition_type,
      drive_url: (data.competition_type === 'report' || data.competition_type === 'photo') ? data.drive_url : null,
      submitter_role: data.submitter_role || null,
      passport_delivered: data.competition_type === 'passport' ? true : false,
      terms_accepted_at: new Date().toISOString(),
      photo_single_item_confirmed: data.competition_type === 'photo' ? true : false,
      status: data.competition_type === 'passport' ? 'pending_receipt' : 'new',
    };

    const { data: newSubmission, error: insertError } = await supabase
      .from('submissions')
      .insert([insertPayload])
      .select('id, reference_code')
      .single();

    if (insertError) {
      console.error('Submission database insert error:', insertError);
      return NextResponse.json(
        { error: 'حدث خطأ أثناء حفظ المشاركة في قاعدة البيانات. يرجى المحاولة لاحقاً.' },
        { status: 500 }
      );
    }

    // 7. Insert Audit Activity Log
    await supabase.from('submission_activity').insert([
      {
        submission_id: newSubmission.id,
        event_type: 'submission_created',
        metadata: {
          competition_type: data.competition_type,
          university_id,
          university_other_name,
          ip_masked: ip.substring(0, 7) + '***',
        },
      },
    ]);

    // 8. Instantly invalidate Next.js caches for admin dashboard and submissions
    try {
      revalidatePath('/admin', 'layout');
      revalidatePath('/admin/submissions');
      revalidatePath('/admin/submissions/report');
      revalidatePath('/admin/submissions/photo');
      revalidatePath('/admin/submissions/passport');
    } catch (e) {
      console.log('Revalidate notice:', e);
    }

    return NextResponse.json({
      success: true,
      reference_code: newSubmission.reference_code,
    });
  } catch (err: unknown) {
    console.error('Unhandled submission API error:', err);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع بالخادم.' },
      { status: 500 }
    );
  }
}
