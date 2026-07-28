import { api } from "@/lib/api";

import {
  Parent,
  PaginatedResponse,
  ResetParentPasswordResponse,
} from "../types";

export interface ParentListParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  must_change_password?: boolean;
}

class ParentService {
  async getParents(
    params: ParentListParams = {}
  ): Promise<PaginatedResponse<Parent>> {
    const { data } =
      await api.get<PaginatedResponse<Parent>>(
        "/auth/parents/",
        {
          params,
        }
      );

    return data;
  }

  async resetPassword(
    parentId: string
  ): Promise<ResetParentPasswordResponse> {
    const { data } =
      await api.post<ResetParentPasswordResponse>(
        `/auth/parents/${parentId}/reset-password/`
      );

    return data;
  }
}

export default new ParentService();