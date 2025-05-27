'use client';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@lib/style/main.css';
import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';

const theme = createTheme({
  /** Put your mantine theme override here */
});

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark' | 'auto'>(
    'auto'
  );

  useEffect(() => {
    const storedColorScheme = localStorage.getItem('mantine-color-scheme') as
      | 'light'
      | 'dark'
      | null;
    if (storedColorScheme) {
      setColorScheme(storedColorScheme);
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
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
