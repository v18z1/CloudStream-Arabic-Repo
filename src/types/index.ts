// أنواع البيانات الأساسية للمشروع

/**
 * واجهة المصدر (Provider)
 * كل موقع يجب أن ينفذ هذه الواجهة
 */
export interface IProvider {
  name: string;                                    // اسم الموقع
  mainUrl: string;                                  // رابط الموقع الرئيسي
  supportedTypes: ContentType[];                    // أنواع المحتوى المدعومة
  
  search(query: string, page?: number): Promise<SearchResult[]>;
  getDetails(id: string): Promise<ContentDetails>;
  getSources(id: string, episode?: number): Promise<VideoSource[]>;
  getEpisodes?(id: string): Promise<Episode[]>;
}

/**
 * أنواع المحتوى
 */
export enum ContentType {
  MOVIE = 'movie',           // فيلم
  SERIES = 'series',         // مسلسل
  ANIME = 'anime',           // أنمي
  MANGA = 'manga'            // مانجا
}

/**
 * نتيجة البحث
 */
export interface SearchResult {
  id: string;                 // معرف المحتوى
  title: string;              // العنوان
  poster?: string;            // صورة الملصق
  year?: number;              // السنة
  type: ContentType;          // نوع المحتوى
  rating?: number;            // التقييم
  description?: string;       // الوصف
}

/**
 * تفاصيل المحتوى
 */
export interface ContentDetails {
  id: string;
  title: string;
  poster?: string;
  backdrop?: string;         // صورة الخلفية
  description: string;
  year?: number;
  rating?: number;
  genres?: string[];
  cast?: string[];
  director?: string;
  duration?: number;         // المدة بالدقائق
  type: ContentType;
  episodes?: Episode[];       // الحلقات (للمسلسلات)
}

/**
 * الحلقة (للمسلسلات والأنمي)
 */
export interface Episode {
  id: string;
  number: number;             // رقم الحلقة
  season?: number;            // رقم الموسم
  title: string;
  description?: string;
  poster?: string;
  airDate?: string;
}

/**
 * مصدر الفيديو
 */
export interface VideoSource {
  id: string;
  url: string;                // رابط المشاهدة
  quality: VideoQuality;      // جودة الفيديو
  server: string;             // اسم الخادم (مثال: Vidstream, Mp4Upload)
  language?: string;          // اللغة (عربي، إنجليزي، إلخ)
  type: 'mp4' | 'hls' | 'dash'; // نوع المصدر
  headers?: Record<string, string>; // رؤوس HTTP إذا لزم الأمر
}

/**
 * جودة الفيديو
 */
export enum VideoQuality {
  UNKNOWN = 'unknown',
  SD = '480p',
  HD = '720p',
  FULL_HD = '1080p',
  QUAD_HD = '2K',
  ULTRA_HD = '4K'
}

/**
 * نتيجة الاستجابة من الخادم
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
