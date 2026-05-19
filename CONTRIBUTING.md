# المساهمة في المشروع

شكراً لاهتمامك بالمساهمة في **CloudStream Arabic Repository**! 🎉

## قواعد المساهمة

### 1. قبل البدء

- تأكد من أن لديك حساب GitHub
- اقرأ ملف README.md كاملاً
- تحقق من المشاكل المفتوحة (Issues) لتجنب العمل المكرر

### 2. خطوات المساهمة

```bash
# 1. انسخ المستودع (Fork)

# 2. استنسخ نسختك المحلية
git clone https://github.com/YOUR-USERNAME/CloudStream-Arabic-Repo.git
cd CloudStream-Arabic-Repo

# 3. أنشئ فرعاً جديداً
git checkout -b feature/your-feature-name

# 4. قم بالتعديلات

# 5. اختبر تغييراتك
npm run build
npm test

# 6. أرسل تغييراتك
git add .
git commit -m "feat: وصف التغيير بالعربية"
git push origin feature/your-feature-name

# 7. أنشئ Pull Request
```

### 3. معايير الكود

#### التنسيق
- استخدم **TypeScript** حصراً
- اتبع معايير ESLint المحددة
- 2 مسافات للمحاذاة (Indentation)

#### التعليقات
```typescript
// تعليق واحد

/**
 * تعليق متعدد الأسطر
 * استخدم دائماً JSDoc
 */
```

#### أسماء المتغيرات والدوال
```typescript
// جيد
const searchResults = [];
function getUserDetails(id: string) {}

// سيء
const sr = [];
function getuser() {}
```

### 4. إضافة موقع جديد

إذا أردت إضافة موقع جديد:

#### أ. أنشئ ملف جديد

```typescript
// src/providers/anime/mynewsite.ts

import { IProvider, SearchResult, ContentDetails, VideoSource, ContentType, Episode } from '../../types';
import { ScraperUtils } from '../../utils/scraper';
import { joinUrl } from '../../utils/helpers';

export class MyNewSiteProvider implements IProvider {
  name = 'My New Site';
  mainUrl = 'https://example.com';
  supportedTypes = [ContentType.ANIME];
  private scraper: ScraperUtils;

  constructor() {
    this.scraper = new ScraperUtils();
  }

  async search(query: string, page = 1): Promise<SearchResult[]> {
    // انجز البحث
  }

  async getDetails(id: string): Promise<ContentDetails> {
    // جلب التفاصيل
  }

  async getSources(id: string, episode?: number): Promise<VideoSource[]> {
    // جلب روابط المشاهدة
  }

  async getEpisodes?(id: string): Promise<Episode[]> {
    // جلب الحلقات (اختياري)
  }
}
```

#### ب. أضفه إلى ملف الفهرس

```typescript
// src/providers/anime/index.ts
export { MyNewSiteProvider } from './mynewsite';
```

#### ج. سجله في المدير الرئيسي

```typescript
// src/index.ts
private initializeProviders(): void {
  // ...
  this.providers.set('mynewsite', new MyNewSiteProvider());
}
```

### 5. الاختبار

```bash
# اختبر الموقع الجديد
npm test -- mynewsite

# اختبر شامل
npm test
```

### 6. رسائل الالتزام (Commit Messages)

استخدم صيغة واضحة:

```
feat: إضافة موقع جديد
fix: إصلاح خطأ في البحث
docs: تحديث التوثيق
refactor: تحسين الكود
test: إضافة اختبارات
```

### 7. معايير القبول

للموافقة على Pull Request، يجب:

✅ اجتياز جميع الاختبارات
✅ اتباع معايير الكود
✅ عدم تضارب مع الأكواد الموجودة
✅ إضافة اختبارات جديدة
✅ تحديث التوثيق
✅ وصف واضح للتغييرات

### 8. الإبلاغ عن المشاكل

عند إبلاغك عن مشكلة، تضمن:

```markdown
## الوصف
وصف واضح للمشكلة

## خطوات التكرار
1. افعل كذا
2. ثم كذا
3. المشكلة تظهر عند كذا

## السلوك المتوقع
ما الذي كان يجب أن يحدث

## معلومات إضافية
- الإصدار
- المتصفح
- نظام التشغيل
```

### 9. طلب ميزة جديدة

```markdown
## الوصف
أريد إضافة ميزة كذا

## السبب
لأنها ستساعد في...

## الحل المقترح
يمكن فعل كذا وكذا

## بدائل
أو يمكن فعل...
```

### 10. طلب المساعدة

- 💬 استخدم **Discussions** للأسئلة
- 🐛 استخدم **Issues** للمشاكل
- 📝 استخدم **Pull Requests** للتحسينات

## قواعس السلوك

- احترم جميع المساهمين
- لا تنشر معلومات شخصية
- تجنب التعليقات المسيئة
- ركز على الأفكار والأكواد

## أسئلة شائعة

### س: كم من الوقت يستغرق قبول PR؟
ج: عادة 1-3 أيام، حسب التعقيد

### س: هل يمكنني إضافة موقع غير عربي؟
ج: نعم، لكن المشروع يركز على المحتوى العربي

### س: هل هناك نقطة بيانات أدنى للموقع الجديد؟
ج: لا، أي موقع قانوني مفيد مقبول

---

**شكراً لك على المساهمة!** 🙏
