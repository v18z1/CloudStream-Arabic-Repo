# دليل التطوير المتقدم

## التثبيت والإعداد

### المتطلبات
- Node.js 14+
- npm أو yarn
- Git

### التثبيت المحلي

```bash
# استنسخ المستودع
git clone https://github.com/v18z1/CloudStream-Arabic-Repo.git
cd CloudStream-Arabic-Repo

# ثبت المكتبات
npm install

# ابدأ في التطوير
npm run dev
```

## هيكل المشروع

```
src/
├── index.ts                 # نقطة الدخول الرئيسية
├── types/
│   └── index.ts            # تعريفات TypeScript
├── providers/
│   ├── index.ts            # تصدير جميع المزودين
│   ├── movies/
│   │   ├── index.ts
│   │   ├── videotyme.ts
│   │   ├── istanbulhd.ts
│   │   ├── cimaclub.ts
│   │   └── wellt.ts
│   ├── anime/
│   │   ├── index.ts
│   │   ├── zoro.ts
│   │   ├── animex.ts
│   │   ├── animefire.ts
│   │   ├── kaido.ts
│   │   └── animatoon.ts
│   └── manga/
│       ├── index.ts
│       ├── mangaonline.ts
│       ├── manganato.ts
│       └── mangafire.ts
└── utils/
    ├── scraper.ts          # أدوات الـ Web Scraping
    ├── helpers.ts          # دوال مساعدة
    └── cache.ts            # نظام التخزين المؤقت
```

## كتابة مزود جديد

### الخطوة 1: فهم الواجهة

```typescript
interface IProvider {
  name: string;                                    // اسم الموقع
  mainUrl: string;                                  // الرابط الأساسي
  supportedTypes: ContentType[];                    // الأنواع المدعومة
  
  search(query: string, page?: number): Promise<SearchResult[]>;          // بحث
  getDetails(id: string): Promise<ContentDetails>;                        // تفاصيل
  getSources(id: string, episode?: number): Promise<VideoSource[]>;       // روابط
  getEpisodes?(id: string): Promise<Episode[]>;                           // حلقات (اختياري)
}
```

### الخطوة 2: فحص الموقع

```typescript
// 1. افتح الموقع في المتصفح
// 2. افحص الـ HTML باستخدام أدوات المطور (F12)
// 3. حدد الـ Selectors للعناصر المهمة
// 4. اختبر Selectors في Console
```

### الخطوة 3: كتابة المزود

```typescript
import { IProvider, SearchResult, ContentDetails, VideoSource, ContentType, Episode } from '../../types';
import { ScraperUtils } from '../../utils/scraper';
import { joinUrl } from '../../utils/helpers';

export class MyProviderProvider implements IProvider {
  name = 'My Provider';
  mainUrl = 'https://example.com';
  supportedTypes = [ContentType.MOVIE];
  private scraper: ScraperUtils;

  constructor() {
    this.scraper = new ScraperUtils();
  }

  async search(query: string, page = 1): Promise<SearchResult[]> {
    try {
      const url = `${this.mainUrl}/search?q=${encodeURIComponent(query)}&page=${page}`;
      const $ = await this.scraper.fetchAndParse(url);
      const results: SearchResult[] = [];

      // حدد Selector مناسب
      $('.movie-item').each((_, element) => {
        const $el = $(element);
        const id = $el.find('a').attr('href')?.split('/').pop() || '';
        const title = $el.find('.title').text().trim();
        const poster = $el.find('img').attr('src');

        if (id && title) {
          results.push({ id, title, poster, type: ContentType.MOVIE });
        }
      });

      return results;
    } catch (error) {
      console.error('خطأ في البحث:', error);
      return [];
    }
  }

  async getDetails(id: string): Promise<ContentDetails> {
    try {
      const url = joinUrl(this.mainUrl, `/movie/${id}`);
      const $ = await this.scraper.fetchAndParse(url);

      return {
        id,
        title: $('h1').text().trim(),
        description: $('.description').text().trim(),
        poster: $('.poster img').attr('src'),
        year: parseInt($('.year').text()) || undefined,
        type: ContentType.MOVIE
      };
    } catch (error) {
      console.error('خطأ في جلب التفاصيل:', error);
      throw error;
    }
  }

  async getSources(id: string, episode?: number): Promise<VideoSource[]> {
    try {
      const url = joinUrl(this.mainUrl, `/watch/${id}`);
      const $ = await this.scraper.fetchAndParse(url);
      const sources: VideoSource[] = [];

      $('.player a').each((index, element) => {
        const $el = $(element);
        sources.push({
          id: `source-${index}`,
          url: $el.attr('href') || '',
          quality: '720p',
          server: $el.text().trim(),
          type: 'mp4'
        });
      });

      return sources;
    } catch (error) {
      console.error('خطأ في جلب المصادر:', error);
      return [];
    }
  }
}
```

## أدوات مساعدة

### ScraperUtils

```typescript
const scraper = new ScraperUtils();

// جلب HTML
const html = await scraper.fetchHTML(url);

// تحليل HTML
const $ = scraper.parseHTML(html);

// جلب وتحليل معاً
const $ = await scraper.fetchAndParse(url);

// استخراج نصوص
const text = scraper.getText($, 'selector');

// استخراج خصائص
const attr = scraper.getAttribute($, 'selector', 'attr-name');

// تنظيف نصوص
const clean = scraper.cleanText(text);

// استخراج أرقام
const num = scraper.extractNumber('الحلقة 25');
```

### دوال مساعدة

```typescript
import { 
  arabicToSlug,
  extractIdFromUrl,
  joinUrl,
  isValidUrl,
  delay,
  retry
} from '../utils/helpers';

// تحويل إلى URL-friendly
const slug = arabicToSlug('محمود عبدالعزيز'); // mahmoud-abdel-aziz

// استخراج معرف من رابط
const id = extractIdFromUrl('/anime/naruto', /\/anime\/(\w+)/);

// دمج روابط
const url = joinUrl('https://example.com', 'anime/naruto');

// التحقق من صحة الرابط
if (isValidUrl(url)) { /* ... */ }

// تأخير
await delay(1000);

// إعادة محاولة
const result = await retry(() => fetch(url), 3, 1000);
```

### CacheManager

```typescript
const cache = new CacheManager(3600); // 1 ساعة

// حفظ
cache.set('key', data);

// استرجاع
const data = cache.get('key');

// حذف
cache.delete('key');

// مسح الكل
cache.clear();

// الحجم
const size = cache.size();
```

## الاختبار

### اختبار موقع واحد

```typescript
// test/providers.test.ts
import { MyProviderProvider } from '../src/providers/movies/myprovider';

describe('MyProvider', () => {
  let provider: MyProviderProvider;

  beforeEach(() => {
    provider = new MyProviderProvider();
  });

  test('البحث يعيد نتائج', async () => {
    const results = await provider.search('test');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('id');
    expect(results[0]).toHaveProperty('title');
  });

  test('التفاصيل تعيد بيانات صحيحة', async () => {
    const details = await provider.getDetails('test-id');
    expect(details).toHaveProperty('title');
    expect(details).toHaveProperty('description');
  });
});
```

## معالجة الأخطاء الشائعة

### مشكلة: الموقع يحتاج إلى User-Agent

```typescript
const scraper = new ScraperUtils(10000, {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
});
```

### مشكلة: الروابط نسبية

```typescript
const absoluteUrl = joinUrl(provider.mainUrl, relativePath);
```

### مشكلة: الصفحة محمية بـ CloudFlare

```typescript
// استخدم مكتبة cloudflare-bypass أو مشابهة
```

## الإطلاق

```bash
# بناء النسخة النهائية
npm run build

# اختبار شامل
npm test

# فحص الأخطاء
npm run lint

# إصلاح تلقائي
npm run lint -- --fix
```

## نصائح

1. **استخدم التخزين المؤقت** لتقليل الطلبات
2. **أضف تأخيرات** بين الطلبات لتجنب الحظر
3. **اختبر جيداً** قبل الإرسال
4. **وثق الكود** بتعليقات واضحة
5. **اتبع المعايير** الموجودة

---

**هل تحتاج إلى مساعدة؟** 🤔
- 📖 [اقرأ التوثيق الكاملة](./README.md)
- 💬 [افتح نقاشاً](https://github.com/v18z1/CloudStream-Arabic-Repo/discussions)
- 🐛 [أبلغ عن مشكلة](https://github.com/v18z1/CloudStream-Arabic-Repo/issues)
