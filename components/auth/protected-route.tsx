"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { canAccess } from "@/lib/permissions";
import { useAuth } from "@/lib/hooks/useAuth";
//import { useAuth } from "@/context/auth-context";

export default function ProtectedRoute({
  children,
  menu,
}: {
  children: React.ReactNode;
  menu: string;
}) {

  const router = useRouter();

  const { user, loading } = useAuth();

  useEffect(() => {

    // attendre auth
    if (loading) return;

    // pas connecté
    if (!user) {

      router.replace("/login");

      return;
    }

    // permission refusée
    if (!canAccess(menu, user)) {

      router.replace("/unauthorized");

      return;
    }

  }, [user, loading, menu]);

  // loading auth
  if (loading) {

    return (

      <div className="p-10">
        Chargement...
      </div>
    );
  }

  // pas connecté
  if (!user) {

    return null;
  }

  // interdit
  if (!canAccess(menu, user)) {

    return null;
  }

  return children;
}