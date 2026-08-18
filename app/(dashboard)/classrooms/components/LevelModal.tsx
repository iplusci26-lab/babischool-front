"use client";

import EntityModal from "@/components/ui/EntityModal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

import { ClassroomLevelForm } from "../types";

interface LevelModalProps {
  open: boolean;
  saving: boolean;

  form: ClassroomLevelForm;

  onClose: () => void;
  onSave: () => void;

  onChange: (
    values: Partial<ClassroomLevelForm>
  ) => void;
}

export default function LevelModal({
  open,
  saving,
  form,
  onClose,
  onSave,
  onChange,
}: LevelModalProps) {
  return (
    <EntityModal
      open={open}
      title={
        form.id
          ? "Modifier un niveau"
          : "Nouveau niveau"
      }
      saving={saving}
      onClose={onClose}
      onSave={onSave}
    >
      <Input
        label="Nom"
        value={form.name}
        placeholder="Ex : CP1, CE2, 6ème, Terminale"
        onChange={(e) =>
          onChange({
            name: e.target.value,
          })
        }
      />

      <Input
        type="number"
        label="Ordre"
        value={form.display_order}
        onChange={(e) =>
          onChange({
            display_order:
              Number(e.target.value) || 0,
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