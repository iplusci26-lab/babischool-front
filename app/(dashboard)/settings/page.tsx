"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { api } from "@/lib/api";

export default function SettingsPage() {

  const [settings, setSettings] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // =========================
  // LOAD
  // =========================

  const loadSettings = async () => {

    try {

      const res = await api.get(
        "/schools/settings/"
      );

      setSettings(res.data);
      console.log("settings--- ",res.data)

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // SAVE
  // =========================

  const submit = async () => {

    setSaving(true);

    try {

      const formData = new FormData();

      formData.append(
        "name",
        settings.name || ""
      );

      formData.append(
        "email",
        settings.email || ""
      );

      formData.append(
        "phone",
        settings.phone || ""
      );

      formData.append(
        "address",
        settings.address || ""
      );

      formData.append(
        "city",
        settings.city || ""
      );

      formData.append(
        "sigle",
        settings.sigle || ""
      );

      formData.append(
        "term_system",
        settings.term_system
      );

      if (
        settings.logo instanceof File
      ) {

        formData.append(
          "logo",
          settings.logo
        );
      }

      await api.put(
        "/schools/settings/",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      alert(
        "Paramètres enregistrés"
      );

      loadSettings();

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

    loadSettings();

  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading || !settings) {

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

    <div className="
      p-6
      max-w-5xl
      mx-auto
      space-y-6
    ">

      {/* HEADER */}

      <div>

        <h1 className="
          text-3xl
          font-bold
        ">
          Settings
        </h1>

        <p className="
          text-gray-500
          mt-1
        ">
          Configuration générale de l’école
        </p>

      </div>

      {/* CARD */}

      <div className="
        bg-white
        p-4
        border
        rounded-3xl
        shadow-sm
        overflow-hidden
      ">

        {/* TOP */}

        <div className="
          h-40 border 
          rounded-t-3xl 
          bg-gradient-to-r 
          from-indigo-500 
          to-purple-600 " />
         
      

        <div className="px-8 pb-8 ">

          {/* LOGO */}

          <div className="-mt-12 flex items-center gap-6 ">

            <div className="
              relative
              w-50
              h-50
              rounded-3xl
              overflow-hidden
              border-4
              border-white
              bg-gray-100
            ">

              {settings?.logo_url ? (

                <img
                  src={
                    settings.logo instanceof File
                      ? URL.createObjectURL(
                          settings.logo
                        )
                      : settings.logo_url
                  }
                  alt="logo"
                  fill="true"
                  className="object-cover w-50 h-50"
                />

              ) : (

                <div className="
                  w-full
                  h-full
                  flex
                  items-center
                  justify-center
                  text-4xl
                  font-bold
                  text-gray-400
                ">
                  {settings.name?.[0]}
                </div>
              )}

            </div>

            <div>

              <h2 className="
                text-2xl
                font-bold
              ">
                {settings.name}
              </h2>

              <p className="
                text-gray-500
              ">
                {settings.city},
                {" "}
                {settings.country}
              </p>

            </div>

          </div>

          {/* FORM */}

          <div className="
            grid
            md:grid-cols-2
            gap-6
            mt-10
          ">

            {/* SCHOOL NAME */}

            <Input
              label="Nom école"
              value={settings.name}

              onChange={(v)=>
                setSettings({
                  ...settings,
                  name: v
                })
              }
            />

            {/* EMAIL */}

            <Input
              label="Email"
              value={settings.email}

              onChange={(v)=>
                setSettings({
                  ...settings,
                  email: v
                })
              }
            />

            {/* PHONE */}

            <Input
              label="Téléphone"
              value={settings.phone}

              onChange={(v)=>
                setSettings({
                  ...settings,
                  phone: v
                })
              }
            />

            {/* CITY */}

            <Input
              label="Ville"
              value={settings.city}

              onChange={(v)=>
                setSettings({
                  ...settings,
                  city: v
                })
              }
            />

            {/* SSIGLE */}
            <Input
              label="Sigle"
              value={settings.sigle}

              onChange={(v)=>
                setSettings({
                  ...settings,
                  city: v
                })
              }
            />
          

            {/* TERM SYSTEM */}

            <div >

              <label className="
                block
                mb-2
                text-sm
                font-medium
              ">
                Système académique
              </label>

              <select

                value={
                  settings.term_system
                }

                onChange={(e)=>
                  setSettings({
                    ...settings,
                    term_system:
                      e.target.value
                  })
                }

                className="
                  w-full
                  border
                  rounded-2xl
                  p-3
                "
              >

                <option value="trimester">
                  Trimestre
                </option>

                <option value="semester">
                  Semestre
                </option>

              </select>

            </div>

            {/* ADDRESS */}

            <div className="md:col-span-2">

              <label className="
                block
                mb-2
                text-sm
                font-medium
              ">
                Adresse
              </label>

              <textarea
                label="Adresse"
                value={
                  settings.address
                }

                onChange={(e)=>
                  setSettings({
                    ...settings,
                    address:
                      e.target.value
                  })
                }

                rows={4}

                className="
                  w-full
                  border
                  rounded-2xl
                  p-3
                "
              />

            </div>

            {/* LOGO */}

            <div className="
              md:col-span-2
            ">

              <label className="
                block
                mb-2
                text-sm
                font-medium
              ">
                Logo école
              </label>

              <input
                type="file"

                onChange={(e)=>
                  setSettings({
                    ...settings,
                    logo:
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

          <div className="
            mt-8
          ">

            <button

              onClick={submit}

              disabled={saving}

              className="
                bg-[#6214BE]
                text-white
                px-6
                py-3
                rounded-2xl
                font-medium
              "
            >

              {saving
                ? "Enregistrement..."
                : "Enregistrer paramètres"
              }

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

// =========================
// INPUT
// =========================

function Input({
  label,
  value,
  onChange
}: any) {

  return (

    <div>

      <label className="
        block
        mb-2
        text-sm
        font-medium
      ">
        {label}
      </label>

      <input
        type="text"

        value={value || ""}

        onChange={(e)=>
          onChange(
            e.target.value
          )
        }

        className="
          w-full
          border
          rounded-2xl
          p-3
        "
      />

    </div>
  );
}