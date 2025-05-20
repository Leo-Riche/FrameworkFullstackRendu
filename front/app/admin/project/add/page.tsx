"use client";
 
import { getSession, getToken } from "@/utils/jwt";
import { useEffect, useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  User,
  GraduationCap,
  Code2,
  BookOpen,
} from "lucide-react"
 
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8">
            <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
                Ajout d&apos;un projet
            </h1>

            {response && (
                <p className="mb-4 text-sm text-center text-green-600 font-medium">
                {response}
                </p>
            )}

            {isAdmin ? (
                <form
                method="POST"
                onSubmit={handleSubmit}
                className="space-y-4 text-sm text-indigo-600"
                >
                {/* Titre */}
                <div>
                <label htmlFor="title" className="block font-medium mb-1 text-indigo-600">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    Titre
                </div>
                </label>
                <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-indigo-600"
                />
                </div>

                {/* Contenu */}
                <div>
                <label htmlFor="content" className="block font-medium mb-1 text-indigo-600">
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    Contenu
                </div>
                </label>
                <textarea
                id="content"
                name="content"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none text-indigo-600"
                />
                </div>

                {/* Image */}
                <div>
                <label htmlFor="image" className="block font-medium mb-1 text-indigo-600">
                <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-500" />
                    Image
                </div>
                </label>
                <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 text-indigo-600"
                />
                </div>

                {/* Étudiants */}
                <div>
                <label htmlFor="student" className="block font-medium mb-1 text-indigo-600">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-500" />
                    Étudiants
                </div>
                </label>
                <input
                type="text"
                id="student"
                name="student"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-indigo-600"
                />
                </div>

                {/* Années d'étude */}
                <div>
                <label htmlFor="study_years" className="block font-medium mb-1 text-indigo-600">
                <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-500" />
                    Années d&apos;étude
                </div>
                </label>
                <input
                type="number"
                id="study_years"
                name="study_years"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-indigo-600"
                />
                </div>

                {/* Technologie */}
                <div>
                <label htmlFor="technology" className="block font-medium mb-1 text-indigo-600">
                <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-500" />
                    Technologie
                </div>
                </label>
                <input
                type="text"
                id="technology"
                name="technology"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-indigo-600"
                />
                </div>

                <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                >
                Ajouter
                </button>
                </form>
            ) : (
                <p className="text-center text-red-600 font-medium">
                Vous n&apos;êtes pas administrateur
                </p>
            )}
            </div>
            </div>
        </>
    );
}