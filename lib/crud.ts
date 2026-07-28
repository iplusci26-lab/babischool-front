import { api } from "./api";
import { PaginatedResponse } from "./types";

export class CrudService<T, F = Partial<T>> {
  constructor(private endpoint: string) {}

  /**
   * Liste paginée
   */
  async list(params?: Record<string, any>): Promise<PaginatedResponse<T>> {
    const response = await api.get(this.endpoint, {
      params,
    });

    return response.data;
  }

  /**
   * Détail
   */
  async get(id: string): Promise<T> {
    const response = await api.get(`${this.endpoint}${id}/`);

    return response.data;
  }

  /**
   * Création
   */
  async create(data: F): Promise<T> {
    const response = await api.post(
      this.endpoint,
      data,
    );

    return response.data;
  }

  /**
   * Modification complète
   */
  async update(
    id: string,
    data: F,
  ): Promise<T> {
    const response = await api.put(
      `${this.endpoint}${id}/`,
      data,
    );

    return response.data;
  }

  /**
   * Modification partielle
   */
  async patch(
    id: string,
    data: Partial<F>,
  ): Promise<T> {
    const response = await api.patch(
      `${this.endpoint}${id}/`,
      data,
    );

    return response.data;
  }

  /**
   * Suppression
   */
  async remove(id: string): Promise<void> {
    await api.delete(
      `${this.endpoint}${id}/`,
    );
  }
}