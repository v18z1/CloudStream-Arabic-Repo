import { IProvider, SearchResult, ContentDetails, VideoSource, ContentType, Episode } from '../../types';
import { ScraperUtils } from '../../utils/scraper';
import { joinUrl } from '../../utils/helpers';

/**
 * موقع أنمي توون - موقع الأنمي والمانجا
 * https://animatoon.net
 */
export class AnimaToonProvider implements IProvider {
  name = 'AnimaToon';
  mainUrl = 'https://animatoon.net';
  supportedTypes = [ContentType.ANIME];
  private scraper: ScraperUtils;

  constructor() {
    this.scraper = new ScraperUtils();
  }

  async search(query: string, page = 1): Promise<SearchResult[]> {
    try {
      const searchUrl = `${this.mainUrl}/search?s=${encodeURIComponent(query)}&page=${page}`;
      const $ = await this.scraper.fetchAndParse(searchUrl);
      const results: SearchResult[] = [];

      $('.anime-box').each((_, element) => {
        const $el = $(element);
        const link = $el.find('a').first().attr('href') || '';
        const id = link.split('/').filter(Boolean).pop() || '';
        const title = $el.find('h3').text().trim();
        const poster = $el.find('img').attr('src');

        if (id && title) {
          results.push({ id, title, poster, type: ContentType.ANIME });
        }
      });

      return results;
    } catch (error) {
      console.error('خطأ في البحث على AnimaToon:', error);
      return [];
    }
  }

  async getDetails(id: string): Promise<ContentDetails> {
    try {
      const url = joinUrl(this.mainUrl, `/${id}`);
      const $ = await this.scraper.fetchAndParse(url);

      const title = $('h1').text().trim();
      const description = $('.story').text().trim();
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
      console.error('خطأ في جلب التفاصيل من AnimaToon:', error);
      throw error;
    }
  }

  async getSources(id: string, episode?: number): Promise<VideoSource[]> {
    try {
      const url = joinUrl(this.mainUrl, `/${id}`);
      const $ = await this.scraper.fetchAndParse(url);
      const sources: VideoSource[] = [];

      $('.server-link').each((index, element) => {
        const $el = $(element);
        const serverId = $el.attr('data-url') || `server-${index}`;
        const serverName = $el.text().trim();

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
      console.error('خطأ في جلب المصادر من AnimaToon:', error);
      return [];
    }
  }

  async getEpisodes(id: string): Promise<Episode[]> {
    try {
      const url = joinUrl(this.mainUrl, `/${id}`);
      const $ = await this.scraper.fetchAndParse(url);
      const episodes: Episode[] = [];

      $('.ep-list a').each((index, element) => {
        const $el = $(element);
        const number = parseInt($el.text()) || (index + 1);
        const title = `الحلقة ${number}`;
        const episodeId = $el.attr('href')?.split('/').pop() || `${id}-${number}`;

        episodes.push({
          id: episodeId,
          number,
          title
        });
      });

      return episodes;
    } catch (error) {
      console.error('خطأ في جلب الحلقات من AnimaToon:', error);
      return [];
    }
  }
}
