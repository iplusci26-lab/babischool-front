"use client";

import { useState } from "react";

import { useAcademicStructure } from "./hooks/useAcademicStructure";

import EntityColumn from "./components/EntityColumn";

import CycleCard from "./components/CycleCard";
import LevelCard from "./components/LevelCard";
import ClassroomCard from "./components/ClassroomCard";
import GroupCard from "./components/GroupCard";

import CycleModal from "./components/CycleModal";
import LevelModal from "./components/LevelModal";
import ClassroomModal from "./components/ClassroomModal";
import GroupModal from "./components/GroupModal";

export default function AcademicStructurePage() {

  const {
    loading,
    saving,

    cycles,
    levels,
    classrooms,
    groups,

    selectedCycleId,
    selectedLevelId,
    selectedClassroomId,

    cycleForm,
    levelForm,
    classroomForm,
    groupForm,

    actions,
} = useAcademicStructure();

const [cycleModalOpen, setCycleModalOpen] =
    useState(false);

const [levelModalOpen, setLevelModalOpen] =
    useState(false);

const [classroomModalOpen, setClassroomModalOpen] =
    useState(false);

const [groupModalOpen, setGroupModalOpen] =
    useState(false);


    return (

      <div className="space-y-6">
      
          <div>
      
              <h1 className="text-3xl font-bold">
      
                  Créations des classes
      
              </h1>
      
              <p className="text-gray-500">
      
                  Gérez les cycles,
                  niveaux,
                  classes
                  et groupes pédagogiques.
      
              </p>
      
          </div>
          <div className="
                grid
                gap-6

                grid-cols-1

                md:grid-cols-2

                xl:grid-cols-4
            "
        >
          <EntityColumn
    title="Type établissement"
    count={cycles.length}
    loading={loading}
    emptyMessage="Aucun type établissement"

    onAdd={() => {
        actions.setCycleForm({
            name: "",
            code: "",
          
            display_order: 1,
            is_active: true,
        });

        setCycleModalOpen(true);
    }}
>

    {cycles.map((cycle) => (

        <CycleCard

            key={cycle.id}

            cycle={cycle}

            selected={
                selectedCycleId === cycle.id
            }

            onSelect={() =>
                actions.selectCycle(cycle.id)
            }

            onEdit={() => {

                actions.openCycleForm(cycle);

                setCycleModalOpen(true);

            }}

            onDelete={() =>
                actions.deleteCycle(cycle.id)
            }

        />

    ))}

</EntityColumn>

<EntityColumn
  title="Niveaux"
  count={levels.length}
  loading={loading}
  emptyMessage="Aucun niveau"
  onAdd={() => {
    actions.resetLevelForm();
    setLevelModalOpen(true);
  }}
>
  {levels
    .filter(
      (level) =>
        level.cycle === selectedCycleId
    )
    .map((level) => (
      <LevelCard
        key={level.id}
        level={level}
        selected={
          selectedLevelId === level.id
        }
        onSelect={() =>
          actions.selectLevel(level.id)
        }
        onEdit={() => {
          actions.openLevelForm(level);
          setLevelModalOpen(true);
        }}
        onDelete={() =>
          actions.deleteLevel(level.id)
        }
      />
    ))}
</EntityColumn>

<EntityColumn
  title="Classes"
  count={classrooms.length}
  loading={loading}
  emptyMessage="Aucune classe"
  onAdd={() => {
    actions.resetClassroomForm();
    setClassroomModalOpen(true);
  }}
>
  {classrooms
    .filter(
      (classroom) =>
        classroom.classroom_level ===
        selectedLevelId
    )
    .map((classroom) => (
      <ClassroomCard
        key={classroom.id}
        classroom={classroom}
        selected={
          selectedClassroomId ===
          classroom.id
        }
        onSelect={() =>
          actions.selectClassroom(
            classroom.id
          )
        }
        onEdit={() => {
          actions.openClassroomForm(
            classroom
          );

          setClassroomModalOpen(true);
        }}
        onDelete={() =>
          actions.deleteClassroom(
            classroom.id
          )
        }
      />
    ))}
</EntityColumn>

<EntityColumn
  title="Groupes"
  count={groups.length}
  loading={loading}
  emptyMessage="Aucun groupe"
  onAdd={() => {
    actions.resetGroupForm();
    setGroupModalOpen(true);
  }}
>
  {groups
    .filter(
      (group) =>
        group.classroom ===
        selectedClassroomId
    )
    .map((group) => (
      <GroupCard
        key={group.id}
        group={group}
        selected={false}
        onSelect={() => {}}
        onEdit={() => {
          actions.openGroupForm(group);

          setGroupModalOpen(true);
        }}
        onDelete={() =>
          actions.deleteGroup(group.id)
        }
      />
    ))}
</EntityColumn>

</div>

<CycleModal
  open={cycleModalOpen}
  saving={saving}
  form={cycleForm}
  onClose={() => setCycleModalOpen(false)}
  onSave={actions.saveCycle}
  onChange={actions.setCycleForm}
/>

<LevelModal
  open={levelModalOpen}
  saving={saving}
  form={levelForm}
  cycles={cycles}
  onClose={() => setLevelModalOpen(false)}
  onSave={actions.saveLevel}
  onChange={actions.setLevelForm}
/>

<ClassroomModal
  open={classroomModalOpen}
  saving={saving}
  form={classroomForm}
  levels={levels}
  classrooms={classrooms}
  onClose={() =>
    setClassroomModalOpen(false)
  }
  onSave={actions.saveClassroom}
  onChange={actions.setClassroomForm}
/>

<GroupModal
  open={groupModalOpen}
  saving={saving}
  form={groupForm}
  classrooms={classrooms}
  onClose={() => setGroupModalOpen(false)}
  onSave={actions.saveGroup}
  onChange={actions.setGroupForm}
/>

</div>
);
}