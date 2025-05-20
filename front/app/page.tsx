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
      <h1>Liste des projets</h1>
      {/* Affichage des projects */}
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <h2>{project.title}</h2>
              <p>{project.student}</p>
              <p>
                <Link href={`/project/${project.id}`}>Afficher le projet</Link>
              </p>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(project.id)}
                >
                  Supprimer ce projet
                </button>
              )}
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun project trouvé</p>
      )}
    </>
  );
}