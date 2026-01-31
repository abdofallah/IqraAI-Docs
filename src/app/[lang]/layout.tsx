import { defineI18nUI } from 'fumadocs-ui/i18n';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';
import SearchDialog from '@/components/search';
import { i18n, rightToLeftLanguages } from '@/lib/i18n';

const { provider } = defineI18nUI(i18n, {
    translations: {
        en: {
            displayName: 'English',
        },
        ar: {
            displayName: 'العربية',
            search: 'يبحث',
        },
        cn: {
            displayName: '中国人',
            search: '搜索',
        },
    },
});

export default async function LanguageLayout({
    params,
    children,
}: {
    params: Promise<{ lang: string }>;
    children: ReactNode;
}) {
    const { lang } = await params;

    return (
        <RootProvider dir={rightToLeftLanguages.includes(lang) ? 'rtl' : 'ltr'} i18n={provider(lang)} search={{ SearchDialog }}>
            {children}
        </RootProvider>
    );
}