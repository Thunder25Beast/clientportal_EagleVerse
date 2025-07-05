const API_BASE_URL = 'https://eagle-backend-v1-production.up.railway.app/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  requiresAuth?: boolean;
  headers?: Record<string, string>;
}

class ApiClient {
  private getAuthToken(): string | null {
    return localStorage.getItem('salon-token');
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('salon-token');
        localStorage.removeItem('salon-user');
        window.location.href = '/';
        throw new Error('Unauthorized');
      }
      throw new Error(`API Error: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return response.text();
  }

  async request(endpoint: string, options: ApiOptions = {}) {
    const {
      method = 'GET',
      body,
      requiresAuth = true,
      headers: customHeaders = {}
    } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    };

    if (requiresAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body) {
      config.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      return this.handleResponse(response);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
      requiresAuth: false
    });
  }

  // User endpoints
  async getCurrentUser() {
    return this.request('/salon-user/get-id');
  }

  async getUserById(id: string) {
    return this.request(`/salon-user/staff/${id}`);
  }

  async getAllStaff() {
    return this.request('/salon-user/get-all');
  }

  async getSalonStaff() {
    return this.request('/salon-user/salon-staff');
  }

  async updateStaffDetails(staffId: string, data: any) {
    return this.request(`/salon-user/staff/${staffId}`, {
      method: 'PUT',
      body: data
    });
  }

  async updateStaffStatus(data: any) {
    return this.request('/salon-user/status', {
      method: 'PATCH',
      body: data
    });
  }

  // Lead endpoints
  async getAllLeads() {
    return this.request('/leads');
  }

  async getLeadById(id: string) {
    return this.request(`/leads/${id}`);
  }

  async createLead(data: any) {
    return this.request('/leads', {
      method: 'POST',
      body: data
    });
  }

  async updateLead(id: string, data: any) {
    return this.request(`/leads/${id}`, {
      method: 'PUT',
      body: data
    });
  }

  async updateLeadStatus(id: string, status: string) {
    return this.request(`/leads/${id}/status?status=${status}`, {
      method: 'PATCH'
    });
  }
}

export const apiClient = new ApiClient();
export { API_BASE_URL };
