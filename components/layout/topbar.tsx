"use client";

import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

export default function Topbar() {

  const [users, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    

    const load = async () => {
      try {
        const me = await api.get("/auth/me/");
        setUser(me.data);
       
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);
  


  const [openMenu, setOpenMenu] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // fermer menu si click ailleurs
  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6 shadow-sm">

      {/* LEFT */}
      <div className="flex items-center gap-4">

          <div className="hidden sm:block">

            <h1 className="text-lg font-bold text-[#6214BE]">
            {users?.role.name}
            </h1>

          
          </div>

        
      </div>

      {/* RIGHT */}
      <div className="relative" ref={dropdownRef}>

        {/* Avatar Button */}
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-2 pr-4 shadow-sm transition hover:bg-gray-50"
        >

          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#6214BE]/10">

            {users?.avatar ? (
              <Image
                src={users.avatar}
                alt="Avatar"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <User
                size={20}
                className="text-[#6214BE]"
              />
            )}

          </div>

          {/* User Infos */}
          <div className="hidden text-left md:block">

            <p className="text-sm font-semibold text-gray-800">
              {users?.last_name} {users?.first_name}
            </p>


          </div>

        </button>

        {/* Dropdown */}
        {openMenu && (

          <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">

            {/* Profil */}
            <Link
              href="/profile"
              className="flex items-center gap-3 px-5 py-4 text-sm text-gray-700 transition hover:bg-gray-50"
            >

              <User size={18} />

              Mon profil

            </Link>

            {/* Dashboard */}
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-5 py-4 text-sm text-gray-700 transition hover:bg-gray-50"
            >

              <LayoutDashboard size={18} />

              Dashboard

            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-5 py-4 text-sm text-red-500 transition hover:bg-red-50"
            >

              <LogOut size={18} />

              Déconnexion

            </button>

          </div>
        )}

      </div>
    </header>
  );
}