"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  GraduationCap,
  User,
  Users,
  Phone,
  Mail,
  Calendar,
  Hash,
  BookOpen,
  Layers,
  Loader2,
  Copy,
} from "lucide-react";

import { api } from "@/lib/api";

export default function AdmissionForm() {

  const [loading, setLoading] = useState(false);

  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);

  const [successModal, setSuccessModal] = useState({
    open: false,
    phone: "",
    password: "",
  });

  const [form, setForm] = useState({

    // Student
    student_first_name: "",
    student_last_name: "",
    student_number: "",
    gender: "M",
    date_of_birth: "",

    classroom_id: "",
    classroom_group_id: "",
    academic_year_id: "",

    // Parent
    parent_first_name: "",
    parent_last_name: "",
    parent_phone: "",
    parent_email: "",

  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };

  useEffect(() => {

    const loadData = async () => {

      try {

        const [classRes, yearRes] = await Promise.all([
          api.get("/students/classrooms/"),
          api.get("/academics/academic-years/"),
        ]);

        setClassrooms(classRes.data.results);
        setAcademicYears(yearRes.data);

        const activeYear = yearRes.data.find(
          (year: any) => year.is_active
        );

        if (activeYear) {

          setForm((prev) => ({
            ...prev,
            academic_year_id: activeYear.id,
          }));

        }

      } catch (error) {

        console.error(error);

      }

    };

    loadData();

  }, []);

  const selectedClassroom = useMemo(() => {

    return classrooms.find(
      (c: any) => c.id === form.classroom_id
    );

  }, [classrooms, form.classroom_id]);

  const classroomGroups =
    selectedClassroom?.groups ?? [];

  const handleClassroomChange = (
    classroomId: string
  ) => {

    setForm((prev) => ({
      ...prev,
      classroom_id: classroomId,
      classroom_group_id: "",
    }));

  };

  const clean = (value: string) => value.trim();

  const handleSubmit = async () => {

    if (loading) return;

    try {

      setLoading(true);

      const payload = {

        student: {

          student_number: clean(
            form.student_number
          ),

          first_name: clean(
            form.student_first_name
          ),

          last_name: clean(
            form.student_last_name
          ),

          gender: form.gender,

          date_of_birth:
            form.date_of_birth,

          classroom_id:
            form.classroom_id,

          classroom_group_id:
            form.classroom_group_id || null,

          academic_year_id:
            form.academic_year_id,

        },

        parent: {

          first_name: clean(
            form.parent_first_name
          ),

          last_name: clean(
            form.parent_last_name
          ),

          phone: clean(
            form.parent_phone
          ),

          email: clean(
            form.parent_email
          ),

        },

      };

      const res = await api.post(
        "/students/admissions/",
        payload
      );

      setSuccessModal({

        open: true,

        phone:
          res.data.results?.parent_phone ??
          res.data.parent_phone ??
          form.parent_phone,

        password:
          res.data.results
            ?.parent_temp_password ??
          res.data.parent_temp_password ??
          "",

      });

      setForm({

        student_first_name: "",
        student_last_name: "",
        student_number: "",
        gender: "M",
        date_of_birth: "",

        classroom_id: "",
        classroom_group_id: "",

        academic_year_id:
          form.academic_year_id,

        parent_first_name: "",
        parent_last_name: "",
        parent_phone: "",
        parent_email: "",

      });

    } catch (error: any) {

      console.error(
        error.response?.data
      );

      alert(
        "Une erreur est survenue lors de l'inscription."
      );

    } finally {

      setLoading(false);

    }

  };

  const copyCredentials = async () => {

    await navigator.clipboard.writeText(
`Téléphone : ${successModal.phone}
Mot de passe : ${successModal.password}`
    );

    alert("Identifiants copiés.");

  };

  const isValid =

    form.student_first_name &&
    form.student_last_name &&
    form.student_number &&
    form.date_of_birth &&
    form.classroom_id &&
    form.parent_first_name &&
    form.parent_phone &&
    form.academic_year_id &&
    (
      classroomGroups.length === 0 ||
      form.classroom_group_id
    );

  return (

    <>

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900">

            Nouvelle inscription

          </h1>

          <p className="text-gray-500 mt-2">

            Inscrire un nouvel élève et créer automatiquement son compte parent.

          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Bandeau */}

          <div className="bg-gradient-to-r from-[#6214BE] to-[#7A2BE2] p-8">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-white">

                  Formulaire d'inscription

                </h2>

                <p className="text-purple-100 mt-2">

                  Complétez les informations de l'élève et de son parent.

                </p>

              </div>

              <GraduationCap
                size={70}
                className="text-white/30"
              />

            </div>

          </div>

          <div className="p-8 space-y-10">

            {/* ===================== */}
            {/* ELEVE */}
            {/* ===================== */}

            <div>

              <div className="flex items-center gap-3 mb-6">

                <div className="w-11 h-11 rounded-xl bg-[#6214BE]/10 flex items-center justify-center">

                  <GraduationCap
                    className="text-[#6214BE]"
                    size={22}
                  />

                </div>

                <div>

                  <h3 className="font-bold text-lg">

                    Informations de l'élève

                  </h3>

                  <p className="text-sm text-gray-500">

                    Informations académiques.

                  </p>

                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-5">

                <div>

                  <label className="text-sm font-medium">

                    Prénom

                  </label>

                  <div className="relative mt-2">

                    <User
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <input
                      name="student_first_name"
                      value={form.student_first_name}
                      onChange={handleChange}
                      placeholder="Prénom"
                      className="w-full rounded-xl border pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#6214BE] outline-none"
                    />

                  </div>

                </div>

                <div>

                  <label className="text-sm font-medium">

                    Nom

                  </label>

                  <div className="relative mt-2">

                    <User
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <input
                      name="student_last_name"
                      value={form.student_last_name}
                      onChange={handleChange}
                      placeholder="Nom"
                      className="w-full rounded-xl border pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#6214BE] outline-none"
                    />

                  </div>

                </div>

                <div>

                  <label className="text-sm font-medium">

                    Matricule

                  </label>

                  <div className="relative mt-2">

                    <Hash
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <input
                      name="student_number"
                      value={form.student_number}
                      onChange={handleChange}
                      maxLength={10}
                      placeholder="Matricule"
                      className="w-full rounded-xl border pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#6214BE] outline-none"
                    />

                  </div>

                </div>

                <div>

                  <label className="text-sm font-medium">

                    Date de naissance

                  </label>

                  <div className="relative mt-2">

                    <Calendar
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <input
                      type="date"
                      name="date_of_birth"
                      value={form.date_of_birth}
                      onChange={handleChange}
                      className="w-full rounded-xl border pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#6214BE] outline-none"
                    />

                  </div>

                </div>

                <div>

                  <label className="text-sm font-medium">

                    Sexe

                  </label>

                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full rounded-xl border mt-2 px-4 py-3 focus:ring-2 focus:ring-[#6214BE] outline-none"
                  >

                    <option value="M">

                      Masculin

                    </option>

                    <option value="F">

                      Féminin

                    </option>

                  </select>

                </div>

                <div>

                  <label className="text-sm font-medium">

                    Classe

                  </label>

                  <div className="relative mt-2">

                    <BookOpen
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <select
                      value={form.classroom_id}
                      onChange={(e) =>
                        handleClassroomChange(
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#6214BE] outline-none"
                    >

                      <option value="">

                        Sélectionner une classe

                      </option>

                      {classrooms.map((c: any) => (

                        <option
                          key={c.id}
                          value={c.id}
                        >

                          {c.name}

                        </option>

                      ))}

                    </select>

                  </div>

                </div>

                {classroomGroups.length > 0 && (

                  <div>

                    <label className="text-sm font-medium">

                      Groupe

                    </label>

                    <div className="relative mt-2">

                      <Layers
                        size={18}
                        className="absolute left-3 top-3.5 text-gray-400"
                      />

                      <select
                        name="classroom_group_id"
                        value={form.classroom_group_id}
                        onChange={handleChange}
                        className="w-full rounded-xl border pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#6214BE] outline-none"
                      >

                        <option value="">

                          Sélectionner un groupe

                        </option>

                        {classroomGroups.map((group: any) => (

                          <option
                            key={group.id}
                            value={group.id}
                          >

                            {group.code} - {group.name}

                          </option>

                        ))}

                      </select>

                    </div>

                  </div>

                )}

                <div>

                  <label className="text-sm font-medium">

                    Année scolaire

                  </label>

                  <div className="mt-2 rounded-xl bg-[#6214BE]/10 border border-[#6214BE]/20 px-4 py-3 font-semibold text-[#6214BE]">

                    {
                      academicYears.find(
                        (y: any) =>
                          y.id ===
                          form.academic_year_id
                      )?.name
                    }

                  </div>

                </div>

              </div>

            </div>

            {/* ===================== */}
            {/* PARENT */}
            {/* ===================== */}

            <div>

              <div className="flex items-center gap-3 mb-6">

                <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">

                  <Users
                    size={22}
                    className="text-green-700"
                  />

                </div>

                <div>

                  <h3 className="font-bold text-lg">

                    Informations du parent

                  </h3>

                  <p className="text-sm text-gray-500">

                    Ces informations serviront à créer son compte.

                  </p>

                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-5">

                {/* Les 4 champs Parent + le bouton seront dans la Partie 3 */}
		                <div>

                  <label className="text-sm font-medium">

                    Prénom du parent

                  </label>

                  <div className="relative mt-2">

                    <User
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <input
                      name="parent_first_name"
                      value={form.parent_first_name}
                      onChange={handleChange}
                      placeholder="Prénom"
                      className="w-full rounded-xl border pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#6214BE] outline-none"
                    />

                  </div>

                </div>

                <div>

                  <label className="text-sm font-medium">

                    Nom du parent

                  </label>

                  <div className="relative mt-2">

                    <User
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <input
                      name="parent_last_name"
                      value={form.parent_last_name}
                      onChange={handleChange}
                      placeholder="Nom"
                      className="w-full rounded-xl border pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#6214BE] outline-none"
                    />

                  </div>

                </div>

                <div>

                  <label className="text-sm font-medium">

                    Téléphone

                  </label>

                  <div className="relative mt-2">

                    <Phone
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <input
                      name="parent_phone"
                      value={form.parent_phone}
                      onChange={handleChange}
                      placeholder="Téléphone"
                      maxLength={10}
                      className="w-full rounded-xl border pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#6214BE] outline-none"
                    />

                  </div>

                </div>

                <div>

                  <label className="text-sm font-medium">

                    Email (optionnel)

                  </label>

                  <div className="relative mt-2">

                    <Mail
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <input
                      name="parent_email"
                      value={form.parent_email}
                      onChange={handleChange}
                      placeholder="Adresse email"
                      className="w-full rounded-xl border pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#6214BE] outline-none"
                    />

                  </div>

                </div>

              </div>

            </div>

            <div className="pt-4 border-t">

              <button

                onClick={handleSubmit}

                disabled={!isValid || loading}

                className="w-full h-14 rounded-xl bg-[#6214BE] hover:bg-[#4E0EA0] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all text-white font-semibold flex items-center justify-center gap-3"

              >

                {loading ? (

                  <>

                    <Loader2
                      className="animate-spin"
                      size={20}
                    />

                    Inscription en cours...

                  </>

                ) : (

                  <>

                    <GraduationCap size={20} />

                    Créer l'inscription

                  </>

                )}

              </button>

            </div>

          </div>

        </div>

      </div>

      {/* =========================== */}
      {/* SUCCESS MODAL */}
      {/* =========================== */}

      {successModal.open && (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 flex flex-col items-center">

              <CheckCircle2
                size={70}
                className="text-white"
              />

              <h2 className="text-2xl font-bold text-white mt-4">

                Admission réussie

              </h2>

              <p className="text-green-100 mt-2 text-center">

                Le compte parent a été créé avec succès.

              </p>

            </div>

            <div className="p-6 space-y-5">

              <div className="rounded-2xl bg-gray-50 border p-4">

                <p className="text-xs uppercase text-gray-500">

                  Téléphone

                </p>

                <p className="font-bold text-lg mt-1">

                  {successModal.phone}

                </p>

              </div>

              <div className="rounded-2xl bg-[#6214BE]/5 border border-[#6214BE]/20 p-4">

                <p className="text-xs uppercase text-gray-500">

                  Mot de passe temporaire

                </p>

                <p className="font-bold text-2xl text-[#6214BE] mt-1 tracking-widest">

                  {successModal.password}

                </p>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <button

                  onClick={copyCredentials}

                  className="h-12 rounded-xl border font-semibold flex items-center justify-center gap-2 hover:bg-gray-100"

                >

                  <Copy size={18} />

                  Copier

                </button>

                <button

                  onClick={() =>
                    setSuccessModal({
                      open: false,
                      phone: "",
                      password: "",
                    })
                  }

                  className="h-12 rounded-xl bg-[#6214BE] hover:bg-[#4E0EA0] text-white font-semibold"

                >

                  Fermer

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </>

  );

}