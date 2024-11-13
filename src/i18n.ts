import {initReactI18next} from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import en from '~/resources/locales/en.json';
import hi from '~/resources/locales/hi.json';
import ja from '~/resources/locales/ja.json';
import de from '~/resources/locales/de.json';
import ko from '~/resources/locales/ko.json';
import es from '~/resources/locales/es.json';
import id from '~/resources/locales/id.json';
import pt from '~/resources/locales/pt.json';

import i18n from "i18next";

const defaultLanguage = 'en';

export const defaultNS = 'default';

export const resources = {
  en: {
    translation: en,
  },
  hi: {
    translation: hi,
  },
  ja: {
    translation: ja,
  },
  es: {
    translation: es,
  },
  id: {
    translation: id,
  },
  de: {
    translation: de,
  },
  ko: {
    translation: ko,
  },
  pt: {
    translation: pt,
  },
};

i18n
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: defaultLanguage,
    fallbackLng: defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
