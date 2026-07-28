"use client";

import EntityCard from "@/components/ui/EntityCard";
import StatusBadge from "@/components/ui/StatusBadge";

import { ClassroomLevel } from "../types";

interface LevelCardProps {
  level: ClassroomLevel;
  selected: boolean;

  onSelect: (level: ClassroomLevel) => void;
  onEdit: (level: ClassroomLevel) => void;
  onDelete: (level: ClassroomLevel) => void;
}

export default function LevelCard({
  level,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: LevelCardProps) {
  return (
    <EntityCard
      selected={selected}
      title={level.name}
      subtitle={level.cycle_name}
      description={level.description || "Aucune description"}
      badge={<StatusBadge active={level.is_active} />}
      footer={
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Ordre :</span>

          <span className="font-semibold">
            {level.display_order}
          </span>
        </div>
      }
      onClick={() => onSelect(level)}
      onEdit={() => onEdit(level)}
      onDelete={() => onDelete(level)}
    />
  );
}