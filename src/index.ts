import { IProvider, SearchResult, ContentDetails, VideoSource, ContentType } from './types';
import { CacheManager } from './utils/cache';
import {
  VideoTymeProvider,
  IstanbulHDProvider,
  CimaClubProvider,
  WelltProvider,
  ZoroProvider,
  AnimeXProvider,
  AnimeFireProvider,
  KaidoProvider,
  AnimaToonProvider,
  MangaOnlineProvider,
  MangaLaterProvider,
  MangaFireProvider
} from './providers';

/**
 * مدير المواقع الرئيسي
 * يدير جميع مواقع البث والقراءة
 */
export class CloudStreamArabic {
  private providers: Map<string, IProvider> = new Map();
  private cache: CacheManager;

  constructor(cacheTTL = 3600) {
    this.cache = new CacheManager(cacheTTL);
    this.initializeProviders();
  }

  /**
   * تهيئة جميع المواقع
   */
  private initializeProviders(): void {
    // مواقع الأفلام والمسلسلات
    this.providers.set('videotyme', new VideoTymeProvider());
    this.providers.set('istanbulhd', new IstanbulHDProvider());
    this.providers.set('cimaclub', new CimaClubProvider());
    this.providers.set('wellt', new WelltProvider());

    // مواقع الأنمي
    this.providers.set('zoro', new ZoroProvider());
    this.providers.set('animex', new AnimeXProvider());
    this.providers.set('animefire', new AnimeFireProvider());
    this.providers.set('kaido', new KaidoProvider());
    this.providers.set('animatoon', new AnimaToonProvider());

    // مواقع المانجا
    this.providers.set('mangaonline', new MangaOnlineProvider());
    this.providers.set('manganato', new MangaLaterProvider());
    this.providers.set('mangafire', new MangaFireProvider());
  }

  /**
   * الحصول على قائمة جميع المواقع المتاحة
   */
  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * الحصول على معلومات موقع معين
   */
  getProviderInfo(providerName: string): IProvider | null {
    return this.providers.get(providerName) || null;
  }

  /**
   * البحث في جميع المواقع
   */
  async searchAll(query: string, page = 1): Promise<Map<string, SearchResult[]>> {
    const results = new Map<string, SearchResult[]>();
    const promises: Promise<void>[] = [];

    for (const [name, provider] of this.providers) {
      const promise = (async () => {
        try {
          const cacheKey = `search:${name}:${query}:${page}`;
          const cached = this.cache.get(cacheKey);

          if (cached) {
            results.set(name, cached);
            return;
          }

          const searchResults = await provider.search(query, page);
          this.cache.set(cacheKey, searchResults);
          results.set(name, searchResults);
        } catch (error) {
          console.error(`خطأ في البحث على ${name}:`, error);
          results.set(name, []);
        }
      })();

      promises.push(promise);
    }

    await Promise.all(promises);
    return results;
  }

  /**
   * البحث في موقع معين
   */
  async search(providerName: string, query: string, page = 1): Promise<SearchResult[]> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`الموقع "${providerName}" غير موجود`);
    }

    const cacheKey = `search:${providerName}:${query}:${page}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const results = await provider.search(query, page);
    this.cache.set(cacheKey, results);
    return results;
  }

  /**
   * جلب تفاصيل المحتوى
   */
  async getDetails(providerName: string, id: string): Promise<ContentDetails> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`الموقع "${providerName}" غير موجود`);
    }

    const cacheKey = `details:${providerName}:${id}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const details = await provider.getDetails(id);
    this.cache.set(cacheKey, details);
    return details;
  }

  /**
   * جلب مصادر المشاهدة
   */
  async getSources(
    providerName: string,
    id: string,
    episode?: number
  ): Promise<VideoSource[]> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`الموقع "${providerName}" غير موجود`);
    }

    const cacheKey = `sources:${providerName}:${id}:${episode || 'all'}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const sources = await provider.getSources(id, episode);
    this.cache.set(cacheKey, sources);
    return sources;
  }

  /**
   * جلب الحلقات (للمسلسلات والأنمي)
   */
  async getEpisodes(providerName: string, id: string): Promise<any[]> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`الموقع "${providerName}" غير موجود`);
    }

    if (!provider.getEpisodes) {
      throw new Error(`الموقع "${providerName}" لا يدعم جلب الحلقات`);
    }

    const cacheKey = `episodes:${providerName}:${id}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const episodes = await provider.getEpisodes(id);
    this.cache.set(cacheKey, episodes);
    return episodes;
  }

  /**
   * البحث حسب النوع
   */
  async searchByType(
    type: ContentType,
    query: string,
    page = 1
  ): Promise<Map<string, SearchResult[]>> {
    const results = new Map<string, SearchResult[]>();

    for (const [name, provider] of this.providers) {
      if (provider.supportedTypes.includes(type)) {
        try {
          const searchResults = await provider.search(query, page);
          results.set(name, searchResults);
        } catch (error) {
          console.error(`خطأ في البحث على ${name}:`, error);
        }
      }
    }

    return results;
  }

  /**
   * مسح ذاكرة التخزين المؤقت
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * الحصول على إحصائيات ذاكرة التخزين المؤقت
   */
  getCacheStats(): { size: number; providers: number } {
    return {
      size: this.cache.size(),
      providers: this.providers.size
    };
  }
}

// تصدير الأنواع أيضاً
export * from './types';
export * from './utils/cache';
export * from './utils/scraper';
