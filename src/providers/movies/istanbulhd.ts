import { IProvider, SearchResult, ContentDetails, VideoSource, ContentType, Episode } from '../../types';
import { ScraperUtils } from '../../utils/scraper';
import { joinUrl } from '../../utils/helpers';

/**
 * موقع إسطنبول HD - مواقع الأفلام والمسلسلات التركية والعربية
 * https://istanbulhd.online
 */
export class IstanbulHDProvider implements IProvider {
  name = 'Istanbul HD';
  mainUrl = 'https://istanbulhd.online';
  supportedTypes = [ContentType.MOVIE, ContentType.SERIES];
  private scraper: ScraperUtils;

  constructor() {
    this.scraper = new ScraperUtils();
  }

  async search(query: string, page = 1): Promise<SearchResult[]> {
    try {
      const searchUrl = `${this.mainUrl}/search/${encodeURIComponent(query)}/page/${page}`;
      const $ = await this.scraper.fetchAndParse(searchUrl);
      const results: SearchResult[] = [];

      $('.item-list .item').each((_, element) => {
        const $el = $(element);
        const link = $el.find('a').attr('href') || '';
        const id = link.split('/').filter(Boolean).pop() || '';
        const title = $el.find('.item-title').text().trim();
        const poster = $el.find('img').attr('src');
        const type = link.includes('/series/') ? ContentType.SERIES : ContentType.MOVIE;

        if (id && title) {
          results.push({ id, title, poster, type });
        }
      });

      return results;
    } catch (error) {
      console.error('خطأ في البحث على Istanbul HD:', error);
      return [];
    }
  }

  async getDetails(id: string): Promise<ContentDetails> {
    try {
      const url = joinUrl(this.mainUrl, `/movie/${id}`);
      const $ = await this.scraper.fetchAndParse(url);

      const title = $('h1').text().trim();
      const description = $('.description').text().trim();
      const poster = $('.poster img').attr('src');
      const backdrop = $('.cover').attr('style')?.match(/url\('([^']+)'\)/)?.[1];
      const year = parseInt($('.release-year').text()) || undefined;

      return {
        id,
        title,
        description,
        poster,
        backdrop,
        year,
        type: ContentType.MOVIE
      };
    } catch (error) {
      console.error('خطأ في جلب التفاصيل من Istanbul HD:', error);
      throw error;
    }
  }

  async getSources(id: string, episode?: number): Promise<VideoSource[]> {
    try {
      const url = joinUrl(this.mainUrl, `/movie/${id}`);
      const $ = await this.scraper.fetchAndParse(url);
      const sources: VideoSource[] = [];

      $('.player-button, .server-item').each((index, element) => {
        const $el = $(element);
        const serverName = $el.text().trim();
        const serverId = $el.attr('data-id') || `server-${index}`;

        sources.push({
          id: serverId,
          url: serverId,
          quality: '720p',
          server: serverName || 'Unknown',
          type: 'mp4'
        });
      });

      return sources;
    } catch (error) {
      console.error('خطأ في جلب المصادر من Istanbul HD:', error);
      return [];
    }
  }

  async getEpisodes(id: string): Promise<Episode[]> {
    try {
      const url = joinUrl(this.mainUrl, `/series/${id}`);
      const $ = await this.scraper.fetchAndParse(url);
      const episodes: Episode[] = [];

      $('.episodes-list .episode').each((index, element) => {
        const $el = $(element);
        const number = parseInt($el.attr('data-episode') || `${index + 1}`);
        const title = $el.find('.ep-title').text().trim() || `الحلقة ${number}`;
        const episodeId = $el.attr('data-id') || `${id}-${number}`;

        episodes.push({
          id: episodeId,
          number,
          title
        });
      });

      return episodes;
    } catch (error) {
      console.error('خطأ في جلب الحلقات من Istanbul HD:', error);
      return [];
    }
  }
}
