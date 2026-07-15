import "./globals.css";
import ThemeProvider from "../components/Theme/ThemeProvider";

export const metadata = {
  title: "Legacy Bridge",
  description: "Clinical legacy data extraction and FHIR validation workspace",
  icons: {
    icon: [
      {
        url: "/logo/ico/legacy-bridge_no_title.ico",
        type: "image/x-icon",
      },
      {
        url: "/logo/legacy-bridge_no_title.png",
        type: "image/png",
        sizes: "1024x1024",
      },
      {
        url: "/logo/webp/legacy-bridge_no_title.webp",
        type: "image/webp",
      },
    ],
    shortcut: "/logo/ico/legacy-bridge_no_title.ico",
    apple: "/logo/legacy-bridge_no_title.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
