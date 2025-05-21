"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Project } from "@/types/project";
import { User, GraduationCap, Code2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ArticlePage() {
    // Récupération de l'id de l'article via l'URL
    const { id } = useParams();
    const [project, setProject] = useState<Project | null>(null);

    const fetchProject = async () => {
        // Appel de l'API pour récupérer l'article
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`);
        const data = await response.json();

        setProject(data as Project);
    };

    // Récupération de l'article lorsque l'id change
    useEffect(() => {
        fetchProject();
    }, [id]);

    if (!project) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 mt-10">
            <Link
                href="/"
                className="inline-flex items-center text-sm text-indigo-600 hover:underline mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la liste des projets
            </Link>

            <h1 className="text-3xl font-bold text-indigo-700 mb-4">{project.title}</h1>

            <p className="text-gray-700 mb-6 whitespace-pre-line">{project.content}</p>

            {project.media && project.media.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-6">
                {project.media.map((media, index) => (
                <img
                    key={index}
                    src={`http://localhost:8000${media.url}`}
                    alt={media.altText || `Image ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg shadow"
                />
                ))}
            </div>
            )}


            <div className="grid sm:grid-cols-2 gap-4 text-gray-800 text-sm">
                <p className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                <span>
                    <span className="font-semibold text-purple-600">Étudiant :</span>{" "}
                    {project.student}
                </span>
                </p>

                <p className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <span>
                    <span className="font-semibold text-purple-600">Année :</span>{" "}
                    {project.study_years}
                </span>
                </p>

                <p className="flex items-center gap-2 sm:col-span-2">
                <Code2 className="w-4 h-4 text-purple-600" />
                <span>
                    <span className="font-semibold text-purple-600">Technologie :</span>{" "}
                    {project.technology}
                </span>
                </p>
            </div>
        </div>
    );
}
