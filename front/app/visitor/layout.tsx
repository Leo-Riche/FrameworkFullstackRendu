import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Visiteur",
    description: "S'inscrire à notre en tant que visiteur",
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