import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { i18n } from '@/lib/i18n';

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    i18n,
    githubUrl: 'https://github.com/abdofallah/IqraAI',
    nav: {
      title: (
        <>
          {/* Image for LIGHT MODE (Hidden in dark mode) */}
          <Image
            src="/logo-dark.png"
            alt="Iqra AI"
            width={30}
            height={30}
            priority
            className="block dark:hidden"
          />

          {/* Image for DARK MODE (Hidden in light mode) */}
          <Image
            src="/logo-colored-light.png"
            alt="Iqra AI"
            width={30}
            height={30}
            priority
            className="hidden dark:block"
          />
          <span className="font-medium">Iqra AI</span>
        </>
      ),
      transparentMode: 'top',
    },
  };
}