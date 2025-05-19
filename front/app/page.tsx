"use client";
 
import { Project } from "@/types/project";
import { useEffect, useState } from "react";
 
export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
 
  // Récupération des projets
  const getProjects = async () => {
    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
      const data = await res.json();
      setProjects(data.member as Project[]);
    } catch (error) {
      console.error(error);
    }
  };
 
  useEffect(() => {
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
              <p>{project.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun project trouvé</p>
      )}
    </>
  );
}