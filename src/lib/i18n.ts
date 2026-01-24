import { defineI18n } from 'fumadocs-core/i18n';

export const i18n = defineI18n({
    defaultLanguage: 'en',
    languages: ['en', 'ar', 'cn'],
    hideLocale: 'default-locale'
});

export const rightToLeftLanguages = ['ar'];