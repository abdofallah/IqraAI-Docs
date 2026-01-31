import { defineI18n } from 'fumadocs-core/i18n';

export const availableLanguages = ['en', 'ar', 'cn'];
export const rightToLeftLanguages = ['ar'];
export const defaultLanguage = 'en';

export const i18n = defineI18n({
    defaultLanguage: defaultLanguage,
    languages: availableLanguages,
    hideLocale: 'default-locale'
});

