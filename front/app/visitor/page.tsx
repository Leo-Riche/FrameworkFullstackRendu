"use client";

import { useState } from "react";

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
        <div>
            <h1>NewsLetter</h1>
            {response && <p>{response}</p>}
            <form method="POST" onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Prénom" />
                <input type="text" name="lastname" placeholder="Nom" />
                <input type="text" name="axe" placeholder="Axe souhaité" />
                <input type="date" name="birthdate" placeholder="Date de naissance" />
                <input type="number" name="phoneNumber" placeholder="Numéro de téléphone" />
                <input type="email" name="email" placeholder="Email" />
                <input type="text" name="message" placeholder="Message personnalisé" />
                <button type="submit">Inscription</button>
            </form>
        </div>
    );
}