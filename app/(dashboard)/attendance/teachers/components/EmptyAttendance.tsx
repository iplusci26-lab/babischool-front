import { CalendarX2 } from "lucide-react";

export default function EmptyAttendance() {
  return (
    <div className="rounded-xl border border-dashed bg-white p-12 text-center">
      <div className="flex justify-center">
        <CalendarX2
          size={56}
          className="text-gray-400"
        />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-gray-900">
        Aucun cours aujourd'hui
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Aucun créneau n'est prévu pour cette journée.
      </p>
    </div>
  );
}