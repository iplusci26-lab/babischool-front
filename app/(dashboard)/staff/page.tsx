"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function StaffPage() {

  const [staff, setStaff] = useState<any[]>([]);
  const [roles, setRole] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [effectif, setEffectif]=useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    user_type: "staff",
    role:""
  });



  const [selectedStaff, setSelectedStaff] =
  useState<any>(null);

  const [openView, setOpenView] =
    useState(false);

  const [openEdit, setOpenEdit] =
    useState(false);    


    const handleEdit = (staff: any) => {

      setSelectedStaff(staff);
    
      setOpenEdit(true);
    };

    const handleView = (staff: any) => {

      setSelectedStaff(staff);
    
      setOpenView(true);
    };


  const loadStaff = async () => {
    const res = await api.get("/auth/staff/");
      setStaff(res.data);
      setEffectif(Object.keys(res.data).length.toString() || "0");
    
  };

  const loadRole = async () => {

    const user_role = await api.get("/auth/role");
    setRole(user_role.data.results || user_role.data);
    
    
  };

  const handleDelete = async (id: string) => {

    const confirmDelete =
      confirm("Supprimer ce personnel ?");
  
    if (!confirmDelete) return;
  
    await api.delete(
      `/auth/staff/${id}/`
    );
  
    loadStaff();
  };

  useEffect(() => {
    loadRole();
    loadStaff();
  }, []);

  const handleSubmit = async () => {
    await api.post("/auth/staff/", form);
    loadStaff();

  };

  return (
    <div className="space-y-6">

      <h1 className="text-xl font-bold">Personnel</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded border space-y-2 max-w-md">
        <input placeholder="First name" className="border p-2 w-full"
          onChange={(e)=>setForm({...form, first_name:e.target.value})}
        />
        <input placeholder="Last name" className="border p-2 w-full"
          onChange={(e)=>setForm({...form, last_name:e.target.value})}
        />
        <input placeholder="Phone" className="border p-2 w-full"
          onChange={(e)=>setForm({...form, phone:e.target.value})}
        />

        <select
          className="border p-2 w-full"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}

        >
          <option value="">Sélectionner un role</option>

          {roles.map((r: any) => (
            <option key={r.id} value={r.id}>
              {r.name}
              
            </option>
          ))}
        </select>
        
        

        <button
          onClick={handleSubmit}
          className="bg-[#6214BE] text-white w-full p-2 rounded"
        >
          Ajouter
        </button>
      </div>

      {/* LIST */}
      <h1 className="text-xl" >Total Personnel:  {effectif}</h1>
      <div className="bg-white border rounded-xl overflow-hidden">

        
        <table className="w-full">

            <thead className="bg-gray-100 text-left">
            <tr>
                <th className="p-3 text-center">Nom et prénom</th>
                <th className="p-3 text-center">Fonction</th>
                <th className="p-3 text-center">Contact</th>
                <th className="p-3 text-center">Actions</th>
                
            </tr>
            </thead>

            <tbody>
                {staff.map((s) => (
                    <tr
                        key={s.id}
                        className="border-t items-center hover:bg-gray-50"
                    >
                    
                        <td className="p-3 text-center">{s.first_name} {s.last_name}</td>
                        <td className="p-3 text-center">{s.role?.name}</td>
                        <td className="p-3 text-center">{s.phone}</td>
                        <td className="p-3 items-center grid grid-cols-3 flex gap-2">

                        <button
                            onClick={() => handleView(s)}
                            className="text-green-600 text-sm text-center"
                          >

                            Voir

                          </button>

                          <button
                            onClick={() => handleEdit(s)}
                            className="text-blue-600 text-sm text-center"
                          >
                            Modifier
                          </button>

                          <button
                            onClick={() => handleDelete(s.id)}
                            className="text-red-600 text-sm text-center"
                          >
                            Supprimer
                          </button>
                        </td>
                    </tr>
                ))}
            </tbody>

        </table>

        

      </div>
      {/* VIEW MODAL */}

      {openView && selectedStaff && (

      <StaffDetailsModal

        staff={selectedStaff}

        onClose={() =>
          setOpenView(false)
        }

      />
      )}

      {/* EDIT MODAL */}

      {openEdit && selectedStaff && (

      <StaffEditModal

        staff={selectedStaff}

        roles={roles}

        onClose={() =>
          setOpenEdit(false)
        }

        onUpdated={() => {

          setOpenEdit(false);

          loadStaff();
        }}
      />
      )}
    </div>
  );
}

function StaffDetailsModal({

  staff,

  onClose

}: any) {

  return (

    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold">

              Détails personnel

            </h2>

            <p className="text-indigo-100 mt-1">

              {staff.first_name}
              {" "}
              {staff.last_name}

            </p>

          </div>

          <button
            onClick={onClose}
            className="bg-white/20 h-10 w-10 rounded-full flex items-center justify-center"
          >

            ✕

          </button>

        </div>

        {/* BODY */}

        <div className="p-6 space-y-5">

          <Info
            label="Nom"
            value={`${staff.first_name} ${staff.last_name}`}
          />

          <Info
            label="Téléphone"
            value={staff.phone}
          />

          <Info
            label="Fonction"
            value={staff.role?.name}
          />

          <Info
            label="Type utilisateur"
            value={staff.user_type}
          />

        </div>

      </div>

    </div>
  );
}

function StaffEditModal({

  staff,

  roles,

  onClose,

  onUpdated

}: any) {

  const [form, setForm] =
    useState({

      first_name:
        staff.first_name || "",

      last_name:
        staff.last_name || "",

      phone:
        staff.phone || "",

      role:
        staff.role?.id || "",
    });

  const [loading, setLoading] =
    useState(false);

  const submit = async () => {

    try {

      setLoading(true);

      await api.patch(

        `/auth/staff/${staff.id}/`,

        form
      );

      alert("Personnel modifié");

      onUpdated();

    } catch (error) {

      console.error(error);

      alert("Erreur");

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">

          <h2 className="text-2xl font-bold">

            Modifier personnel

          </h2>

        </div>

        {/* BODY */}

        <div className="p-6 space-y-4">

          <input
            value={form.first_name}
            onChange={(e) =>
              setForm({
                ...form,
                first_name: e.target.value
              })
            }
            placeholder="Prénom"
            className="border p-4 rounded-2xl w-full"
          />

          <input
            value={form.last_name}
            onChange={(e) =>
              setForm({
                ...form,
                last_name: e.target.value
              })
            }
            placeholder="Nom"
            className="border p-4 rounded-2xl w-full"
          />

          <input
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value
              })
            }
            placeholder="Téléphone"
            className="border p-4 rounded-2xl w-full"
          />

          <select
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value
              })
            }
            className="border p-4 rounded-2xl w-full"
          >

            <option value="">
              Sélectionner rôle
            </option>

            {roles.map((r: any) => (

              <option
                key={r.id}
                value={r.id}
              >

                {r.name}

              </option>
            ))}

          </select>

        </div>

        {/* FOOTER */}

        <div className="border-t p-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-5 py-3 border rounded-2xl"
          >

            Annuler

          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-5 py-3 bg-blue-600 text-white rounded-2xl"
          >

            {loading
              ? "Enregistrement..."
              : "Sauvegarder"}

          </button>

        </div>

      </div>

    </div>
  );
}


function Info({

  label,

  value

}: any) {

  return (

    <div>

      <p className="text-sm text-gray-500">

        {label}

      </p>

      <p className="font-semibold mt-1">

        {value || "-"}

      </p>

    </div>
  );
}