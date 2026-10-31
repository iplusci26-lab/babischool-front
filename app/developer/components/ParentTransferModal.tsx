
"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  Users,
  X,
  ArrowLeftRight,
} from "lucide-react";
import { api } from "@/lib/api";

interface Child {
  student_id: string;
  first_name: string;
  last_name: string;
  student_number: string;
  school_name: string;
  classroom?: string | null;
}

interface Parent {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  phone: string;
  alternate_phone?: string;
  email?: string;
  children_count: number;
  children: Child[];
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface TransferResult {
  success: boolean;
  message: string;
  transferred_count: number;
  skipped_count: number;
  skipped_student_ids: string[];
  source_parent_id: string;
  destination_parent_id: string;
}

interface ParentTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceParent: {
    id: string;
    display_name: string;
    phone: string;
    children_count: number;
  };
  onSuccess: () => void;
}

export default function ParentTransferModal({
  isOpen,
  onClose,
  sourceParent,
  onSuccess,
}: ParentTransferModalProps) {
  const [phone, setPhone] = useState("");
  const [parents, setParents] = useState<Parent[]>([]);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);

  const [searching, setSearching] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TransferResult | null>(null);

  if (!isOpen) return null;

  const searchParents = async () => {
    const value = phone.trim();

    if (!value) {
      setError("Saisis le numéro de téléphone du parent destinataire.");
      return;
    }

    setSearching(true);
    setError("");
    setParents([]);
    setSelectedParent(null);

    try {
      const response = await api.get<PaginatedResponse<Parent>>(
        "/developer/supervisor/parents/",
        {
          params: {
            phone: value,
            page: 1,
          },
        }
      );

      // Exclure le parent source de la liste des destinataires.
      const filteredParents = response.data.results.filter(
        (parent) => parent.id !== sourceParent.id
      );

      setParents(filteredParents);

      if (filteredParents.length === 0) {
        setError("Aucun autre parent ne correspond à ce numéro.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Impossible de rechercher le parent. Réessaie."
      );
    } finally {
      setSearching(false);
    }
  };

  const executeTransfer = async () => {
    if (!selectedParent) return;

    setTransferring(true);
    setError("");

    try {
      const response = await api.post<TransferResult>(
        `/developer/supervisor/parents/${sourceParent.id}/transfer-children/`,
        {
          destination_parent_id: selectedParent.id,
        }
      );

      setResult(response.data);
      onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Le transfert a échoué. Vérifie les informations et réessaie."
      );
    } finally {
      setTransferring(false);
    }
  };

  const resetAndClose = () => {
    setPhone("");
    setParents([]);
    setSelectedParent(null);
    setError("");
    setResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-2.5 text-[#6214BE]">
              <ArrowLeftRight size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Transférer les enfants
              </h2>
              <p className="text-sm text-gray-500">
                Transfert entre deux profils parents
              </p>
            </div>
          </div>

          <button
            onClick={resetAndClose}
            disabled={transferring}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[75vh] space-y-5 overflow-y-auto p-6">
          {/* Résultat */}
          {result ? (
            <div className="space-y-5">
              <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                <div className="mb-3 flex items-center gap-2 text-green-700">
                  <CheckCircle2 size={23} />
                  <h3 className="font-bold">Transfert terminé</h3>
                </div>

                <p className="text-sm text-green-800">{result.message}</p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white p-3">
                    <p className="text-2xl font-bold text-green-700">
                      {result.transferred_count}
                    </p>
                    <p className="text-xs text-gray-500">
                      Enfants transférés
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-3">
                    <p className="text-2xl font-bold text-orange-600">
                      {result.skipped_count}
                    </p>
                    <p className="text-xs text-gray-500">
                      Doublons ignorés
                    </p>
                  </div>
                </div>
              </div>

              {result.skipped_count > 0 && (
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
                  {result.skipped_count} rattachement(s) n'ont pas été transférés
                  car le parent destinataire était déjà lié à ces enfants.
                </div>
              )}

              <button
                onClick={resetAndClose}
                className="w-full rounded-xl bg-[#6214BE] px-4 py-3 font-semibold text-white hover:bg-[#5010a0]"
              >
                Terminer
              </button>
            </div>
          ) : (
            <>
              {/* Parent source */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Parent source
                </p>

                <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                  <p className="font-semibold text-gray-900">
                    {sourceParent.display_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {sourceParent.phone}
                  </p>
                  <p className="mt-2 text-sm text-[#6214BE]">
                    {sourceParent.children_count} enfant(s) rattaché(s)
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="rounded-full bg-gray-100 p-2 text-gray-500">
                  <ArrowRight size={20} />
                </div>
              </div>

              {/* Recherche destinataire */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Rechercher le parent destinataire
                </label>

                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") searchParents();
                    }}
                    placeholder="Ex : 0757505469"
                    className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#6214BE] focus:ring-2 focus:ring-purple-100"
                  />

                  <button
                    onClick={searchParents}
                    disabled={searching}
                    className="flex items-center gap-2 rounded-xl bg-[#6214BE] px-4 py-3 text-sm font-semibold text-white hover:bg-[#5010a0] disabled:opacity-60"
                  >
                    {searching ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Search size={18} />
                    )}
                    Rechercher
                  </button>
                </div>
              </div>

              {/* Résultats de recherche */}
              {parents.length > 0 && !selectedParent && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Résultats ({parents.length})
                  </p>

                  {parents.map((parent) => (
                    <button
                      key={parent.id}
                      onClick={() => {
                        setSelectedParent(parent);
                        setError("");
                      }}
                      className="flex w-full items-center justify-between rounded-xl border p-4 text-left transition hover:border-[#6214BE] hover:bg-purple-50"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {parent.display_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {parent.phone}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {parent.children_count} enfant(s) déjà rattaché(s)
                        </p>
                      </div>

                      <span className="text-sm font-semibold text-[#6214BE]">
                        Choisir
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Parent sélectionné */}
              {selectedParent && (
                <div className="space-y-3">
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                        Parent destinataire sélectionné
                      </p>

                      <CheckCircle2 size={19} className="text-green-600" />
                    </div>

                    <p className="font-semibold text-gray-900">
                      {selectedParent.display_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedParent.phone}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                      <Users size={16} />
                      {selectedParent.children_count} enfant(s) déjà rattaché(s)
                    </div>

                    {selectedParent.children?.length > 0 && (
                      <div className="mt-3 border-t border-green-200 pt-3">
                        <p className="mb-2 text-xs font-semibold text-gray-600">
                          Enfants déjà associés :
                        </p>

                        <div className="space-y-1">
                          {selectedParent.children.slice(0, 5).map((child) => (
                            <p
                              key={child.student_id}
                              className="text-xs text-gray-600"
                            >
                              • {child.first_name} {child.last_name}
                              {child.school_name
                                ? ` — ${child.school_name}`
                                : ""}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedParent(null)}
                    className="text-sm font-medium text-[#6214BE] hover:underline"
                  >
                    Choisir un autre parent
                  </button>

                  <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle
                        size={19}
                        className="mt-0.5 shrink-0 text-orange-600"
                      />
                      <div className="text-sm text-orange-900">
                        <p className="font-semibold">
                          Confirmer le transfert ?
                        </p>
                        <p className="mt-1">
                          Tous les enfants du parent source seront rattachés
                          au parent destinataire, quelle que soit leur école.
                          Les doublons seront ignorés. Aucun compte parent ne
                          sera supprimé.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={executeTransfer}
                    disabled={transferring}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6214BE] px-4 py-3 font-semibold text-white hover:bg-[#5010a0] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {transferring ? (
                      <>
                        <Loader2 size={19} className="animate-spin" />
                        Transfert en cours...
                      </>
                    ) : (
                      <>
                        <ArrowLeftRight size={19} />
                        Confirmer le transfert
                      </>
                    )}
                  </button>
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
