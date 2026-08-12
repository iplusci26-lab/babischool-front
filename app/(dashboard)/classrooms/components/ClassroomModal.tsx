"use client";

import EntityModal from "@/components/ui/EntityModal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

import {
  Classroom,
  ClassroomForm,
  ClassroomLevel,
} from "../types";

interface ClassroomModalProps {
  open: boolean;

  saving: boolean;

  form: ClassroomForm;

  levels: ClassroomLevel[];

  classrooms: Classroom[];

  onClose: () => void;

  onSave: () => void;

  onChange: (
    values: Partial<ClassroomForm>
  ) => void;
}

export default function ClassroomModal({
  open,
  saving,
  form,
  levels,
  classrooms,
  onClose,
  onSave,
  onChange,
}: ClassroomModalProps) {
  return (
    <EntityModal
      open={open}
      title={
        form.id
          ? "Modifier une classe"
          : "Nouvelle classe"
      }
      saving={saving}
      onClose={onClose}
      onSave={onSave}
    >
      <Select
        label="Niveau"
        value={String(form.classroom_level)}
        options={[
          {
            label: "Sélectionner...",
            value: "",
          },
          ...levels.map((level) => ({
            label: level.name,
            value: String(level.id),
          })),
        ]}
        onChange={(e) =>
          onChange({
            classroom_level: e.target.value,
          })
        }
      />

      <Input
        label="Classe"
        placeholder="Ex : CM2 A, 6ème 1, 4ème 1, Tle C, 2nd C"
        value={form.name}
        onChange={(e) =>
          onChange({
            name: e.target.value,
          })
        }
      />

      <Input
        type="number"
        label="Frais d'écolage (FCFA)"
        placeholder="0"
        value={form.annual_tuition_fee}
        onChange={(e) =>
          onChange({
            annual_tuition_fee:
              Number(e.target.value),
          })
        }
      />

      {/*<Select
        label="Classe suivante"
        value={String(form.next_classroom ?? "")}
        options={[
          {
            label: "Aucune",
            value: "",
          },
          ...classrooms
            .filter(
              (classroom) =>
                classroom.id !== form.id
            )
            .map((classroom) => ({
              label: classroom.name,
              value: String(classroom.id),
            })),
        ]}
        onChange={(e) =>
          onChange({
            next_classroom: e.target.value
              ? e.target.value
              : null,
          })
        }
      />*/}
    </EntityModal>
  );
}