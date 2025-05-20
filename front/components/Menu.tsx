"use client";

import { getSession, logout } from "@/utils/jwt";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu as MenuIcon, X } from "lucide-react";

export default function Menu() {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchSession = async () => {
    const session = await getSession();
    if (session) {
      setIsLogged(true);
      setIsAdmin(session.roles.includes("ROLE_ADMIN"));
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsLogged(false);
    redirect("/");
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-xl font-bold text-indigo-600">
            🎓 Projet Étudiant
          </h1>

          {/* Hamburger Button */}
          <button
            className="sm:hidden text-gray-700"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>

          {/* Menu desktop */}
          <ul className="hidden sm:flex space-x-4 text-sm font-medium text-gray-700">
            <li>
              <Link
                href="/"
                className="px-3 py-2 rounded-lg hover:bg-indigo-100 transition"
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link
                href="/visitor"
                className="px-3 py-2 rounded-lg hover:bg-indigo-100 transition"
              >
                Newsletter
              </Link>
            </li>

            {isLogged ? (
              <>
                {isAdmin && (
                  <li>
                    <Link
                      href="/admin/project/add"
                      className="px-3 py-2 rounded-lg text-purple-700 hover:bg-purple-100 transition"
                    >
                      Ajouter un projet
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    href="#"
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-lg text-red-600 hover:bg-red-100 transition"
                  >
                    Déconnexion
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="px-3 py-2 rounded-lg text-indigo-600 hover:bg-indigo-100 transition"
                  >
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    Inscription
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Menu mobile */}
        {isOpen && (
          <ul className="sm:hidden flex flex-col gap-2 pb-4 text-sm font-medium text-gray-700">
            <li>
              <Link href="/" className="block px-3 py-2 hover:bg-indigo-100 rounded">
                Accueil
              </Link>
            </li>
            <li>
              <Link
                href="/visitor"
                className="block px-3 py-2 hover:bg-indigo-100 rounded"
              >
                Newsletter
              </Link>
            </li>

            {isLogged ? (
              <>
                {isAdmin && (
                  <li>
                    <Link
                      href="/admin/project/add"
                      className="block px-3 py-2 hover:bg-purple-100 rounded text-purple-700"
                    >
                      Ajouter un projet
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 hover:bg-red-100 rounded text-red-600"
                  >
                    Déconnexion
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="block px-3 py-2 hover:bg-indigo-100 rounded text-indigo-600"
                  >
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="block px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Inscription
                  </Link>
                </li>
              </>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
}
