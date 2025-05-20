"use client";

import { getToken } from "@/utils/jwt";
import { useState } from "react";

export default function TestUpload() {
    const [message, setMessage] = useState("");

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const token = await getToken();
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const text = await res.text(); // ← pour éviter l'erreur JSON
            console.log("Upload response raw:", text);

            if (!res.ok) {
                setMessage("Erreur upload (status " + res.status + ")");
            } else {
                const json = JSON.parse(text);
                setMessage("Fichier reçu : " + json.url);
            }
        } catch (err) {
            console.error("Fetch failed:", err);
            setMessage("Échec de la requête");
        }
    };

    return (
        <div>
            <h2>Test d&apos;upload seul</h2>
            <input type="file" onChange={handleUpload} />
            <p>{message}</p>
        </div>
    );
}
