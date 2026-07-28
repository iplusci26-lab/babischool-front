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

          <div className="flex items-center justify-between">

              <div>

                  <h1 className="text-3xl font-bold">
                      Attribution classe
                  </h1>

                  <p className="text-sm text-gray-500 mt-1">
                      Gérez les affectations des enseignants par classe.
                  </p>

              </div>

              <button
                  onClick={() => {
                      setEditingAssignment(null);
                      setModalOpen(true);
                  }}
                  className="flex items-center gap-2 rounded-lg bg-[#6214BE] px-4 py-2 text-white hover:bg-[#5310a0]"
              >
                  <Plus size={18} />

                  Ajouer
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
                            Enseignant
                        </th>

                        <th className="px-6 py-3 text-left">
                            Attribution
                        </th>

                        <th className="px-6 py-3 text-left">
                            Groupe
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
                                  colSpan={6}
                                  className="py-10 text-center"
                              >

                                  Chargement...

                              </td>

                          </tr>

                      ) : assignments.length === 0 ? (

                          <tr>

                              <td
                                  colSpan={6}
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
                        
                            {/* Classe */}
                        
                            <td className="px-6 py-4 font-medium">
                        
                                {assignment.classroom_name}
                        
                            </td>
                        
                            {/* Enseignant */}
                        
                            <td className="px-6 py-4">
                        
                                {assignment.teacher_name}
                        
                            </td>
                        
                            {/* Affectation */}
                        
                            <td className="px-6 py-4">
                        
                                {assignment.assignment_type === "PRIMARY" ? (
                        
                                    <span className="font-medium text-blue-700">
                        
                                        🏫 Titulaire de la classe
                        
                                    </span>
                        
                                ) : (
                        
                                    <span>
                        
                                        📘 {assignment.subject_name}
                        
                                    </span>
                        
                                )}
                        
                            </td>
                        
                            {/* Groupe */}
                        
                            <td className="px-6 py-4">
                        
                                {assignment.classroom_group_name ?? "Classe entière"}
                        
                            </td>
                        
                            {/* Statut */}
                        
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
                        
                            {/* Actions */}
                        
                            <td className="px-6 py-4">
                        
                                <div className="flex items-center justify-center gap-2">
                        
                                    <button
                                        onClick={() => {
                                            setEditingAssignment(
                                                assignment
                                            );
                                            setModalOpen(true);
                                        }}
                                        className="rounded-lg border p-2 hover:bg-gray-100"
                                    >
                        
                                        <Pencil size={16} />
                        
                                    </button>
                        
                                    <button
                                        className="rounded-lg border p-2 text-red-600 hover:bg-red-50"
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

</div>

);

}