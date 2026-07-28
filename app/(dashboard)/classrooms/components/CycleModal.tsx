"use client";

import EntityModal from "@/components/ui/EntityModal";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";

import { CycleForm } from "../types";

interface CycleModalProps {
  open: boolean;

  saving: boolean;

  form: CycleForm;

  onClose: () => void;

  onSave: () => void;

  onChange: (
    values: Partial<CycleForm>
  ) => void;
}

export default function CycleModal({
  open,
  saving,
  form,
  onClose,
  onSave,
  onChange,
}: CycleModalProps) {
  return (
    <EntityModal
      open={open}
      title={
        form.id
          ? "Modifier un cycle"
          : "Nouveau cycle"
      }
      saving={saving}
      onClose={onClose}
      onSave={onSave}
    >
      <Input
        label="Nom"
        placeholder="Ex : Primaire"
        value={form.name}
        onChange={(e) =>
          onChange({
            name: e.target.value,
          })
        }
      />

        <Input
        label="Code"
        placeholder="Ex : PRIM"
        value={form.code}
        onChange={(e) =>
            onChange({
            code: e.target.value.toUpperCase(),
            codeManuallyEdited: true,
            })
        }
        />

      
      <Input
        type="number"
        label="Ordre d'affichage"
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