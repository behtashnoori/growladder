# راهنمای اجرای پروژه نردبان آموزش

## نصب وابستگی‌ها
```bash
npm install
```

## اجرای پروژه

### 1. اجرای همزمان Frontend و Backend
```bash
npm run dev
```

### 2. اجرای جداگانه

#### فقط Frontend (React + Vite)
```bash
npm run dev:web
```
Frontend روی پورت 5173 اجرا می‌شود: http://localhost:5173

#### فقط Backend (Node.js + Express)
```bash
npm run dev:backend
```
Backend روی پورت 4000 اجرا می‌شود: http://localhost:4000

### 3. اجرای Production
```bash
# Build frontend
npm run build

# Build and run backend
npm --prefix server run build
npm --prefix server run start
```

## دسترسی به API Documentation
پس از اجرای backend، می‌توانید به مستندات API در آدرس زیر دسترسی داشته باشید:
http://localhost:4000/api-docs

## دسترسی به Prisma Studio
```bash
npm run prisma:studio
```

## پاک‌سازی و Reset
```bash
# حذف node_modules و نصب مجدد
rm -rf node_modules server/node_modules
npm install

# Reset دیتابیس
npm run prisma:migrate
npm run prisma:seed
```

## عیب‌یابی

### مشکل TypeScript در Backend
اگر خطای TypeScript دریافت کردید:
```bash
cd server
npm install
npm run dev
```

### مشکل پورت
اگر پورت 5173 یا 4000 اشغال است، Vite به‌طور خودکار پورت بعدی را انتخاب می‌کند.

