"use client";

import {

  useCallback,

  useEffect,

  useState,

} from "react";

import ParentService, {

  ParentListParams,

  UpdateParentPayload,

} from "../services/parent.service";

import type {

  Parent,

  ResetParentPasswordResponse,

} from "../types";


// ==========================================================
// HOOK
// ==========================================================

export default function useParents() {


  // ========================================================
  // DATA
  // ========================================================

  const [

    parents,

    setParents,

  ] = useState<Parent[]>([]);


  const [

    loading,

    setLoading,

  ] = useState(false);


  // ========================================================
  // PAGINATION
  // ========================================================

  const [

    page,

    setPage,

  ] = useState(1);


  const [

    pageSize,

  ] = useState(20);


  const [

    count,

    setCount,

  ] = useState(0);


  // ========================================================
  // SEARCH
  // ========================================================

  const [

    search,

    setSearch,

  ] = useState("");


  // ========================================================
  // SELECTED PARENT
  // ========================================================

  const [

    selectedParent,

    setSelectedParent,

  ] = useState<Parent | null>(null);


  // ========================================================
  // RESET PASSWORD DIALOG
  // ========================================================

  const [

    confirmOpen,

    setConfirmOpen,

  ] = useState(false);


  // ========================================================
  // RESET RESULT
  // ========================================================

  const [

    resultOpen,

    setResultOpen,

  ] = useState(false);


  const [

    resetResult,

    setResetResult,

  ] =

    useState<
      ResetParentPasswordResponse | null
    >(

      null

    );


  // ========================================================
  // EDIT MODAL
  // ========================================================

  const [

    editModalOpen,

    setEditModalOpen,

  ] = useState(false);


  const [

    editingParent,

    setEditingParent,

  ] = useState<Parent | null>(null);


  // ========================================================
  // STATUS DIALOG
  // ========================================================

  const [

    deactivateOpen,

    setDeactivateOpen,

  ] = useState(false);


  // ========================================================
  // LOAD PARENTS
  // ========================================================

  const loadParents = useCallback(

    async () => {

      try {

        setLoading(true);


        const params: ParentListParams = {

          page,

          page_size: pageSize,

          search,

        };


        const response =

          await ParentService.getParents(

            params

          );


        setParents(

          response.results

        );


        setCount(

          response.count

        );

      }

      finally {

        setLoading(false);

      }

    },

    [

      page,

      pageSize,

      search,

    ]

  );


  // ========================================================
  // AUTO LOAD
  // ========================================================

  useEffect(

    () => {

      void loadParents();

    },

    [

      loadParents,

    ]

  );


  // ========================================================
  // RESET PASSWORD
  // ========================================================

  const openResetDialog = (

    parent: Parent

  ) => {

    setSelectedParent(parent);

    setConfirmOpen(true);

  };


  const closeResetDialog = () => {

    if (loading) {

      return;

    }


    setConfirmOpen(false);

    setSelectedParent(null);

  };


  const closeResultDialog = () => {

    setResultOpen(false);

    setResetResult(null);

  };


  const resetPassword =

    async () => {

      if (!selectedParent) {

        return;

      }


      try {

        setLoading(true);


        const response =

          await ParentService.resetPassword(

            selectedParent.id

          );


        setConfirmOpen(false);


        setResetResult(response);


        setResultOpen(true);


        await loadParents();

      }

      finally {

        setLoading(false);

      }

    };


  // ========================================================
  // EDIT
  // ========================================================

  const openEditModal = (

    parent: Parent

  ) => {

    setEditingParent(parent);

    setEditModalOpen(true);

  };


  const closeEditModal = () => {

    if (loading) {

      return;

    }


    setEditModalOpen(false);

    setEditingParent(null);

  };


  const updateParent =

    async (

      data: UpdateParentPayload

    ) => {

      if (!editingParent) {

        return;

      }


      try {

        setLoading(true);


        await ParentService.updateParent(

          editingParent.id,

          data

        );


        setEditModalOpen(false);


        setEditingParent(null);


        await loadParents();

      }

      finally {

        setLoading(false);

      }

    };


  // ========================================================
  // ACTIVATE / DEACTIVATE DIALOG
  // ========================================================

  const openDeactivateDialog = (

    parent: Parent

  ) => {

    setSelectedParent(parent);

    setDeactivateOpen(true);

  };


  const closeDeactivateDialog = () => {

    if (loading) {

      return;

    }


    setDeactivateOpen(false);

    setSelectedParent(null);

  };


  // ========================================================
  // TOGGLE PARENT STATUS
  // ========================================================

  const toggleParentStatus =

    async () => {

      if (!selectedParent) {

        return;

      }


      try {

        setLoading(true);


        // ==================================================
        // PARENT ACTIVE
        // → DEACTIVATE
        // ==================================================

        if (selectedParent.is_active) {

          await ParentService.deactivateParent(

            selectedParent.id

          );

        }


        // ==================================================
        // PARENT INACTIVE
        // → ACTIVATE
        // ==================================================

        else {

          await ParentService.activateParent(

            selectedParent.id

          );

        }


        // ==================================================
        // CLOSE DIALOG
        // ==================================================

        setDeactivateOpen(false);


        setSelectedParent(null);


        // ==================================================
        // RELOAD LIST
        // ==================================================

        await loadParents();

      }

      finally {

        setLoading(false);

      }

    };


  // ========================================================
  // RETURN
  // ========================================================

  return {


    // ======================================================
    // DATA
    // ======================================================

    parents,

    loading,

    count,


    // ======================================================
    // PAGINATION
    // ======================================================

    page,

    setPage,

    pageSize,


    // ======================================================
    // SEARCH
    // ======================================================

    search,

    setSearch,


    // ======================================================
    // SELECTED
    // ======================================================

    selectedParent,


    // ======================================================
    // RESET PASSWORD
    // ======================================================

    confirmOpen,

    resultOpen,

    resetResult,

    openResetDialog,

    closeResetDialog,

    closeResultDialog,

    resetPassword,


    // ======================================================
    // EDIT
    // ======================================================

    editModalOpen,

    editingParent,

    openEditModal,

    closeEditModal,

    updateParent,


    // ======================================================
    // ACTIVATE / DEACTIVATE
    // ======================================================

    deactivateOpen,

    openDeactivateDialog,

    closeDeactivateDialog,

    toggleParentStatus,


    // ======================================================
    // RELOAD
    // ======================================================

    reload: loadParents,

  };

}