// filepath: c:\Users\o001830\clubsapp\src\app\club\layout.tsx
export default function ClubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="club-layout">
      <header className="bg-blue-500 text-white p-4">
        <h1>Club Dashboard</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}