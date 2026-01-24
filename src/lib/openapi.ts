import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createOpenAPI } from 'fumadocs-openapi/server';

let cachedSchema: any = null;

export const openapi = createOpenAPI({
    async input() {
        // If we already have it in memory, return it immediately
        if (cachedSchema) return { my_schema: cachedSchema };

        try {
            const res = await fetch('https://app.iqra.bot/openapi/v1.json');
            if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

            cachedSchema = await res.json();
        } catch (error) {
            console.warn('⚠️ Error fetching remote OpenAPI schema. Falling back to local v1.json.');

            const localPath = join(process.cwd(), 'v1.json');
            const fileContents = readFileSync(localPath, 'utf-8');
            cachedSchema = JSON.parse(fileContents);
        }

        return {
            my_schema: cachedSchema,
        };
    }
});