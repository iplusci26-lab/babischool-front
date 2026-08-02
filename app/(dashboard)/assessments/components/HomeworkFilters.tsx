"use client";

import { Search } from "lucide-react";

import SearchSelect from "@/components/ui/SearchSelect";

import {
  HomeworkFilters as Filters,
  Classroom,
  Subject,
  HOMEWORK_STATUS_OPTIONS,
} from "../types";

interface HomeworkFiltersProps {

  filters: Filters;

  classrooms: Classroom[];

  subjects: Subject[];

  onFiltersChange: (
    filters: Filters
  ) => void;

}

export default function HomeworkFilters({

  filters,

  classrooms,

  subjects,

  onFiltersChange,

}: HomeworkFiltersProps) {

  return (

    <div
      className="
        rounded-3xl
        border
        bg-white
        p-6
        shadow-sm
        space-y-5
      "
    >

      {/* Recherche */}

      <div className="relative">

        <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
          "
        />

        <input
          type="text"
          placeholder="Rechercher un exercice..."
          value={filters.search}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              search: e.target.value,
            })
          }
          className="
            w-full
            rounded-2xl
            border
            py-3
            pl-11
            pr-4
            outline-none
            transition
            focus:border-[#6214BE]
          "
        />

      </div>

      {/* Filtres */}

      <div className="grid gap-4 md:grid-cols-3">

        <SearchSelect
          label="Classe"
          placeholder="Toutes les classes"
          value={filters.classroom}
          options={classrooms.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
          onChange={(value) =>
            onFiltersChange({
              ...filters,
              classroom: value,
            })
          }
        />

        <SearchSelect
          label="Matière"
          placeholder="Toutes les matières"
          value={filters.subject}
          options={subjects.map((s) => ({
            value: s.id,
            label: s.name,
          }))}
          onChange={(value) =>
            onFiltersChange({
              ...filters,
              subject: value,
            })
          }
        />

        <SearchSelect
          label="Statut"
          placeholder="Tous les statuts"
          value={filters.status}
          options={HOMEWORK_STATUS_OPTIONS}
          onChange={(value) =>
            onFiltersChange({
              ...filters,
              status: value,
            })
          }
        />

      </div>

    </div>

  );

}