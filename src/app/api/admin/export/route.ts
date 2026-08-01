import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateSubmissionsCSV } from '@/lib/csv';
import { Submission } from '@/types/database';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Verify User Session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'غير مصرح. يرجى تسجيل الدخول أولاً.' }, { status: 401 });
    }

    // 2. Verify Admin Role in profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'عذراً، هذه الصلاحية تقتصر على المدراء فقط.' }, { status: 403 });
    }

    // 3. Extract Filter Search Parameters
    const url = new URL(req.url);
    const competition_type = url.searchParams.get('competition_type');
    const university_id = url.searchParams.get('university_id');
    const status = url.searchParams.get('status');
    const read_status = url.searchParams.get('read_status');
    const search = url.searchParams.get('search');
    const locale = (url.searchParams.get('locale') as 'ar' | 'en') || 'ar';

    // 4. Fetch Submissions with Filters
    const adminSupabase = createAdminClient();
    let query = adminSupabase
      .from('submissions')
      .select('*, university:universities(*)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (competition_type && competition_type !== 'all') {
      query = query.eq('competition_type', competition_type);
    }

    if (university_id && university_id !== 'all') {
      if (university_id === 'other') {
        query = query.is('university_id', null);
      } else {
        query = query.eq('university_id', university_id);
      }
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (read_status === 'read') {
      query = query.not('read_at', 'is', null);
    } else if (read_status === 'unread') {
      query = query.is('read_at', null);
    }

    if (search && search.trim() !== '') {
      const q = `%${search.trim()}%`;
      query = query.or(`full_name.ilike.${q},reference_code.ilike.${q},phone.ilike.${q},university_other_name.ilike.${q}`);
    }

    const { data: submissions, error } = await query;

    if (error) {
      console.error('CSV export query error:', error);
      return NextResponse.json({ error: 'حدث خطأ أثناء جلب البيانات للتصدير.' }, { status: 500 });
    }

    const submissionList = (submissions || []) as Submission[];

    // 5. Generate CSV with UTF-8 BOM
    const csvData = generateSubmissionsCSV(submissionList, locale);

    // 6. Log Export Audit Activity
    await adminSupabase.from('submission_activity').insert([
      {
        submission_id: submissionList[0]?.id || '00000000-0000-0000-0000-000000000000',
        actor_id: user.id,
        event_type: 'submissions_exported_csv',
        metadata: {
          count: submissionList.length,
          filters: { competition_type, university_id, status, read_status, search },
        },
      },
    ]);

    const filename = `ksu_submissions_${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err: unknown) {
    console.error('Export CSV handler error:', err);
    return NextResponse.json({ error: 'حدث خطأ بالخادم عند تصدير البيانات.' }, { status: 500 });
  }
}
