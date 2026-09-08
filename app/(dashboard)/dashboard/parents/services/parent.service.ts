import { api } from "@/lib/api";

import type {
  Parent,
  PaginatedResponse,
  ResetParentPasswordResponse,
} from "../types";


// ==========================================================
// LIST PARAMS
// ==========================================================

export interface ParentListParams {

  page?: number;

  page_size?: number;

  search?: string;

  ordering?: string;

  must_change_password?: boolean;

}


// ==========================================================
// UPDATE PAYLOAD
// ==========================================================

export interface UpdateParentPayload {

  first_name: string;

  last_name: string;

  phone: string;

  alternate_phone?: string;

  occupation?: string;

  address?: string;

}


// ==========================================================
// SERVICE
// ==========================================================

class ParentService {


  // ========================================================
  // GET PARENTS
  // ========================================================

  async getParents(

    params: ParentListParams = {}

  ): Promise<PaginatedResponse<Parent>> {

    const { data } = await api.get<
      PaginatedResponse<Parent>
    >(

      "/auth/parents/",

      {
        params,
      }

    );

    return data;

  }


  // ========================================================
  // UPDATE PARENT
  // ========================================================

  async updateParent(

    parentId: string,

    payload: UpdateParentPayload

  ): Promise<Parent> {

    const { data } = await api.patch<Parent>(

      `/auth/parents/${parentId}/`,

      payload

    );

    return data;

  }


  // ========================================================
  // RESET PASSWORD
  // ========================================================

  async resetPassword(

    parentId: string

  ): Promise<ResetParentPasswordResponse> {

    const { data } =

      await api.post<
        ResetParentPasswordResponse
      >(

        `/auth/parents/${parentId}/reset-password/`

      );

    return data;

  }


  // ========================================================
  // DEACTIVATE PARENT
  // ========================================================

  async deactivateParent(

    parentId: string

  ): Promise<void> {

    await api.post(

      `/auth/parents/${parentId}/deactivate/`

    );

  }


  // ========================================================
  // ACTIVATE PARENT
  // ========================================================

  async activateParent(

    parentId: string

  ): Promise<void> {

    await api.post(

      `/auth/parents/${parentId}/activate/`

    );

  }

}


// ==========================================================
// EXPORT
// ==========================================================

export default new ParentService();