import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n/context';

export const metadata: Metadata = {
  title: 'منصة مسابقات جامعة الملك سعود | King Saud University Competitions Platform',
  description: 'المنصة الرسمية لمسابقات جامعة الملك سعود المفتوحة لجميع الطلاب والمشرفين بالجامعات المشاركة (أفضل تقرير، أفضل صورة فوتوغرافية، أفضل جواز سفر).',
  keywords: ['جامعة الملك سعود', 'مسابقات طلابية', 'لجنة عمداء شؤون الطلاب', 'أفضل تقرير', 'أفضل صورة', 'أفضل جواز', 'KSU Competitions'],
  authors: [{ name: 'لجنة عمداء شؤون الطلاب للجامعات السعودية | جامعة الملك سعود' }],
  openGraph: {
    title: 'منصة مسابقات جامعة الملك سعود',
    description: 'أطلق فكرتك. شارك أثرَك. المنصة التنافسية الرسمية للجامعات المشاركة.',
    url: 'https://competitions.ksu.edu.sa',
    siteName: 'منصة مسابقات جامعة الملك سعود',
    locale: 'ar_SA',
    type: 'website',
  },
  icons: {
    icon: '/brand/committee-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#F8F7F4] text-[#142921] font-sans">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
