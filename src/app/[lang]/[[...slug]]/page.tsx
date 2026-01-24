import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { PageActions } from '@/components/ai/page-actions';
import { APIPage } from '@/components/api/api-page';
import {
    DocsBody,
    DocsDescription,
    DocsPage,
    DocsTitle,
} from '@/components/layout/notebook/page';
import { rightToLeftLanguages } from '@/lib/i18n';
import { source } from '@/lib/source';
import { getMDXComponents } from "@/mdx-components";

export default async function Page(props: {
    params: Promise<{ lang: string; slug?: string[] }>;
}) {
    const params = await props.params;

    if (!params.slug) {
        return redirect(`/${params.lang}/intro`);
    }

    const page = source.getPage(params.slug, params.lang);
    if (!page) notFound();

    const markdownUrl = `/${params.lang}/${params.slug.join('/')}.md`;

    // for OpenAPI pages
    if (page.data.type === 'openapi') {
        return (
            <DocsPage full>
                <DocsTitle dir={rightToLeftLanguages.includes(params.lang) ? 'rtl' : 'ltr'}>
                    {page.data.title}
                </DocsTitle>

                <PageActions markdownUrl={markdownUrl} />

                <DocsDescription dir={rightToLeftLanguages.includes(params.lang) ? 'rtl' : 'ltr'}>{page.data.description}</DocsDescription>
                <DocsBody dir={rightToLeftLanguages.includes(params.lang) ? 'rtl' : 'ltr'}>
                    <APIPage {...page.data.getAPIPageProps()} />
                </DocsBody>
            </DocsPage>
        );
    }

    const MDX = page.data.body;

    return (
        <DocsPage toc={page.data.toc} full={page.data.full}>
            <DocsTitle dir={rightToLeftLanguages.includes(params.lang) ? 'rtl' : 'ltr'}>
                {page.data.title}
            </DocsTitle>

            <PageActions markdownUrl={markdownUrl} />

            <DocsDescription dir={rightToLeftLanguages.includes(params.lang) ? 'rtl' : 'ltr'}>{page.data.description}</DocsDescription>
            <DocsBody dir={rightToLeftLanguages.includes(params.lang) ? 'rtl' : 'ltr'}>
                <MDX components={getMDXComponents()} />
            </DocsBody>
        </DocsPage>
    );
}


export async function generateStaticParams() {
    const params = source.generateParams();
    return params;
}

export async function generateMetadata(props: {
    params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
    const params = await props.params;
    const page = source.getPage(params.slug);
    if (!page) notFound();

    return {
        title: page.data.title,
        description: page.data.description
    };
}