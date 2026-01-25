import type { ReactNode } from 'react';
import { DocsLayout } from '@/components/layout/notebook';
import { AISearch, AISearchPanel, AISearchTrigger } from '@/components/search';
import { rightToLeftLanguages } from '@/lib/i18n';
import { baseOptions } from '@/lib/layout.shared';
import { getPageTree } from '@/lib/source';

export default async function Layout({
    params,
    children
}: {
    children: ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const tree = getPageTree(lang);
    const { nav, ...base } = baseOptions(lang);

    return (
        <DocsLayout
            {...base}
            nav={{ ...nav, mode: 'top' }}
            tabMode="navbar"
            tree={tree}
            dir={rightToLeftLanguages.includes(lang) ? 'rtl' : 'ltr'}
        >
            {children}

            <AISearch>
                <AISearchPanel />
                <AISearchTrigger />
            </AISearch>
        </DocsLayout>
    );
}