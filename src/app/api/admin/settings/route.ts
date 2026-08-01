import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { registration_open, notice_ar, notice_en } = body;

    const supabase = createAdminClient();

    // Upsert registration_open
    const { error: err1 } = await supabase
      .from('app_settings')
      .upsert(
        {
          key: 'registration_open',
          value: Boolean(registration_open),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

    if (err1) {
      console.error('Error updating registration_open setting:', err1);
      return NextResponse.json({ error: err1.message }, { status: 500 });
    }

    // Upsert notice_text
    const { error: err2 } = await supabase
      .from('app_settings')
      .upsert(
        {
          key: 'notice_text',
          value: { ar: notice_ar || '', en: notice_en || '' },
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

    if (err2) {
      console.error('Error updating notice_text setting:', err2);
      return NextResponse.json({ error: err2.message }, { status: 500 });
    }

    // Force Next.js cache revalidation for all pages
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/register');
      revalidatePath('/admin/settings');
    } catch (e) {
      console.log('Cache revalidate notice:', e);
    }

    return NextResponse.json({
      success: true,
      registration_open: Boolean(registration_open),
      notice_text: { ar: notice_ar || '', en: notice_en || '' },
    });
  } catch (err: unknown) {
    console.error('Admin Settings API Error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to update settings';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
