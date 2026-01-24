import { docs } from 'fumadocs-mdx:collections/server';
import type * as PageTree from 'fumadocs-core/page-tree';
import { type InferPageType, loader, multiple } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { openapiPlugin, openapiSource } from 'fumadocs-openapi/server';
import { i18n } from '@/lib/i18n';
import { openapi } from './openapi';

export const source = loader(
  multiple({
    docs: docs.toFumadocsSource(),
    openapi: await openapiSource(openapi, {
      per: 'custom',
      baseDir: 'developers/api/v1',
      toPages(builder) {
        const items = builder.extract();

        // --- PASS 1: Pre-process and Normalize Paths ---
        // We map the raw operations to a temporary structure containing the "clean" path.
        const processedItems = items.operations.map(op => {
          const { pathItem, operation, displayName } = builder.fromExtractedOperation(op)!;

          // 1. Remove prefix
          const cleanPrefix = op.path.replace(/^\/api\/v1\//, '');

          // 2. Handle Parameters (Remove intermediate, keep last)
          const segments = cleanPrefix.split('/');
          const cleanSegments = segments.map((segment, index) => {
            const isParam = segment.startsWith('{') && segment.endsWith('}');
            const isLast = index === segments.length - 1;

            if (isParam) {
              // If it's the last param, keep the name (stripped of braces). 
              // If it's intermediate, remove it.
              return isLast ? segment.slice(1, -1) : null;
            }
            return segment;
          }).filter(Boolean); // Remove nulls

          const normalizedPath = cleanSegments.join('/');

          return {
            op,
            normalizedPath,
            // Store these for later so we don't have to extract again
            meta: {
              title: displayName,
              description: operation.description ?? pathItem.description
            }
          };
        });

        // --- PASS 2: Detect Hierarchy and Generate Pages ---

        // We create a Set of all paths to easily look up if a path acts as a parent
        // Actually, a simple loop check is safer for "startsWith" logic.

        for (const item of processedItems) {
          const currentPath = item.normalizedPath;

          // CHECK: Is 'currentPath' a parent of any OTHER path?
          // We look for any other item whose path starts with "currentPath/"
          const hasChildren = processedItems.some(otherItem =>
            otherItem.normalizedPath !== currentPath &&
            otherItem.normalizedPath.startsWith(currentPath + '/')
          );

          let finalPath = '';

          if (hasChildren) {
            // Logic: If it has children, it becomes a folder.
            // We repeat the last segment to make the file.
            // e.g. "business/queues/outbound" -> "business/queues/outbound/outbound.mdx"
            const lastSegment = currentPath.split('/').pop();
            finalPath = `${currentPath}/${lastSegment}.mdx`;
          } else {
            // Logic: It is a leaf node.
            // e.g. "business/call/initiate" -> "business/call/initiate.mdx"
            finalPath = `${currentPath}.mdx`;
          }

          builder.create({
            path: finalPath,
            schemaId: builder.id,
            info: {
              title: item.meta.title,
              description: item.meta.description,
            },
            type: 'operation',
            item: item.op
          });
        }
      }
    }),
  }),
  {
    baseUrl: '/',
    i18n,
    plugins: [
      lucideIconsPlugin(),
      openapiPlugin()
    ],
  }
);

export function getPageTree(locale: string): PageTree.Root {
  return source.pageTree[locale] || Object.values(source.pageTree)[0];
}

export function getOrderedPages(locale: string) {
  const tree = getPageTree(locale);
  const allPages = new Map(source.getPages().map(p => [p.url, p]));
  const ordered: InferPageType<typeof source>[] = [];

  function traverse(node: PageTree.Node) {
    if (node.type === 'page') {
      const page = allPages.get(node.url);
      if (page) ordered.push(page);
    }

    if (node.type === 'folder') {
      if (node.index) {
        const page = allPages.get(node.index.url);
        if (page) ordered.push(page);
      }
      node.children.forEach(traverse);
    }
  }

  tree.children.forEach(traverse);

  return Array.from(new Set(ordered));
}

export async function getLLMText(page: InferPageType<typeof source>) {
  // Handle OpenAPI Pages
  if (page.data.type === 'openapi') {
    const schema = await page.data.getSchema();
    const props = (page.data as any).getAPIPageProps();
    const operation = props.operations?.[0];

    if (!operation) {
      return `# ${page.data.title}\n\n${page.data.description ?? ''}`;
    }

    const path = operation.path as string;
    const method = (operation.method as string).toLowerCase();

    const paths = (schema.bundled.paths || {}) as Record<string, any>;
    const pathItem = paths[path] || {};
    const operationSpec = pathItem[method] || {};
    const relevantSchemas = resolveRefs(operationSpec, schema.bundled);

    const finalDoc = {
      path: path,
      method: method.toUpperCase(),
      operation: operationSpec,
      components: {
        schemas: relevantSchemas
      }
    };

    return `# ${page.data.title && page.data.title !== path ? page.data.title + ' ' : ''}[${method.toUpperCase()} ${path}] (Reference: https://docs.iqra.bot${page.url})
${page.data.description ? `\n## Description\n${page.data.description}\n` : ''}
## OpenAPI Specification
\`\`\`json
${JSON.stringify(finalDoc, null, 2)}
\`\`\``;
  }

  // Handle Normal Markdown Pages
  const processed = await page.data.getText('processed');
  const cleanContent = processed.replace(/^import\s+.*;?$/gm, '').trim();

  return `# ${page.data.title} (Reference: https://docs.iqra.bot${page.url})\n\n${cleanContent}`;
}

/**
 * Helper: Recursively finds all $ref schemas used in an object
 * and returns a dictionary of those schemas.
 */
function resolveRefs(obj: any, root: any, collected: Record<string, any> = {}) {
  if (!obj || typeof obj !== 'object') return collected;

  if (Array.isArray(obj)) {
    obj.forEach(item => resolveRefs(item, root, collected));
    return collected;
  }

  const allSchemas = (root.components?.schemas || {}) as Record<string, any>;

  for (const key in obj) {
    const value = obj[key];

    if (key === '$ref' && typeof value === 'string' && value.startsWith('#/components/schemas/')) {
      const schemaName = value.split('/').pop();

      if (schemaName && !collected[schemaName] && allSchemas[schemaName]) {
        const schemaDef = allSchemas[schemaName];
        collected[schemaName] = schemaDef;
        resolveRefs(schemaDef, root, collected);
      }
    }
    else if (typeof value === 'object') {
      resolveRefs(value, root, collected);
    }
  }

  return collected;
}