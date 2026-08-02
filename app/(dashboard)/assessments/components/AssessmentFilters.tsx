"use client";

import { Search } from "lucide-react";

import SearchSelect from "@/components/ui/SearchSelect";

import {
  AssessmentFilters as Filters,
  Classroom,
  Subject,
  Term,
  ASSESSMENT_TYPE_OPTIONS,
} from "../types";

interface AssessmentFiltersProps {

  filters: Filters;

  classrooms: Classroom[];

  subjects: Subject[];

  terms: Term[];

  onFiltersChange: (
    filters: Filters
  ) => void;

}

export default function AssessmentFilters({

  filters,

  classrooms,

  subjects,

  terms,

  onFiltersChange,

}: AssessmentFiltersProps) {

  return (

    <div className="
      rounded-3xl
      border
      bg-white
      p-6
      shadow-sm
      space-y-5
    ">

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
          placeholder="Rechercher une évaluation..."
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

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
          label="Période"
          placeholder="Toutes les périodes"
          value={filters.term}
          options={terms.map((t) => ({
            value: t.id,
            label: t.name,
          }))}
          onChange={(value) =>
            onFiltersChange({
              ...filters,
              term: value,
            })
          }
        />

        <SearchSelect
          label="Type"
          placeholder="Tous les types"
          value={filters.assessment_type}
          options={ASSESSMENT_TYPE_OPTIONS}
          onChange={(value) =>
            onFiltersChange({
              ...filters,
              assessment_type: value,
            })
          }
        />

      </div>

    </div>

  );

}