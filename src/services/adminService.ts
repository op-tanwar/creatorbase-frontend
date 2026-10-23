import api from '@/lib/api';
import {
  AdminMetrics,
  AdminActivity,
  AdminAgency,
  AdminTransaction,
  Creator,
  ApiResponse,
} from '@/types';

export interface AdminMetricsResponse {
  metrics: AdminMetrics;
  planBreakdown: Record<string, number>;
  recentActivities: AdminActivity[];
}

export interface AdminAgenciesResponse {
  agencies: AdminAgency[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminTransactionsResponse {
  transactions: AdminTransaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const adminService = {
  async getMetrics(): Promise<AdminMetricsResponse> {
    const res = await api.get<ApiResponse<AdminMetricsResponse>>('/admin/metrics');
    return res.data.data;
  },

  async getAgencies(params?: {
    page?: number;
    limit?: number;
    search?: string;
    plan?: string;
    status?: string;
  }): Promise<AdminAgenciesResponse> {
    const res = await api.get<ApiResponse<AdminAgenciesResponse>>('/admin/agencies', { params });
    return res.data.data;
  },

  async updateAgency(
    id: string,
    data: {
      planType?: string;
      planExpiresAt?: string | null;
      subscriptionStatus?: string;
      isSuspended?: boolean;
      suspensionReason?: string | null;
    }
  ): Promise<AdminAgency> {
    const res = await api.patch<ApiResponse<AdminAgency>>(`/admin/agencies/${id}`, data);
    return res.data.data;
  },

  async getTransactions(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<AdminTransactionsResponse> {
    const res = await api.get<ApiResponse<AdminTransactionsResponse>>('/admin/transactions', { params });
    return res.data.data;
  },

  async createCreator(data: Partial<Creator>): Promise<Creator> {
    const res = await api.post<ApiResponse<Creator>>('/admin/creators', data);
    return res.data.data;
  },

  async updateCreator(id: string, data: Partial<Creator>): Promise<Creator> {
    const res = await api.patch<ApiResponse<Creator>>(`/admin/creators/${id}`, data);
    return res.data.data;
  },

  async deleteCreator(id: string): Promise<{ id: string }> {
    const res = await api.delete<ApiResponse<{ id: string }>>(`/admin/creators/${id}`);
    return res.data.data;
  },
};

export default adminService;
