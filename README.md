# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/5c1f6b41-0f6e-4160-a08c-339b602b7248

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5c1f6b41-0f6e-4160-a08c-339b602b7248) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Prepare the API database (first run only).
cd server && npm run prisma:migrate -- --name init && cd ..

# Step 5: Start the web and API servers concurrently.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5c1f6b41-0f6e-4160-a08c-339b602b7248) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Local Data Mode (IndexedDB)

این پروژه داده‌ها را به‌صورت محلی در مرورگر با استفاده از IndexedDB و کتابخانه Dexie ذخیره می‌کند. از صفحه «آپلود» می‌توانید فایل‌های CSV یا XLSX شامل دوره‌ها را بارگذاری کنید، پیش‌نمایش تغییرات را ببینید و سپس آن‌ها را به پایگاه‌دادهٔ محلی متعهد کنید. صفحهٔ «دوره‌ها» بلافاصله پس از commit داده‌های جدید را نمایش می‌دهد و از بخش «خروجی همه» می‌توانید اطلاعات موجود را به‌صورت فایل Excel یا CSV دریافت کنید. برای پاک‌سازی کامل داده‌های محلی، از دکمهٔ «حذف داده‌ها» استفاده کنید.

### Import Personnel & Educational Profile

از منوی «آپلود پرسنل» می‌توانید فایل‌های CSV یا XLSX حاوی ستون‌های `emp_code,name,job_title_id,job_title,department_id,department_name` را بارگذاری کنید. پس از تأیید، اطلاعات پرسنل در IndexedDB ذخیره شده و در صفحه «لیست پرسنل» قابل مشاهده خواهد بود. با کلیک روی هر پرسنل، «پرونده آموزشی» او نمایش داده می‌شود که شامل دوره‌های موردنیاز بر اساس عنوان شغلی و وضعیت گذراندن هر دوره است.

## Import Job–Course Mapping

برای نگاشت شغل‌ها به دوره‌های موردنیاز می‌توانید از صفحه «آپلود نگاشت شغل-دوره» فایل‌های CSV یا XLSX با ستون‌های `Job_Title_id, Job_Title, Department_Name, Department_id, Required_Course, Required_Course_id` را بارگذاری کنید. پس از پردازش، پیش‌نمایشی از شغل‌های جدید، به‌روزرسانی‌ها، ارتباطات جدید و خطاها نمایش داده می‌شود. در صورت نبود کد دوره، commit غیرفعال می‌شود تا ابتدا دوره‌ها وارد شوند. داده‌ها پس از commit در IndexedDB ذخیره شده و در صفحات «شغل‌ها» و «جزئیات شغل» قابل مشاهده و خروجی گرفتن هستند.

## Master Data & Personnel Assignment (IndexedDB)

برای ورود اطلاعات پایه مانند پست‌ها، بخش‌ها، اداره‌ها و مدیریت‌ها می‌توانید از صفحات مربوطه در منوی «اطلاعات پایه» استفاده کنید. هر صفحه امکان بارگذاری فایل‌های CSV/XLSX، پیش‌نمایش و commit را فراهم می‌کند. پس از ثبت، داده‌ها در IndexedDB نگهداری شده و در گفت‌وگوی «تعیین اطلاعات پایه» برای هر پرسنل قابل انتخاب هستند.

پس از بارگذاری اطلاعات پایه و پرسنل، از منوی «آپلود داده‌ها» می‌توانید به سایر آپلودها دسترسی داشته باشید. در صفحهٔ «لیست پرسنل» دکمهٔ «تعریف جایگاه» امکان ثبت تاریخچهٔ سازمانی با بازهٔ زمانی را فراهم می‌کند. در «پروندهٔ آموزشی» هر شخص نیز می‌توان دورهٔ گذرانده را همراه با تاریخ، ساعت و نمره ثبت کرد.
