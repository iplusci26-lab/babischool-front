"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AssignmentModal from "./components/AssignmentModal";
import { getAcademicYears } from "@/lib/api/academicYears";
import { getClassrooms } from "@/lib/api/classrooms";
import { getTeachingAssignments } from "@/lib/api/teachingAssignments";

import { AcademicYear } from "@/types/academicYear";
import { Classroom } from "@/types/classroom";
import { TeachingAssignment } from "@/types/teachingAssignment";
import CourseGroupModal from "./components/CourseGroupModal";
import {
    getCourseGroups,
    deleteCourseGroup,
} from "@/lib/api/courseGroups";

import { CourseGroup } from "@/types/courseGroup";

export default function AssignmentsPage() {

    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);

    const [selectedAcademicYear, setSelectedAcademicYear] =
        useState("");

    const [classrooms, setClassrooms] =
        useState<Classroom[]>([]);

    const [selectedClassroom, setSelectedClassroom] =
        useState("");

    const [assignments, setAssignments] =
        useState<TeachingAssignment[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [modalOpen, setModalOpen] =
        useState(false);

    
    const [courseGroups, setCourseGroups] =
        useState<CourseGroup[]>([]);
    
    const [courseGroupModalOpen, setCourseGroupModalOpen] =
        useState(false);
    
    const [editingCourseGroup, setEditingCourseGroup] =
        useState<CourseGroup | null>(null);

    const [editingAssignment, setEditingAssignment] =
        useState<TeachingAssignment | null>(null);

    const loadAcademicYears = async () => {

        try {

            const data =
                await getAcademicYears();

            setAcademicYears(data);

            if (data.length > 0) {
                setSelectedAcademicYear(
                    data[0].id
                );
            }

        } catch (error) {

            console.error(error);

        }

    };

    const loadCourseGroups = async (
        academicYearId: string
    ) => {
    
        try {
    
            const data =
                await getCourseGroups({
                    academicYearId,
                });
    
            setCourseGroups(data);
    
        } catch (error) {
    
            console.error(error);
    
        }
    
    };

    const loadClassrooms = async (
        academicYearId: string
    ) => {

        try {

            const data =
                await getClassrooms({
                    academicYearId,
                });
           
            setClassrooms(data.results);

            if (data.results.length > 0) {

                setSelectedClassroom(
                    data.results[0].id
                );

            } else {

                setSelectedClassroom("");
                setAssignments([]);

            }

        } catch (error) {

            console.error(error);

        }

    };

    const loadAssignments = async (
        classroomId: string
    ) => {

        try {

            setLoading(true);

            const data =
                await getTeachingAssignments(
                    classroomId
                );

            setAssignments(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadAcademicYears();

    }, []);

    useEffect(() => {

        if (!selectedAcademicYear)
            return;

        loadClassrooms(
            selectedAcademicYear
        );

        loadCourseGroups(
            selectedAcademicYear
        );

    }, [selectedAcademicYear]);

    useEffect(() => {

        if (!selectedClassroom)
            return;

        loadAssignments(
            selectedClassroom
        );

    }, [selectedClassroom]);
    const refreshAssignments = async () => {

      if (!selectedClassroom)
          return;
  
      await loadAssignments(
          selectedClassroom
      );
  
  };
    return (

      <div className="space-y-6">

          {/* ===========================
              HEADER
          ============================ */}

                <div className="flex items-center gap-3">

                <button
                    onClick={() => {
                        setEditingCourseGroup(null);
                        setCourseGroupModalOpen(true);
                    }}
                    className="flex items-center cursor-pointer gap-2 rounded-lg border border-[#6214BE] px-4 py-2 text-[#6214BE] hover:bg-purple-50"
                >

                    <Plus size={18} />

                    Nouveau cours commun

                </button>


                <button
                    onClick={() => {
                        setEditingAssignment(null);
                        setModalOpen(true);
                    }}
                    className="flex items-center cursor-pointer gap-2 rounded-lg bg-[#6214BE] px-4 py-2 text-white hover:bg-[#5310a0]"
                >

                    <Plus size={18} />

                    Ajouter une affectation

                </button>

                </div>

          {/* ===========================
              FILTRES
          ============================ */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <div>

                  <label className="mb-2 block text-sm font-medium">

                      Année scolaire

                  </label>

                  <select
                      value={selectedAcademicYear}
                      onChange={(e) =>
                          setSelectedAcademicYear(
                              e.target.value
                          )
                      }
                      className="w-full rounded-lg border p-3"
                  >

                      {academicYears.map((year) => (

                          <option
                              key={year.id}
                              value={year.id}
                          >

                              {year.name}

                          </option>

                      ))}

                  </select>

              </div>

              <div>

                  <label className="mb-2 block text-sm font-medium">

                      Classe

                  </label>

                  <select
                      value={selectedClassroom}
                      onChange={(e) =>
                          setSelectedClassroom(
                              e.target.value
                          )
                      }
                      className="w-full rounded-lg border p-3"
                  >

                      {classrooms.map((classroom) => (

                          <option
                              key={classroom.id}
                              value={classroom.id}
                          >

                              {classroom.name}

                          </option>

                      ))}

                  </select>

              </div>

          </div>

          {/* ===========================
              TABLEAU
          ============================ */}

          <div className="overflow-hidden rounded-xl border bg-white">

              <table className="min-w-full">

              <thead className="bg-gray-100">
                    <tr>

                        <th className="px-6 py-3 text-left">
                            Classe
                        </th>

                        <th className="px-6 py-3 text-left">
                            Matière
                        </th>

                        <th className="px-6 py-3 text-left">
                            Enseignant
                        </th>

                        <th className="px-6 py-3 text-left">
                            Cours commun
                        </th>

                        <th className="px-6 py-3 text-left">
                            Groupe
                        </th>

                        <th className="px-6 py-3 text-left">
                            Type
                        </th>

                        <th className="px-6 py-3 text-left">
                            Statut
                        </th>

                        <th className="px-6 py-3 text-center">
                            Actions
                        </th>

                    </tr>
                </thead>

                  <tbody>

                      {loading ? (

                          <tr>

                              <td
                                  colSpan={8}
                                  className="py-10 text-center"
                              >

                                  Chargement...

                              </td>

                          </tr>

                      ) : assignments.length === 0 ? (

                          <tr>

                              <td
                                  colSpan={8}
                                  className="py-10 text-center text-gray-500"
                              >

                                  Aucune affectation pédagogique.

                              </td>

                          </tr>

                      ) : (

                        assignments.map((assignment) => (

                            <tr
                                key={assignment.id}
                                className="border-t hover:bg-gray-50 transition-colors"
                            >
                        
                                {/* =========================
                                    CLASSE
                                ========================== */}
                        
                                <td className="px-6 py-4 font-medium">
                        
                                    {assignment.classroom_name}
                        
                                </td>
                        
                        
                                {/* =========================
                                    MATIÈRE
                                ========================== */}
                        
                                <td className="px-6 py-4">
                        
                                    {assignment.assignment_type === "PRIMARY" ? (
                        
                                        <span className="text-gray-400">
                                            Toutes les matières
                                        </span>
                        
                                    ) : (
                        
                                        assignment.subject_name ?? "—"
                        
                                    )}
                        
                                </td>
                        
                        
                                {/* =========================
                                    ENSEIGNANT
                                ========================== */}
                        
                                <td className="px-6 py-4">
                        
                                    {assignment.teacher_name}
                        
                                </td>
                        
                        
                                {/* =========================
                                    COURS COMMUN
                                ========================== */}
                        
                                <td className="px-6 py-4">
                        
                                    {assignment.course_group_name ? (
                        
                                        <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                        
                                            {assignment.course_group_name}
                        
                                        </span>
                        
                                    ) : (
                        
                                        <span className="text-gray-400">
                                            Aucun
                                        </span>
                        
                                    )}
                        
                                </td>
                        
                        
                                {/* =========================
                                    GROUPE
                                ========================== */}
                        
                                <td className="px-6 py-4">
                        
                                    {assignment.classroom_group_name ? (
                        
                                        <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                        
                                            {assignment.classroom_group_name}
                        
                                        </span>
                        
                                    ) : (
                        
                                        <span className="text-gray-500">
                                            Classe entière
                                        </span>
                        
                                    )}
                        
                                </td>
                        
                        
                                {/* =========================
                                    TYPE
                                ========================== */}
                        
                                <td className="px-6 py-4">
                        
                                    {assignment.assignment_type === "PRIMARY" ? (
                        
                                        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        
                                            Titulaire
                        
                                        </span>
                        
                                    ) : (
                        
                                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        
                                            Matière
                        
                                        </span>
                        
                                    )}
                        
                                </td>
                        
                        
                                {/* =========================
                                    STATUT
                                ========================== */}
                        
                                <td className="px-6 py-4">
                        
                                    {assignment.is_active ? (
                        
                                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        
                                            Actif
                        
                                        </span>
                        
                                    ) : (
                        
                                        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        
                                            Inactif
                        
                                        </span>
                        
                                    )}
                        
                                </td>
                        
                        
                                {/* =========================
                                    ACTIONS
                                ========================== */}
                        
                                <td className="px-6 py-4">
                        
                                    <div className="flex items-center justify-center gap-2">
                        
                                        <button
                                            onClick={() => {
                                                setEditingAssignment(
                                                    assignment
                                                );
                        
                                                setModalOpen(true);
                                            }}
                                            className="rounded-lg border cursor-pointer p-2 hover:bg-gray-100"
                                            title="Modifier"
                                        >
                        
                                            <Pencil size={16} />
                        
                                        </button>
                        
                        
                                        <button
                                            className="rounded-lg border p-2 text-red-600 cursor-pointer hover:bg-red-50"
                                            title="Supprimer"
                                        >
                        
                                            <Trash2 size={16} />
                        
                                        </button>
                        
                                    </div>
                        
                                </td>
                        
                            </tr>
                        
                        ))

                      )}

                  </tbody>

              </table>

            </div>

            {/* ===========================
                COURS COMMUNS
            ============================ */}

            <div className="overflow-hidden rounded-xl border bg-white">

            <div className="border-b px-6 py-4">

                <div>
                    <h2 className="text-lg font-semibold">
                        Cours communs
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Les cours communs et les classes auxquelles ils sont associés.
                    </p>
                </div>

            </div>

            <table className="min-w-full">

                <thead className="bg-gray-100">

                    <tr>

                        <th className="px-6 py-3 text-left">
                            Cours commun
                        </th>

                        <th className="px-6 py-3 text-left">
                            Matière
                        </th>

                        <th className="px-6 py-3 text-left">
                            Enseignant
                        </th>

                        <th className="px-6 py-3 text-left">
                            Classes concernées
                        </th>

                        <th className="px-6 py-3 text-left">
                            Statut
                        </th>

                        <th className="px-6 py-3 text-center">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {courseGroups.length === 0 ? (

                        <tr>

                            <td
                                colSpan={6}
                                className="py-10 text-center text-gray-500"
                            >
                                Aucun cours commun configuré.
                            </td>

                        </tr>

                    ) : (

                        courseGroups.map((courseGroup) => (

                            <tr
                                key={courseGroup.id}
                                className="border-t transition-colors hover:bg-gray-50"
                            >

                                {/* =========================
                                    NOM
                                ========================== */}

                                <td className="px-6 py-4">

                                    <div className="font-medium">
                                        {courseGroup.name}
                                    </div>

                                    {courseGroup.code && (

                                        <div className="mt-1 text-xs text-gray-500">
                                            Code : {courseGroup.code}
                                        </div>

                                    )}

                                </td>


                                {/* =========================
                                    MATIÈRE
                                ========================== */}

                                <td className="px-6 py-4">

                                    {courseGroup.subject_name || "—"}

                                </td>


                                {/* =========================
                                    ENSEIGNANT
                                ========================== */}

                                <td className="px-6 py-4">

                                    {courseGroup.teacher_name}

                                </td>


                                {/* =========================
                                    CLASSES
                                ========================== */}

                                <td className="px-6 py-4">

                                    <div className="flex flex-wrap gap-1.5">

                                        {courseGroup.classrooms.length > 0 ? (

                                            courseGroup.classrooms.map(
                                                (classroom) => (

                                                    <span
                                                        key={classroom.id}
                                                        className="inline-flex rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700"
                                                    >
                                                        {classroom.name}
                                                    </span>

                                                )
                                            )

                                        ) : (

                                            <span className="text-gray-400">
                                                Aucune classe
                                            </span>

                                        )}

                                    </div>

                                </td>


                                {/* =========================
                                    STATUT
                                ========================== */}

                                <td className="px-6 py-4">

                                    {courseGroup.is_active ? (

                                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                            Actif
                                        </span>

                                    ) : (

                                        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                            Inactif
                                        </span>

                                    )}

                                </td>


                                {/* =========================
                                    ACTIONS
                                ========================== */}

                                <td className="px-6 py-4">

                                    <div className="flex items-center justify-center gap-2">

                                        <button
                                            onClick={() => {
                                                setEditingCourseGroup(
                                                    courseGroup
                                                );

                                                setCourseGroupModalOpen(
                                                    true
                                                );
                                            }}
                                            className="cursor-pointer rounded-lg border p-2 hover:bg-gray-100"
                                            title="Modifier"
                                        >

                                            <Pencil size={16} />

                                        </button>

                                        <button
                                            onClick={async () => {

                                                if (
                                                    !window.confirm(
                                                        `Voulez-vous vraiment supprimer le cours commun « ${courseGroup.name} » ?`
                                                    )
                                                ) {
                                                    return;
                                                }

                                                try {

                                                    await deleteCourseGroup(
                                                        courseGroup.id
                                                    );

                                                    await loadCourseGroups(
                                                        selectedAcademicYear
                                                    );

                                                } catch (error) {

                                                    console.error(error);

                                                }

                                            }}
                                            className="cursor-pointer rounded-lg border p-2 text-red-600 hover:bg-red-50"
                                            title="Supprimer"
                                        >

                                            <Trash2 size={16} />

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

            </div>

          {/* =========================== MODALE ============================ */}

        {modalOpen && (

          <AssignmentModal
            open={modalOpen}
            assignment={editingAssignment}
            academicYearId={selectedAcademicYear}
            classroomId={selectedClassroom}
            onClose={() => {
                setModalOpen(false);
                setEditingAssignment(null);
            }}
            onSaved={refreshAssignments}
          />

        )}

        {courseGroupModalOpen && (

        <CourseGroupModal
            open={courseGroupModalOpen}
            courseGroup={editingCourseGroup}
            academicYearId={selectedAcademicYear}
            classrooms={classrooms}
            onClose={() => {
                setCourseGroupModalOpen(false);
                setEditingCourseGroup(null);
            }}
            onSaved={() => {
                loadCourseGroups(
                    selectedAcademicYear
                );
            }}
        />

        )}

</div>

);

}