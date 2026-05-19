import { IProvider, SearchResult, ContentDetails, VideoSource, ContentType } from '../../types';
import { ScraperUtils } from '../../utils/scraper';
import { joinUrl } from '../../utils/helpers';

/**
 * موقع مانجا فايير - موقع المانجا والويب تون
 * https://mangafire.to
 */
export class MangaFireProvider implements IProvider {
  name = 'Manga Fire';
  mainUrl = 'https://mangafire.to';
  supportedTypes = [ContentType.MANGA];
  private scraper: ScraperUtils;

  constructor() {
    this.scraper = new ScraperUtils();
  }

  async search(query: string, page = 1): Promise<SearchResult[]> {
    try {
      const searchUrl = `${this.mainUrl}/search?keyword=${encodeURIComponent(query)}&page=${page}`;
      const $ = await this.scraper.fetchAndParse(searchUrl);
      const results: SearchResult[] = [];

      $('.manga-card').each((_, element) => {
        const $el = $(element);
        const link = $el.find('a').first().attr('href') || '';
        const id = link.split('/').filter(Boolean).pop() || '';
        const title = $el.find('.manga-name').text().trim();
        const poster = $el.find('img').attr('src');

        if (id && title) {
          results.push({ id, title, poster, type: ContentType.MANGA });
        }
      });

      return results;
    } catch (error) {
      console.error('خطأ في البحث على Manga Fire:', error);
      return [];
    }
  }

  async getDetails(id: string): Promise<ContentDetails> {
    try {
      const url = joinUrl(this.mainUrl, `/manga/${id}`);
      const $ = await this.scraper.fetchAndParse(url);

      const title = $('h1.title').text().trim();
      const description = $('.description').text().trim();
      const poster = $('.poster img').attr('src');
      const year = parseInt($('.year').text()) || undefined;

      return {
        id,
        title,
        description,
        poster,
        year,
        type: ContentType.MANGA
      };
    } catch (error) {
      console.error('خطأ في جلب التفاصيل من Manga Fire:', error);
      throw error;
    }
  }

  async getSources(id: string): Promise<VideoSource[]> {
    try {
      const url = joinUrl(this.mainUrl, `/manga/${id}`);
      const $ = await this.scraper.fetchAndParse(url);
      const sources: VideoSource[] = [];

      $('.chapter-item').each((index, element) => {
        const $el = $(element);
        const href = $el.find('a').attr('href') || '';
        const chapterId = href.split('/').filter(Boolean).pop() || `chapter-${index}`;

        sources.push({
          id: chapterId,
          url: href,
          quality: 'web',
          server: 'MangaFire',
          type: 'mp4'
        });
      });

      return sources;
    } catch (error) {
      console.error('خطأ في جلب المصادر من Manga Fire:', error);
      return [];
    }
  }
}
