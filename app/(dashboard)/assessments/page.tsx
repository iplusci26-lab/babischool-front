"use client";

import { useState } from "react";

import AssessmentTab from "./components/AssessmentTab";
import ScheduledAssessmentTab from "./components/ScheduledAssessmentTab";
import HomeworkTab from "./components/HomeworkTab";

export default function EvaluationsPage() {

  const [tab, setTab] = useState("assessment");

  return (

    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">

          Évaluations

        </h1>

        <p className="mt-2 text-gray-500">

          Gérez les évaluations, leur programmation
          ainsi que les exercices de maison.

        </p>

      </div>

      {/* Onglets */}

      <div className="flex gap-2 border-b">

        <Tab
          value="assessment"
          current={tab}
          onClick={setTab}
        >
          📝 Évaluations classe
        </Tab>

        <Tab
          value="scheduled"
          current={tab}
          onClick={setTab}
        >
          📅 Évaluations programmées
        </Tab>

        <Tab
          value="homework"
          current={tab}
          onClick={setTab}
        >
          🏠 Exercices
        </Tab>

      </div>

      {/* Contenu */}

      {tab === "assessment" && (

        <AssessmentTab />

      )}

      {tab === "scheduled" && (

        <ScheduledAssessmentTab />

      )}

      {tab === "homework" && (

        <HomeworkTab />

      )}

    </div>

  );

}

interface TabProps {

  children: React.ReactNode;

  value: string;

  current: string;

  onClick: (value: string) => void;

}

function Tab({

  children,

  value,

  current,

  onClick,

}: TabProps) {

  const active = current === value;

  return (

    <button

      onClick={() => onClick(value)}

      className={`
        -mb-px
        rounded-t-2xl
        border-b-2
        px-5
        py-3
        text-sm
        font-medium
        transition
        ${
          active
            ? "border-[#6214BE] text-[#6214BE]"
            : "border-transparent text-gray-500 hover:text-[#6214BE]"
        }
      `}

    >

      {children}

    </button>

  );

}