import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Newsletter",
    description: "S'inscrire à notre newsletter",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    );
}