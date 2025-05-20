"use client";

import { getSession, getToken } from "@/utils/jwt";
import { Project } from "@/types/project";
import { useEffect, useState } from "react";
import Link from "next/link";
import { isAscii } from "buffer";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [response, setResponse] = useState("");


  const fetchSession = async () => {
    const session = await getSession();
    if (session) {
      setIsAdmin(session.roles.includes("ROLE_ADMIN"));
    }
  };

  const getProjects = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
      const data = await res.json();
      setProjects(data.member as Project[]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (projectId: number) => {
    const token = await getToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setResponse("Projet supprimé avec succès");
      setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
    } else {
      const data = await response.json();
      console.error(data);
      setResponse("Échec lors de la suppression du projet");
    }

  };


  useEffect(() => {
    fetchSession();
    getProjects();
  }, []);

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-indigo-600">
        🎓 Liste des projets
      </h1>

      {projects.length > 0 ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl shadow-md p-6 hover:shadow-xl transition"
            >
              <div>
                <h2 className="text-xl font-bold text-indigo-700 mb-1">
                  {project.title}
                </h2>
                <p className="text-sm text-gray-700 mb-4">
                  Étudiant :{" "}
                  <span className="font-medium text-purple-600">
                    {project.student}
                  </span>
                </p>
                <img
                  src={`http://localhost:8000${project.image}`}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <Link
                  href={`/project/${project.id}`}
                  className="inline-block text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition"
                >
                  Voir le projet
                </Link>
              </div>

              {isAdmin && (
                <button
                  onClick={() => handleDelete(project.id)}
                  className="mt-4 w-full text-sm px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Supprimer ce projet
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Aucun projet trouvé</p>
      )}
    </div>
  </>
  );
}