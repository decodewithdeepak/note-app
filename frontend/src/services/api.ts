const API_BASE = 'http://localhost:5000/api';

// Auth API
export const authAPI = {
    register: async (userData: { name: string; email: string; password: string }) => {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }
        return data;
    },

    verifyOTP: async (data: { userId?: string; email: string; otp: string }) => {
        const response = await fetch(`${API_BASE}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'OTP verification failed');
        }
        return result;
    },

    login: async (credentials: { email: string; password: string }) => {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        return data;
    },

    getProfile: async (token: string) => {
        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to get profile');
        }
        return data;
    }
};

// Notes API
export const notesAPI = {
    getNotes: async (token: string) => {
        const response = await fetch(`${API_BASE}/notes`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch notes');
        }
        return data.notes || data;
    },

    createNote: async (token: string, note: { title: string; content: string }) => {
        const response = await fetch(`${API_BASE}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(note),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to create note');
        }
        return data.note || data;
    },

    updateNote: async (token: string, id: string, note: { title: string; content: string; isPinned?: boolean }) => {
        const response = await fetch(`${API_BASE}/notes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(note),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to update note');
        }
        return data.note || data;
    },

    deleteNote: async (token: string, id: string) => {
        const response = await fetch(`${API_BASE}/notes/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to delete note');
        }
        return data;
    }
};
