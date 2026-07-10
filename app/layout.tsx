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
    title: "Atharva Kale — Backend & AI Engineer",
    description: "Backend & AI engineer building streaming multi-agent systems, RAG pipelines, and high-throughput production infrastructure.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
                <Navbar />
                <main className="flex-grow w-full">
                    {children}
                </main>
                <Footer />
                <Chatbot />
            </body>
        </html>
    );
}
