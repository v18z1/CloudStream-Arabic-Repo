import { IProvider, SearchResult, ContentDetails, VideoSource, ContentType, Episode } from '../../types';
import { ScraperUtils } from '../../utils/scraper';
import { joinUrl } from '../../utils/helpers';

/**
 * موقع ويلت - مواقع الأفلام والمسلسلات الأجنبية مترجمة
 * https://wellt.net
 */
export class WelltProvider implements IProvider {
  name = 'Wellt';
  mainUrl = 'https://wellt.net';
  supportedTypes = [ContentType.MOVIE, ContentType.SERIES];
  private scraper: ScraperUtils;

  constructor() {
    this.scraper = new ScraperUtils();
  }

  async search(query: string, page = 1): Promise<SearchResult[]> {
    try {
      const searchUrl = `${this.mainUrl}/search?keyword=${encodeURIComponent(query)}&page=${page}`;
      const $ = await this.scraper.fetchAndParse(searchUrl);
      const results: SearchResult[] = [];

      $('.movie, .series').each((_, element) => {
        const $el = $(element);
        const link = $el.find('a').first().attr('href') || '';
        const id = link.split('/').filter(Boolean).pop()?.replace(/\/$/, '') || '';
        const title = $el.find('.title, h3').text().trim();
        const poster = $el.find('img').attr('src');
        const type = link.includes('series') ? ContentType.SERIES : ContentType.MOVIE;

        if (id && title) {
          results.push({ id, title, poster, type });
        }
      });

      return results;
    } catch (error) {
      console.error('خطأ في البحث على Wellt:', error);
      return [];
    }
  }

  async getDetails(id: string): Promise<ContentDetails> {
    try {
      const url = joinUrl(this.mainUrl, `/${id}`);
      const $ = await this.scraper.fetchAndParse(url);

      const title = $('h1').text().trim();
      const description = $('.description').text().trim();
      const poster = $('.poster img').attr('src');
      const year = parseInt($('.year').text()) || undefined;

      return {
        id,
        title,
        description,
        poster,
        year,
        type: ContentType.MOVIE
      };
    } catch (error) {
      console.error('خطأ في جلب التفاصيل من Wellt:', error);
      throw error;
    }
  }

  async getSources(id: string, episode?: number): Promise<VideoSource[]> {
    try {
      const url = joinUrl(this.mainUrl, `/${id}`);
      const $ = await this.scraper.fetchAndParse(url);
      const sources: VideoSource[] = [];

      $('.player iframe').each((index, element) => {
        const src = $(element).attr('src');
        if (src) {
          sources.push({
            id: `wellt-${index}`,
            url: src,
            quality: '720p',
            server: 'Wellt',
            type: 'mp4'
          });
        }
      });

      return sources;
    } catch (error) {
      console.error('خطأ في جلب المصادر من Wellt:', error);
      return [];
    }
  }

  async getEpisodes(id: string): Promise<Episode[]> {
    try {
      const url = joinUrl(this.mainUrl, `/${id}`);
      const $ = await this.scraper.fetchAndParse(url);
      const episodes: Episode[] = [];

      $('.episode').each((index, element) => {
        const $el = $(element);
        const number = index + 1;
        const title = $el.text().trim() || `الحلقة ${number}`;
        const episodeId = $el.attr('data-id') || `${id}-${number}`;

        episodes.push({
          id: episodeId,
          number,
          title
        });
      });

      return episodes;
    } catch (error) {
      console.error('خطأ في جلب الحلقات من Wellt:', error);
      return [];
    }
  }
}
