"use client";

import EntityModal from "@/components/ui/EntityModal";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";

import {
  Classroom,
  ClassroomGroupForm,
} from "../types";

interface GroupModalProps {
  open: boolean;

  saving: boolean;

  form: ClassroomGroupForm;

  classrooms: Classroom[];

  onClose: () => void;

  onSave: () => void;

  onChange: (
    values: Partial<ClassroomGroupForm>
  ) => void;
}

export default function GroupModal({
  open,
  saving,
  form,
  classrooms,
  onClose,
  onSave,
  onChange,
}: GroupModalProps) {
  return (
    <EntityModal
      open={open}
      title={
        form.id
          ? "Modifier un groupe"
          : "Nouveau groupe"
      }
      saving={saving}
      onClose={onClose}
      onSave={onSave}
    >
      <Select
        label="Classe"
        value={String(form.classroom)}
        options={[
          {
            label: "Sélectionner...",
            value: "",
          },
          ...classrooms.map((classroom) => ({
            label: classroom.name,
            value: String(classroom.id),
          })),
        ]}
        onChange={(e) =>
          onChange({
            classroom: e.target.value,
          })
        }
      />

      <Input
        label="Nom"
        placeholder="Ex : Groupe A"
        value={form.name}
        onChange={(e) =>
          onChange({
            name: e.target.value,
          })
        }
      />

      <Input
        label="Code"
        placeholder="Ex : GA"
        value={form.code}
        onChange={(e) =>
          onChange({
            code: e.target.value.toUpperCase(),
          })
        }
      />

      {/*<TextArea
        label="Description"
        rows={3}
        placeholder="Description du groupe..."
        value={form.description}
        onChange={(e) =>
          onChange({
            description: e.target.value,
          })
        }
      />*/}

      <Input
        type="number"
        label="Ordre d'affichage"
        value={form.display_order}
        onChange={(e) =>
          onChange({
            display_order: Number(e.target.value),
          })
        }
      />

      <Select
        label="Statut"
        value={String(form.is_active)}
        options={[
          {
            label: "Actif",
            value: "true",
          },
          {
            label: "Inactif",
            value: "false",
          },
        ]}
        onChange={(e) =>
          onChange({
            is_active:
              e.target.value === "true",
          })
        }
      />
    </EntityModal>
  );
}