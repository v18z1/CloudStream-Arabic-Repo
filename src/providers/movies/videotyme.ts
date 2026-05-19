import { IProvider, SearchResult, ContentDetails, VideoSource, ContentType, Episode } from '../../types';
import { ScraperUtils } from '../../utils/scraper';
import { joinUrl } from '../../utils/helpers';

/**
 * موقع فيديو تايم - مواقع الأفلام والمسلسلات العربية
 * https://videotyme.com
 */
export class VideoTymeProvider implements IProvider {
  name = 'Video Tyme';
  mainUrl = 'https://videotyme.com';
  supportedTypes = [ContentType.MOVIE, ContentType.SERIES];
  private scraper: ScraperUtils;

  constructor() {
    this.scraper = new ScraperUtils();
  }

  async search(query: string, page = 1): Promise<SearchResult[]> {
    try {
      const searchUrl = `${this.mainUrl}/search?q=${encodeURIComponent(query)}&page=${page}`;
      const $ = await this.scraper.fetchAndParse(searchUrl);
      const results: SearchResult[] = [];

      $('.movie-item, .series-item').each((_, element) => {
        const $el = $(element);
        const id = $el.find('a').attr('href')?.split('/').pop() || '';
        const title = $el.find('.title').text().trim();
        const poster = $el.find('img').attr('src');
        const year = parseInt($el.find('.year').text()) || undefined;
        const type = $el.hasClass('series-item') ? ContentType.SERIES : ContentType.MOVIE;

        if (id && title) {
          results.push({ id, title, poster, year, type });
        }
      });

      return results;
    } catch (error) {
      console.error('خطأ في البحث على Video Tyme:', error);
      return [];
    }
  }

  async getDetails(id: string): Promise<ContentDetails> {
    try {
      const url = joinUrl(this.mainUrl, `/watch/${id}`);
      const $ = await this.scraper.fetchAndParse(url);

      const title = $('h1.title').text().trim();
      const description = $('.description').text().trim();
      const poster = $('.poster img').attr('src');
      const backdrop = $('.backdrop').attr('src');
      const year = parseInt($('.year').text()) || undefined;
      const genres = $('a.genre').map((_, el) => $(el).text()).get();
      const cast = $('a.actor').map((_, el) => $(el).text()).get();

      return {
        id,
        title,
        description,
        poster,
        backdrop,
        year,
        genres,
        cast,
        type: this.supportedTypes.includes(ContentType.SERIES) ? ContentType.SERIES : ContentType.MOVIE
      };
    } catch (error) {
      console.error('خطأ في جلب التفاصيل من Video Tyme:', error);
      throw error;
    }
  }

  async getSources(id: string, episode?: number): Promise<VideoSource[]> {
    try {
      const url = joinUrl(this.mainUrl, `/watch/${id}`);
      if (episode) url += `?ep=${episode}`;

      const $ = await this.scraper.fetchAndParse(url);
      const sources: VideoSource[] = [];

      $('.player iframe').each((_, element) => {
        const src = $(element).attr('src');
        if (src) {
          sources.push({
            id: src,
            url: src,
            quality: '720p',
            server: 'DirectStream',
            type: 'mp4'
          });
        }
      });

      return sources;
    } catch (error) {
      console.error('خطأ في جلب المصادر من Video Tyme:', error);
      return [];
    }
  }

  async getEpisodes(id: string): Promise<Episode[]> {
    try {
      const url = joinUrl(this.mainUrl, `/watch/${id}`);
      const $ = await this.scraper.fetchAndParse(url);
      const episodes: Episode[] = [];

      $('.episode-item').each((index, element) => {
        const $el = $(element);
        const number = index + 1;
        const title = $el.find('.ep-title').text().trim();
        const episodeId = $el.attr('data-id') || `${id}-${number}`;

        episodes.push({
          id: episodeId,
          number,
          title
        });
      });

      return episodes;
    } catch (error) {
      console.error('خطأ في جلب الحلقات من Video Tyme:', error);
      return [];
    }
  }
}
