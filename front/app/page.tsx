"use client";

import { getSession, getToken } from "@/utils/jwt";
import { Project } from "@/types/project";
import { useEffect, useState } from "react";
import Link from "next/link";

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

  const toggleHideProject = async (projectId: number, hide: boolean) => {
    const token = await getToken();
    console.log(hide)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/merge-patch+json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ hide }),
    });

    if (response.ok) {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId ? { ...project, hide } : project
        )
      );
    } else {
      const data = await response.json();
      console.error(data);
      setResponse("Échec lors de la mise à jour du projet");
    }
  };


  useEffect(() => {
    fetchSession();
    getProjects();
  }, []);

  console.log("Projects:", projects);
  return (
    <>
      <h1>Liste des projets</h1>
      {response && <p>{response}</p>}
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            (!project.hide || isAdmin) && (
              <li key={project.id}>
                <h2>{project.title}</h2>
                <p>{project.student}</p>
                <p>
                  <Link href={`/project/${project.id}`}>Afficher le projet</Link>
                </p>
                {isAdmin && (
                  <>
                    <button onClick={() => handleDelete(project.id)}>Supprimer ce projet</button>
                    <label>
                      <input
                        type="checkbox"
                        checked={project.hide}
                        onChange={() => toggleHideProject(project.id, !project.hide)}
                      />
                      Masquer ce projet
                    </label>
                  </>
                )}
                <hr />
              </li>
            )
          ))}
        </ul>
      ) : (
        <p>Aucun projet trouvé</p>
      )}
    </>
  );
}