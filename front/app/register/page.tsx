"use client";
 
import { useState } from "react";
 
export default function Register() {
    const [response, setResponse] = useState<string>("");
 
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const plainPassword = formData.get("plainPassword") as string;
 
        const register = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/ld+json",
            },
            body: JSON.stringify({
                email: email,
                plainPassword: plainPassword,
            }),
        });
 
        const data = await register.json();
        if (register.ok) {
            setResponse("Inscription réussie");
        } else {
            console.error(data);
            if (data.description) {
                setResponse(data.description);
            } else {
                setResponse("Echec lors de l'inscription");
            }
        }
    }
 
    return (
        <div className="flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
                <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
                Inscription
                </h1>

                {response && (
                <p className="mb-4 text-sm text-center text-red-600 font-medium">
                    {response}
                </p>
                )}

                <form method="POST" onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="w-full text-indigo-600 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                    type="password"
                    name="plainPassword"
                    placeholder="Mot de passe"
                    required
                    className="w-full text-indigo-600 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                >
                    Inscription
                </button>
                </form>
            </div>
        </div>
    );
}