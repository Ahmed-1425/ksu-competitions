import React from 'react';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import About from '@/components/landing/About';
import Competitions from '@/components/landing/Competitions';
import Steps from '@/components/landing/Steps';
import Universities from '@/components/landing/Universities';
import Faq from '@/components/landing/Faq';
import CtaSection from '@/components/landing/CtaSection';
import Footer from '@/components/landing/Footer';
import NoticeBanner from '@/components/landing/NoticeBanner';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAppSettings() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from('app_settings').select('*');

    let registrationOpen = true;
    let noticeText = { ar: '', en: '' };

    if (data) {
      data.forEach((item) => {
        if (item.key === 'registration_open') {
          registrationOpen = item.value === true || item.value === 'true' || JSON.stringify(item.value) === 'true';
        }
        if (item.key === 'notice_text' && typeof item.value === 'object' && item.value !== null) {
          noticeText = item.value as { ar: string; en: string };
        }
      });
    }

    return { registrationOpen, noticeText };
  } catch {
    return { registrationOpen: true, noticeText: { ar: '', en: '' } };
  }
}

export default async function HomePage() {
  const { registrationOpen, noticeText } = await getAppSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <NoticeBanner registrationOpen={registrationOpen} noticeText={noticeText} />
      <Header />
      <main className="flex-grow">
        <Hero />
        <About />
        <Competitions />
        <Steps />
        <Universities />
        <Faq />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
