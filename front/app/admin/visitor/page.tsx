"use client";

import { getSession, getToken } from "@/utils/jwt";
import { useEffect, useState } from "react";
import { Visitor } from "@/types/visitor";
import {
  Mail,
  Smartphone,
  Calendar,
  BookOpen,
  MessageSquare,
  User,
} from "lucide-react";

export default function Visitor() {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSession = async () => {
        const session = await getSession();
        if (session) {
            setIsAdmin(session.roles.includes("ROLE_ADMIN"));
        }
    };
    const getVisitor = async () => {
        const token = await getToken(); // Récupère le token d'authentification
        try {
            setIsLoading(true);
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
        } finally {
            setIsLoading(false); // Fin du chargement
        }
    };


    useEffect(() => {
        fetchSession();
        getVisitor();
    }, []);

       return (
        <>
            {isLoading ? (
                <p className="text-center text-indigo-600 py-10">Chargement ...</p>
            ) : isAdmin ? (
                visitors.length > 0 ? (
                <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {visitors.map((visitor) => (
                    <div
                        key={visitor.id}
                        className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition"
                    >
                        <h2 className="text-xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-500" />
                        {visitor.name} {visitor.lastname}
                        </h2>

                        <p className="flex items-center gap-2 text-indigo-600 mb-1">
                        <Mail className="w-4 h-4 text-indigo-600" />
                        {visitor.email}
                        </p>

                        <p className="flex items-center gap-2 text-indigo-600 mb-1">
                        <Smartphone className="w-4 h-4 text-indigo-600" />
                        {visitor.phone_number}
                        </p>

                        <p className="flex items-center gap-2 text-indigo-600 mb-1">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        {new Date(visitor.birthdate).toLocaleDateString()}
                        </p>

                        <p className="flex items-center gap-2 text-indigo-600 mb-1">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        {visitor.axe}
                        </p>

                        <p className="flex items-start gap-2 text-indigo-600">
                        <MessageSquare className="w-4 h-4 text-indigo-600 mt-0.5" />
                        <span>{visitor.message}</span>
                        </p>
                    </div>
                    ))}
                </div>
                ) : (
                <p className="text-center text-indigo-600 py-10">
                    Aucun visiteur trouvé.
                </p>
                )
            ) : (
                <p className="text-center text-red-600 font-medium py-10">
                Vous n&apos;êtes pas administrateur
                </p>
            )}
        </>
    );
}