import "./globals.css";

export const metadata = {
  title: "Clubfy App",
  description: "Gestión de clubes deportivos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
