'use client';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@lib/style/main.css';
import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAuthOnboardingRedirectNeeded } from './_actions';

const theme = createTheme({
  /** Put your mantine theme override here */
});

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark' | 'auto'>(
    'auto'
  );
  const [redirectToOnboardingChecked, setRedirectToOnboardingChecked] =
    useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const storedColorScheme = localStorage.getItem('mantine-color-scheme') as
      | 'light'
      | 'dark'
      | null;
    if (storedColorScheme) {
      setColorScheme(storedColorScheme);
    }
  }, []);
  useEffect(() => {
    if (
      redirectToOnboardingChecked ||
      !pathname ||
      pathname.startsWith('/onboarding') ||
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/sign-up')
    ) {
      return;
    }

    isAuthOnboardingRedirectNeeded(pathname).then((doRedirect) => {
      if (doRedirect) {
        router.push('/onboarding');
        return;
      }
      setRedirectToOnboardingChecked(true);
    });
  }, [pathname, redirectToOnboardingChecked]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme={colorScheme}>
          <Notifications />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
