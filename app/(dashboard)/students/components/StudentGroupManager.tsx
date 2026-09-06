"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  ChevronDown,
  Loader2,
  Search,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";

import { toast } from "sonner";

import { api } from "@/lib/api";

import type {
  Classroom,
  ClassroomGroup,
  ClassroomGroupMembersResponse,
  Student,
  StudentGroupMember,
} from "../types";

// ==========================================================
// TYPES
// ==========================================================

type UUID = string;

interface PaginatedResponse<T> {
  data?: T[];
  results?: T[];
}

interface StudentsResponse {
  data?: Student[];
  results?: Student[];
}

interface StudentGroupManagerProps {
  classrooms: Classroom[];

  /**
   * IDs des élèves sélectionnés depuis la table principale.
   */
  selectedStudents?: UUID[];

  /**
   * Synchronise la sélection avec le parent.
   */
  onSelectionChange?: (
    studentIds: UUID[]
  ) => void;
}

// ==========================================================
// HELPERS
// ==========================================================

function normalizeIds(
  ids: UUID[]
): UUID[] {
  return [
    ...new Set(
      ids.filter(
        (id) =>
          typeof id === "string" &&
          id.trim().length > 0
      )
    ),
  ];
}

function areArraysEqual(
  first: UUID[],
  second: UUID[]
): boolean {
  if (
    first.length !==
    second.length
  ) {
    return false;
  }

  const firstSet =
    new Set(first);

  return second.every(
    (value) =>
      firstSet.has(value)
  );
}

function getResponseList<T>(
  data:
    | T[]
    | PaginatedResponse<T>
    | undefined
    | null
): T[] {
  if (!data) {
    return [];
  }

  if (
    Array.isArray(data)
  ) {
    return data;
  }

  if (
    Array.isArray(
      data.data
    )
  ) {
    return data.data;
  }

  if (
    Array.isArray(
      data.results
    )
  ) {
    return data.results;
  }

  return [];
}

function getStudentName(
  student:
    | Student
    | StudentGroupMember
): string {
  if (
    student.display_name
  ) {
    return student.display_name;
  }

  return [
    student.last_name,
    student.first_name,
  ]
    .filter(Boolean)
    .join(" ");
}

function getInitials(
  student:
    | Student
    | StudentGroupMember
): string {
  const first =
    student.first_name
      ?.charAt(0)
      ?.toUpperCase() ??
    "";

  const last =
    student.last_name
      ?.charAt(0)
      ?.toUpperCase() ??
    "";

  return (
    `${first}${last}` ||
    "?"
  );
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function StudentGroupManager({
  classrooms,
  selectedStudents = [],
  onSelectionChange,
}: StudentGroupManagerProps) {

  // ========================================================
  // STATE
  // ========================================================

  const [
    selectedClassroom,
    setSelectedClassroom,
  ] = useState<
    UUID | null
  >(null);


  const [
    groups,
    setGroups,
  ] = useState<
    ClassroomGroup[]
  >([]);


  const [
    selectedGroup,
    setSelectedGroup,
  ] = useState<
    ClassroomGroup | null
  >(null);


  const [
    members,
    setMembers,
  ] = useState<
    StudentGroupMember[]
  >([]);


  const [
    students,
    setStudents,
  ] = useState<
    Student[]
  >([]);


  const [
    loadingGroups,
    setLoadingGroups,
  ] = useState(false);


  const [
    loadingMembers,
    setLoadingMembers,
  ] = useState(false);


  const [
    loadingStudents,
    setLoadingStudents,
  ] = useState(false);


  const [
    updating,
    setUpdating,
  ] = useState(false);


  const [
    search,
    setSearch,
  ] = useState("");


  const [
    selectedAvailableStudents,
    setSelectedAvailableStudents,
  ] = useState<
    UUID[]
  >([]);


  const [
    selectedMembers,
    setSelectedMembers,
  ] = useState<
    UUID[]
  >([]);


  // ========================================================
  // SAFE VALUES
  // ========================================================

  const safeSelectedClassroom =
    selectedClassroom &&
    selectedClassroom.trim()
      ? selectedClassroom
      : null;


  const safeSelectedGroupId =
    selectedGroup?.id &&
    String(
      selectedGroup.id
    ).trim()
      ? String(
          selectedGroup.id
        )
      : null;


  // ========================================================
  // EXTERNAL SELECTION
  // ========================================================

  const validSelectedStudents =
    useMemo(
      () =>
        normalizeIds(
          selectedStudents
        ),
      [
        selectedStudents,
      ]
    );


  // ========================================================
  // LOAD GROUPS
  // ========================================================

  const loadGroups =
    useCallback(
      async (
        classroomId: UUID
      ): Promise<
        ClassroomGroup[]
      > => {

        try {

          setLoadingGroups(
            true
          );


          const response =
            await api.get<
              | ClassroomGroup[]
              | PaginatedResponse<ClassroomGroup>
            >(
              "/students/classroom-groups/",
              {
                params: {
                  classroom:
                    classroomId,

                  is_active:
                    true,
                },
              }
            );


          const data =
            getResponseList<
              ClassroomGroup
            >(
              response.data
            );


          setGroups(
            data
          );


          return data;

        } catch (
          error
        ) {

          console.error(
            "Erreur chargement groupes:",
            error
          );


          toast.error(
            "Impossible de charger les groupes."
          );


          setGroups(
            []
          );


          return [];

        } finally {

          setLoadingGroups(
            false
          );

        }
      },
      []
    );


  // ========================================================
  // LOAD STUDENTS
  // ========================================================

  const loadStudents =
    useCallback(
      async (
        classroomId: UUID
      ): Promise<
        Student[]
      > => {

        try {

          setLoadingStudents(
            true
          );


          const response =
            await api.get<
              | Student[]
              | StudentsResponse
            >(
              "/students/",
              {
                params: {
                  classroom_id:
                    classroomId,

                  page_size:
                    1000,
                },
              }
            );


          const data =
            getResponseList<
              Student
            >(
              response.data
            );


          setStudents(
            data
          );


          return data;

        } catch (
          error
        ) {

          console.error(
            "Erreur chargement élèves:",
            error
          );


          toast.error(
            "Impossible de charger les élèves."
          );


          setStudents(
            []
          );


          return [];

        } finally {

          setLoadingStudents(
            false
          );

        }
      },
      []
    );


  // ========================================================
  // LOAD MEMBERS
  // ========================================================

  const loadMembers =
    useCallback(
      async (
        groupId: UUID
      ): Promise<
        StudentGroupMember[]
      > => {

        try {

          setLoadingMembers(
            true
          );


          const response =
            await api.get<
              ClassroomGroupMembersResponse
            >(
              `/students/classroom-groups/${groupId}/members/`
            );


          const data =
            Array.isArray(
              response.data.data
            )
              ? response.data.data
              : [];


          setMembers(
            data
          );


          setSelectedMembers(
            []
          );


          return data;

        } catch (
          error
        ) {

          console.error(
            "Erreur chargement membres:",
            error
          );


          toast.error(
            "Impossible de charger les membres du groupe."
          );


          setMembers(
            []
          );


          setSelectedMembers(
            []
          );


          return [];

        } finally {

          setLoadingMembers(
            false
          );

        }
      },
      []
    );


  // ========================================================
  // LOAD DATA WHEN CLASSROOM CHANGES
  // ========================================================

  useEffect(
    () => {

      if (
        safeSelectedClassroom ===
        null
      ) {

        setGroups(
          []
        );

        setStudents(
          []
        );

        setSelectedGroup(
          null
        );

        setMembers(
          []
        );

        setSelectedMembers(
          []
        );

        setSelectedAvailableStudents(
          []
        );

        return;
      }


      setSelectedGroup(
        null
      );

      setMembers(
        []
      );

      setSelectedMembers(
        []
      );


      void loadGroups(
        safeSelectedClassroom
      );


      void loadStudents(
        safeSelectedClassroom
      );

    },
    [
      safeSelectedClassroom,
      loadGroups,
      loadStudents,
    ]
  );


  // ========================================================
  // LOAD MEMBERS WHEN GROUP CHANGES
  // ========================================================

  useEffect(
    () => {

      if (
        safeSelectedGroupId ===
        null
      ) {

        setMembers(
          []
        );

        setSelectedMembers(
          []
        );

        return;
      }


      void loadMembers(
        safeSelectedGroupId
      );

    },
    [
      safeSelectedGroupId,
      loadMembers,
    ]
  );


  // ========================================================
  // MEMBER IDS
  // ========================================================

  const memberIds =
    useMemo(
      () =>
        new Set<UUID>(
          members
            .map(
              (
                student
              ) =>
                String(
                  student.id
                )
            )
            .filter(
              (
                id
              ) =>
                id.trim().length >
                0
            )
        ),
      [
        members,
      ]
    );


  // ========================================================
  // AVAILABLE STUDENTS
  // ========================================================

  const availableStudents =
    useMemo(
      () =>
        students.filter(
          (
            student
          ) =>
            !memberIds.has(
              String(
                student.id
              )
            )
        ),
      [
        students,
        memberIds,
      ]
    );


  // ========================================================
  // FILTER STUDENTS
  // ========================================================

  const filteredStudents =
    useMemo(
      () => {

        const searchValue =
          search
            .trim()
            .toLowerCase();


        if (
          !searchValue
        ) {
          return availableStudents;
        }


        return availableStudents.filter(
          (
            student
          ) => {

            const firstName =
              student.first_name
                ?.toLowerCase() ??
              "";


            const lastName =
              student.last_name
                ?.toLowerCase() ??
              "";


            const studentNumber =
              student.student_number
                ?.toLowerCase() ??
              "";


            const displayName =
              student.display_name
                ?.toLowerCase() ??
              "";


            return (
              firstName.includes(
                searchValue
              ) ||

              lastName.includes(
                searchValue
              ) ||

              studentNumber.includes(
                searchValue
              ) ||

              displayName.includes(
                searchValue
              )
            );

          }
        );

      },
      [
        availableStudents,
        search,
      ]
    );


  // ========================================================
  // AVAILABLE STUDENT IDS
  // ========================================================

  const availableStudentIds =
    useMemo(
      () =>
        new Set<UUID>(
          availableStudents.map(
            (
              student
            ) =>
              String(
                student.id
              )
          )
        ),
      [
        availableStudents,
      ]
    );


  // ========================================================
  // SYNC EXTERNAL SELECTION
  // ========================================================

  useEffect(
    () => {

      const next =
        validSelectedStudents.filter(
          (
            id
          ) =>
            availableStudentIds.has(
              id
            )
        );


      setSelectedAvailableStudents(
        (
          current
        ) => {

          if (
            areArraysEqual(
              current,
              next
            )
          ) {
            return current;
          }

          return next;

        }
      );

    },
    [
      validSelectedStudents,
      availableStudentIds,
    ]
  );


  // ========================================================
  // CLEAN AVAILABLE SELECTION
  // ========================================================

  useEffect(
    () => {

      setSelectedAvailableStudents(
        (
          current
        ) => {

          const next =
            current.filter(
              (
                id
              ) =>
                availableStudentIds.has(
                  id
                )
            );


          if (
            areArraysEqual(
              current,
              next
            )
          ) {
            return current;
          }


          onSelectionChange?.(
            next
          );


          return next;

        }
      );

    },
    [
      availableStudentIds,
      onSelectionChange,
    ]
  );


  // ========================================================
  // TOGGLE AVAILABLE STUDENT
  // ========================================================

  const toggleStudent =
    useCallback(
      (
        studentId:
          UUID
      ) => {

        if (
          !studentId ||
          !studentId.trim()
        ) {
          return;
        }


        setSelectedAvailableStudents(
          (
            current
          ) => {

            const next =
              current.includes(
                studentId
              )
                ? current.filter(
                    (
                      id
                    ) =>
                      id !==
                      studentId
                  )
                : [
                    ...current,
                    studentId,
                  ];


            onSelectionChange?.(
              next
            );


            return next;

          }
        );

      },
      [
        onSelectionChange,
      ]
    );


  // ========================================================
  // TOGGLE MEMBER
  // ========================================================

  const toggleMember =
    useCallback(
      (
        studentId:
          UUID
      ) => {

        if (
          !studentId ||
          !studentId.trim()
        ) {
          return;
        }


        setSelectedMembers(
          (
            current
          ) =>
            current.includes(
              studentId
            )
              ? current.filter(
                  (
                    id
                  ) =>
                    id !==
                    studentId
                )
              : [
                  ...current,
                  studentId,
                ]
        );

      },
      []
    );


  // ========================================================
  // TOGGLE ALL AVAILABLE STUDENTS
  // ========================================================

  const toggleAllStudents =
    useCallback(
      () => {

        const ids =
          normalizeIds(
            filteredStudents.map(
              (
                student
              ) =>
                String(
                  student.id
                )
            )
          );


        const allSelected =
          ids.length >
            0 &&
          ids.every(
            (
              id
            ) =>
              selectedAvailableStudents.includes(
                id
              )
          );


        const next =
          allSelected
            ? selectedAvailableStudents.filter(
                (
                  id
                ) =>
                  !ids.includes(
                    id
                  )
              )
            : normalizeIds(
                [
                  ...selectedAvailableStudents,
                  ...ids,
                ]
              );


        setSelectedAvailableStudents(
          next
        );


        onSelectionChange?.(
          next
        );

      },
      [
        filteredStudents,
        selectedAvailableStudents,
        onSelectionChange,
      ]
    );


  // ========================================================
  // TOGGLE ALL MEMBERS
  // ========================================================

  const toggleAllMembers =
    useCallback(
      () => {

        const ids =
          normalizeIds(
            members.map(
              (
                student
              ) =>
                String(
                  student.id
                )
            )
          );


        const allSelected =
          ids.length >
            0 &&
          ids.every(
            (
              id
            ) =>
              selectedMembers.includes(
                id
              )
          );


        setSelectedMembers(
          allSelected
            ? []
            : ids
        );

      },
      [
        members,
        selectedMembers,
      ]
    );


  // ========================================================
  // ADD STUDENTS
  // ========================================================

  const addStudents =
    useCallback(
      async () => {

        if (
          safeSelectedGroupId ===
          null
        ) {

          toast.error(
            "Veuillez sélectionner un groupe."
          );

          return;

        }


        const studentIds =
          normalizeIds(
            selectedAvailableStudents
          );


        if (
          studentIds.length ===
          0
        ) {

          toast.error(
            "Veuillez sélectionner au moins un élève."
          );

          return;

        }


        try {

          setUpdating(
            true
          );


          await api.post(
            "/students/classroom-groups/members/bulk-add/",
            {
              student_ids:
                studentIds,

              group_ids: [
                safeSelectedGroupId,
              ],
            }
          );


          toast.success(
            "Élèves ajoutés au groupe avec succès."
          );


          setSelectedAvailableStudents(
            []
          );


          onSelectionChange?.(
            []
          );


          await loadMembers(
            safeSelectedGroupId
          );

        } catch (
          error
        ) {

          console.error(
            "Erreur ajout élèves:",
            error
          );


          toast.error(
            "Impossible d'ajouter les élèves."
          );

        } finally {

          setUpdating(
            false
          );

        }

      },
      [
        safeSelectedGroupId,
        selectedAvailableStudents,
        onSelectionChange,
        loadMembers,
      ]
    );


  // ========================================================
  // REMOVE STUDENTS
  // ========================================================

  const removeStudents =
    useCallback(
      async () => {

        if (
          safeSelectedGroupId ===
          null
        ) {

          toast.error(
            "Veuillez sélectionner un groupe."
          );

          return;

        }


        const studentIds =
          normalizeIds(
            selectedMembers
          );


        if (
          studentIds.length ===
          0
        ) {

          toast.error(
            "Veuillez sélectionner au moins un élève."
          );

          return;

        }


        try {

          setUpdating(
            true
          );


          await api.post(
            "/students/classroom-groups/members/bulk-remove/",
            {
              student_ids:
                studentIds,

              group_ids: [
                safeSelectedGroupId,
              ],
            }
          );


          toast.success(
            "Élèves retirés du groupe avec succès."
          );


          setSelectedMembers(
            []
          );


          await loadMembers(
            safeSelectedGroupId
          );

        } catch (
          error
        ) {

          console.error(
            "Erreur retrait élèves:",
            error
          );


          toast.error(
            "Impossible de retirer les élèves."
          );

        } finally {

          setUpdating(
            false
          );

        }

      },
      [
        safeSelectedGroupId,
        selectedMembers,
        loadMembers,
      ]
    );


  // ========================================================
  // CLASSROOM CHANGE
  // ========================================================

  const handleClassroomChange =
    useCallback(
      (
        value:
          string
      ) => {

        if (
          !value
        ) {

          setSelectedClassroom(
            null
          );

          setSelectedGroup(
            null
          );

          setGroups(
            []
          );

          setMembers(
            []
          );

          setStudents(
            []
          );

          setSelectedAvailableStudents(
            []
          );

          setSelectedMembers(
            []
          );

          setSearch(
            ""
          );

          onSelectionChange?.(
            []
          );

          return;

        }


        const classroom =
          classrooms.find(
            (
              item
            ) =>
              String(
                item.id
              ) ===
              value
          );


        if (
          !classroom
        ) {

          console.error(
            "Classe introuvable:",
            value
          );

          return;

        }


        const classroomId =
          String(
            classroom.id
          );


        setSelectedClassroom(
          classroomId
        );


        setSelectedGroup(
          null
        );

        setGroups(
          []
        );

        setMembers(
          []
        );

        setStudents(
          []
        );

        setSelectedAvailableStudents(
          []
        );

        setSelectedMembers(
          []
        );

        setSearch(
          ""
        );

        onSelectionChange?.(
          []
        );

      },
      [
        classrooms,
        onSelectionChange,
      ]
    );


  // ========================================================
  // GROUP CHANGE
  // ========================================================

  const handleGroupChange =
    useCallback(
      (
        value:
          string
      ) => {

        if (
          !value
        ) {

          setSelectedGroup(
            null
          );

          setMembers(
            []
          );

          setSelectedMembers(
            []
          );

          return;

        }


        const group =
          groups.find(
            (
              item
            ) =>
              String(
                item.id
              ) ===
              value
          ) ??
          null;


        if (
          !group
        ) {

          console.error(
            "Groupe introuvable:",
            value
          );

          return;

        }


        setSelectedGroup(
          group
        );


        setMembers(
          []
        );

        setSelectedMembers(
          []
        );

      },
      [
        groups,
      ]
    );


  // ========================================================
  // RENDER
  // ========================================================

  return (
    <div className="space-y-6">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-sm
        "
      >

        <div
          className="
            flex
            flex-col
            gap-4
            p-6
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div className="flex items-center gap-4">

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-violet-100
                text-violet-700
              "
            >

              <Users
                size={24}
              />

            </div>


            <div>

              <h2
                className="
                  text-xl
                  font-bold
                  text-gray-900
                "
              >
                Gestion des groupes
              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                "
              >
                Organisez facilement les élèves
                et gérez les membres de chaque groupe.
              </p>

            </div>

          </div>


          {selectedGroup && (

            <div
              className="
                rounded-xl
                bg-violet-50
                px-4
                py-2
                text-sm
                font-medium
                text-violet-700
              "
            >
              Groupe :
              {" "}
              {selectedGroup.name}
            </div>

          )}

        </div>

      </div>


      {/* ================================================== */}
      {/* SELECTORS */}
      {/* ================================================== */}

      <div
        className="
          grid
          gap-5
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-5
          shadow-sm
          md:grid-cols-2
        "
      >

        {/* CLASSROOM */}

        <div>

          <label
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-gray-700
            "
          >
            Classe
          </label>


          <div className="relative">

            <select
              value={
                safeSelectedClassroom ??
                ""
              }
              onChange={
                (
                  event
                ) =>
                  handleClassroomChange(
                    event.target.value
                  )
              }
              className="
                w-full
                appearance-none
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                pr-10
                text-sm
                font-medium
                text-gray-700
                outline-none
                transition
                hover:border-violet-300
                focus:border-violet-500
                focus:ring-4
                focus:ring-violet-100
              "
            >

              <option value="">
                Sélectionner une classe
              </option>


              {classrooms.map(
                (
                  classroom
                ) => (

                  <option
                    key={
                      String(
                        classroom.id
                      )
                    }
                    value={
                      String(
                        classroom.id
                      )
                    }
                  >
                    {classroom.name}
                  </option>

                )
              )}

            </select>


            <ChevronDown
              size={18}
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

          </div>

        </div>


        {/* GROUP */}

        <div>

          <label
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-gray-700
            "
          >
            Groupe
          </label>


          <div className="relative">

            <select
              disabled={
                safeSelectedClassroom ===
                  null ||
                loadingGroups
              }
              value={
                safeSelectedGroupId ??
                ""
              }
              onChange={
                (
                  event
                ) =>
                  handleGroupChange(
                    event.target.value
                  )
              }
              className="
                w-full
                appearance-none
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                pr-10
                text-sm
                font-medium
                text-gray-700
                outline-none
                transition
                disabled:cursor-not-allowed
                disabled:bg-gray-100
                disabled:text-gray-400
                focus:border-violet-500
                focus:ring-4
                focus:ring-violet-100
              "
            >

              <option value="">
                {loadingGroups
                  ? "Chargement des groupes..."
                  : "Sélectionner un groupe"}
              </option>


              {groups.map(
                (
                  group
                ) => (

                  <option
                    key={
                      String(
                        group.id
                      )
                    }
                    value={
                      String(
                        group.id
                      )
                    }
                  >
                    {group.name}

                    {group.code
                      ? ` (${group.code})`
                      : ""}

                  </option>

                )
              )}

            </select>


            <ChevronDown
              size={18}
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

          </div>

        </div>

      </div>


      {/* ================================================== */}
      {/* EMPTY CLASSROOM */}
      {/* ================================================== */}

      {safeSelectedClassroom ===
        null && (

        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-gray-300
            bg-gray-50
            p-12
            text-center
          "
        >

          <div
            className="
              mx-auto
              mb-4
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-white
              shadow-sm
            "
          >

            <Users
              size={24}
              className="
                text-gray-400
              "
            />

          </div>


          <h3
            className="
              font-semibold
              text-gray-800
            "
          >
            Sélectionnez une classe
          </h3>


          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Choisissez une classe pour afficher
            les groupes et les élèves disponibles.
          </p>

        </div>

      )}


      {/* ================================================== */}
      {/* LOADING CLASSROOM DATA */}
      {/* ================================================== */}

      {safeSelectedClassroom !==
        null &&
        (
          loadingGroups ||
          loadingStudents
        ) && (

        <div
          className="
            flex
            items-center
            justify-center
            gap-3
            rounded-2xl
            border
            bg-white
            p-10
            text-gray-500
          "
        >

          <Loader2
            size={22}
            className="
              animate-spin
              text-violet-600
            "
          />

          Chargement des données de la classe...

        </div>

      )}


      {/* ================================================== */}
      {/* EMPTY GROUP */}
      {/* ================================================== */}

      {safeSelectedClassroom !==
        null &&
        safeSelectedGroupId ===
          null &&
        !loadingGroups &&
        !loadingStudents && (

          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-gray-300
              bg-gray-50
              p-12
              text-center
            "
          >

            <Users
              size={30}
              className="
                mx-auto
                mb-4
                text-gray-400
              "
            />


            <h3
              className="
                font-semibold
                text-gray-800
              "
            >
              Sélectionnez un groupe
            </h3>


            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Choisissez maintenant un groupe
              pour gérer ses membres.
            </p>

          </div>

        )}


      {/* ================================================== */}
      {/* GROUP MANAGEMENT */}
      {/* ================================================== */}

      {safeSelectedClassroom !==
        null &&
        selectedGroup &&
        !loadingStudents && (

        <div
          className="
            grid
            gap-6
            lg:grid-cols-2
          "
        >

          {/* ============================================== */}
          {/* AVAILABLE STUDENTS */}
          {/* ============================================== */}

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              bg-white
              shadow-sm
            "
          >

            <div
              className="
                border-b
                border-gray-100
                p-5
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >

                <div>

                  <h3
                    className="
                      font-semibold
                      text-gray-900
                    "
                  >
                    Élèves disponibles
                  </h3>


                  <p
                    className="
                      mt-1
                      text-sm
                      text-gray-500
                    "
                  >
                    {filteredStudents.length}
                    {" "}
                    élève
                    {filteredStudents.length >
                    1
                      ? "s"
                      : ""}
                    {" "}
                    disponible
                    {filteredStudents.length >
                    1
                      ? "s"
                      : ""}
                  </p>

                </div>


                <button
                  type="button"
                  onClick={
                    toggleAllStudents
                  }
                  className="
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-violet-700
                    transition
                    hover:bg-violet-50
                  "
                >
                  Tout sélectionner
                </button>

              </div>


              <div
                className="
                  relative
                  mt-4
                "
              >

                <Search
                  size={18}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />


                <input
                  value={search}
                  onChange={
                    (
                      event
                    ) =>
                      setSearch(
                        event.target.value
                      )
                  }
                  placeholder="Rechercher un élève..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    py-2.5
                    pl-10
                    pr-4
                    text-sm
                    outline-none
                    transition
                    focus:border-violet-500
                    focus:ring-4
                    focus:ring-violet-100
                  "
                />

              </div>

            </div>


            <div
              className="
                max-h-[500px]
                divide-y
                divide-gray-100
                overflow-y-auto
              "
            >

              {loadingStudents && (

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    p-10
                    text-gray-500
                  "
                >

                  <Loader2
                    size={20}
                    className="
                      animate-spin
                    "
                  />

                  Chargement...

                </div>

              )}


              {!loadingStudents &&
                filteredStudents.length ===
                  0 && (

                  <div
                    className="
                      p-10
                      text-center
                      text-sm
                      text-gray-500
                    "
                  >
                    Aucun élève disponible.
                  </div>

                )}


              {filteredStudents.map(
                (
                  student
                ) => {

                  const studentId =
                    String(
                      student.id
                    );

                  const isSelected =
                    selectedAvailableStudents.includes(
                      studentId
                    );


                  return (

                    <label
                      key={
                        studentId
                      }
                      className="
                        flex
                        cursor-pointer
                        items-center
                        gap-3
                        p-4
                        transition
                        hover:bg-violet-50/40
                      "
                    >

                      <input
                        type="checkbox"
                        checked={
                          isSelected
                        }
                        onChange={() =>
                          toggleStudent(
                            studentId
                          )
                        }
                        className="
                          h-4
                          w-4
                          cursor-pointer
                          accent-violet-600
                        "
                      />


                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-violet-100
                          text-sm
                          font-bold
                          text-violet-700
                        "
                      >
                        {getInitials(
                          student
                        )}
                      </div>


                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >

                        <p
                          className="
                            truncate
                            font-medium
                            text-gray-900
                          "
                        >
                          {getStudentName(
                            student
                          )}
                        </p>


                        <p
                          className="
                            text-sm
                            text-gray-500
                          "
                        >
                          {student.student_number}
                        </p>

                      </div>


                      {isSelected && (

                        <Check
                          size={19}
                          className="
                            shrink-0
                            text-violet-600
                          "
                        />

                      )}

                    </label>

                  );

                }
              )}

            </div>


            <div
              className="
                border-t
                border-gray-100
                bg-gray-50/50
                p-4
              "
            >

              <button
                type="button"
                disabled={
                  selectedAvailableStudents.length ===
                    0 ||
                  updating
                }
                onClick={
                  addStudents
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-violet-700
                  px-4
                  py-3
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-violet-800
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {updating ? (

                  <Loader2
                    size={18}
                    className="
                      animate-spin
                    "
                  />

                ) : (

                  <UserPlus
                    size={18}
                  />

                )}


                Ajouter au groupe


                {selectedAvailableStudents.length >
                  0 &&
                  ` (${selectedAvailableStudents.length})`}

              </button>

            </div>

          </div>


          {/* ============================================== */}
          {/* GROUP MEMBERS */}
          {/* ============================================== */}

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              bg-white
              shadow-sm
            "
          >

            <div
              className="
                border-b
                border-gray-100
                p-5
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >

                <div>

                  <h3
                    className="
                      font-semibold
                      text-gray-900
                    "
                  >
                    Membres du groupe
                  </h3>


                  <p
                    className="
                      mt-1
                      text-sm
                      text-gray-500
                    "
                  >

                    {selectedGroup.name}

                    {" · "}

                    {members.length}

                    {" "}

                    membre
                    {members.length >
                    1
                      ? "s"
                      : ""}

                  </p>

                </div>


                <button
                  type="button"
                  onClick={
                    toggleAllMembers
                  }
                  disabled={
                    members.length ===
                    0
                  }
                  className="
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-violet-700
                    transition
                    hover:bg-violet-50
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  Tout sélectionner
                </button>

              </div>

            </div>


            <div
              className="
                max-h-[500px]
                divide-y
                divide-gray-100
                overflow-y-auto
              "
            >

              {loadingMembers && (

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    p-10
                    text-gray-500
                  "
                >

                  <Loader2
                    size={20}
                    className="
                      animate-spin
                    "
                  />

                  Chargement...

                </div>

              )}


              {!loadingMembers &&
                members.length ===
                  0 && (

                  <div
                    className="
                      p-10
                      text-center
                      text-sm
                      text-gray-500
                    "
                  >
                    Aucun membre dans ce groupe.
                  </div>

                )}


              {members.map(
                (
                  student
                ) => {

                  const studentId =
                    String(
                      student.id
                    );

                  const isSelected =
                    selectedMembers.includes(
                      studentId
                    );


                  return (

                    <label
                      key={
                        studentId
                      }
                      className="
                        flex
                        cursor-pointer
                        items-center
                        gap-3
                        p-4
                        transition
                        hover:bg-red-50/40
                      "
                    >

                      <input
                        type="checkbox"
                        checked={
                          isSelected
                        }
                        onChange={() =>
                          toggleMember(
                            studentId
                          )
                        }
                        className="
                          h-4
                          w-4
                          cursor-pointer
                          accent-red-600
                        "
                      />


                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-violet-100
                          text-sm
                          font-bold
                          text-violet-700
                        "
                      >
                        {getInitials(
                          student
                        )}
                      </div>


                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >

                        <p
                          className="
                            truncate
                            font-medium
                            text-gray-900
                          "
                        >
                          {getStudentName(
                            student
                          )}
                        </p>


                        <p
                          className="
                            text-sm
                            text-gray-500
                          "
                        >
                          {student.student_number}
                        </p>

                      </div>


                      {isSelected && (

                        <Check
                          size={19}
                          className="
                            shrink-0
                            text-red-600
                          "
                        />

                      )}

                    </label>

                  );

                }
              )}

            </div>


            <div
              className="
                border-t
                border-gray-100
                bg-gray-50/50
                p-4
              "
            >

              <button
                type="button"
                disabled={
                  selectedMembers.length ===
                    0 ||
                  updating
                }
                onClick={
                  removeStudents
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-red-600
                  px-4
                  py-3
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {updating ? (

                  <Loader2
                    size={18}
                    className="
                      animate-spin
                    "
                  />

                ) : (

                  <UserMinus
                    size={18}
                  />

                )}


                Retirer du groupe


                {selectedMembers.length >
                  0 &&
                  ` (${selectedMembers.length})`}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}