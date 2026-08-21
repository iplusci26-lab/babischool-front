"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";
import { api } from "@/lib/api";
import { Role, Staff } from "../types";

interface StaffEditModalProps {
    staff: Staff;
    roles: any[];
    onClose: () => void;
    onUpdated: () => void;
}

export default function StaffEditModal({
    staff,
    roles,
    onClose,
    onUpdated,
}: StaffEditModalProps) {

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        first_name: staff.first_name || "",
        last_name: staff.last_name || "",
        phone: staff.phone || "",
        role: staff.role?.id || "",
        function: staff.function || "",
    });

    async function submit() {

        try {

            setLoading(true);

            await api.patch(
                `/auth/staff/${staff.id}/`,
                form
            );

            onUpdated();

        } catch (error) {

            console.error(error);

            alert("Une erreur est survenue.");

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

                {/* HEADER */}

                <div className="bg-[#6214BE] px-6 py-5 flex items-center justify-between text-white">

                    <div>

                        <h2 className="text-xl font-semibold">

                            Modifier le personnel administratif

                        </h2>

                        <p className="text-sm text-violet-100 mt-1">

                            Mettre à jour les informations.

                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-white/20"
                    >

                        <X size={20} />

                    </button>

                </div>

                {/* BODY */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">

                    <div>

                        <label className="mb-2 block text-sm font-medium">

                            Nom

                        </label>

                        <input
                            value={form.last_name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    last_name: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border px-3 py-2"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-medium">

                            Prénom

                        </label>

                        <input
                            value={form.first_name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    first_name: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border px-3 py-2"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-medium">

                            Téléphone

                        </label>

                        <input
                            value={form.phone}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    phone: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border px-3 py-2"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-medium">
                            Fonction
                        </label>

                        <input
                            type="text"
                            value={form.function}
                            placeholder="Ex : Comptable"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    function: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20"
                        />

                    </div>

                   

                    <div>

                        <label className="mb-2 block text-sm font-medium">

                            Accès (Rôle)

                        </label>

                        <select
                            value={form.role}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    role: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border px-3 py-2"
                        >

                            <option value="">

                                Sélectionner...

                            </option>

                            {roles
                                .filter(
                                    (role) =>
                                        role.name !== "Enseignant"
                                )
                                .map((role) => (

                                    <option
                                        key={role.id}
                                        value={role.id}
                                    >

                                        {role.name}

                                    </option>

                                ))}

                        </select>

                    </div>

                </div>

                {/* FOOTER */}

                <div className="border-t px-6 py-4 flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="rounded-lg border px-5 py-2 hover:bg-gray-50"
                    >

                        Annuler

                    </button>

                    <button
                        onClick={submit}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg bg-[#6214BE] px-5 py-2 text-white hover:bg-[#4f0fa0] disabled:opacity-60"
                    >

                        <Save size={18} />

                        {loading
                            ? "Enregistrement..."
                            : "Enregistrer"}

                    </button>

                </div>

            </div>

        </div>

    );

}