"use client";

import { useRouter } from "next/navigation";
import StudentModal from "./components/StudentModal";
import StudentToolbar from "./components/StudentToolbar";
import StudentStats from "./components/StudentStats";
import StudentFilters from "./components/StudentFilters";
import StudentTable from "./components/StudentsTable";

import { useStudents } from "./hooks/useStudents";

export default function StudentsPage() {
  const router = useRouter();

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

 
  return (
    <>
    <div className="space-y-6">

      {/* HEADER */}

      <StudentToolbar
        total={stats.total}
        onCreate={() => router.push("/admissions")}
        onExportExcel={actions.exportExcel}
        onExportPDF={actions.exportPDF}
      />

      {/* FILTERS */}

      <StudentFilters
        filters={filters}
        classrooms={classrooms}
        onChange={actions.setFilters}
        onReset={actions.resetFilters}
      />

      {/* STATS */}

      <StudentStats
        total={stats.total}
        girls={stats.girls}
        boys={stats.boys}
        classrooms={stats.classrooms}
      />

      {/* TABLE */}

      <StudentTable
        students={students}
        loading={loading}
        selectedStudents={selectedStudents}
        onToggleSelection={actions.toggleStudentSelection}
        onSelectAll={() => {
          if (
            selectedStudents.length === students.length
          ) {
            actions.clearSelection();
          } else {
            actions.selectAllStudents();
          }
        }}
        onView={(student) =>
          router.push(`/students/${student.id}`)
        }
        onEdit={actions.editStudent}
      />
     
    </div>
     <StudentModal
     open={studentModal.open}
     student={studentModal.student}
     loading={studentModal.loading}
     onClose={actions.closeStudentModal}
     onSubmit={actions.updateStudent}
   />
   </>
  );
}