import { IProvider, SearchResult, ContentDetails, VideoSource, ContentType } from '../../types';
import { ScraperUtils } from '../../utils/scraper';
import { joinUrl } from '../../utils/helpers';

/**
 * موقع مانجا أون لاين - موقع المانجا العربي
 * https://mangaonline.co
 */
export class MangaOnlineProvider implements IProvider {
  name = 'Manga Online';
  mainUrl = 'https://mangaonline.co';
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

      $('.manga-item').each((_, element) => {
        const $el = $(element);
        const link = $el.find('a').first().attr('href') || '';
        const id = link.split('/').filter(Boolean).pop() || '';
        const title = $el.find('.manga-title').text().trim();
        const poster = $el.find('img').attr('src');

        if (id && title) {
          results.push({ id, title, poster, type: ContentType.MANGA });
        }
      });

      return results;
    } catch (error) {
      console.error('خطأ في البحث على Manga Online:', error);
      return [];
    }
  }

  async getDetails(id: string): Promise<ContentDetails> {
    try {
      const url = joinUrl(this.mainUrl, `/manga/${id}`);
      const $ = await this.scraper.fetchAndParse(url);

      const title = $('h1').text().trim();
      const description = $('.synopsis').text().trim();
      const poster = $('.manga-poster img').attr('src');
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
      console.error('خطأ في جلب التفاصيل من Manga Online:', error);
      throw error;
    }
  }

  async getSources(id: string): Promise<VideoSource[]> {
    try {
      const url = joinUrl(this.mainUrl, `/manga/${id}`);
      const $ = await this.scraper.fetchAndParse(url);
      const sources: VideoSource[] = [];

      $('.chapter-link').each((index, element) => {
        const $el = $(element);
        const chapterId = $el.attr('data-id') || `chapter-${index}`;
        const chapterName = $el.text().trim();

        sources.push({
          id: chapterId,
          url: $el.attr('href') || '',
          quality: 'web',
          server: 'MangaOnline',
          type: 'mp4'
        });
      });

      return sources;
    } catch (error) {
      console.error('خطأ في جلب المصادر من Manga Online:', error);
      return [];
    }
  }
}
