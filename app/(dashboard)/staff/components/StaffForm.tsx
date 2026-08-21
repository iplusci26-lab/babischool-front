"use client";

import { useState } from "react";

interface Role {
    id: string;
    name: string;
}

export interface StaffFormData {
    first_name: string;
    last_name: string;
    phone: string;
    role: string;
    function: string;
}

interface StaffFormProps {
    roles: Role[];
    onSubmit: (data: StaffFormData) => Promise<void>;
}

export default function StaffForm({
    roles,
    onSubmit,
}: StaffFormProps) {

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState<StaffFormData>({
        first_name: "",
        last_name: "",
        phone: "",
        role: "",
        function: "",
    });

    async function handleSubmit() {

        if (
            !form.first_name ||
            !form.last_name ||
            !form.phone ||
            !form.role ||
            !form.function
        ) {
            alert("Veuillez renseigner tous les champs.");
            return;
        }

        try {

            setLoading(true);

            await onSubmit(form);

            setForm({
                first_name: "",
                last_name: "",
                phone: "",
                role: "",
                function:"",
            });

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="rounded-2xl border bg-white shadow-sm">

            <div className="border-b px-6 py-4">

                <h2 className="text-lg font-semibold">

                    Nouveau membre de l'administration

                </h2>

                <p className="text-sm text-gray-500 mt-1">

                    Ajouter un membre de l'administration et lui attribuer un accès.

                </p>

            </div>

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
                        placeholder="Nom"
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
                        placeholder="Prénom"
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
                        placeholder="Téléphone"
                    />

                </div>


                <div>

                    <label className="mb-2 block text-sm font-medium">

                        Fonction

                    </label>

                    <input
                         type="text"
                         placeholder="Ex : Comptable"
                         value={form.function}
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

                        Accès

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
                                (r) => r.name !== "Enseignant"
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

            <div className="border-t px-6 py-4 flex justify-end">

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="rounded-lg bg-[#6214BE] px-6 py-2 text-white hover:bg-[#5110a0] disabled:opacity-60"
                >

                    {loading
                        ? "Enregistrement..."
                        : "Ajouter le personnel administratif"}

                </button>

            </div>

        </div>

    );

}