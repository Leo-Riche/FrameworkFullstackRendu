"use client";

import { getSession, getToken } from "@/utils/jwt";
import { useEffect, useState } from "react";
import { Visitor } from "@/types/visitor";



export default function Visitor() {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchSession = async () => {
        const session = await getSession();
        if (session) {
            setIsAdmin(session.roles.includes("ROLE_ADMIN"));
        }
    };
    const getVisitor = async () => {
        const token = await getToken(); // Récupère le token d'authentification
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visitors`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`, // Ajoute le token dans les en-têtes
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("Erreur lors de la récupération des visiteurs");
            }

            const data = await res.json();
            console.log("Visiteurs récupérés :", data);
            setVisitors(data.member ? (data.member as Visitor[]) : []); // Défaut à un tableau vide si `member` est absent
        } catch (error) {
            console.error("Erreur :", error);
            setVisitors([]); // Défaut à un tableau vide en cas d'erreur
        }
    };


    useEffect(() => {
        fetchSession();
        getVisitor();
    }, []);

       return (
        <>
            {isAdmin ? (
                visitors.length > 0 ? (
                    visitors.map((visitor) => (
                        <div key={visitor.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                            <h2 className="text-xl font-bold">{visitor.name} {visitor.lastname}</h2>
                            <p>Email: {visitor.email}</p>
                            <p>Téléphone: {visitor.phone_number}</p>
                            <p>Date de naissance: {new Date(visitor.birthdate).toLocaleDateString()}</p>
                            <p>Axe: {visitor.axe}</p>
                            <p>Message: {visitor.message}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">Aucun visiteur trouvé.</p>
                )
            ) : (
                <p className="text-center text-red-600 font-medium">
                    Vous n&apos;êtes pas administrateur
                </p>
            )}
        </>
    );
}