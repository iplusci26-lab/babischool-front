"use client";

import EntityModal from "@/components/ui/EntityModal";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";

import { ClassroomLevelForm, Cycle } from "../types";

interface LevelModalProps {
  open: boolean;
  saving: boolean;

  form: ClassroomLevelForm;

  cycles: Cycle[];

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
  cycles,
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
      <Select
        label="Cycle"
        value={String(form.cycle)}
        options={[
          { label: "Sélectionner...", value: "" },
          ...cycles.map((cycle) => ({
            label: cycle.name,
            value: String(cycle.id),
          })),
        ]}
        onChange={(e) =>
          onChange({
            cycle: e.target.value,
          })
        }
      />

      <Input
        label="Nom"
        value={form.name}
        onChange={(e) =>
          onChange({
            name: e.target.value,
          })
        }
      />

      <TextArea
        label="Description"
        rows={3}
        value={form.description}
        onChange={(e) =>
          onChange({
            description: e.target.value,
          })
        }
      />

      <Input
        type="number"
        label="Ordre"
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
          { label: "Actif", value: "true" },
          { label: "Inactif", value: "false" },
        ]}
        onChange={(e) =>
          onChange({
            is_active: e.target.value === "true",
          })
        }
      />
    </EntityModal>
  );
}