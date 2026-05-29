"use client";

import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth() {

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    const checkAuth = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const res = await api.get("/auth/me/");

        setUser(res.data);

      } catch (error) {

        localStorage.removeItem("token");

        router.push("/login");

      } finally {

        setLoading(false);
      }
    };

    checkAuth();

  }, [router]);

  return {
    user,
    loading,
  };
}