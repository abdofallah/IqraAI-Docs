import { createAPIPage } from 'fumadocs-openapi/ui';
import { mediaAdapters } from '@/lib/media-adapters';
import { openapi } from '@/lib/openapi';
import client from './api-page.client';

export const APIPage = createAPIPage(openapi, {
    client,
    mediaAdapters
});