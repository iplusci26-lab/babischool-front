"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  Plus,
  Trash2,
  Settings2,
  X,
  Pencil,
  Loader2,
} from "lucide-react";

import { api } from "@/lib/api";


// ==========================================================
// TYPES
// ==========================================================

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface Classroom {
  id: string;
  classroom_level: string | null;
  classroom_level_name: string | null;
  cycle_id: string | null;
  cycle_name: string | null;
  name: string;
  annual_tuition_fee: number | string;
  next_classroom: string | null;
  next_classroom_name: string | null;
}

interface AcademicYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface ClassroomSubject {
  id: string;

  school: string;

  classroom: string;
  classroom_name: string;

  subject: string;
  subject_name: string;
  subject_code: string;

  academic_year: string;
  academic_year_name: string;

  coefficient: number | string;
  pass_mark: number | string;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}


// ==========================================================
// PAGE
// ==========================================================

export default function SubjectsPage() {

  // ========================================================
  // SUBJECTS
  // ========================================================

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [loadingSubjects, setLoadingSubjects] =
    useState(false);

  const [creatingSubject, setCreatingSubject] =
    useState(false);

  const [deletingSubjectId, setDeletingSubjectId] =
    useState<string | null>(null);


  // ========================================================
  // CLASSROOMS
  // ========================================================

  const [classrooms, setClassrooms] =
    useState<Classroom[]>([]);

  const [loadingClassrooms, setLoadingClassrooms] =
    useState(false);


  // ========================================================
  // ACADEMIC YEARS
  // ========================================================

  const [academicYears, setAcademicYears] =
    useState<AcademicYear[]>([]);

  const [loadingAcademicYears, setLoadingAcademicYears] =
    useState(false);


  // ========================================================
  // CLASSROOM SUBJECTS
  // ========================================================

  const [classroomSubjects, setClassroomSubjects] =
    useState<ClassroomSubject[]>([]);

  const [loadingConfigurations, setLoadingConfigurations] =
    useState(false);


  // ========================================================
  // CREATION MATIERE
  // ========================================================

  const [subjectForm, setSubjectForm] = useState({
    name: "",
    code: "",
  });


  // ========================================================
  // CONFIGURATION
  // ========================================================

  const [configurationOpen, setConfigurationOpen] =
    useState(false);

  const [selectedSubject, setSelectedSubject] =
    useState<Subject | null>(null);

  const [editingConfiguration, setEditingConfiguration] =
    useState<ClassroomSubject | null>(null);

  const [savingConfiguration, setSavingConfiguration] =
    useState(false);

  const [deletingConfigurationId, setDeletingConfigurationId] =
    useState<string | null>(null);


  const [configurationForm, setConfigurationForm] =
    useState({
      classroom: "",
      academic_year: "",
      coefficient: "1",
      pass_mark: "10",
    });


  // ========================================================
  // LOAD SUBJECTS
  // ========================================================

  const loadSubjects = async () => {

    try {

      setLoadingSubjects(true);

      const response = await api.get(
        "/academics/subjects/"
      );

      setSubjects(
        response.data.results || response.data
      );

    } catch (error) {

      console.error(
        "Erreur chargement matières :",
        error
      );

      toast.error(
        "Impossible de charger les matières."
      );

    } finally {

      setLoadingSubjects(false);

    }

  };


  // ========================================================
  // LOAD CLASSROOMS
  // ========================================================

  const loadClassrooms = async () => {

    try {

      setLoadingClassrooms(true);

      const response = await api.get(
        "/students/classrooms/"
      );

      setClassrooms(
        response.data.results || response.data
      );

    } catch (error) {

      console.error(
        "Erreur chargement classes :",
        error
      );

      toast.error(
        "Impossible de charger les classes."
      );

    } finally {

      setLoadingClassrooms(false);

    }

  };


  // ========================================================
  // LOAD ACADEMIC YEARS
  // ========================================================

  const loadAcademicYears = async () => {

    try {

      setLoadingAcademicYears(true);

      const response = await api.get(
        "/academics/academic-years/"
      );

      const years =
        response.data.results || response.data;

      setAcademicYears(years);

      // Sélection automatique de l'année active
      const activeYear = years.find(
        (year: AcademicYear) =>
          year.is_active
      );

      if (activeYear) {

        setConfigurationForm(
          (current) => ({
            ...current,
            academic_year:
              current.academic_year ||
              activeYear.id,
          })
        );

      }

    } catch (error) {

      console.error(
        "Erreur chargement années scolaires :",
        error
      );

      toast.error(
        "Impossible de charger les années scolaires."
      );

    } finally {

      setLoadingAcademicYears(false);

    }

  };


  // ========================================================
  // INITIALISATION
  // ========================================================

  useEffect(() => {

    loadSubjects();
    loadClassrooms();
    loadAcademicYears();

  }, []);


  // ========================================================
  // LOAD CLASSROOM SUBJECTS
  // ========================================================

  const loadConfigurations = async (
    subjectId: string
  ) => {

    try {

      setLoadingConfigurations(true);

      const response = await api.get(
        "/academics/classroom-subjects/",
        {
          params: {
            subject: subjectId,
          },
        }
      );

      setClassroomSubjects(
        response.data.results || response.data
      );

    } catch (error) {

      console.error(
        "Erreur chargement configurations :",
        error
      );

      toast.error(
        "Impossible de charger les configurations."
      );

    } finally {

      setLoadingConfigurations(false);

    }

  };


  // ========================================================
  // OPEN CONFIGURATION
  // ========================================================

  const openConfiguration = async (
    subject: Subject
  ) => {

    setSelectedSubject(subject);

    setEditingConfiguration(null);

    const activeYear =
      academicYears.find(
        (year) => year.is_active
      );

    setConfigurationForm({
      classroom: "",
      academic_year:
        activeYear?.id ||
        academicYears[0]?.id ||
        "",
      coefficient: "1",
      pass_mark: "10",
    });

    setConfigurationOpen(true);

    await loadConfigurations(
      subject.id
    );

  };


  // ========================================================
  // CLOSE CONFIGURATION
  // ========================================================

  const closeConfiguration = () => {

    if (savingConfiguration) {
      return;
    }

    setConfigurationOpen(false);

    setSelectedSubject(null);

    setEditingConfiguration(null);

    setClassroomSubjects([]);

  };


  // ========================================================
  // CREATE SUBJECT
  // ========================================================

  const handleCreateSubject = async () => {

    if (!subjectForm.name.trim()) {

      toast.error(
        "Veuillez renseigner le nom de la matière."
      );

      return;

    }

    if (!subjectForm.code.trim()) {

      toast.error(
        "Veuillez renseigner l'abréviation de la matière."
      );

      return;

    }

    try {

      setCreatingSubject(true);

      await api.post(
        "/academics/subjects/",
        {
          name: subjectForm.name.trim(),

          code: subjectForm.code
            .trim()
            .toUpperCase(),
        }
      );

      toast.success(
        "Matière ajoutée avec succès."
      );

      setSubjectForm({
        name: "",
        code: "",
      });

      await loadSubjects();

    } catch (error: any) {

      console.error(
        "Erreur création matière :",
        error?.response?.data || error
      );

      const data =
        error?.response?.data;

      if (data?.name) {

        toast.error(
          Array.isArray(data.name)
            ? data.name[0]
            : data.name
        );

      } else if (data?.code) {

        toast.error(
          Array.isArray(data.code)
            ? data.code[0]
            : data.code
        );

      } else if (data?.detail) {

        toast.error(
          data.detail
        );

      } else {

        toast.error(
          "Impossible d'ajouter la matière."
        );

      }

    } finally {

      setCreatingSubject(false);

    }

  };


  // ========================================================
  // DELETE SUBJECT
  // ========================================================

  const handleDeleteSubject = async (
    id: string
  ) => {

    try {

      setDeletingSubjectId(id);

      await api.delete(
        `/academics/subjects/${id}/`
      );

      toast.success(
        "Matière supprimée avec succès."
      );

      await loadSubjects();

    } catch (error: any) {

      console.error(
        "Erreur suppression matière :",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.detail ||
        "Impossible de supprimer cette matière."
      );

    } finally {

      setDeletingSubjectId(null);

    }

  };


  // ========================================================
  // VALIDATE CONFIGURATION
  // ========================================================

  const validateConfiguration = () => {

    if (!configurationForm.academic_year) {

      toast.error(
        "Veuillez sélectionner une année scolaire."
      );

      return false;

    }

    if (!configurationForm.classroom) {

      toast.error(
        "Veuillez sélectionner une classe."
      );

      return false;

    }

    if (!configurationForm.coefficient.trim()) {

      toast.error(
        "Veuillez renseigner le coefficient."
      );

      return false;

    }

    const coefficient = Number(
      configurationForm.coefficient
        .replace(",", ".")
    );

    if (
      !Number.isFinite(coefficient) ||
      coefficient <= 0
    ) {

      toast.error(
        "Le coefficient doit être supérieur à 0."
      );

      return false;

    }

    if (coefficient > 999.99) {

      toast.error(
        "Le coefficient ne peut pas dépasser 999.99."
      );

      return false;

    }

    if (!configurationForm.pass_mark.trim()) {

      toast.error(
        "Veuillez renseigner la note de passage."
      );

      return false;

    }

    const passMark = Number(
      configurationForm.pass_mark
        .replace(",", ".")
    );

    if (
      !Number.isFinite(passMark) ||
      passMark < 0
    ) {

      toast.error(
        "La note de passage doit être supérieure ou égale à 0."
      );

      return false;

    }

    return true;

  };


  // ========================================================
  // SAVE CONFIGURATION
  // ========================================================

  const handleSaveConfiguration = async () => {

    if (!selectedSubject) {
      return;
    }

    if (!validateConfiguration()) {
      return;
    }

    const payload = {

      classroom:
        configurationForm.classroom,

      subject:
        selectedSubject.id,

      academic_year:
        configurationForm.academic_year,

      coefficient: Number(
        configurationForm.coefficient
          .replace(",", ".")
      ),

      pass_mark: Number(
        configurationForm.pass_mark
          .replace(",", ".")
      ),

      is_active: true,

    };

    try {

      setSavingConfiguration(true);

      if (editingConfiguration) {

        await api.patch(
          `/academics/classroom-subjects/${editingConfiguration.id}/`,
          payload
        );

        toast.success(
          "Configuration modifiée avec succès."
        );

      } else {

        await api.post(
          "/academics/classroom-subjects/",
          payload
        );

        toast.success(
          "Configuration enregistrée avec succès."
        );

      }

      setEditingConfiguration(null);

      const activeYear =
        academicYears.find(
          (year) => year.is_active
        );

      setConfigurationForm({
        classroom: "",
        academic_year:
          activeYear?.id ||
          academicYears[0]?.id ||
          "",
        coefficient: "1",
        pass_mark: "10",
      });

      await loadConfigurations(
        selectedSubject.id
      );

    } catch (error: any) {

      console.error(
        "Erreur configuration matière :",
        error?.response?.data || error
      );

      const data =
        error?.response?.data;

      if (data?.classroom) {

        toast.error(
          Array.isArray(data.classroom)
            ? data.classroom[0]
            : data.classroom
        );

      } else if (data?.subject) {

        toast.error(
          Array.isArray(data.subject)
            ? data.subject[0]
            : data.subject
        );

      } else if (data?.academic_year) {

        toast.error(
          Array.isArray(data.academic_year)
            ? data.academic_year[0]
            : data.academic_year
        );

      } else if (data?.coefficient) {

        toast.error(
          Array.isArray(data.coefficient)
            ? data.coefficient[0]
            : data.coefficient
        );

      } else if (data?.pass_mark) {

        toast.error(
          Array.isArray(data.pass_mark)
            ? data.pass_mark[0]
            : data.pass_mark
        );

      } else if (data?.detail) {

        toast.error(
          data.detail
        );

      } else {

        toast.error(
          "Impossible d'enregistrer la configuration."
        );

      }

    } finally {

      setSavingConfiguration(false);

    }

  };


  // ========================================================
  // EDIT CONFIGURATION
  // ========================================================

  const handleEditConfiguration = (
    configuration: ClassroomSubject
  ) => {

    setEditingConfiguration(
      configuration
    );

    setConfigurationForm({

      classroom:
        configuration.classroom,

      academic_year:
        configuration.academic_year,

      coefficient:
        String(configuration.coefficient),

      pass_mark:
        String(configuration.pass_mark),

    });

  };


  // ========================================================
  // CANCEL EDIT
  // ========================================================

  const cancelEdit = () => {

    setEditingConfiguration(null);

    const activeYear =
      academicYears.find(
        (year) => year.is_active
      );

    setConfigurationForm({

      classroom: "",

      academic_year:
        activeYear?.id ||
        academicYears[0]?.id ||
        "",

      coefficient: "1",

      pass_mark: "10",

    });

  };


  // ========================================================
  // DELETE CONFIGURATION
  // ========================================================

  const handleDeleteConfiguration = async (
    id: string
  ) => {

    try {

      setDeletingConfigurationId(id);

      await api.delete(
        `/academics/classroom-subjects/${id}/`
      );

      toast.success(
        "Configuration supprimée."
      );

      if (selectedSubject) {

        await loadConfigurations(
          selectedSubject.id
        );

      }

    } catch (error: any) {

      console.error(
        "Erreur suppression configuration :",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.detail ||
        "Impossible de supprimer cette configuration."
      );

    } finally {

      setDeletingConfigurationId(null);

    }

  };


  // ========================================================
  // CONFIGURATION COUNT
  // ========================================================

  const configurationCountBySubject =
    useMemo(() => {

      const result: Record<
        string,
        number
      > = {};

      classroomSubjects.forEach(
        (configuration) => {

          result[
            configuration.subject
          ] =
            (result[
              configuration.subject
            ] || 0) + 1;

        }
      );

      return result;

    }, [classroomSubjects]);


  // ========================================================
  // FORMAT COEFFICIENT
  // ========================================================

  const formatCoefficient = (
    value: number | string
  ) => {

    const number =
      Number(
        String(value)
          .replace(",", ".")
      );

    if (!Number.isFinite(number)) {
      return value;
    }

    return number
      .toFixed(2)
      .replace(/\.00$/, "")
      .replace(/(\.\d)0$/, "$1");

  };


  // ========================================================
  // UI
  // ========================================================

  return (

    <div className="min-h-screen space-y-6 bg-gray-50 p-6">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div>

        <h1 className="text-2xl font-bold text-gray-900">
          Gestion des matières
        </h1>

        <p className="mt-1 max-w-3xl text-sm text-gray-500">
          Créez les matières de votre établissement,
          puis configurez leur coefficient et leur note
          de passage pour chaque classe.
        </p>

      </div>


      {/* ================================================== */}
      {/* CREATION MATIERE */}
      {/* ================================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">

          <Plus
            size={20}
            className="text-[#6214BE]"
          />

          Nouvelle matière

        </h2>


        <div className="grid gap-5 lg:grid-cols-3">

          {/* NOM */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nom de la matière
            </label>

            <input
              type="text"
              placeholder="Ex : Mathématiques"
              value={subjectForm.name}
              onChange={(event) =>
                setSubjectForm({
                  ...subjectForm,
                  name: event.target.value,
                })
              }
              disabled={creatingSubject}
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                px-4
                py-3
                outline-none
                transition
                focus:border-[#6214BE]
                focus:ring-2
                focus:ring-[#6214BE]/10
                disabled:bg-gray-100
              "
            />

          </div>


          {/* CODE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Abréviation
            </label>

            <input
              type="text"
              placeholder="Ex : MATH"
              value={subjectForm.code}
              onChange={(event) =>
                setSubjectForm({
                  ...subjectForm,
                  code:
                    event.target.value.toUpperCase(),
                })
              }
              disabled={creatingSubject}
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                px-4
                py-3
                uppercase
                outline-none
                transition
                focus:border-[#6214BE]
                focus:ring-2
                focus:ring-[#6214BE]/10
                disabled:bg-gray-100
              "
            />

          </div>


          {/* BOUTON */}

          <div className="flex items-end">

            <button
              type="button"
              onClick={handleCreateSubject}
              disabled={creatingSubject}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#6214BE]
                px-5
                py-3
                font-medium
                text-white
                transition
                hover:bg-[#4d0fa0]
                disabled:cursor-not-allowed
                disabled:bg-gray-400
              "
            >

              {creatingSubject && (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              )}

              {creatingSubject
                ? "Ajout..."
                : "Ajouter matière"}

            </button>

          </div>

        </div>

      </div>


      {/* ================================================== */}
      {/* TABLEAU */}
      {/* ================================================== */}

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

        <div className="border-b bg-gray-50 px-6 py-4">

          <h2 className="font-semibold text-gray-800">
            Matières enregistrées
          </h2>

          <p className="mt-1 text-sm text-gray-500">

            {subjects.length} matière
            {subjects.length > 1 ? "s" : ""}

          </p>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr className="text-left text-sm font-semibold text-gray-600">

                <th className="px-6 py-4">
                  Matière
                </th>

                <th className="px-6 py-4">
                  Abréviation
                </th>

                <th className="px-6 py-4">
                  Configuration
                </th>

                <th className="px-6 py-4 text-right">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {loadingSubjects ? (

                <tr>

                  <td
                    colSpan={4}
                    className="py-12 text-center text-gray-500"
                  >

                    <div className="flex items-center justify-center gap-2">

                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Chargement des matières...

                    </div>

                  </td>

                </tr>

              ) : subjects.length === 0 ? (

                <tr>

                  <td
                    colSpan={4}
                    className="py-12 text-center text-gray-500"
                  >

                    <div className="flex flex-col items-center gap-3">

                      <BookOpen
                        size={32}
                        className="text-gray-300"
                      />

                      <span>
                        Aucune matière enregistrée.
                      </span>

                    </div>

                  </td>

                </tr>

              ) : (

                subjects.map((subject) => (

                  <tr
                    key={subject.id}
                    className="
                      border-t
                      transition-colors
                      hover:bg-gray-50
                    "
                  >

                    {/* MATIERE */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="rounded-xl bg-[#6214BE]/10 p-2">

                          <BookOpen
                            size={18}
                            className="text-[#6214BE]"
                          />

                        </div>

                        <span className="font-medium text-gray-800">

                          {subject.name}

                        </span>

                      </div>

                    </td>


                    {/* CODE */}

                    <td className="px-6 py-4">

                      <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium">

                        {subject.code}

                      </span>

                    </td>


                    {/* CONFIGURATION */}

                    <td className="px-6 py-4">

                      <button
                        type="button"
                        onClick={() =>
                          openConfiguration(
                            subject
                          )
                        }
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-lg
                          border
                          border-[#6214BE]/20
                          bg-[#6214BE]/5
                          px-3
                          py-2
                          text-sm
                          font-medium
                          text-[#6214BE]
                          transition
                          hover:bg-[#6214BE]/10
                        "
                      >

                        <Settings2
                          size={16}
                        />

                        Configurer

                      </button>

                    </td>


                    {/* ACTIONS */}

                    <td className="px-6 py-4 text-right">

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteSubject(
                            subject.id
                          )
                        }
                        disabled={
                          deletingSubjectId ===
                          subject.id
                        }
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-lg
                          border
                          border-red-200
                          px-3
                          py-2
                          text-sm
                          font-medium
                          text-red-600
                          transition
                          hover:bg-red-50
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >

                        <Trash2
                          size={16}
                        />

                        {deletingSubjectId ===
                        subject.id
                          ? "Suppression..."
                          : "Supprimer"}

                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ================================================== */}
      {/* MODAL CONFIGURATION */}
      {/* ================================================== */}

      {configurationOpen &&
        selectedSubject && (

          <div
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/40
              p-4
            "
          >

            <div
              className="
                flex
                max-h-[90vh]
                w-full
                max-w-5xl
                flex-col
                overflow-hidden
                rounded-2xl
                bg-white
                shadow-2xl
              "
            >

              {/* ================================================== */}
              {/* MODAL HEADER */}
              {/* ================================================== */}

              <div className="flex items-center justify-between border-b px-6 py-5">

                <div>

                  <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-[#6214BE]/10 p-2">

                      <Settings2
                        size={20}
                        className="text-[#6214BE]"
                      />

                    </div>

                    <div>

                      <h2 className="text-lg font-bold text-gray-900">

                        Configuration de{" "}

                        {selectedSubject.name}

                      </h2>

                      <p className="mt-1 text-sm text-gray-500">

                        {selectedSubject.code}

                      </p>

                    </div>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={closeConfiguration}
                  disabled={savingConfiguration}
                  className="
                    rounded-lg
                    p-2
                    text-gray-500
                    transition
                    hover:bg-gray-100
                    hover:text-gray-700
                  "
                >

                  <X size={20} />

                </button>

              </div>


              {/* ================================================== */}
              {/* MODAL BODY */}
              {/* ================================================== */}

              <div className="overflow-y-auto p-6">

                <div className="grid gap-6 lg:grid-cols-2">


                  {/* ================================================== */}
                  {/* FORMULAIRE */}
                  {/* ================================================== */}

                  <div className="rounded-2xl border bg-gray-50 p-5">

                    <div className="mb-5">

                      <h3 className="font-semibold text-gray-900">

                        {editingConfiguration
                          ? "Modifier la configuration"
                          : "Nouvelle configuration"}

                      </h3>

                      <p className="mt-1 text-sm text-gray-500">

                        Définissez les paramètres de cette
                        matière pour une classe.

                      </p>

                    </div>


                    <div className="space-y-5">


                      {/* ANNEE */}

                      <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">

                          Année scolaire

                        </label>

                        <select
                          value={
                            configurationForm.academic_year
                          }
                          onChange={(event) =>
                            setConfigurationForm({
                              ...configurationForm,
                              academic_year:
                                event.target.value,
                            })
                          }
                          disabled={
                            savingConfiguration ||
                            loadingAcademicYears
                          }
                          className="
                            w-full
                            rounded-xl
                            border
                            border-gray-300
                            bg-white
                            px-4
                            py-3
                            outline-none
                            transition
                            focus:border-[#6214BE]
                            focus:ring-2
                            focus:ring-[#6214BE]/10
                          "
                        >

                          <option value="">
                            Sélectionner une année
                          </option>

                          {academicYears.map(
                            (year) => (

                              <option
                                key={year.id}
                                value={year.id}
                              >

                                {year.name}

                                {year.is_active
                                  ? " — Année active"
                                  : ""}

                              </option>

                            )
                          )}

                        </select>

                      </div>


                      {/* CLASSE */}

                      <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">

                          Classe

                        </label>

                        <select
                          value={
                            configurationForm.classroom
                          }
                          onChange={(event) =>
                            setConfigurationForm({
                              ...configurationForm,
                              classroom:
                                event.target.value,
                            })
                          }
                          disabled={
                            savingConfiguration ||
                            loadingClassrooms
                          }
                          className="
                            w-full
                            rounded-xl
                            border
                            border-gray-300
                            bg-white
                            px-4
                            py-3
                            outline-none
                            transition
                            focus:border-[#6214BE]
                            focus:ring-2
                            focus:ring-[#6214BE]/10
                          "
                        >

                          <option value="">
                            Sélectionner une classe
                          </option>

                          {classrooms.map(
                            (classroom) => (

                              <option
                                key={classroom.id}
                                value={classroom.id}
                              >

                                {classroom.name}

                                {classroom.classroom_level_name
                                  ? ` — ${classroom.classroom_level_name}`
                                  : ""}

                              </option>

                            )
                          )}

                        </select>

                      </div>


                      {/* COEFFICIENT */}

                      <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">

                          Coefficient

                        </label>

                        <input
                          type="number"
                          min="0.01"
                          max="999.99"
                          step="0.01"
                          inputMode="decimal"
                          value={
                            configurationForm.coefficient
                          }
                          onChange={(event) =>
                            setConfigurationForm({
                              ...configurationForm,
                              coefficient:
                                event.target.value,
                            })
                          }
                          disabled={
                            savingConfiguration
                          }
                          className="
                            w-full
                            rounded-xl
                            border
                            border-gray-300
                            bg-white
                            px-4
                            py-3
                            outline-none
                            transition
                            focus:border-[#6214BE]
                            focus:ring-2
                            focus:ring-[#6214BE]/10
                          "
                        />

                      </div>


                      {/* NOTE DE PASSAGE */}

                      <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">

                          Note de passage

                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          inputMode="decimal"
                          value={
                            configurationForm.pass_mark
                          }
                          onChange={(event) =>
                            setConfigurationForm({
                              ...configurationForm,
                              pass_mark:
                                event.target.value,
                            })
                          }
                          disabled={
                            savingConfiguration
                          }
                          className="
                            w-full
                            rounded-xl
                            border
                            border-gray-300
                            bg-white
                            px-4
                            py-3
                            outline-none
                            transition
                            focus:border-[#6214BE]
                            focus:ring-2
                            focus:ring-[#6214BE]/10
                          "
                        />

                      </div>


                      {/* BOUTONS */}

                      <div className="flex gap-3 pt-2">

                        {editingConfiguration && (

                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={
                              savingConfiguration
                            }
                            className="
                              flex-1
                              rounded-xl
                              border
                              border-gray-300
                              bg-white
                              px-4
                              py-3
                              font-medium
                              text-gray-700
                              transition
                              hover:bg-gray-100
                            "
                          >

                            Annuler

                          </button>

                        )}


                        <button
                          type="button"
                          onClick={
                            handleSaveConfiguration
                          }
                          disabled={
                            savingConfiguration
                          }
                          className="
                            flex
                            flex-1
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-[#6214BE]
                            px-4
                            py-3
                            font-medium
                            text-white
                            transition
                            hover:bg-[#4d0fa0]
                            disabled:cursor-not-allowed
                            disabled:bg-gray-400
                          "
                        >

                          {savingConfiguration && (

                            <Loader2
                              size={17}
                              className="animate-spin"
                            />

                          )}

                          {savingConfiguration
                            ? "Enregistrement..."
                            : editingConfiguration
                              ? "Modifier"
                              : "Enregistrer"}

                        </button>

                      </div>

                    </div>

                  </div>


                  {/* ================================================== */}
                  {/* CONFIGURATIONS EXISTANTES */}
                  {/* ================================================== */}

                  <div>

                    <div className="mb-4">

                      <h3 className="font-semibold text-gray-900">

                        Configurations existantes

                      </h3>

                      <p className="mt-1 text-sm text-gray-500">

                        Paramètres de cette matière par
                        classe et année scolaire.

                      </p>

                    </div>


                    {loadingConfigurations ? (

                      <div className="flex min-h-[250px] items-center justify-center rounded-2xl border">

                        <div className="flex items-center gap-2 text-sm text-gray-500">

                          <Loader2
                            size={18}
                            className="animate-spin"
                          />

                          Chargement...

                        </div>

                      </div>

                    ) : classroomSubjects.length === 0 ? (

                      <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border bg-gray-50 p-6 text-center">

                        <Settings2
                          size={32}
                          className="mb-3 text-gray-300"
                        />

                        <p className="font-medium text-gray-700">

                          Aucune configuration

                        </p>

                        <p className="mt-1 text-sm text-gray-500">

                          Configurez cette matière pour
                          commencer à l'utiliser.

                        </p>

                      </div>

                    ) : (

                      <div className="overflow-hidden rounded-2xl border">

                        <div className="max-h-[450px] overflow-y-auto">

                          <table className="w-full">

                            <thead className="sticky top-0 bg-gray-50">

                              <tr className="text-left text-xs font-semibold uppercase text-gray-500">

                                <th className="px-4 py-3">
                                  Année
                                </th>

                                <th className="px-4 py-3">
                                  Classe
                                </th>

                                <th className="px-4 py-3">
                                  Coef.
                                </th>

                                <th className="px-4 py-3">
                                  Passage
                                </th>

                                <th className="px-4 py-3 text-right">
                                  Actions
                                </th>

                              </tr>

                            </thead>


                            <tbody>

                              {classroomSubjects.map(
                                (configuration) => (

                                  <tr
                                    key={
                                      configuration.id
                                    }
                                    className="
                                      border-t
                                      hover:bg-gray-50
                                    "
                                  >

                                    <td className="px-4 py-3 text-sm">

                                      {
                                        configuration.academic_year_name
                                      }

                                    </td>


                                    <td className="px-4 py-3">

                                      <span className="font-medium text-gray-800">

                                        {
                                          configuration.classroom_name
                                        }

                                      </span>

                                    </td>


                                    <td className="px-4 py-3">

                                      <span className="rounded-full bg-[#6214BE]/10 px-2.5 py-1 text-xs font-semibold text-[#6214BE]">

                                        {formatCoefficient(
                                          configuration.coefficient
                                        )}

                                      </span>

                                    </td>


                                    <td className="px-4 py-3 text-sm text-gray-600">

                                      {
                                        configuration.pass_mark
                                      }

                                    </td>


                                    <td className="px-4 py-3 text-right">

                                      <div className="flex justify-end gap-2">

                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleEditConfiguration(
                                              configuration
                                            )
                                          }
                                          className="
                                            rounded-lg
                                            p-2
                                            text-gray-500
                                            transition
                                            hover:bg-[#6214BE]/10
                                            hover:text-[#6214BE]
                                          "
                                          title="Modifier"
                                        >

                                          <Pencil
                                            size={16}
                                          />

                                        </button>


                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleDeleteConfiguration(
                                              configuration.id
                                            )
                                          }
                                          disabled={
                                            deletingConfigurationId ===
                                            configuration.id
                                          }
                                          className="
                                            rounded-lg
                                            p-2
                                            text-red-500
                                            transition
                                            hover:bg-red-50
                                            disabled:opacity-50
                                          "
                                          title="Supprimer"
                                        >

                                          {deletingConfigurationId ===
                                          configuration.id ? (

                                            <Loader2
                                              size={16}
                                              className="animate-spin"
                                            />

                                          ) : (

                                            <Trash2
                                              size={16}
                                            />

                                          )}

                                        </button>

                                      </div>

                                    </td>

                                  </tr>

                                )
                              )}

                            </tbody>

                          </table>

                        </div>

                      </div>

                    )}

                  </div>

                </div>

              </div>


              {/* ================================================== */}
              {/* MODAL FOOTER */}
              {/* ================================================== */}

              <div className="flex justify-end border-t bg-gray-50 px-6 py-4">

                <button
                  type="button"
                  onClick={closeConfiguration}
                  disabled={savingConfiguration}
                  className="
                    rounded-xl
                    border
                    border-gray-300
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-gray-700
                    transition
                    hover:bg-gray-100
                  "
                >

                  Fermer

                </button>

              </div>

            </div>

          </div>

        )}

    </div>

  );

}