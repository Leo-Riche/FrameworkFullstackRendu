"use client";
 
import { getSession, getToken } from "@/utils/jwt";
import { useEffect, useState } from "react";
 
export default function AddProject() {
    const [response, setResponse] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchSession = async () => {
    const session = await getSession();
        if (session) {
            setIsAdmin(session.roles.includes("ROLE_ADMIN"));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = await getToken();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const title = formData.get("title");
        const content = formData.get("content");
        const student = formData.get("student");
        const study_years = parseInt(formData.get("study_years") as string);
        const technology = formData.get("technology");
        const imageFile = formData.get("image") as File;
        const hide = formData.get("hide") === "on" ? true : false;

        let imageUrl = "";

        console.log("Image file:", imageFile);

        // Étape 1 : upload de l'image
        if (imageFile && imageFile.size > 0) {
            const uploadData = new FormData();
            uploadData.append("file", imageFile);

            console.log("Upload data:", uploadData);

            const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: uploadData,
            });

            console.log("Upload response:", uploadRes);

            const uploadJson = await uploadRes.json();

            if (!uploadRes.ok || !uploadJson.url) {
                console.error(uploadJson);
                setResponse("Erreur lors de l'upload de l'image");
                return;
            }

            imageUrl = uploadJson.url;
        }

        const payload = {
            title,
            content,
            image: imageUrl,
            student,
            study_years,
            technology,
            hide,
        };

        const projectRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
            method: "POST",
            headers: {
                "Content-Type": "application/ld+json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await projectRes.json();
        if (projectRes.ok) {
            setResponse("Projet ajouté avec succès");
        } else {
            console.error(data);
            setResponse(data.detail || "Échec lors de la création du projet");
        }
    };

    useEffect(() => {
        fetchSession();
    }, []);

    return (
        <>
            <h1>Ajout d&apos;un projet</h1>
            {response && <p>{response}</p>}
            {isAdmin ? (
<form method="POST" onSubmit={handleSubmit}>
                <label htmlFor="title">Titre</label>
                <input type="text" id="title" name="title" />
                <br />
                <label htmlFor="content">Contenu</label>
                <textarea id="content" name="content"></textarea>
                <br />
                <label htmlFor="image">Image</label>
                <input type="file" id="image" name="image" accept="image/*" />
                <br />
                <label htmlFor="student">Étudiants</label>
                <input type="text" id="student" name="student" />
                <br />
                <label htmlFor="study_years">Années d&apos;étude</label>
                <input type="number" id="study_years" name="study_years" />
                <br />
                <label htmlFor="technology">Technologie</label>
                <input type="text" id="technology" name="technology" />
                <br />
                <label htmlFor="hide">Masquer le projet</label>
                <input type="checkbox" id="hide" name="hide" />
                <br />
                
                <button type="submit">Ajouter</button>
            </form>            ) : (
                <p>Vous n&apos;êtes pas administrateur</p>
            )}
            
        </>
    );
}