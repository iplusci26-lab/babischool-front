"use client";

import {

  useEffect,

  useState

} from "react";

import {

  X,

  Upload

} from "lucide-react";

import { api } from "@/lib/api";

export default function AnnouncementFormModal({
  announcement,
  onClose,

  onSuccess,

}: any) {

  const [loading, setLoading] =
    useState(false);

  const [roles, setRoles] =
    useState<any[]>([]);

  const [classrooms, setClassrooms] =
    useState<any[]>([]);

  const [levels, setLevels] =
    useState<any[]>([]);

  const [cycles, setCycles] =
    useState<any[]>([]);

  const [form, setForm] =
    useState({

      title: "",

      category: "general",

      priority: "normal",

      content: "",

      expire_at: "",

      target_type: "school",

      role: "",

      classroom: "",

      classroom_level: "",

      cycle: "",
    });

  const [attachment, setAttachment] =
    useState<File | null>(null);

  useEffect(() => {

    loadData();

  }, []);

  useEffect(() => {

    if (!announcement) return;
  
    const target =
      announcement.targets?.[0];
  
    setForm({
  
      title:
        announcement.title || "",
  
      category:
        announcement.category || "general",
  
      priority:
        announcement.priority || "normal",
  
      content:
        announcement.content || "",
  
      expire_at:
        announcement.expire_at
          ? announcement.expire_at
              .slice(0, 16)
          : "",
  
      target_type:
        target?.target_type ||
        "school",
  
      role:
        target?.role || "",
  
      classroom:
        target?.classroom || "",
  
      classroom_level:
        target?.classroom_level || "",
  
      cycle:
        target?.cycle || "",
    });
  
  }, [announcement]);

  const loadData = async () => {

    try {

      const [

        rolesRes,

        classroomRes,

        levelRes,

        cycleRes,

      ] = await Promise.all([

        api.get("/auth/role/"),

        api.get("/students/classrooms/"),

        api.get("/students/classlevel/"),

        api.get("/students/cycles/"),

      ]);

      setRoles(
        rolesRes.data.results ||
        rolesRes.data
      );

      setClassrooms(
        classroomRes.data.results ||
        classroomRes.data
      );

      setLevels(
        levelRes.data.results ||
        levelRes.data
      );

      setCycles(
        cycleRes.data.results ||
        cycleRes.data
      );

    } catch (error) {

      console.error(error);
    }
  };

  const submit = async () => {

    try {

      setLoading(true);

      const payload =
        new FormData();

      payload.append(
        "title",
        form.title
      );

      payload.append(
        "category",
        form.category
      );

      payload.append(
        "priority",
        form.priority
      );

      payload.append(
        "content",
        form.content
      );

      payload.append(
        "expire_at",
        form.expire_at
      );

      if (attachment) {

        payload.append(
          "attachment",
          attachment
        );
      }

      payload.append(

        "targets",

        JSON.stringify([
          {

            target_type:
              form.target_type,

            role:
              form.role || null,

            classroom:
              form.classroom || null,

            classroom_level:
              form.classroom_level || null,

            cycle:
              form.cycle || null,
          },
        ])
      );

      if (announcement) {

        await api.put(
      
          `/announcements/${announcement.id}/`,
      
          payload,
      
          {
      
            headers: {
      
              "Content-Type":
                "multipart/form-data",
            },
          }
        );
      
      } else {
      
        await api.post(
      
          "/announcements/create/",
      
          payload,
      
          {
      
            headers: {
      
              "Content-Type":
                "multipart/form-data",
            },
          }
        );
      }

      onSuccess();

    } catch (error) {

      console.error(error);

      alert(
        "Erreur création annonce"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">

      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white flex justify-between items-center">

          <div>

            <h2 className="text-2xl font-bold">

            {announcement
                ? "Modifier l'annonce"
                : "Nouvelle annonce"
            }

            </h2>

            <p className="text-indigo-100">

              Communication interne

            </p>

          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 cursor-pointer rounded-full bg-white/20 flex items-center justify-center"
          >

            <X size={20} />

          </button>

        </div>

        {/* BODY */}

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

          {/* TITRE */}

          <div>

            <label className="block mb-2 text-sm font-medium">

              Titre

            </label>

            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title:
                    e.target.value,
                })
              }
              className="w-full border rounded-2xl p-4"
            />

          </div>

          {/* CATEGORIE */}

          <div>

            <label className="block mb-2">

              Catégorie

            </label>

            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category:
                    e.target.value,
                })
              }
              className="w-full border rounded-2xl p-4"
            >

              <option value="general">
                Générale
              </option>

              <option value="finance">
                Finance
              </option>

              <option value="academic">
                Pédagogique
              </option>

              <option value="discipline">
                Discipline
              </option>

              <option value="holiday">
                Congé
              </option>

              <option value="meeting">
                Réunion
              </option>

              <option value="service">
                Note de service
              </option>

              <option value="exam">
                Examen
              </option>

              <option value="emergency">
                Urgence
              </option>

            </select>

          </div>

          {/* PRIORITE */}

          <div>

            <label className="block mb-2">

              Priorité

            </label>

            <select
              value={form.priority}
              onChange={(e) =>
                setForm({
                  ...form,
                  priority:
                    e.target.value,
                })
              }
              className="w-full border rounded-2xl p-4"
            >

              <option value="normal">
                Normale
              </option>

              <option value="important">
                Importante
              </option>

              <option value="urgent">
                Urgente
              </option>

            </select>

          </div>

          {/* CONTENU */}

          <div>

            <label className="block mb-2">

              Contenu

            </label>

            <textarea
              rows={6}
              value={form.content}
              onChange={(e) =>
                setForm({
                  ...form,
                  content:
                    e.target.value,
                })
              }
              className="w-full border rounded-2xl p-4"
            />

          </div>

          {/* EXPIRATION */}

          <div>

            <label className="block mb-2">

              Date expiration

            </label>

            <input
              type="datetime-local"
              value={form.expire_at}
              onChange={(e) =>
                setForm({
                  ...form,
                  expire_at:
                    e.target.value,
                })
              }
              className="w-full border rounded-2xl p-4"
            />

          </div>

          {/* CIBLAGE */}

          <div>

            <label className="block mb-2">

              Destinataires

            </label>

            <select
              value={form.target_type}
              onChange={(e) =>
                setForm({
                  ...form,
                  target_type:
                    e.target.value,
                })
              }
              className="w-full border rounded-2xl p-4"
            >

              <option value="school">
                Toute l'école
              </option>

              <option value="staff">
                Personnel
              </option>

              <option value="teachers">
                Enseignants
              </option>

              <option value="parents">
                Parents
              </option>

              <option value="role">
                Rôle
              </option>

              <option value="classroom">
                Classe
              </option>

              <option value="classroom_level">
                Niveau
              </option>

              <option value="cycle">
                Cycle
              </option>

            </select>

          </div>
          {form.target_type === "classroom" && (

            <div>

            <label className="block mb-2">

                Sélectionner une classe

            </label>

            <select
                value={form.classroom}
                onChange={(e) =>
                setForm({
                    ...form,
                    classroom:
                    e.target.value,
                })
                }
                className="w-full border rounded-2xl p-4"
            >

                <option value="">
                Choisir une classe
                </option>

                {classrooms.map((item) => (

                <option
                    key={item.id}
                    value={item.id}
                >

                    {item.name}

                </option>
                ))}

            </select>

            </div>
            )}

            {form.target_type === "level" || form.target_type ==="classroom_level" && (

            <div>

            <label className="block mb-2">

                Sélectionner une classe

            </label>

            <select
                value={form.classroom_level}
                onChange={(e) =>
                setForm({
                    ...form,
                    classroom_level:
                    e.target.value,
                })
                }
                className="w-full border rounded-2xl p-4"
            >

                <option value="">
                Choisir une classe
                </option>

                {classrooms.map((item) => (

                <option
                    key={item.id}
                    value={item.id}
                >

                    {item.name}

                </option>
                ))}

            </select>

            </div>
            )}


            {form.target_type === "cycle" && (

            <div>

            <label className="block mb-2">

                Sélectionner un cycle

            </label>

            <select
                value={form.cycle}
                onChange={(e) =>
                setForm({
                    ...form,
                    cycle:
                    e.target.value,
                })
                }
                className="w-full border rounded-2xl p-4"
            >

                <option value="">
                Choisir un cycle
                </option>

                {cycles.map((item) => (

                <option
                    key={item.id}
                    value={item.id}
                >

                    {item.name}

                </option>
                ))}

            </select>

            </div>
            )}
            
            <div>

            <label className="block mb-2">

            Pièce jointe

            </label>

            <label className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">

            <Upload size={28} />

            <span className="mt-3 text-sm">

                Cliquez pour sélectionner un fichier

            </span>

            <input
                type="file"
                hidden
                onChange={(e) => {

                if (
                    e.target.files &&
                    e.target.files[0]
                ) {

                    setAttachment(
                    e.target.files[0]
                    );
                }
                }}
            />

            </label>

            {attachment && (

            <p className="mt-2 text-sm text-green-600">

                {attachment.name}

            </p>
            )}

            </div>
        </div>
            
            <div className="border-t p-6 flex justify-end gap-3">

                <button
                    onClick={onClose}
                    className="px-5 py-3 cursor-pointer border rounded-2xl hover:bg-gray-50"
                >

                    Annuler

                </button>

                <button
                    onClick={submit}
                    disabled={loading}
                    className="px-5 py-3 cursor-pointer rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50"
                >

                        {loading
                        ? (
                            announcement
                            ? "Modification..."
                            : "Publication..."
                        )
                        : (
                            announcement
                            ? "Mettre à jour"
                            : "Publier l'annonce"
                        )}

                </button>

                </div>
                
                </div>
</div>
);
}
            