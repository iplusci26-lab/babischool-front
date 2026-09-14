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

      subtitle={
        classroom.classroom_level_name
      }

      description={
        `Cycle : ${classroom.cycle_name}`
      }

      footer={

        <div className="w-full space-y-2 text-sm">
            <p className="items-center justify-between font-bold text-violet-600">Frais d'écolage: </p>
          {/* ================================================
           * ÉLÈVE AFFECTÉ
           * ================================================ */}

          <div className="flex items-center justify-between text-gray-500">

            <span>
              Affecté :
            </span>

            <span className="font-semibold text-gray-900">

              {Number(
                classroom.annual_tuition_fee_assigned
              ).toLocaleString()}

              {" "}FCFA

            </span>

          </div>


          {/* ================================================
           * ÉLÈVE NON AFFECTÉ
           * ================================================ */}

          <div className="flex items-center justify-between text-gray-500">

            <span>
              Non affecté : 
            </span>

            <span className="font-semibold text-gray-900">

         {Number(
                classroom.annual_tuition_fee_unassigned
              ).toLocaleString()}

              {" "}FCFA

            </span>

          </div>

        </div>

      }

      onClick={() =>
        onSelect(classroom)
      }

      onEdit={() =>
        onEdit(classroom)
      }

      onDelete={() =>
        onDelete(classroom)
      }
    />

  );

}