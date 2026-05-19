import { IProvider, SearchResult, ContentDetails, VideoSource, ContentType, Episode } from '../../types';
import { ScraperUtils } from '../../utils/scraper';
import { joinUrl } from '../../utils/helpers';

/**
 * موقع أنمي فاير - موقع الأنمي
 * https://animefire.plus
 */
export class AnimeFireProvider implements IProvider {
  name = 'Anime Fire';
  mainUrl = 'https://animefire.plus';
  supportedTypes = [ContentType.ANIME];
  private scraper: ScraperUtils;

  constructor() {
    this.scraper = new ScraperUtils();
  }

  async search(query: string, page = 1): Promise<SearchResult[]> {
    try {
      const searchUrl = `${this.mainUrl}/search/${encodeURIComponent(query)}?page=${page}`;
      const $ = await this.scraper.fetchAndParse(searchUrl);
      const results: SearchResult[] = [];

      $('.anime-item').each((_, element) => {
        const $el = $(element);
        const link = $el.find('a').first().attr('href') || '';
        const id = link.split('/').filter(Boolean).pop() || '';
        const title = $el.find('.title').text().trim();
        const poster = $el.find('img').attr('src');

        if (id && title) {
          results.push({ id, title, poster, type: ContentType.ANIME });
        }
      });

      return results;
    } catch (error) {
      console.error('خطأ في البحث على Anime Fire:', error);
      return [];
    }
  }

  async getDetails(id: string): Promise<ContentDetails> {
    try {
      const url = joinUrl(this.mainUrl, `/${id}`);
      const $ = await this.scraper.fetchAndParse(url);

      const title = $('h1').text().trim();
      const description = $('.synopsis').text().trim();
      const poster = $('.poster img').attr('src');
      const year = parseInt($('.release-year').text()) || undefined;

      return {
        id,
        title,
        description,
        poster,
        year,
        type: ContentType.ANIME
      };
    } catch (error) {
      console.error('خطأ في جلب التفاصيل من Anime Fire:', error);
      throw error;
    }
  }

  async getSources(id: string, episode?: number): Promise<VideoSource[]> {
    try {
      const url = joinUrl(this.mainUrl, `/${id}`);
      const $ = await this.scraper.fetchAndParse(url);
      const sources: VideoSource[] = [];

      $('.server-item').each((index, element) => {
        const $el = $(element);
        const serverId = $el.attr('data-id') || `server-${index}`;
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
      console.error('خطأ في جلب المصادر من Anime Fire:', error);
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
      console.error('خطأ في جلب الحلقات من Anime Fire:', error);
      return [];
    }
  }
}
