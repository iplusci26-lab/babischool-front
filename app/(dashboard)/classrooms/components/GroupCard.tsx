"use client";

import EntityCard from "@/components/ui/EntityCard";
import StatusBadge from "@/components/ui/StatusBadge";

import { ClassroomGroup } from "../types";

interface GroupCardProps {
  group: ClassroomGroup;
  selected: boolean;

  onSelect: (group: ClassroomGroup) => void;
  onEdit: (group: ClassroomGroup) => void;
  onDelete: (group: ClassroomGroup) => void;
}

export default function GroupCard({
  group,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: GroupCardProps) {
  return (
    <EntityCard
      selected={selected}
      title={group.name}
      subtitle={group.classroom_name}
      description={group.description || "Aucune description"}
      badge={<StatusBadge active={group.is_active} />}
      footer={
        <div className="flex items-center justify-between w-full">

          <span className="text-sm text-gray-500">
            {group.code  || "-"}
          </span>

          <span className="text-sm text-gray-500">
             - Ordre : {group.display_order}
          </span>

        </div>
      }
      onClick={() => onSelect(group)}
      onEdit={() => onEdit(group)}
      onDelete={() => onDelete(group)}
    />
  );
}