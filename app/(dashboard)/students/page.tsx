"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import StudentModal from "./components/StudentModal";

import StudentToolbar from "./components/StudentToolbar";

import StudentStats from "./components/StudentStats";

import StudentFilters from "./components/StudentFilters";

import StudentTable from "./components/StudentsTable";

import StudentGroupManager from "./components/StudentGroupManager";

import {
  useStudents,
} from "./hooks/useStudents";

import type {
  Student,
  UUID,
} from "./types";


// ==========================================================
// COMPONENT
// ==========================================================

export default function StudentsPage() {

  const router =
    useRouter();


  // ========================================================
  // GROUP MANAGER MODAL
  // ========================================================

  const [
    groupManagerOpen,
    setGroupManagerOpen,
  ] = useState(
    false
  );


  // ========================================================
  // STUDENTS
  // ========================================================

  const {
    loading,
    students,
    classrooms,
    filters,
    stats,
    selectedStudents,
    actions,
    studentModal,
  } = useStudents();


  // ========================================================
  // OPEN GROUP MANAGER
  // ========================================================

  const openGroupManager =
    () => {

      setGroupManagerOpen(
        true
      );

    };


  // ========================================================
  // CLOSE GROUP MANAGER
  // ========================================================

  const closeGroupManager =
    () => {

      setGroupManagerOpen(
        false
      );

    };


  // ========================================================
  // SELECT ALL
  // ========================================================

  const handleSelectAll =
    () => {

      const currentPageStudentIds =
        students
          .map(
            (
              student
            ) =>
              student.id
          )
          .filter(
            (
              id
            ): id is UUID =>
              typeof id === "string" &&
              id.trim().length > 0
          );


      const allSelected =
        currentPageStudentIds.length > 0 &&
        currentPageStudentIds.every(
          (
            studentId
          ) =>
            selectedStudents.includes(
              studentId
            )
        );


      if (
        allSelected
      ) {

        actions.clearSelection();

        return;

      }


      actions.selectAllStudents();

    };


  // ========================================================
  // VIEW STUDENT
  // ========================================================

  const handleViewStudent =
    (
      student:
        Student
    ) => {

      router.push(
        `/students/${student.id}`
      );

    };


  // ========================================================
  // SYNC GROUP MANAGER SELECTION
  // ========================================================

  const handleGroupManagerSelectionChange =
    (
      studentIds:
        UUID[]
    ) => {

      actions.clearSelection();


      studentIds
        .filter(
          (
            studentId
          ): studentId is UUID =>
            typeof studentId ===
              "string" &&
            studentId.trim().length >
              0
        )
        .forEach(
          (
            studentId
          ) => {

            actions.toggleStudentSelection(
              studentId
            );

          }
        );

    };


  // ========================================================
  // RENDER
  // ========================================================

  return (

    <>


      {/* ================================================== */}
      {/* STUDENTS PAGE */}
      {/* ================================================== */}

      <div
        className="
          min-w-0
          max-w-full
          space-y-6
        "
      >


        {/* ================================================ */}
        {/* HEADER */}
        {/* ================================================ */}

        <StudentToolbar
          total={
            stats.total
          }
          selectedCount={
            selectedStudents.length
          }
          onCreate={() =>
            router.push(
              "/admissions"
            )
          }
          onExportExcel={
            actions.exportExcel
          }
          onExportPDF={
            actions.exportPDF
          }
          onManageGroups={
            openGroupManager
          }
        />


        {/* ================================================ */}
        {/* FILTERS */}
        {/* ================================================ */}

        <StudentFilters
          filters={
            filters
          }
          classrooms={
            classrooms
          }
          onChange={
            actions.setFilters
          }
          onReset={
            actions.resetFilters
          }
        />


        {/* ================================================ */}
        {/* STATS */}
        {/* ================================================ */}

        <StudentStats
          total={
            stats.total
          }
          girls={
            stats.girls
          }
          boys={
            stats.boys
          }
          classrooms={
            stats.classrooms
          }
        />


        {/* ================================================ */}
        {/* TABLE */}
        {/* ================================================ */}

        <StudentTable
          students={
            students
          }
          loading={
            loading
          }
          selectedStudents={
            selectedStudents
          }
          onToggleSelection={
            actions.toggleStudentSelection
          }
          onSelectAll={
            handleSelectAll
          }
          onView={
            handleViewStudent
          }
          onEdit={
            actions.editStudent
          }
        />

      </div>


      {/* ================================================== */}
      {/* STUDENT MODAL */}
      {/* ================================================== */}

      <StudentModal
        open={
          studentModal.open
        }
        student={
          studentModal.student
        }

        classrooms={
          classrooms
        }

        loading={
          studentModal.loading
        }
        onClose={
          actions.closeStudentModal
        }
        onSubmit={
          actions.updateStudent
        }
      />


      {/* ================================================== */}
      {/* GROUP MANAGER MODAL */}
      {/* ================================================== */}

      {groupManagerOpen && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            p-4
          "
          onMouseDown={
            closeGroupManager
          }
        >

          <div
            className="
              relative
              max-h-[95vh]
              w-full
              max-w-7xl
              overflow-y-auto
              rounded-2xl
              bg-white
              p-6
              shadow-2xl
            "
            onMouseDown={
              (
                event
              ) =>
                event.stopPropagation()
            }
          >


            <button
              type="button"
              onClick={
                closeGroupManager
              }
              className="
                absolute
                right-4
                top-4
                z-10
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-xl
                text-gray-500
                transition
                hover:bg-gray-100
                hover:text-gray-900
              "
              aria-label="Fermer"
            >
              ×
            </button>


            <StudentGroupManager
              classrooms={
                classrooms
              }
              selectedStudents={
                selectedStudents
              }
              onSelectionChange={
                handleGroupManagerSelectionChange
              }
            />

          </div>

        </div>

      )}

    </>

  );

}