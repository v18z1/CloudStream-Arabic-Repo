import { IProvider, SearchResult, ContentDetails, VideoSource, ContentType } from '../../types';
import { ScraperUtils } from '../../utils/scraper';
import { joinUrl } from '../../utils/helpers';

/**
 * موقع مانجا لاتر - موقع المانجا
 * https://manganato.com
 */
export class MangaLaterProvider implements IProvider {
  name = 'Manga Noto';
  mainUrl = 'https://manganato.com';
  supportedTypes = [ContentType.MANGA];
  private scraper: ScraperUtils;

  constructor() {
    this.scraper = new ScraperUtils();
  }

  async search(query: string, page = 1): Promise<SearchResult[]> {
    try {
      const searchUrl = `${this.mainUrl}/search/story/${encodeURIComponent(query)}?page=${page}`;
      const $ = await this.scraper.fetchAndParse(searchUrl);
      const results: SearchResult[] = [];

      $('.search-story-item').each((_, element) => {
        const $el = $(element);
        const link = $el.find('a.item-title').attr('href') || '';
        const id = link.split('/').filter(Boolean).pop() || '';
        const title = $el.find('.item-title').text().trim();
        const poster = $el.find('img').attr('src');

        if (id && title) {
          results.push({ id, title, poster, type: ContentType.MANGA });
        }
      });

      return results;
    } catch (error) {
      console.error('خطأ في البحث على Manga Noto:', error);
      return [];
    }
  }

  async getDetails(id: string): Promise<ContentDetails> {
    try {
      const url = joinUrl(this.mainUrl, `/manga/${id}`);
      const $ = await this.scraper.fetchAndParse(url);

      const title = $('h1.story-title').text().trim();
      const description = $('.panel-story-info-description').text().trim();
      const poster = $('.story-info-left img').attr('src');

      return {
        id,
        title,
        description,
        poster,
        type: ContentType.MANGA
      };
    } catch (error) {
      console.error('خطأ في جلب التفاصيل من Manga Noto:', error);
      throw error;
    }
  }

  async getSources(id: string): Promise<VideoSource[]> {
    try {
      const url = joinUrl(this.mainUrl, `/manga/${id}`);
      const $ = await this.scraper.fetchAndParse(url);
      const sources: VideoSource[] = [];

      $('.row-content-chapter a').each((index, element) => {
        const $el = $(element);
        const href = $el.attr('href') || '';
        const chapterId = href.split('/').filter(Boolean).pop() || `chapter-${index}`;

        sources.push({
          id: chapterId,
          url: href,
          quality: 'web',
          server: 'MangaNato',
          type: 'mp4'
        });
      });

      return sources;
    } catch (error) {
      console.error('خطأ في جلب المصادر من Manga Noto:', error);
      return [];
    }
  }
}
