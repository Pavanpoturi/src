import { loadState } from "@lib/helpers/localStorage";
const userLanguage = loadState("userLanguage");

const config = {
  defaultLanguage: userLanguage,
  options: [
    {
      languageId: "english",
      locale: "en",
      text: "English",
    },
    {
      languageId: "hindi",
      locale: "hi",
      text: "Hindi",
    },
  ],
};

export function getCurrentLanguage(lang) {
  let selecetedLanguage = config.options[0];
  config.options.forEach((language) => {
    if (language.languageId === lang) {
      selecetedLanguage = language;
    }
  });
  return selecetedLanguage;
}
export default config;
