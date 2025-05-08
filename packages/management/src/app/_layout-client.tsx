'use client';
import '@mantine/core/styles.css';
import { MantineProvider, ColorSchemeScript, createTheme } from '@mantine/core';

const theme = createTheme({
  /** Put your mantine theme override here */
});

export function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
