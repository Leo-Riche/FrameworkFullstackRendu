"use client";
 
import { getSession, logout } from "@/utils/jwt";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
 
export default function Menu() {
    const [isLogged, setIsLogged] = useState(false);
 
    const fetchSession = async () => {
        const session = await getSession();
        if (session) {
            setIsLogged(true);
        }
    };
 
    const handleLogout = async () => {
        await logout();
        setIsLogged(false);
        redirect("/")
    };
 
    useEffect(() => {
        fetchSession();
    }, []);
    
    return (
        <nav>
            <ul>
                <li>
                    <Link href="/">Accueil</Link>
                </li>
                {isLogged ? (
                    <li><Link href="#" onClick={handleLogout}>Déconnexion</Link></li>
                ) : (
                    <>
                        <li><Link href="/login">Connexion</Link></li>
                        <li><Link href="/register">Inscription</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}