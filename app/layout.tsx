import type { Metadata } from "next";
import "./globals.scss";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Herb Approach | Canada's #1 Online Dispensary",
  description: "Premium AAAA+ Cannabis Flowers, Potent Edibles, and Concentrates delivered to your door.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="page-enter">
        <Toaster position="top-right" />
        {children}
        {/* Bootstrap Bundle JS */}
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          async
        ></script>
      </body>
    </html>
  );
}
