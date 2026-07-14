import "./globals.css";

export const metadata = {
  title: "Legacy Bridge",
  description: "Clinical legacy data extraction and FHIR validation workspace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
