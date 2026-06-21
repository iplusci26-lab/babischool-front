"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";

import {
  Bell,
  MessageCircle,
  GraduationCap,
  Megaphone,
  CreditCard,
} from "lucide-react";

export default function RecentActivity() {

  const [items, setItems] =
    useState<any[]>([]);

  useEffect(() => {

    load();

  }, []);

  const load = async () => {

    try {

      const res =
        await api.get(
          "/notifications/recent/"
        );

      setItems(
        res.data
      );

    } catch (error) {

      console.error(error);
    }
  };

  const getIcon = (
    type: string
  ) => {

    switch (type) {

      case "message":
        return (
          <MessageCircle size={18} />
        );

      case "announcement":
        return (
          <Megaphone size={18} />
        );

      case "grade":
        return (
          <GraduationCap size={18} />
        );

      case "payment":
        return (
          <CreditCard size={18} />
        );

      default:
        return (
          <Bell size={18} />
        );
    }
  };

  return (

    <div className="bg-white border rounded-3xl p-6">

      <h2 className="font-bold text-lg mb-4">

        Activité récente

      </h2>

      <div className="space-y-4">

        {items.map(
          (item) => (

            <div
              key={item.id}
              className="flex gap-3"
            >

              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">

                {getIcon(
                  item.notification_type
                )}

              </div>

              <div>

                <p className="font-medium">

                  {item.title}

                </p>

                <p className="text-sm text-gray-500">

                  {item.message}

                </p>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}