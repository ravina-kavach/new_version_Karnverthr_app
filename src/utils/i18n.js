import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import RNLocalize from 'react-native-localize';
import LanguageDetector from '@os-team/i18next-react-native-language-detector';

import en from '../locales/English.json'
import hi from '../locales/Hindi.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    resources: { en: { translation: en }, hi: { translation: hi } },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
 
RNLocalize?.addEventListener('change', () => {
  i18n.reloadResources();
});
export default i18n;