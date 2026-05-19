# CloudStream Arabic Repository 🎬📺🐉💫

مستودع متكامل وشامل لتطبيق CloudStream 4 يوفر محتوى عربي كامل من الأفلام والمسلسلات والأنمي والمانجا

## ✨ المميزات الرئيسية

✅ **12 موقع عربي وعالمي موثوق**
✅ **دعم كامل للأفلام والمسلسلات والأنمي والمانجا**
✅ **بحث متقدم وسريع جداً**
✅ **تخزين مؤقت ذكي للبيانات**
✅ **معالجة أخطاء شاملة**
✅ **توثيق كامل وواضح**
✅ **سهل التطوير والإضافة**

## 📦 المواقع المدعومة (12 موقع)

### 🎬 مواقع الأفلام والمسلسلات (4 مواقع)

| الموقع | الرابط | النوع |
|--------|--------|-------|
| Video Tyme | https://videotyme.com | أفلام + مسلسلات عربية |
| Istanbul HD | https://istanbulhd.online | أفلام + مسلسلات تركية وعربية |
| Cima Club | https://cima4u.cyou | أفلام + مسلسلات عربية وأجنبية |
| Wellt | https://wellt.net | أفلام + مسلسلات أجنبية مترجمة |

### 🐉 مواقع الأنمي (5 مواقع)

| الموقع | الرابط | الخصائص |
|--------|--------|----------|
| Zoro | https://zoro.to | أنمي عالي الجودة |
| AnimeX | https://animex.info | أنمي ومانجا |
| Anime Fire | https://animefire.plus | أنمي متنوع |
| Kaido | https://kaido.to | أنمي عالمي |
| AnimaToon | https://animatoon.net | أنمي وويب توون |

### 💫 مواقع المانجا (3 مواقع)

| الموقع | الرابط | المميزات |
|--------|--------|----------|
| Manga Online | https://mangaonline.co | مانجا عربي |
| MangaNato | https://manganato.com | مانجا عالمي كبير |
| Manga Fire | https://mangafire.to | مانجا وويب توون |

## 🚀 البدء السريع

### 1️⃣ التثبيت

```bash
# استنساخ المستودع
git clone https://github.com/v18z1/CloudStream-Arabic-Repo.git
cd CloudStream-Arabic-Repo

# تثبيت المكتبات
npm install

# بناء المشروع
npm run build
```

### 2️⃣ الاستخدام الأساسي

```typescript
import { CloudStreamArabic } from './src';

// إنشاء مثيل من المدير
const cs = new CloudStreamArabic();

// 1. الحصول على قائمة المواقع
const providers = cs.getAvailableProviders();
console.log('المواقع المتاحة:', providers);

// 2. البحث في موقع معين
const results = await cs.search('zoro', 'ناروتو');
console.log('نتائج البحث:', results);

// 3. جلب تفاصيل المحتوى
const details = await cs.getDetails('zoro', 'naruto-dub');
console.log('التفاصيل:', details);

// 4. جلب مصادر المشاهدة
const sources = await cs.getSources('zoro', 'naruto-dub', 1);
console.log('المصادر:', sources);

// 5. جلب الحلقات
const episodes = await cs.getEpisodes('zoro', 'naruto-dub');
console.log('الحلقات:', episodes);
```

## 📖 الأمثلة المتقدمة

### البحث في جميع المواقع

```typescript
const allResults = await cs.searchAll('Attack on Titan');

for (const [provider, results] of allResults) {
  console.log(`${provider}: ${results.length} نتيجة`);
}
```

### البحث حسب النوع

```typescript
import { ContentType } from './src';

// البحث عن الأنمي فقط
const animeResults = await cs.searchByType(ContentType.ANIME, 'One Piece');

// البحث عن الأفلام فقط
const movieResults = await cs.searchByType(ContentType.MOVIE, 'Avengers');
```

### معلومات الموقع

```typescript
const zoro = cs.getProviderInfo('zoro');
console.log('اسم الموقع:', zoro.name);
console.log('الرابط الرئيسي:', zoro.mainUrl);
console.log('الأنواع المدعومة:', zoro.supportedTypes);
```

## 🏗️ هيكل المشروع

```
CloudStream-Arabic-Repo/
├── src/
│   ├── index.ts                 # الملف الرئيسي والمدير
│   ├── types/
│   │   └── index.ts            # أنواع البيانات
│   ├── providers/
│   │   ├── movies/             # مواقع الأفلام
│   │   │   ├── videotyme.ts
│   │   │   ├── istanbulhd.ts
│   │   │   ├── cimaclub.ts
│   │   │   ├── wellt.ts
│   │   │   └── index.ts
│   │   ├── anime/              # مواقع الأنمي
│   │   │   ├── zoro.ts
│   │   │   ├── animex.ts
│   │   │   ├── animefire.ts
│   │   │   ├── kaido.ts
│   │   │   ├── animatoon.ts
│   │   │   └── index.ts
│   │   ├── manga/              # مواقع المانجا
│   │   │   ├── mangaonline.ts
│   │   │   ├── manganato.ts
│   │   │   ├── mangafire.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   └── utils/
│       ├── scraper.ts          # أدوات الـ Scraping
│       ├── helpers.ts          # دوال مساعدة
│       └── cache.ts            # نظام التخزين المؤقت
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .gitignore
└── README.md
```

## 🔧 واجهات البيانات الرئيسية

### IProvider

```typescript
interface IProvider {
  name: string;
  mainUrl: string;
  supportedTypes: ContentType[];
  search(query: string, page?: number): Promise<SearchResult[]>;
  getDetails(id: string): Promise<ContentDetails>;
  getSources(id: string, episode?: number): Promise<VideoSource[]>;
  getEpisodes?(id: string): Promise<Episode[]>;
}
```

### SearchResult

```typescript
interface SearchResult {
  id: string;
  title: string;
  poster?: string;
  year?: number;
  type: ContentType;
  rating?: number;
  description?: string;
}
```

### ContentDetails

```typescript
interface ContentDetails {
  id: string;
  title: string;
  description: string;
  poster?: string;
  backdrop?: string;
  year?: number;
  rating?: number;
  genres?: string[];
  cast?: string[];
  type: ContentType;
  episodes?: Episode[];
}
```

## 💡 إضافة موقع جديد

### الخطوات:

1. **أنشئ ملف جديد** في المجلد المناسب:
   ```typescript
   // src/providers/anime/newsite.ts
   import { IProvider, SearchResult, ContentDetails, VideoSource, ContentType } from '../../types';
   import { ScraperUtils } from '../../utils/scraper';
   import { joinUrl } from '../../utils/helpers';

   export class NewSiteProvider implements IProvider {
     name = 'New Site';
     mainUrl = 'https://example.com';
     supportedTypes = [ContentType.ANIME];
     private scraper: ScraperUtils;

     constructor() {
       this.scraper = new ScraperUtils();
     }

     async search(query: string, page = 1): Promise<SearchResult[]> {
       // تنفيذ البحث
     }

     async getDetails(id: string): Promise<ContentDetails> {
       // جلب التفاصيل
     }

     async getSources(id: string, episode?: number): Promise<VideoSource[]> {
       // جلب المصادر
     }

     async getEpisodes?(id: string): Promise<Episode[]> {
       // جلب الحلقات (اختياري)
     }
   }
   ```

2. **أضفها إلى ملف الفهرس**:
   ```typescript
   // src/providers/anime/index.ts
   export { NewSiteProvider } from './newsite';
   ```

3. **سجلها في المدير**:
   ```typescript
   // في src/index.ts
   private initializeProviders(): void {
     // ...
     this.providers.set('newsite', new NewSiteProvider());
   }
   ```

## 🧪 الاختبار

```bash
# تشغيل الاختبارات
npm test

# اختبار موقع معين
npm test -- zoro

# اختبار بتغطية شاملة
npm test -- --coverage
```

## 📝 الترخيص

MIT License - مفتوح المصدر للجميع ✅

## 🤝 المساهمة

نرحب بمساهماتك! اتبع هذه الخطوات:

1. Fork المستودع
2. أنشئ فرع جديد: `git checkout -b feature/myfeature`
3. اكتب الأكواد والاختبارات
4. أرسل Pull Request

## ⭐ الدعم

إذا أعجبك المشروع، أعطه ⭐ على GitHub!

## 📞 التواصل والدعم

- 📧 البريد الإلكتروني: [أضف بريدك]
- 💬 المناقشات: https://github.com/v18z1/CloudStream-Arabic-Repo/discussions
- 🐛 الإبلاغ عن المشاكل: https://github.com/v18z1/CloudStream-Arabic-Repo/issues

---

**آخر تحديث**: 2026-05-19 | **الإصدار**: 1.0.0 | **الحالة**: ✅ يعمل بنجاح

مصنوع بـ ❤️ من قبل v18z1
