import { IProvider, SearchResult, ContentDetails, VideoSource, ContentType, Episode } from '../../types';
import { ScraperUtils } from '../../utils/scraper';
import { joinUrl } from '../../utils/helpers';

/**
 * موقع أنمي إكس - موقع الأنمي والمانجا
 * https://animex.info
 */
export class AnimeXProvider implements IProvider {
  name = 'AnimeX';
  mainUrl = 'https://animex.info';
  supportedTypes = [ContentType.ANIME];
  private scraper: ScraperUtils;

  constructor() {
    this.scraper = new ScraperUtils();
  }

  async search(query: string, page = 1): Promise<SearchResult[]> {
    try {
      const searchUrl = `${this.mainUrl}/search?q=${encodeURIComponent(query)}&page=${page}`;
      const $ = await this.scraper.fetchAndParse(searchUrl);
      const results: SearchResult[] = [];

      $('.anime-card').each((_, element) => {
        const $el = $(element);
        const link = $el.find('a').first().attr('href') || '';
        const id = link.split('/').filter(Boolean).pop() || '';
        const title = $el.find('.anime-name').text().trim();
        const poster = $el.find('img').attr('src');

        if (id && title) {
          results.push({ id, title, poster, type: ContentType.ANIME });
        }
      });

      return results;
    } catch (error) {
      console.error('خطأ في البحث على AnimeX:', error);
      return [];
    }
  }

  async getDetails(id: string): Promise<ContentDetails> {
    try {
      const url = joinUrl(this.mainUrl, `/anime/${id}`);
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
        type: ContentType.ANIME
      };
    } catch (error) {
      console.error('خطأ في جلب التفاصيل من AnimeX:', error);
      throw error;
    }
  }

  async getSources(id: string, episode?: number): Promise<VideoSource[]> {
    try {
      const url = joinUrl(this.mainUrl, `/anime/${id}`);
      const $ = await this.scraper.fetchAndParse(url);
      const sources: VideoSource[] = [];

      $('.player-server').each((index, element) => {
        const $el = $(element);
        const serverName = $el.text().trim();
        const serverId = $el.attr('data-server') || `server-${index}`;

        sources.push({
          id: serverId,
          url: serverId,
          quality: '720p',
          server: serverName,
          type: 'mp4'
        });
      });

      return sources;
    } catch (error) {
      console.error('خطأ في جلب المصادر من AnimeX:', error);
      return [];
    }
  }

  async getEpisodes(id: string): Promise<Episode[]> {
    try {
      const url = joinUrl(this.mainUrl, `/anime/${id}`);
      const $ = await this.scraper.fetchAndParse(url);
      const episodes: Episode[] = [];

      $('.episode-link').each((index, element) => {
        const $el = $(element);
        const number = parseInt($el.attr('data-ep') || `${index + 1}`);
        const title = $el.text().trim() || `الحلقة ${number}`;
        const episodeId = $el.attr('href')?.split('/').pop() || `${id}-${number}`;

        episodes.push({
          id: episodeId,
          number,
          title
        });
      });

      return episodes;
    } catch (error) {
      console.error('خطأ في جلب الحلقات من AnimeX:', error);
      return [];
    }
  }
}
