import { createTokenizer } from '@orama/tokenizers/mandarin';
import { createFromSource } from 'fumadocs-core/search/server';
import { source } from '@/lib/source';

export const { GET } = createFromSource(source, {
  language: 'english',
  localeMap: {
    ar: { language: 'arabic' },
    en: { language: 'english' },
    cn: {
      // @ts-ignore - Ensure Orama doesn't receive a language string here
      language: null,
      components: {
        tokenizer: createTokenizer(),
      },
      search: {
        threshold: 0,
        tolerance: 0,
      },
    },
  },
});
