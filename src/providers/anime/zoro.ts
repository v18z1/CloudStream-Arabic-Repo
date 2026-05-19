import { IProvider, SearchResult, ContentDetails, VideoSource, ContentType, Episode } from '../../types';
import { ScraperUtils } from '../../utils/scraper';
import { joinUrl } from '../../utils/helpers';

/**
 * موقع زورو - موقع الأنمي الشهير
 * https://zoro.to
 */
export class ZoroProvider implements IProvider {
  name = 'Zoro';
  mainUrl = 'https://zoro.to';
  supportedTypes = [ContentType.ANIME];
  private scraper: ScraperUtils;

  constructor() {
    this.scraper = new ScraperUtils();
  }

  async search(query: string, page = 1): Promise<SearchResult[]> {
    try {
      const searchUrl = `${this.mainUrl}/search?keyword=${encodeURIComponent(query)}&page=${page}`;
      const $ = await this.scraper.fetchAndParse(searchUrl);
      const results: SearchResult[] = [];

      $('.film-poster').each((_, element) => {
        const $el = $(element);
        const link = $el.find('a').first().attr('href') || '';
        const id = link.split('/').pop()?.split('?')[0] || '';
        const title = $el.find('.film-title').text().trim();
        const poster = $el.find('img').attr('src');

        if (id && title) {
          results.push({ id, title, poster, type: ContentType.ANIME });
        }
      });

      return results;
    } catch (error) {
      console.error('خطأ في البحث على Zoro:', error);
      return [];
    }
  }

  async getDetails(id: string): Promise<ContentDetails> {
    try {
      const url = joinUrl(this.mainUrl, `/anime/${id}`);
      const $ = await this.scraper.fetchAndParse(url);

      const title = $('.anime-title').text().trim() || $('h1').text().trim();
      const description = $('.synopsis').text().trim();
      const poster = $('.poster img').attr('src');
      const year = parseInt($('.year').text()) || undefined;

      return {
        id,
        title,
        description,
        poster,
        year,
        type: ContentType.ANIME
      };
    } catch (error) {
      console.error('خطأ في جلب التفاصيل من Zoro:', error);
      throw error;
    }
  }

  async getSources(id: string, episode?: number): Promise<VideoSource[]> {
    try {
      const url = joinUrl(this.mainUrl, `/anime/${id}`);
      const $ = await this.scraper.fetchAndParse(url);
      const sources: VideoSource[] = [];

      $('.server-list .server').each((index, element) => {
        const $el = $(element);
        const serverId = $el.attr('data-id') || `server-${index}`;
        const serverName = $el.text().trim();

        sources.push({
          id: serverId,
          url: `${this.mainUrl}/ajax/load-embed/${id}?id=${serverId}`,
          quality: '720p',
          server: serverName,
          type: 'mp4'
        });
      });

      return sources;
    } catch (error) {
      console.error('خطأ في جلب المصادر من Zoro:', error);
      return [];
    }
  }

  async getEpisodes(id: string): Promise<Episode[]> {
    try {
      const url = joinUrl(this.mainUrl, `/anime/${id}`);
      const $ = await this.scraper.fetchAndParse(url);
      const episodes: Episode[] = [];

      $('.episodes .ep-item').each((index, element) => {
        const $el = $(element);
        const number = parseInt($el.attr('data-number') || `${index + 1}`);
        const title = $el.find('.ep-name').text().trim() || `الحلقة ${number}`;
        const episodeId = $el.attr('data-id') || `${id}-${number}`;

        episodes.push({
          id: episodeId,
          number,
          title
        });
      });

      return episodes;
    } catch (error) {
      console.error('خطأ في جلب الحلقات من Zoro:', error);
      return [];
    }
  }
}
