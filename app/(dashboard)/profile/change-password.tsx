"use client";

import { useState } from "react";

import { api } from "@/lib/api";

export default function ChangePassword() {

  const [form, setForm] = useState({

    current_password: "",

    new_password: "",

    confirm_password: ""
  });

  const [loading, setLoading] =
    useState(false);

  // =========================
  // SUBMIT
  // =========================

  const submit = async () => {

    if (
      !form.current_password ||
      !form.new_password ||
      !form.confirm_password
    ) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);

    try {

      await api.post(
        "/auth/change-password/",
        form
      );

      alert(
        "Mot de passe modifié"
      );

      setForm({

        current_password: "",

        new_password: "",

        confirm_password: ""
      });

    } catch (err: any) {

      console.log("erreur---- ",err?.response?.data);

      alert(

        err?.response?.data?.message ||

        "Erreur"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (

    <div className="
      bg-white
      border
      rounded-3xl
      p-6
      space-y-6
    ">

      {/* HEADER */}

      <div>

        <h2 className="text-xl font-bold">
          Changer mot de passe
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Sécurisez votre compte utilisateur
        </p>

      </div>

      {/* CURRENT */}

      <div>

        <label className="
          block
          mb-2
          text-sm
          font-medium
        ">
          Mot de passe actuel
        </label>

        <input
          type="password"

          value={form.current_password}

          onChange={(e)=>
            setForm({

              ...form,

              current_password:
                e.target.value
            })
          }

          className="
            w-full
            border
            rounded-2xl
            p-3
          "
        />

      </div>

      {/* NEW */}

      <div>

        <label className="
          block
          mb-2
          text-sm
          font-medium
        ">
          Nouveau mot de passe
        </label>

        <input
          type="password"

          value={form.new_password}

          onChange={(e)=>
            setForm({

              ...form,

              new_password:
                e.target.value
            })
          }

          className="
            w-full
            border
            rounded-2xl
            p-3
          "
        />

      </div>

      {/* CONFIRM */}

      <div>

        <label className="
          block
          mb-2
          text-sm
          font-medium
        ">
          Confirmation
        </label>

        <input
          type="password"

          value={form.confirm_password}

          onChange={(e)=>
            setForm({

              ...form,

              confirm_password:
                e.target.value
            })
          }

          className="
            w-full
            border
            rounded-2xl
            p-3
          "
        />

      </div>

      {/* ACTION */}

      <button

        onClick={submit}

        disabled={loading}

        className="
          text-white
          bg-[#6214BE]
          px-6
          py-3
          rounded-2xl
          font-medium
        "
      >

        {loading
          ? "Modification..."
          : "Modifier mot de passe"
        }

      </button>

    </div>
  );
}