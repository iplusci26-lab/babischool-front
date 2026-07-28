"use client";

import EntityCard from "@/components/ui/EntityCard";

import { Classroom } from "../types";

interface ClassroomCardProps {
  classroom: Classroom;
  selected: boolean;

  onSelect: (classroom: Classroom) => void;
  onEdit: (classroom: Classroom) => void;
  onDelete: (classroom: Classroom) => void;
}

export default function ClassroomCard({
  classroom,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: ClassroomCardProps) {
  return (
    <EntityCard
      selected={selected}
      title={classroom.name}
      subtitle={classroom.classroom_level_name}
      description={`Cycle : ${classroom.cycle_name}`}
      footer={
        <div className="flex justify-between w-full text-sm text-gray-500">

          <span>
            Frais :
          </span>

          <span className="font-semibold">
            {classroom.annual_tuition_fee.toLocaleString()} FCFA
          </span>

        </div>
      }
      onClick={() => onSelect(classroom)}
      onEdit={() => onEdit(classroom)}
      onDelete={() => onDelete(classroom)}
    />
  );
}