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
    const [images, setImages] = useState<any[]>([]);

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
        const selectedMedia = formData.getAll("media[]");
        const hide = formData.get("hide") === "on" ? true : false;

        const payload = {
            title,
            content,
            student,
            study_years,
            technology,
            media: selectedMedia,
            hide,
        };

        console.log("Payload envoyé :", payload);

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

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media`, {
            headers: {
                Accept: "application/ld+json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
            console.log("Réponse brute :", data);
            const parsed = (data.member || []).map((img) => {
                const idFromIri = img["@id"]?.split("/").pop();
                return {
                ...img,
                id: idFromIri,
                };
            });

            console.log("Images chargées :", parsed);
            setImages(parsed);
            })
            .catch((err) => {
            console.error("Erreur lors du chargement des médias :", err);
            });
    }, []);

    console.log("Images dans le form :", images);

    return (
        <>
        <form
  method="POST"
  onSubmit={async (e) => {
    e.preventDefault();
    const token = await getToken();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const file = formData.get("file") as File;
    const altText = formData.get("altText") as string;

    if (!file || file.size === 0) {
      alert("Veuillez sélectionner une image.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("altText", altText);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: uploadData,
    });

    if (res.ok) {
      const data = await res.json();
      alert("Image ajoutée avec succès !");
      console.log("Image enregistrée :", data);
      form.reset();
    } else {
      alert("Erreur lors de l'ajout de l'image");
      console.error(await res.text());
    }
  }}
  className="mb-8 border border-indigo-100 p-4 rounded-xl bg-indigo-50"
>
  <h2 className="text-lg font-semibold text-indigo-600 mb-3">
    Uploader une image dans Media
  </h2>
  <div className="mb-2">
    <label htmlFor="file" className="block mb-1 text-indigo-600 font-medium">
      Image
    </label>
    <input
      type="file"
      name="file"
      accept="image/*"
      className="w-full text-indigo-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
    />
  </div>
  <div className="mb-2">
    <label htmlFor="altText" className="block mb-1 text-indigo-600 font-medium">
      Texte alternatif
    </label>
    <input
      type="text"
      name="altText"
      placeholder="Texte alternatif"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-indigo-600"
    />
  </div>
  <button
    type="submit"
    className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
  >
    Ajouter l&apos;image
  </button>
</form>

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
                {/* Sélection des images (ManyToMany) */}
                <div>
                <label className="block font-medium mb-1 text-indigo-600">
                    <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-500" />
                    Sélectionner des images existantes
                    </div>
                </label>

                <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto border p-2 rounded-lg bg-indigo-50">
                    {images.length === 0 ? (
                        <p className="text-sm italic text-indigo-400">Aucune image disponible</p>
                    ) : (
                        images.map((img) => (
                            <label key={img.id} className="flex items-center gap-2 border p-2">
                            <input
                                type="checkbox"
                                name="media[]"
                                value={`/api/media/${img.id}`}
                                className="accent-indigo-600"
                            />
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}${img.url}`}
                                alt={img.altText}
                                className="w-16 h-16 object-cover rounded shadow"
                            />
                            </label>
                        ))
                    )}
                </div>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="hide"
                        name="hide"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hide" className="font-medium text-indigo-600 select-none">
                        Masquer le projet
                    </label>
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