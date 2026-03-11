import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import en from './locales/en.json';
import zhTW from './locales/zh-TW.json';
import zhCN from './locales/zh-CN.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import pt from './locales/pt.json';
import ja from './locales/ja.json';
import ru from './locales/ru.json';

export const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文' },
  { code: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
];

const resources = {
  en: { translation: en },
  'zh-TW': { translation: zhTW },
  'zh-CN': { translation: zhCN },
  es: { translation: es },
  fr: { translation: fr },
  pt: { translation: pt },
  ja: { translation: ja },
  ru: { translation: ru },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'translation',
    detection: {
      // 只使用 localStorage，不自动检测浏览器语言
      // 这样首次访问会使用 fallbackLng (英文)
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    // 支持的语言白名单
    supportedLngs: ['en', 'zh-TW', 'zh-CN', 'es', 'fr', 'pt', 'ja', 'ru'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
