# Bozorcha — User (mijoz) frontend

Xaridorlar uchun do'kon interfeysi. React 19 + Vite + Tailwind CSS v4 + shadcn uslubidagi komponentlar. **Faqat UI tayyor** — integratsiya RTK Query bilan talabalar tomonidan qilinadi.

Bu — ikkita alohida frontend ilovadan biri (ikkinchisi: `frontend-admin`). Ular mustaqil loyihalar, alohida `npm install` va alohida portda ishga tushadi.

## O'rnatish

```bash
npm install
cp .env.example .env
npm run dev
```
http://localhost:5173

`.env`:
```
VITE_API_BASE_URL=http://localhost:8989
```

## Sahifalar

- `/` — Bosh sahifa (banner, kategoriyalar, tavsiya etilgan mahsulotlar)
- `/catalog` — Katalog (filtrlar bilan)
- `/product/:id` — Mahsulot sahifasi (galereya, sharh, o'xshash mahsulotlar)
- `/cart` — Savatcha
- `/checkout` — Buyurtmani rasmiylashtirish
- `/orders`, `/orders/:id` — Buyurtmalar tarixi
- `/favorites` — Sevimlilar
- `/profile` — Profil (ma'lumotlar, parol)
- `/login`, `/register` — Kirish / Ro'yxatdan o'tish

## Talabalar uchun vazifa

`src/store/api/*/*.js` fayllaridagi bo'sh `injectEndpoints`larni to'ldiring (har bir modulning `path.js` faylida barcha backend endpoint manzillari tayyor). So'ng `src/data/mockData.js` dagi statik ma'lumotlarni RTK Query hook'lari bilan almashtiring. Batafsil: loyihaning bosh papkasidagi `README.md`.
