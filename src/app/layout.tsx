// Root layout must exist for Next.js App Router.
// The actual <html> and <body> are rendered in src/app/[locale]/layout.tsx
// because next-intl requires a dynamic <html lang={locale}> attribute.
//
// This is the correct next-intl pattern — not a hack.
// See: https://next-intl-docs.vercel.app/docs/getting-started/app-router
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
