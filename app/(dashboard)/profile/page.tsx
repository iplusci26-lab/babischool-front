"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";

import Image from "next/image";
import ChangePassword from "./change-password";

export default function ProfilePage() {

  const [profile, setProfile] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // =========================
  // LOAD PROFILE
  // =========================

  const loadProfile = async () => {

    try {

      const res = await api.get(
        "/auth/profile/"
      );

      setProfile(res.data);
      console.log(res.data)

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // UPDATE
  // =========================

  const submit = async () => {

    setSaving(true);

    try {

      const formData = new FormData();

      formData.append(
        "first_name",
        profile.first_name || ""
      );

      formData.append(
        "last_name",
        profile.last_name || ""
      );

      formData.append(
        "email",
        profile.email || ""
      );

      formData.append(
        "phone",
        profile.phone || ""
      );

      if (profile.avatar instanceof File) {

        formData.append(
          "avatar",
          profile.avatar
        );
      }

      await api.put(
        "/auth/profile/",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      alert("Profil mis à jour");

      loadProfile();

    } catch (err) {

      console.log(err);

      alert("Erreur");

    } finally {

      setSaving(false);
    }
  };

  // =========================
  // EFFECT
  // =========================

  useEffect(() => {

    loadProfile();

  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="p-6">
        Chargement...
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (

    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* HEADER */}

      <div>

        <h1 className="text-3xl font-bold">
          Mon profil
        </h1>

        <p className="text-gray-500 mt-1">
          Gérez vos informations personnelles
        </p>

      </div>

      {/* CARD */}

      <div className="bg-white p-4 rounded-3xl border shadow-sm overflow-hidden">

        {/* TOP */}

        <div className="rounded-t-3xl  bg-gradient-to-r from-indigo-500 to-purple-600 h-40" />

        <div className="px-8 pb-8">

          {/* AVATAR */}

          <div className="-mt-16 flex items-center gap-6">

            <div className="relative w-30 h-30 rounded-full overflow-hidden border-4 border-white bg-gray-100">

              {profile.avatar ? (

                <img
                  src={`https://iplus-api.onrender.com${
                    profile.avatar instanceof File
                      ? URL.createObjectURL(profile.avatar)
                      : profile.avatar
              }`}
                  alt="avatar"
                  className="w-30 h-30  rounded object-cover"
                />

              ) : (

                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">

                  {profile.first_name?.[0]}

                </div>
              )}

            </div>

            <div>

              <h2 className="text-2xl text-white font-bold mt-5">

                {profile.first_name}
                {" "}
                {profile.last_name}

              </h2>

              <p className="text-gray-500 text-black font-bold">
                {profile.role}
              </p>

              <p className="text-sm text-gray-400 mt-1">
                {profile.school_name} {profile.school_sigle ? " - "+profile.school_sigle : ""}
              </p>

            </div>

          </div>

          {/* FORM */}

          <div className="grid md:grid-cols-2 gap-6 mt-10">

            {/* FIRST NAME */}

            <div>

              <label className="block mb-2 text-sm font-medium">
                Prénom
              </label>

              <input
                type="text"

                value={profile.first_name || ""}

                onChange={(e)=>
                  setProfile({
                    ...profile,
                    first_name:
                      e.target.value
                  })
                }

                className="
                  w-full
                  border
                  rounded-2xl
                  p-3
                "
              />

            </div>

            {/* LAST NAME */}

            <div>

              <label className="block mb-2 text-sm font-medium">
                Nom
              </label>

              <input
                type="text"

                value={profile.last_name || ""}

                onChange={(e)=>
                  setProfile({
                    ...profile,
                    last_name:
                      e.target.value
                  })
                }

                className="
                  w-full
                  border
                  rounded-2xl
                  p-3
                "
              />

            </div>

            {/* EMAIL */}

            <div>

              <label className="block mb-2 text-sm font-medium">
                Email
              </label>

              <input
                type="email"

                value={profile.email || ""}

                onChange={(e)=>
                  setProfile({
                    ...profile,
                    email:
                      e.target.value
                  })
                }

                className="
                  w-full
                  border
                  rounded-2xl
                  p-3
                "
              />

            </div>

            {/* PHONE */}

            <div>

              <label className="block mb-2 text-sm font-medium">
                Téléphone
              </label>

              <input
                type="text"

                value={profile.phone || ""}

                onChange={(e)=>
                  setProfile({
                    ...profile,
                    phone:
                      e.target.value
                  })
                }

                className="
                  w-full
                  border
                  rounded-2xl
                  p-3
                "
              />

            </div>

            {/* AVATAR */}

            <div className="md:col-span-2">

              <label className="block mb-2 text-sm font-medium">
                Photo de profil
              </label>

              <input
                type="file"

                onChange={(e)=>
                  setProfile({
                    ...profile,
                    avatar:
                      e.target.files?.[0]
                  })
                }

                className="
                  w-full
                  border
                  rounded-2xl
                  p-3
                "
              />

            </div>

          </div>

          {/* ACTION */}

          <div className="mt-8">

            <button

              onClick={submit}

              disabled={saving}

              className="
                bg-[#6214BE]
                text-white
                cursor-pointer
                px-6
                py-3
                rounded-2xl
                font-medium
              "
            >

              {saving
                ? "Enregistrement..."
                : "Mettre à jour"
              }

            </button>

          </div>

        </div>

      </div>
      <ChangePassword />
    </div>
  );
}