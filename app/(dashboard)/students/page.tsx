import StudentsTable from "./components/students-table";

export default function StudentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Students</h1>

      <StudentsTable />
    </div>
  );
}