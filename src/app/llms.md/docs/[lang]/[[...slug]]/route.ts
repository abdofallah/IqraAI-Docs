import { notFound } from 'next/navigation';
import { getLLMText, source } from '@/lib/source';

export const revalidate = false;

export async function GET(
    _req: Request,
    props: { params: Promise<{ lang: string; slug?: string[] }> }
) {
    const { lang, slug } = await props.params;

    // Fetch the page using correct locale and slug
    const page = source.getPage(slug, lang);

    if (!page) notFound();

    const text = await getLLMText(page);

    return new Response(text, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8', // Plain text for easy viewing/copying
        },
    });
}

export function generateStaticParams() {
    return source.generateParams();
}