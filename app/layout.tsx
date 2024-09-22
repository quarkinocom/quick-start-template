import localFont from "next/font/local";
import "./globals.css";
import { getSettings } from "@/actions/getSettings";
import Providers from "@/components/providers/providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

/**
 *
 * @returns Makes metadata
 */
export const generateMetadata = async () => {
  const settings = await getSettings();

  return {
    metadataBase: new URL(process.env.BASE_URL as string),
    title: {
      default: `${
        settings?.data?.results?.site_title?.site_title || "Quarkino"
      }`,
      template: `%s :: ${
        settings?.data?.results?.site_title?.site_title || "Quarkino"
      }`,
    },
    description: "",
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
