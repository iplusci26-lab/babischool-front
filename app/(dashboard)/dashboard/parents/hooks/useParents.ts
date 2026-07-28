"use client";

import { useCallback, useEffect, useState } from "react";

import ParentService, {
  ParentListParams,
} from "../services/parent.service";

import {
  Parent,
  ResetParentPasswordResponse,
} from "../types";

export default function useParents() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState("");

  const [count, setCount] = useState(0);

  const [selectedParent, setSelectedParent] =
    useState<Parent | null>(null);

  const [confirmOpen, setConfirmOpen] =
    useState(false);

  const [resultOpen, setResultOpen] =
    useState(false);

  const [resetResult, setResetResult] =
    useState<ResetParentPasswordResponse | null>(
      null
    );

  const loadParents = useCallback(async () => {
    try {
      setLoading(true);

      const params: ParentListParams = {
        page,
        page_size: pageSize,
        search,
      };

      const response =
        await ParentService.getParents(params);

      setParents(response.results);

      setCount(response.count);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    loadParents();
  }, [loadParents]);

  const openResetDialog = (parent: Parent) => {
    setSelectedParent(parent);
    setConfirmOpen(true);
  };

  const closeResetDialog = () => {
    setConfirmOpen(false);
    setSelectedParent(null);
  };

  const closeResultDialog = () => {
    setResultOpen(false);
    setResetResult(null);
  };

  const resetPassword = async () => {
    if (!selectedParent) return;

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
    } finally {
      setLoading(false);
    }
  };

  return {
    parents,

    loading,

    page,
    setPage,

    pageSize,

    count,

    search,
    setSearch,

    selectedParent,

    confirmOpen,
    resultOpen,

    resetResult,

    openResetDialog,

    closeResetDialog,

    closeResultDialog,

    resetPassword,

    reload: loadParents,
  };
}