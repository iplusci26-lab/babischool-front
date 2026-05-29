export default function StudentHeader({ student }: any) {
    return (
      <div className="bg-white p-6 rounded-xl border flex justify-between">
  
        <div>
          <h2 className="text-xl font-bold">
            {student.first_name} {student.last_name}
          </h2>
  
          <p className="text-gray-500">
            Matricule: {student.student_number}
          </p>
  
          <p className="text-gray-500">
            Classe: {student.classroom}
          </p>
        </div>
  
        <div className="text-right">
          <p className="text-sm text-gray-500">Parent</p>
          <p className="font-medium">
            {student.parent_phone}
          </p>
        </div>
  
      </div>
    );
  }