"use client";

import { useEffect, useState } from "react";

import {
  Megaphone,
  AlertTriangle,
  Bell,
  Plus,
} from "lucide-react";

import { api } from "@/lib/api";

import AnnouncementCard from "./components/announcementCard";

import AnnouncementFormModal from "./components/announcementFormModal";

import AnnouncementDetailModal from "./components/announcementDetailModal";

export default function AnnouncementsPage() {

  const [announcements, setAnnouncements] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [filter, setFilter] =
    useState("all");

  const [openCreate, setOpenCreate] =
    useState(false);

  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<any>(null);

  const [editingAnnouncement, setEditingAnnouncement] =
    useState<any>(null);


  const loadAnnouncements = async () => {

    try {

      const res = await api.get(
        "/announcements/create"
      );

      setAnnouncements(
        res.data
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  const handleDelete = async (
    id: string
  ) => {
  
    const confirmDelete = confirm(
      "Supprimer cette annonce ?"
    );
  
    if (!confirmDelete) {
      return;
    }
  
    try {
  
      await api.delete(
        `/announcements/${id}/`
      );
  
      loadAnnouncements();
  
    } catch (error) {
  
      console.error(error);
  
      alert(
        "Erreur lors de la suppression"
      );
    }
  };

 

  useEffect(() => {

    loadAnnouncements();

  }, []);

  const filteredAnnouncements =
    announcements.filter((item) => {

      if (filter === "all") {
        return true;
      }

      return (
        item.priority === filter
      );
    });

  const total =
    announcements.length;

  const important =
    announcements.filter(
      (a) =>
        a.priority ===
        "important"
    ).length;

  const urgent =
    announcements.filter(
      (a) =>
        a.priority ===
        "urgent"
    ).length;

  const active =
    announcements.filter(
      (a) =>
        a.is_active
    ).length;

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Annonces

          </h1>

          <p className="text-gray-500 mt-1">

            Communication interne

          </p>

        </div>

        <button
          onClick={() =>{
            setEditingAnnouncement(
                null
              );
            setOpenCreate(true)
          }}
          className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2"
        >

          <Plus size={18} />

          Nouvelle annonce

        </button>

      </div>

      {/* KPI */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

        <StatCard
          title="Total"
          value={total}
          icon={<Megaphone size={20} />}
        />

        <StatCard
          title="Actives"
          value={active}
          icon={<Bell size={20} />}
        />

        <StatCard
          title="Importantes"
          value={important}
          icon={<AlertTriangle size={20} />}
        />

        <StatCard
          title="Urgentes"
          value={urgent}
          icon={<AlertTriangle size={20} />}
        />

      </div>

      {/* FILTERS */}

      <div className="flex gap-3">

        <FilterButton
          label="Toutes"
          value="all"
          current={filter}
          setFilter={setFilter}
        />

        <FilterButton
          label="Normales"
          value="normal"
          current={filter}
          setFilter={setFilter}
        />

        <FilterButton
          label="Importantes"
          value="important"
          current={filter}
          setFilter={setFilter}
        />

        <FilterButton
          label="Urgentes"
          value="urgent"
          current={filter}
          setFilter={setFilter}
        />

      </div>

      {/* LIST */}

      {loading ? (

        <div className="bg-white p-6 rounded-3xl border">

          Chargement...

        </div>

      ) : (

        <div className="grid md:grid-cols-2 gap-5">

            {filteredAnnouncements.length === 0 && (

            <div className="col-span-2 bg-white border rounded-3xl p-10 text-center">

            <p className="text-gray-500">

                Aucune annonce disponible

            </p>

            <button
                onClick={() =>
                setOpenCreate(true)
                }
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-xl"
            >

                Créer une annonce

            </button>

            </div>
            )}

          {filteredAnnouncements.map(
            (announcement) => (

                <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onView={() =>
                  setSelectedAnnouncement(
                    announcement
                  )
                }
                onEdit={() =>{

                    setEditingAnnouncement(
                      announcement
                    );
                
                    setOpenCreate(true);
                  }
                }
                onDelete={() =>
                  handleDelete(
                    announcement.id
                  )
                }
              />
            )
          )}

        </div>
      )}

      {/* CREATE */}

      {openCreate && (

        <AnnouncementFormModal

        announcement={
            editingAnnouncement
          }

          onClose={() =>{
            setOpenCreate(false);
            setEditingAnnouncement(
                null
              );
          }}

          onSuccess={() => {

            setOpenCreate(false);
            setEditingAnnouncement(
                null
              );

            loadAnnouncements();
          }}
        />
      )}

       

      {/* DETAIL */}

      {selectedAnnouncement && (

        <AnnouncementDetailModal

          announcement={
            selectedAnnouncement
          }

          onClose={() =>
            setSelectedAnnouncement(
              null
            )
          }
        />
      )}

    </div>
  );
}

function StatCard({
  title,
  value,
  icon
}: any) {

  return (

    <div className="bg-white rounded-3xl border p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">

            {title}

          </p>

          <h3 className="text-2xl font-bold mt-2">

            {value}

          </h3>

        </div>

        <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">

          {icon}

        </div>

      </div>

    </div>
  );
}

function FilterButton({
  label,
  value,
  current,
  setFilter
}: any) {

  return (

    <button
      onClick={() =>
        setFilter(value)
      }
      className={`px-4 py-2 cursor-pointer rounded-xl border ${
        current === value
          ? "bg-indigo-600 text-white"
          : "bg-white"
      }`}
    >

      {label}

    </button>
  );
}