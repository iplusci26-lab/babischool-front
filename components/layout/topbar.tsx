"use client";

import Image from "next/image";
import Link from "next/link";

import { api } from "@/lib/api";
import { useNotificationsSocket } from "@/lib/hooks/useNotificationsSocket";
import { useMessagingSocket } from "@/lib/hooks/useMessagingSocket";
import { useNotificationStore } from "@/lib/store/notificationStore";
import { useMessagingStore } from "@/lib/store/messagingStore";

import {
  LayoutDashboard,
  LogOut,
  User,
  MessageCircle,
  Bell
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState
} from "react";

import { toast } from "sonner";

export default function Topbar() {

  const unreadNotifications =
  useNotificationStore(
    state => state.unreadCount
  );

  const [user, setUser] =
    useState<any>(null);

  const [openMenu, setOpenMenu] =
    useState(false);

    const unreadMessages =
    useMessagingStore(
      state =>
        state.unreadCount
    );
    
    const setUnreadCount =
      useMessagingStore(
        state => state.setUnreadCount
      );

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const loadUser = async () => {

    try {

      const res =
        await api.get(
          "/auth/me/"
        );

      setUser(
        res.data
      );

    } catch (error) {

      console.error(error);
    }
  };

  const loadUnreadMessages =
    async () => {

      try {

        const res =
          await api.get(
            "/messaging/unread-count/"
          );

        setUnreadCount(
          res.data.count || 0
        );

      } catch (error) {

        console.error(error);
      }
    };

  const loadNotifications =
    async () => {

      try {

        const res =
          await api.get(
            "/notifications/"
          );

        useNotificationStore
          .getState()
          .setNotifications(
            res.data.results ||
            res.data
          );

      } catch (error) {

        console.error(error);
      }
    };

  useEffect(() => {

    loadUser();

    loadUnreadMessages();

    loadNotifications();

  }, []);

  useEffect(() => {

    const interval =
      setInterval(() => {

        loadUnreadMessages();


      }, 10000);

    return () =>
      clearInterval(interval);

  }, []);

  useEffect(() => {

    const handleClickOutside = (
      event: MouseEvent
    ) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {

        setOpenMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  useNotificationsSocket({

    onNotification: (
      notification
    ) => {
  
      toast.info(
        notification.title,
        {
          description:
            notification.message,
      
          action: {
            label: "Voir",
      
            onClick: () => {
      
              if (
                notification.url
              ) {
      
                window.location.href =
                  notification.url;
              }
            },
          },
        }
      );
  

    },
  });

  useMessagingSocket();

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    window.location.href =
      "/login";
  };

  return (

    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6 shadow-sm">

      {/* LEFT */}

      <div className="flex items-center gap-4">

        <div className="hidden sm:block">

          <h1 className="text-lg font-bold text-[#6214BE]">

            {user?.role?.name}

          </h1>

        </div>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-3">

        {/* MESSAGES */}

        <Link
          href="/messaging"
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-100 bg-white transition hover:bg-gray-50"
        >

          <MessageCircle
            size={20}
          />

          {unreadMessages > 0 && (

            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">

              {unreadMessages > 99 ? "99+" : unreadMessages}

            </span>

          )}

        </Link>

        {/* NOTIFICATIONS */}

        <Link
          href="/notifications"
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-100 bg-white transition hover:bg-gray-50"
        >

          <Bell
            size={20}
          />

          {unreadNotifications > 0 && (

            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">

              {unreadNotifications}

            </span>

          )}

        </Link>

        {/* USER MENU */}

        <div
          className="relative"
          ref={dropdownRef}
        >

          <button
            onClick={() =>
              setOpenMenu(
                !openMenu
              )
            }
            className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-2 pr-4 shadow-sm transition hover:bg-gray-50"
          >

            {/* Avatar */}

            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#6214BE]/10">

              {user?.avatar ? (

                <Image
                  src={user.avatar}
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

            {/* User */}

            <div className="hidden text-left md:block">

              <p className="text-sm font-semibold text-gray-800">

                {user?.last_name}{" "}
                {user?.first_name}

              </p>

            </div>

          </button>

          {/* DROPDOWN */}

          {openMenu && (

            <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">

              <Link
                href="/profile"
                className="flex items-center gap-3 px-5 py-4 text-sm text-gray-700 transition hover:bg-gray-50"
              >

                <User size={18} />

                Mon profil

              </Link>

              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-5 py-4 text-sm text-gray-700 transition hover:bg-gray-50"
              >

                <LayoutDashboard
                  size={18}
                />

                Dashboard

              </Link>

              <button
                onClick={
                  handleLogout
                }
                className="flex w-full items-center gap-3 px-5 py-4 text-sm text-red-500 transition hover:bg-red-50"
              >

                <LogOut
                  size={18}
                />

                Déconnexion

              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}