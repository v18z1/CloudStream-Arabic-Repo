import axios, { AxiosInstance } from 'axios';
import { load } from 'cheerio';

/**
 * فئة مساعدة للـ Scraping
 * تستخدم لاستخراج البيانات من الصفحات
 */
export class ScraperUtils {
  private axiosInstance: AxiosInstance;

  constructor(
    private timeout = 10000,
    private headers?: Record<string, string>
  ) {
    this.axiosInstance = axios.create({
      timeout: this.timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...this.headers
      }
    });
  }

  /**
   * جلب HTML الصفحة
   */
  async fetchHTML(url: string): Promise<string> {
    try {
      const response = await this.axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error(`خطأ في جلب الصفحة: ${url}`, error);
      throw error;
    }
  }

  /**
   * تحليل HTML باستخدام Cheerio
   */
  parseHTML(html: string) {
    return load(html);
  }

  /**
   * جلب وتحليل الصفحة مباشرة
   */
  async fetchAndParse(url: string) {
    const html = await this.fetchHTML(url);
    return this.parseHTML(html);
  }

  /**
   * استخراج النص من عنصر
   */
  getText(element: any, selector: string): string {
    return element.find(selector).text().trim();
  }

  /**
   * استخراج الخاصية من عنصر
   */
  getAttribute(element: any, selector: string, attr: string): string | undefined {
    return element.find(selector).attr(attr);
  }

  /**
   * استخراج كل العناصر المطابقة
   */
  getElements(html: any, selector: string) {
    return html(selector);
  }

  /**
   * تنظيف النص
   */
  cleanText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  /**
   * استخراج رقم من نص
   */
  extractNumber(text: string): number | null {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : null;
  }
}
