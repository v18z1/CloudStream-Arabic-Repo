# CloudStream Arabic Repository 🎬📺

مستودع متكامل لتطبيق CloudStream يوفر محتوى عربي شامل من الأفلام والمسلسلات والأنمي والمانجا

## ✨ الميزات الرئيسية

- 🎬 **أفلام عربية** من أفضل المواقع
- 📺 **مسلسلات عربية وعالمية** مترجمة
- 🐉 **محتوى أنمي** كامل من المواقع الموثوقة
- 💫 **مانجا عربي** من أفضل المنصات
- 🔍 **بحث متقدم** وسهل الاستخدام
- ⚡ **تحديثات دورية** للروابط والمواقع
- 🛡️ **محتوى آمن** وموثوق

## 📦 المواقع المدعومة

### أفلام ومسلسلات
- [ ] موقع إسطنبول HD
- [ ] موقع فيديو تايم
- [ ] موقع سينما بلاس
- [ ] موقع ويلت
- [ ] موقع سيما كلاب

### محتوى أنمي
- [ ] موقع زورو (Zoro.to)
- [ ] موقع أنمي إكس (AnimeX)
- [ ] موقع أنمي فاير
- [ ] موقع أنمي توون
- [ ] موقع كايدو

### مانجا
- [ ] موقع مانجا إون لاين
- [ ] موقع أنمي إكس (مانجا)
- [ ] موقع زورو (مانجا)
- [ ] موقع مانجا لاتر

## 🚀 البدء السريع

### المتطلبات
- Node.js 14+
- npm أو yarn
- CloudStream 3 أو أحدث

### التثبيت

```bash
# استنساخ المستودع
git clone https://github.com/v18z1/CloudStream-Arabic-Repo.git
cd CloudStream-Arabic-Repo

# تثبيت المكتبات
npm install

# تشغيل المشروع
npm start
```

### الاستخدام

```typescript
import { ArabicProviders } from './src/providers';

const providers = new ArabicProviders();
const movies = await providers.searchMovies('محمود عبدالعزيز');
const anime = await providers.searchAnime('ناروتو');
```

## 📁 هيكل المشروع

```
CloudStream-Arabic-Repo/
├── src/
│   ├── providers/
│   │   ├── movies/
│   │   │   ├── istanbulhd.ts
│   │   │   ├── videotyme.ts
│   │   │   └── ...
│   │   ├── anime/
│   │   │   ├── zoro.ts
│   │   │   ├── animex.ts
│   │   │   └── ...
│   │   ├── manga/
│   │   │   ├── mangaonline.ts
│   │   │   └── ...
│   │   └── index.ts
│   ├── utils/
│   │   ├── scraper.ts
│   │   ├── parser.ts
│   │   └── cache.ts
│   ├── types/
│   │   ├── provider.ts
│   │   ├── movie.ts
│   │   ├── anime.ts
│   │   └── manga.ts
│   └── index.ts
├── tests/
│   ├── providers.test.ts
│   └── utils.test.ts
├── docs/
│   ├── PROVIDERS.md
│   ├── API.md
│   └── CONTRIBUTING.md
├── package.json
├── tsconfig.json
├── .eslintrc.json
└── .gitignore
```

## 🔌 API الرئيسي

### البحث عن الأفلام
```typescript
const movies = await providers.searchMovies(query: string, page?: number);
// النتيجة: Movie[]
```

### البحث عن الأنمي
```typescript
const anime = await providers.searchAnime(query: string, page?: number);
// النتيجة: Anime[]
```

### الحصول على تفاصيل
```typescript
const details = await providers.getDetails(id: string, type: 'movie' | 'anime' | 'manga');
// النتيجة: Details
```

### الحصول على روابط المشاهدة
```typescript
const sources = await providers.getSources(id: string, episode?: number);
// النتيجة: Source[]
```

## 🛠️ التطوير والمساهمة

نرحب بمساهماتك! اتبع الخطوات التالية:

1. **انسخ المستودع** (Fork)
2. **أنشئ فرعاً جديداً** (`git checkout -b feature/اسم-الميزة`)
3. **اكتب الأكواد** واختبرها
4. **أرسل طلب دمج** (Pull Request)

اقرأ [CONTRIBUTING.md](./docs/CONTRIBUTING.md) لمزيد من التفاصيل.

## 📋 متطلبات إضافة موقع جديد

كل موقع (Provider) يجب أن يحقق:

- ✅ تنفيذ واجهة `IProvider`
- ✅ دوال البحث (`search`)
- ✅ دوال الحصول على التفاصيل (`getDetails`)
- ✅ دوال الحصول على الروابط (`getSources`)
- ✅ اختبارات شاملة (`*.test.ts`)
- ✅ توثيق كامل (`README.md`)

## 📊 الحالة الحالية

| النوع | العدد | الحالة |
|------|------|-------|
| أفلام | 5 | 🔨 قيد التطوير |
| مسلسلات | 5 | 🔨 قيد التطوير |
| أنمي | 5 | 🔨 قيد التطوير |
| مانجا | 3 | 🔨 قيد التطوير |

## 🐛 الإبلاغ عن المشاكل

وجدت مشكلة؟ [أفتح Issue](https://github.com/v18z1/CloudStream-Arabic-Repo/issues)

## 📝 الترخيص

MIT License - اقرأ [LICENSE](./LICENSE) للتفاصيل

## 👥 الفريق

- **المطور الرئيسي**: v18z1
- **المساهمون**: [أضف نفسك هنا]

## 🤝 الدعم

هل تحتاج لمساعدة؟
- 📖 اقرأ [التوثيق الكاملة](./docs)
- 💬 افتح [مناقشة](https://github.com/v18z1/CloudStream-Arabic-Repo/discussions)
- 🐛 أبلغ عن [مشكلة](https://github.com/v18z1/CloudStream-Arabic-Repo/issues)

---

**آخر تحديث**: 2026-05-19 | **الإصدار**: 1.0.0
