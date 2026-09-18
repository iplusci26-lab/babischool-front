"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  X,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

// ==========================================================
// TYPES
// ==========================================================

interface Classroom {
  id: string | number;
  name: string;
}

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  student_number?: string;
  classroom_name?: string;
  classroom?: {
    id?: string | number;
    name?: string;
  };
}

interface NewConversationModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

interface StudentsResponse {
  // Format actuel de ton API
  data?: Student[];
  total_E?: number;

  // Format DRF paginé
  results?: Student[];
  count?: number;

  next?: string | null;
  previous?: string | null;
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function NewConversationModal({
  onClose,
  onSuccess,
}: NewConversationModalProps) {
  const router = useRouter();

  // ========================================================
  // STATE
  // ========================================================

  const [loading, setLoading] =
    useState(false);

  const [loadingStudents, setLoadingStudents] =
    useState(false);

  const [loadingClassrooms, setLoadingClassrooms] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [students, setStudents] =
    useState<Student[]>([]);

  const [classrooms, setClassrooms] =
    useState<Classroom[]>([]);

  const [selectedClassroom, setSelectedClassroom] =
    useState<string>("");

  const [page, setPage] =
    useState(1);

  const pageSize = 10;

  const [totalStudents, setTotalStudents] =
    useState(0);

  // ========================================================
  // LOAD CLASSROOMS
  // ========================================================

  const loadClassrooms = useCallback(
    async () => {
      try {
        setLoadingClassrooms(true);

        const response =
          await api.get(
            "/students/classrooms/"
          );

        const payload =
          response.data;

        let loadedClassrooms: Classroom[] =
          [];

        // API retourne directement un tableau
        if (Array.isArray(payload)) {
          loadedClassrooms = payload;
        }

        // Format { data: [...] }
        else if (
          Array.isArray(payload?.data)
        ) {
          loadedClassrooms =
            payload.data;
        }

        // Format DRF { results: [...] }
        else if (
          Array.isArray(payload?.results)
        ) {
          loadedClassrooms =
            payload.results;
        }

        setClassrooms(
          loadedClassrooms
        );
      } catch (error) {
        console.error(
          "Erreur chargement classes :",
          error
        );

        setClassrooms([]);
      } finally {
        setLoadingClassrooms(false);
      }
    },
    []
  );

  // ========================================================
  // LOAD STUDENTS
  // ========================================================

  const loadStudents = useCallback(
    async () => {
      /*
       * IMPORTANT :
       * Aucun appel /students/ tant qu'une
       * classe n'a pas été sélectionnée.
       */
      if (!selectedClassroom) {
        setStudents([]);
        setTotalStudents(0);
        return;
      }

      try {
        setLoadingStudents(true);

        const response =
          await api.get<StudentsResponse>(
            "/students/",
            {
              params: {
                search:
                  search.trim() ||
                  undefined,

                classroom_id:
                  selectedClassroom,

                page,

                page_size:
                  pageSize,
              },
            }
          );

        const payload =
          response.data;

        let loadedStudents: Student[] =
          [];

        // --------------------------------------------------
        // FORMAT ACTUEL
        // {
        //   data: [...],
        //   total_E: 50
        // }
        // --------------------------------------------------

        if (
          Array.isArray(
            payload?.data
          )
        ) {
          loadedStudents =
            payload.data;
        }

        // --------------------------------------------------
        // FORMAT DRF
        // {
        //   results: [...],
        //   count: 50
        // }
        // --------------------------------------------------

        else if (
          Array.isArray(
            payload?.results
          )
        ) {
          loadedStudents =
            payload.results;
        }

        setStudents(
          loadedStudents
        );

        /*
         * Priorité au count DRF.
         * Sinon on utilise total_E de ton API.
         */
        const total =
          payload?.count ??
          payload?.total_E ??
          0;

        setTotalStudents(
          Number(total)
        );
      } catch (error) {
        console.error(
          "Erreur chargement élèves :",
          error
        );

        setStudents([]);
        setTotalStudents(0);
      } finally {
        setLoadingStudents(false);
      }
    },
    [
      search,
      selectedClassroom,
      page,
    ]
  );

  // ========================================================
  // INITIAL LOAD
  // ========================================================

  useEffect(() => {
    loadClassrooms();
  }, [loadClassrooms]);

  // ========================================================
  // LOAD STUDENTS WHEN FILTERS CHANGE
  // ========================================================

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // ========================================================
  // RESET PAGE WHEN FILTER CHANGES
  // ========================================================

  useEffect(() => {
    setPage(1);
  }, [
    search,
    selectedClassroom,
  ]);

  // ========================================================
  // CLASSROOM CHANGE
  // ========================================================

  const handleClassroomChange = (
    value: string
  ) => {
    setSelectedClassroom(value);

    /*
     * On vide immédiatement les anciens élèves
     * pour éviter d'afficher les élèves de
     * l'ancienne classe pendant le chargement.
     */
    setStudents([]);

    setTotalStudents(0);

    setPage(1);
  };

  // ========================================================
  // SEARCH CHANGE
  // ========================================================

  const handleSearchChange = (
    value: string
  ) => {
    setSearch(value);

    /*
     * Une nouvelle recherche doit toujours
     * recommencer à la page 1.
     */
    setPage(1);
  };

  // ========================================================
  // PAGINATION
  // ========================================================

  const totalPages =
    totalStudents > 0
      ? Math.ceil(
          totalStudents /
            pageSize
        )
      : 0;

  const canGoPrevious =
    page > 1;

  const canGoNext =
    page < totalPages;

  const goToPreviousPage =
    () => {
      if (
        !canGoPrevious ||
        loadingStudents
      ) {
        return;
      }

      setPage(
        (currentPage) =>
          currentPage - 1
      );
    };

  const goToNextPage =
    () => {
      if (
        !canGoNext ||
        loadingStudents
      ) {
        return;
      }

      setPage(
        (currentPage) =>
          currentPage + 1
      );
    };

  // ========================================================
  // DISPLAY RANGE
  // ========================================================

  const firstDisplayedStudent =
    totalStudents === 0
      ? 0
      : (page - 1) *
          pageSize +
        1;

  const lastDisplayedStudent =
    Math.min(
      page * pageSize,
      totalStudents
    );

  // ========================================================
  // START CONVERSATION
  // ========================================================

  const startConversation =
    async (
      studentId: string
    ) => {
      try {
        setLoading(true);

        const response =
          await api.post(
            "/messaging/start/",
            {
              student_id:
                studentId,
            }
          );

        console.log(
          "Conversation créée :",
          response.data
        );

        onSuccess?.();

        router.push(
          `/messaging/${response.data.conversation_id}`
        );
      } catch (error) {
        console.error(
          "Erreur création conversation :",
          error
        );

        alert(
          "Erreur lors de la création de la conversation"
        );
      } finally {
        setLoading(false);
      }
    };

  // ========================================================
  // RENDER
  // ========================================================

  return (
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
        backdrop-blur-sm
      "
    >
      <div
        className="
          flex
          max-h-[90vh]
          w-full
          max-w-xl
          flex-col
          overflow-hidden
          rounded-3xl
          bg-white
          shadow-2xl
        "
      >
        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            p-6
          "
        >
          <div>
            <h2
              className="
                text-2xl
                font-bold
                text-gray-900
              "
            >
              Nouveau message
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Sélectionnez un élève
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              transition
              hover:bg-gray-100
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* ================================================== */}
        {/* FILTERS */}
        {/* ================================================== */}

        <div
          className="
            shrink-0
            space-y-4
            border-b
            p-5
          "
        >
          {/* ------------------------------------------------ */}
          {/* CLASSROOM */}
          {/* ------------------------------------------------ */}

          <div>
            <label
              htmlFor="classroom-filter"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Classe
            </label>

            <select
              id="classroom-filter"
              value={selectedClassroom}
              onChange={(e) =>
                handleClassroomChange(
                  e.target.value
                )
              }
              disabled={
                loadingClassrooms
              }
              className="
                w-full
                rounded-2xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                text-sm
                text-gray-700
                outline-none
                transition
                focus:border-indigo-500
                focus:ring-2
                focus:ring-indigo-500/20
                disabled:cursor-not-allowed
                disabled:bg-gray-50
              "
            >
              <option value="">
                {loadingClassrooms
                  ? "Chargement des classes..."
                  : "Sélectionner une classe"}
              </option>

              {classrooms.map(
                (classroom) => (
                  <option
                    key={
                      classroom.id
                    }
                    value={String(
                      classroom.id
                    )}
                  >
                    {classroom.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* ------------------------------------------------ */}
          {/* SEARCH */}
          {/* ------------------------------------------------ */}

          <div>
            <label
              htmlFor="student-search"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Rechercher un élève
            </label>

            <div
              className="
                relative
              "
            >
              <Search
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                id="student-search"
                type="text"
                value={search}
                onChange={(e) =>
                  handleSearchChange(
                    e.target.value
                  )
                }
                disabled={
                  !selectedClassroom
                }
                placeholder={
                  selectedClassroom
                    ? "Nom, prénom ou matricule..."
                    : "Sélectionnez d'abord une classe"
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  border-gray-200
                  py-3
                  pl-11
                  pr-4
                  text-sm
                  outline-none
                  transition
                  focus:border-indigo-500
                  focus:ring-2
                  focus:ring-indigo-500/20
                  disabled:cursor-not-allowed
                  disabled:bg-gray-50
                  disabled:text-gray-400
                "
              />
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* STUDENTS CONTENT */}
        {/* ================================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
          "
        >
          {/* ================================================= */}
          {/* NO CLASS SELECTED */}
          {/* ================================================= */}

          {!selectedClassroom ? (
            <div
              className="
                flex
                min-h-[300px]
                flex-col
                items-center
                justify-center
                px-6
                text-center
              "
            >
              <div
                className="
                  mb-4
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-indigo-50
                "
              >
                <User
                  size={28}
                  className="
                    text-indigo-500
                  "
                />
              </div>

              <h3
                className="
                  text-base
                  font-semibold
                  text-gray-800
                "
              >
                Sélectionnez une classe
              </h3>

              <p
                className="
                  mt-1
                  max-w-sm
                  text-sm
                  leading-6
                  text-gray-500
                "
              >
                Choisissez une classe
                ci-dessus pour afficher
                les élèves et démarrer
                une conversation.
              </p>
            </div>
          ) : loadingStudents ? (
            /* ================================================= */
            /* LOADING */
            /* ================================================= */

            <div
              className="
                flex
                min-h-[300px]
                flex-col
                items-center
                justify-center
              "
            >
              <div
                className="
                  h-8
                  w-8
                  animate-spin
                  rounded-full
                  border-2
                  border-gray-200
                  border-t-indigo-600
                "
              />

              <p
                className="
                  mt-3
                  text-sm
                  text-gray-500
                "
              >
                Chargement des élèves...
              </p>
            </div>
          ) : students.length === 0 ? (
            /* ================================================= */
            /* NO STUDENT */
            /* ================================================= */

            <div
              className="
                flex
                min-h-[300px]
                flex-col
                items-center
                justify-center
                px-6
                text-center
              "
            >
              <div
                className="
                  mb-3
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-100
                "
              >
                <User
                  size={24}
                  className="
                    text-gray-400
                  "
                />
              </div>

              <p
                className="
                  text-sm
                  font-medium
                  text-gray-600
                "
              >
                Aucun élève trouvé
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-400
                "
              >
                Essayez de modifier
                votre recherche.
              </p>
            </div>
          ) : (
            /* ================================================= */
            /* STUDENTS LIST */
            /* ================================================= */

            students.map(
              (student) => (
                <button
                  key={student.id}
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    startConversation(
                      student.id
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-4
                    border-b
                    p-4
                    text-left
                    transition
                    hover:bg-gray-50
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {/* AVATAR */}

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-indigo-100
                    "
                  >
                    <User
                      size={20}
                      className="
                        text-indigo-600
                      "
                    />
                  </div>

                  {/* STUDENT INFO */}

                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    <h3
                      className="
                        truncate
                        font-semibold
                        text-gray-900
                      "
                    >
                      {
                        student.first_name
                      }{" "}
                      {
                        student.last_name
                      }
                    </h3>

                    {student.student_number && (
                      <p
                        className="
                          mt-0.5
                          text-sm
                          text-gray-500
                        "
                      >
                        {
                          student.student_number
                        }
                      </p>
                    )}

                    {student.classroom_name && (
                      <p
                        className="
                          mt-0.5
                          text-xs
                          text-gray-400
                        "
                      >
                        {
                          student.classroom_name
                        }
                      </p>
                    )}
                  </div>

                  {/* ARROW */}

                  <ChevronRight
                    size={18}
                    className="
                      shrink-0
                      text-gray-300
                    "
                  />
                </button>
              )
            )
          )}
        </div>

        {/* ================================================== */}
        {/* PAGINATION */}
        {/* ================================================== */}

        {selectedClassroom && (
          <div
            className="
              flex
              shrink-0
              items-center
              justify-between
              border-t
              bg-gray-50
              px-5
              py-3
            "
          >
            {/* COUNT */}

            <div
              className="
                text-xs
                text-gray-500
              "
            >
              {totalStudents > 0 ? (
                <>
                  {firstDisplayedStudent}
                  –
                  {lastDisplayedStudent}{" "}
                  sur{" "}
                  {totalStudents}
                </>
              ) : (
                "0 élève"
              )}
            </div>

            {/* NAVIGATION */}

            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <button
                type="button"
                onClick={
                  goToPreviousPage
                }
                disabled={
                  !canGoPrevious ||
                  loadingStudents
                }
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  text-gray-600
                  transition
                  hover:bg-gray-100
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                title="Page précédente"
              >
                <ChevronLeft
                  size={18}
                />
              </button>

              <span
                className="
                  min-w-[80px]
                  text-center
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Page {page}

                {totalPages > 0 &&
                  ` / ${totalPages}`}
              </span>

              <button
                type="button"
                onClick={
                  goToNextPage
                }
                disabled={
                  !canGoNext ||
                  loadingStudents
                }
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  text-gray-600
                  transition
                  hover:bg-gray-100
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                title="Page suivante"
              >
                <ChevronRight
                  size={18}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}