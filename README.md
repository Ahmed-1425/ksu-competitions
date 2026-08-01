# منصة مسابقات جامعة الملك سعود | King Saud University Competitions Platform

منصة ويب إنتاجية متكاملة وفاخرة لإدارة مسابقات جامعة الملك سعود للجامعات المشاركة، مصممة بأحدث تقنيات Next.js (App Router), TypeScript, Tailwind CSS, و Supabase.

---

## 🌟 المزايا والمسابقات الثلاث

1. **أفضل تقرير (`report`):** مخصصة للجامعات المشاركة عبر مشرف أو طالب باسم الجامعة مع رابط Google Drive مفتوح للعرض.
2. **أفضل صورة فوتوغرافية (`photo`):** مخصصة لجميع الطلاب مع اشتراط صورة واحدة فقط داخل الرابط بدون ألبومات.
3. **أفضل جواز سفر (`passport`):** تسليم يدوي مع تأكيد الاستلام من الإدارة عبر لوحة التحكم.

- **الهوية البصرية:** تصميم فاخر يعتمد Light Mode واللون الرسمي `#008DC3` مع دعم كامل للغة العربية (RTL) والإنجليزية (LTR).
- **الأمان والخصوصية:** الرابط المحمي لـ Admin، حماية المخرجات بـ RLS Policies بالخادم، Honeypot لمكافحة الإغراق، و dynamic rate-limiting.
- **تصدير CSV مصفى:** تصدير نتائج البحث والفلترة بصيغة CSV آمنة تدعم اللغة العربية مع ترميز UTF-8 BOM وتجنب صيغ Excel الخبيثة.

---

## 🚀 التشغيل المحلي (Local Setup)

### 1. تثبيت الاعتمادات (Install Dependencies)
```bash
npm install
```

### 2. إعداد متغيرات البيئة (Environment Variables)
انسخ `.env.example` إلى `.env.local`:
```bash
cp .env.example .env.local
```
ثم عبئ البيانات من مشروع Supabase الخاص بك:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-server-only
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. تشغيل خادم التطوير (Development Server)
```bash
npm run dev
```
افتح المتصفح على [http://localhost:3000](http://localhost:3000)

---

## 🗄️ إعداد Supabase وقاعدة البيانات

### 1. تنفيذ هجرة الهيكلية (Database Migration)
في محرر SQL Dashboard داخل Supabase، انسخ وشغّل محتوى الملف:
`supabase/migrations/20260801000000_initial_schema.sql`

### 2. إدراج بيانات الجامعات الأولية (Seed Data)
انسخ وشغّل محتوى الملف:
`supabase/seed.sql`

### 3. إنشاء حساب المسؤول الأول (Create First Admin)
1. من تبويب **Authentication** في Supabase Dashboard، أنشئ مستخدماً جديداً بالبريد وكلمة المرور (مثل: `admin@ksu.edu.sa`).
2. انسخ `User ID` (UUID) الخاص بالمستخدم الجديد.
3. افتح **SQL Editor** ونفّذ الاستعلام الآتي لمنحه صلاحية مدير النظام:
```sql
insert into public.profiles (id, full_name, role)
values ('ضع-رقم-User-ID-هنا', 'مدير النظام', 'admin')
on conflict (id) do update set role = 'admin';
```
4. يمكنك الآن تسجيل الدخول مباشرة من المسار المحمي: `/admin/login`.

---

## 🏗️ التجميع للإنتاج للنشر (Production Build)

```bash
# بناء المشروع والتثبت من الأنواع والأنماط
npm run build

# تشغيل النسخة التجميعية محلياً
npm run start
```

### النشر على منصات الاستضافة (Deployment)
المشروع جاهز للنشر على أي بيئة تدعم Next.js مثل Vercel, Netlify, Railway, Docker, أو VPS.
تأكد من ضبط متغيرات البيئة (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) في لوحة التحكم الخاصة بمزود الاستضافة.

---

## 📄 الشعار والهوية الرسمية
- الشعار الرسمي لجامعة الملك سعود موجود بالمسار الرسمي `public/brand/ksu-logo.svg`.
- النص الإلزامي بالفوتر: `اللجنة التقنية ببرنامج الشراكة الطلابية | جامعة الملك سعود`.
