"use client";

import EntityCard from "@/components/ui/EntityCard";
import StatusBadge from "@/components/ui/StatusBadge";

import { Cycle } from "../types";

interface CycleCardProps {
  cycle: Cycle;

  selected: boolean;

  onSelect: (cycle: Cycle) => void;

  onEdit: (cycle: Cycle) => void;

  onDelete: (cycle: Cycle) => void;
}

export default function CycleCard({
  cycle,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: CycleCardProps) {
  return (
    <EntityCard
      selected={selected}
      title={cycle.name}
      subtitle={cycle.code}
      badge={
        <StatusBadge
          active={cycle.is_active}
        />
      }
      footer={
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Ordre :</span>

          <span className="font-semibold">
            {cycle.display_order}
          </span>
        </div>
      }
      onClick={() => onSelect(cycle)}
      onEdit={() => onEdit(cycle)}
      onDelete={() => onDelete(cycle)}
    />
  );
}