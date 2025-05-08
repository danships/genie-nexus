import { LayoutClient } from './_layout-client';

export const metadata = {
  title: {
    template: '%s | Genie Nexus',
    default: 'Genie Nexus',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutClient>{children}</LayoutClient>;
}
