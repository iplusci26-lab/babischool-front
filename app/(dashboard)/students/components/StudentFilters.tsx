"use client";

import { Search, RotateCcw } from "lucide-react";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

import { Classroom, StudentFilters as Filters } from "../types";

interface StudentFiltersProps {
  filters: Filters;

  classrooms: Classroom[];

  onChange: (values: Partial<Filters>) => void;

  onReset: () => void;
}

export default function StudentFilters({
  filters,
  classrooms,
  onChange,
  onReset,
}: StudentFiltersProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">

        {/* Recherche */}

        <Input
          placeholder="Rechercher un élève..."
          value={filters.search}
          onChange={(e) =>
            onChange({
              search: e.target.value,
            })
          }
          leftIcon={<Search size={18} />}
        />

        {/* Classe */}

        <Select
          value={String(filters.classroom ?? "")}
          options={[
            {
              label: "Toutes les classes",
              value: "",
            },

            ...classrooms.map((c) => ({
              label: c.name,
              value: String(c.id),
            })),
          ]}
          onChange={(e) =>
            onChange({
              classroom: e.target.value
            })
          }
        />

        {/* Sexe */}

        <Select
          value={filters.gender}
          options={[
            {
              label: "Tous les sexes",
              value: "",
            },
            {
              label: "Garçons",
              value: "M",
            },
            {
              label: "Filles",
              value: "F",
            },
          ]}
          onChange={(e) =>
            onChange({
              gender: e.target.value as "M" | "F" | "",
            })
          }
        />

        {/* Statut */}

        {/*<Select
          value={filters.status}
          options={[
            {
              label: "Tous les statuts",
              value: "",
            },
            {
              label: "Actif",
              value: "ACTIVE",
            },
            {
              label: "Inactif",
              value: "INACTIVE",
            },
            {
              label: "Transféré",
              value: "TRANSFERRED",
            },
          ]}
          onChange={(e) =>
            onChange({
              status: e.target.value as
                | ""
                | "ACTIVE"
                | "INACTIVE"
                | "TRANSFERRED",
            })
          }
        />*/}

        {/* Réinitialiser */}

        <button
          onClick={onReset}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            px-4
            py-2
            hover:bg-gray-50
          "
        >
          <RotateCcw size={18} />

          Réinitialiser
        </button>

      </div>

    </div>
  );
}