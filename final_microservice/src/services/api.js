/**
 * API Service Layer
 * Handles all communication with the backend microservices
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Set auth token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Get user data from localStorage
const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Set user data in localStorage
const setUserData = (user) => {
  localStorage.setItem('userData', JSON.stringify(user));
};

// Remove user data from localStorage
const removeUserData = () => {
  localStorage.removeItem('userData');
};

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch(endpoint, options = {}) {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        removeAuthToken();
        removeUserData();
        window.location.href = '/'; // Redirect to login
      }
      
      throw new Error(data.error?.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ============================================
// AUTHENTICATION API
// ============================================

export const authAPI = {
  /**
   * Register a new user
   */
  async register(email, password, name) {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    if (data.success && data.data) {
      setAuthToken(data.data.token);
      setUserData(data.data.user);
    }

    return data;
  },

  /**
   * Login user
   */
  async login(email, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.success && data.data) {
      setAuthToken(data.data.token);
      setUserData(data.data.user);
    }

    return data;
  },

  /**
   * Logout user
   */
  logout() {
    removeAuthToken();
    removeUserData();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!getAuthToken();
  },

  /**
   * Get current user data
   */
  getCurrentUser() {
    return getUserData();
  },
};

// ============================================
// USER API
// ============================================

export const userAPI = {
  /**
   * Get user profile
   */
  async getProfile(userId) {
    return await apiFetch(`/users/${userId}`);
  },

  /**
   * Update user profile
   */
  async updateProfile(userId, updates) {
    const data = await apiFetch(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    // Update local user data
    if (data.success && data.data) {
      const currentUser = getUserData();
      setUserData({ ...currentUser, ...data.data });
    }

    return data;
  },

  /**
   * Change password
   */
  async changePassword(userId, currentPassword, newPassword) {
    return await apiFetch(`/users/${userId}/password`, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

// ============================================
// ITEM API
// ============================================

export const itemAPI = {
  /**
   * Get all items for current user
   */
  async getAll(userId) {
    return await apiFetch(`/items?userId=${userId}`);
  },

  /**
   * Get single item
   */
  async getById(itemId, userId) {
    return await apiFetch(`/items/${itemId}?userId=${userId}`);
  },

  /**
   * Create new item
   */
  async create(userId, itemData) {
    return await apiFetch('/items', {
      method: 'POST',
      body: JSON.stringify({ userId, ...itemData }),
    });
  },

  /**
   * Update item
   */
  async update(itemId, userId, updates) {
    return await apiFetch(`/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ userId, ...updates }),
    });
  },

  /**
   * Delete item
   */
  async delete(itemId, userId) {
    return await apiFetch(`/items/${itemId}?userId=${userId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get available locations
   */
  async getLocations(userId) {
    return await apiFetch(`/locations?userId=${userId}`);
  },
};

// ============================================
// SEARCH API
// ============================================

export const searchAPI = {
  /**
   * Search items with filters
   */
  async search(userId, filters = {}) {
    const params = new URLSearchParams({
      userId,
      ...filters,
    });
    return await apiFetch(`/search?${params}`);
  },

  /**
   * Full-text search
   */
  async fullTextSearch(userId, query) {
    const params = new URLSearchParams({ userId, query });
    return await apiFetch(`/search/fulltext?${params}`);
  },

  /**
   * Get all tags
   */
  async getTags(userId) {
    return await apiFetch(`/search/tags?userId=${userId}`);
  },
};

// ============================================
// AI ASSISTANT API
// ============================================

export const aiAPI = {
  /**
   * Process natural language query
   */
  async query(userId, query) {
    return await apiFetch('/ai/query', {
      method: 'POST',
      body: JSON.stringify({ userId, query }),
    });
  },

  /**
   * Get query suggestions
   */
  async getSuggestions(userId) {
    return await apiFetch(`/ai/suggestions?userId=${userId}`);
  },
};

// ============================================
// ANALYTICS API
// ============================================

export const analyticsAPI = {
  /**
   * Get dashboard statistics
   */
  async getDashboard(userId) {
    return await apiFetch(`/analytics/dashboard?userId=${userId}`);
  },

  /**
   * Get activity logs
   */
  async getActivity(userId, options = {}) {
    const params = new URLSearchParams({
      userId,
      ...options,
    });
    return await apiFetch(`/analytics/activity?${params}`);
  },

  /**
   * Get location statistics
   */
  async getLocationStats(userId) {
    return await apiFetch(`/analytics/stats/locations?userId=${userId}`);
  },
};

// Export all APIs
export default {
  auth: authAPI,
  user: userAPI,
  item: itemAPI,
  search: searchAPI,
  ai: aiAPI,
  analytics: analyticsAPI,
};

