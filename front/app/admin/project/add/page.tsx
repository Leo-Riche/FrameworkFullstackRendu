"use client";
 
import { getToken } from "@/utils/jwt";
import { useEffect, useState } from "react";
 
export default function AddProject() {
    const [response, setResponse] = useState("");
    // const [categories, setCategories] = useState<Category[]>([]);
 
    // const fetchCategories = async () => {
    //     const token = await getToken();
    //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
    //         headers: {
    //             "Authorization": `Bearer ${token}`,
    //         },
    //     });
    //     const data = await response.json();
    //     setCategories(data.member as Category[]);
    // };
 
    // useEffect(() => {  
    //     fetchCategories();
    // }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
 
        const token = await getToken();
 
        const formData = new FormData(e.target as HTMLFormElement);
        const title = formData.get("title");
        const content = formData.get("content");
        const image = formData.get("image");
        const student = formData.get("student");
        const study_years = parseInt(formData.get("study_years") as string);
        const technology = formData.get("technology");
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
            method: "POST",
            headers: {
                "Content-Type": "application/ld+json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: title,
                content: content,
                image: image,
                student: student,
                study_years: study_years,
                technology: technology,
            }),
        });
 
        const data = await response.json();
        if (response.ok) {
            setResponse("Projet ajouté avec succès");
        } else {
            console.error(data);
            if(data.description){
                setResponse(data.description);
            } else {
                setResponse("Echec lors de la création du projet");
            }
        }
    }
 
    return (
        <>
            <h1>Ajout d&apos;un projet</h1>
            {response && <p>{response}</p>}
            <form method="POST" onSubmit={handleSubmit}>
                <label htmlFor="title">Titre</label>
                <input type="text" id="title" name="title" />
                <br />
                <label htmlFor="content">Contenu</label>
                <textarea id="content" name="content"></textarea>
                <br />
                <label htmlFor="image">Image</label>
                <input type="text" id="image" name="image" />
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
                {/* <label htmlFor="category">Catégorie</label>
                <select id="category" name="category">
                    {categories.map((category: any) => (
                        <option value={category['@id']} key={category.id}>{category.name}</option>
                    ))}
                </select> */}
                <br />
                <button type="submit">Ajouter</button>
            </form>
        </>
    )
}