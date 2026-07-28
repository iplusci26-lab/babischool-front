export interface Parent {
    id: string;
    full_name: string;
    phone: string;
    must_change_password: boolean;
    children_count: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  }
  
  export interface ResetParentPasswordResponse {
    message: string;
    parent: {
      id: string;
      name: string;
      phone: string;
    };
    temporary_password: string;
    must_change_password: boolean;
  }