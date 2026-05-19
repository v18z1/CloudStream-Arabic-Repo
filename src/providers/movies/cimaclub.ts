import { IProvider, SearchResult, ContentDetails, VideoSource, ContentType, Episode } from '../../types';
import { ScraperUtils } from '../../utils/scraper';
import { joinUrl } from '../../utils/helpers';

/**
 * موقع سينما كلاب - مواقع الأفلام والمسلسلات العربية والأجنبية
 * https://cima4u.cyou
 */
export class CimaClubProvider implements IProvider {
  name = 'Cima Club';
  mainUrl = 'https://cima4u.cyou';
  supportedTypes = [ContentType.MOVIE, ContentType.SERIES];
  private scraper: ScraperUtils;

  constructor() {
    this.scraper = new ScraperUtils();
  }

  async search(query: string, page = 1): Promise<SearchResult[]> {
    try {
      const searchUrl = `${this.mainUrl}/?s=${encodeURIComponent(query)}&paged=${page}`;
      const $ = await this.scraper.fetchAndParse(searchUrl);
      const results: SearchResult[] = [];

      $('.movies-list article').each((_, element) => {
        const $el = $(element);
        const link = $el.find('a').first().attr('href') || '';
        const id = link.split('/').filter(Boolean).pop()?.replace(/\/$/, '') || '';
        const title = $el.find('h2, h3').text().trim();
        const poster = $el.find('img').attr('src');
        const type = link.includes('series') ? ContentType.SERIES : ContentType.MOVIE;

        if (id && title) {
          results.push({ id, title, poster, type });
        }
      });

      return results;
    } catch (error) {
      console.error('خطأ في البحث على Cima Club:', error);
      return [];
    }
  }

  async getDetails(id: string): Promise<ContentDetails> {
    try {
      const url = joinUrl(this.mainUrl, `/${id}`);
      const $ = await this.scraper.fetchAndParse(url);

      const title = $('h1.title').text().trim() || $('h1').text().trim();
      const description = $('.description, .story').text().trim();
      const poster = $('.poster img, .cover img').attr('src');
      const year = parseInt($('.release-date, .year').text()) || undefined;

      return {
        id,
        title,
        description,
        poster,
        year,
        type: ContentType.MOVIE
      };
    } catch (error) {
      console.error('خطأ في جلب التفاصيل من Cima Club:', error);
      throw error;
    }
  }

  async getSources(id: string, episode?: number): Promise<VideoSource[]> {
    try {
      const url = joinUrl(this.mainUrl, `/${id}`);
      const $ = await this.scraper.fetchAndParse(url);
      const sources: VideoSource[] = [];

      // جلب روابط المشاهدة
      $('.download-link, .watch-button').each((index, element) => {
        const $el = $(element);
        const href = $el.attr('href') || '';
        const quality = $el.text().includes('720') ? '720p' : $el.text().includes('1080') ? '1080p' : '480p';

        if (href) {
          sources.push({
            id: `source-${index}`,
            url: href,
            quality,
            server: 'CimaClub',
            type: 'mp4'
          });
        }
      });

      return sources.length > 0 ? sources : this.getDefaultSources(id);
    } catch (error) {
      console.error('خطأ في جلب المصادر من Cima Club:', error);
      return this.getDefaultSources(id);
    }
  }

  private getDefaultSources(id: string): VideoSource[] {
    return [{
      id: `${id}-1`,
      url: `${this.mainUrl}/${id}`,
      quality: '720p',
      server: 'CimaClub',
      type: 'mp4'
    }];
  }

  async getEpisodes(id: string): Promise<Episode[]> {
    try {
      const url = joinUrl(this.mainUrl, `/${id}`);
      const $ = await this.scraper.fetchAndParse(url);
      const episodes: Episode[] = [];

      $('.episode-item, .ep').each((index, element) => {
        const $el = $(element);
        const number = index + 1;
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
      console.error('خطأ في جلب الحلقات من Cima Club:', error);
      return [];
    }
  }
}
