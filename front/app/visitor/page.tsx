"use client";

import { useState } from "react";
import {
  User,
  Calendar,
  Mail,
  Smartphone,
  MessageSquare,
  BookOpen,
} from "lucide-react";

export default function Visitor() {
    const [response, setResponse] = useState<string>("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const name = formData.get("name") as string;
        const lastname = formData.get("lastname") as string;
        const axe = formData.get("axe") as string;
        const birthdate = formData.get("birthdate") as string;
        const phone_number = parseInt(formData.get("phoneNumber") as string, 10); // Conversion en entier
        const message = formData.get("message") as string;

        console.log("Form data:", {
            email,
            name,
            lastname,
            axe,
            birthdate,
            phone_number,
            message,
        });

        const visitor = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visitors`, {
            method: "POST",
            headers: {
                "Content-Type": "application/ld+json",
            },
            body: JSON.stringify({
                email: email,
                name: name,
                lastname: lastname,
                axe: axe,
                birthdate: birthdate, // Assurez-vous que c'est une chaîne
                phone_number: phone_number, // Utilisation de la clé correcte
                message: message,
            }),
        });

        const data = await visitor.json();
        if (visitor.ok) {
            setResponse("Inscription réussie");
        } else {
            console.error(data);
            if (data.description) {
                setResponse(data.description);
            } else {
                setResponse("Echec lors de l'inscription");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-8">
                <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
                Inscription en tant que visiteur
                </h1>

                {response && (
                <p className="mb-4 text-sm text-center text-green-600 font-medium">
                    {response}
                </p>
                )}

                <form method="POST" onSubmit={handleSubmit} className="space-y-4">
                {/* Prénom & Nom */}
                <div className="text-indigo-600 grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    <input
                        type="text"
                        name="name"
                        placeholder="Prénom"
                        required
                        className="w-full outline-none"
                    />
                    </div>
                    <div className="text-indigo-600 flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    <input
                        type="text"
                        name="lastname"
                        placeholder="Nom"
                        required
                        className="w-full outline-none"
                    />
                    </div>
                </div>

                {/* Axe & Date de naissance */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="text-indigo-600 flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <input
                        type="text"
                        name="axe"
                        placeholder="Axe souhaité"
                        className="w-full outline-none"
                    />
                    </div>
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <input
                        type="date"
                        name="birthdate"
                        placeholder="Date de naissance"
                        className="w-full outline-none"
                    />
                    </div>
                </div>

                {/* Téléphone & Email */}
                <div className="text-indigo-600 grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                    <Smartphone className="w-4 h-4 text-indigo-600" />
                    <input
                        type="number"
                        name="phoneNumber"
                        placeholder="Numéro de téléphone"
                        className="w-full outline-none"
                    />
                    </div>
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        className="w-full outline-none"
                    />
                    </div>
                </div>

                {/* Message */}
                <div className="text-indigo-600 flex items-start gap-2 border border-gray-300 rounded-lg px-3 py-2">
                    <MessageSquare className="w-5 h-5 text-indigo-600 mt-1" />
                    <textarea
                    name="message"
                    placeholder="Message personnalisé"
                    rows={4}
                    className="w-full outline-none resize-none"
                    />
                </div>

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