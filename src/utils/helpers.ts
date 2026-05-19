/**
 * أدوات للتعامل مع البيانات والتحويلات
 */

/**
 * تحويل النص العربي إلى slug
 */
export function arabicToSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '');
}

/**
 * استخراج معرف من رابط
 */
export function extractIdFromUrl(url: string, pattern: RegExp): string | null {
  const match = url.match(pattern);
  return match ? match[1] : null;
}

/**
 * دمج رابط أساسي مع رابط نسبي
 */
export function joinUrl(baseUrl: string, relativePath: string): string {
  const base = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
  const path = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return base + path;
}

/**
 * التحقق من صحة الرابط
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * تأخير العملية (للتهدئة)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * إعادة محاولة العملية
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 1000
): Promise<T> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxAttempts - 1) throw error;
      await delay(delayMs);
    }
  }
  throw new Error('فشلت جميع المحاولات');
}
