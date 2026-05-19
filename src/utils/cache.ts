/**
 * نظام التخزين المؤقت (Cache)
 * لتحسين الأداء وتقليل الطلبات
 */

export class CacheManager {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private ttl: number; // Time to live بالميلي ثانية

  constructor(ttlSeconds = 3600) {
    this.ttl = ttlSeconds * 1000;
  }

  /**
   * حفظ البيانات في الـ Cache
   */
  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * استرجاع البيانات من الـ Cache
   */
  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // تحقق من انتهاء صلاحية البيانات
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * حذف البيانات من الـ Cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * مسح كل البيانات
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * الحصول على حجم الـ Cache
   */
  size(): number {
    return this.cache.size;
  }
}
