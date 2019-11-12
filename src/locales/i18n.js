import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en";
import es from "./es";

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: cb => cb("es"),
  init: () => {},
  cacheUserLanguage: () => {}
};

i18n
  .use(languageDetector)
  .use(initReactI18next) // bind react-i18next to the instance
  .init({
    fallbackLng: "es",
    debug: true,

    interpolation: {
      escapeValue: false // not needed for react!!
    },
    resources: {
      en,
      es
    }

    // react i18next special options (optional)
    // override if needed - omit if ok with defaults
    /*
    react: {
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
      useSuspense: true,
    }
    */
  });

export default i18n;
