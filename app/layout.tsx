import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "AI Engineer Portfolio",
    description: "Portfolio of a Senior Backend & AI Engineer",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${inter.variable} antialiased min-h-screen flex flex-col relative z-0`}>
                {/* Global Ethereal Mesh Background */}
                <div className="mesh-bg"></div>

                <Navbar />
                <main className="flex-grow pt-40 relative z-10 w-full">
                    {children}
                </main>
                <Footer />
                <Chatbot />
            </body>
        </html>
    );
}
