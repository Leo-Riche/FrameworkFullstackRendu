import Menu from "@/components/Menu";
 
export default function RootTemplate({ children }: { children: React.ReactNode }) {
    return (
        <>
            <header className="bg-white shadow-md">
                <Menu />
            </header>
            <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </>
    )
}