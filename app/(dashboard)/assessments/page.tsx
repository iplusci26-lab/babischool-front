"use client";

import { useState } from "react";

import GradesTab from "./components/evaluation-tabs";
import HomeworkTab from "./components/homework-tabs";

export default function EvaluationsPage() {

  const [tab, setTab] = useState("grades");

  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Evaluations
        </h1>

        <p className="text-gray-500 mt-1">
        PROGRAMMATION DES EVALUATIONS
        </p>

      </div>

      {/* TABS */}

      <div className="flex gap-6 border-b">

        <Tab
          label="Evaluation"
          value="grades"
          tab={tab}
          setTab={setTab}
        />

        <Tab
          label="Exercice"
          value="homework"
          tab={tab}
          setTab={setTab}
        />

      </div>

      {/* CONTENT */}

      {tab === "grades" && (
        <GradesTab />
      )}

      {tab === "homework" && (
        <HomeworkTab />
      )}

    </div>
  );
}

function Tab({
  label,
  value,
  tab,
  setTab
}: any) {

  return (

    <button
      onClick={() => setTab(value)}
      className={`
        pb-3 font-medium
        ${
          tab === value
            ? "border-b-2 border-primary text-primary"
            : "text-gray-500"
        }
      `}
    >
      {label}
    </button>
  );
}