"use client";

import { createCookie } from "@/utils/jwt";
import { redirect } from "next/navigation";
 
import { useState } from "react";
 
export default function Login() {
    const [response, setResponse] = useState<string>("");
 
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
 
        const register = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/ld+json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });
 
        const data = await register.json();
        if (register.ok) {
            // Récupération du token
            const token = data.token;
            console.log(token);
            createCookie(token); // Crée le cookie avec le token
            redirect("/"); // Redirige vers la page d'accueil
        } else {
            console.error(data);
            if(data.message){
                setResponse(data.message);
            } else {
                setResponse("Echec lors de la connexion");
            }
        }
    }
 
    return (
        <div className="flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
                <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
                    Connexion
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
                        name="password"
                        placeholder="Mot de passe"
                        required
                        className="w-full text-indigo-600 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Connexion
                    </button>
                </form>
            </div>
        </div>
    );
}