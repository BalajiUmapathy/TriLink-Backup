const BASE_URL = 'http://localhost:5081/api';

const getHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    get: async (endpoint, params = {}) => {
        const url = new URL(`${BASE_URL}${endpoint}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            handleError(response);
        }
        return response.json();
    },

    post: async (endpoint, body, isFormData = false) => {
        const headers = getHeaders();
        if (isFormData) {
            delete headers['Content-Type'];
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: isFormData ? (headers.Authorization ? { Authorization: headers.Authorization } : {}) : headers,
            body: isFormData ? body : JSON.stringify(body),
        });

        if (!response.ok) {
            await handleError(response);
        }
        return response.json();
    },

    put: async (endpoint, body) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            await handleError(response);
        }
        return response.json();
    },

    delete: async (endpoint) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (!response.ok) {
            await handleError(response);
        }
        return response.json();
    }
};

async function handleError(response) {
    let errorMessage = response.statusText;
    try {
        const clone = response.clone();
        const errorData = await clone.json();
        errorMessage = errorData.message || errorData.title || JSON.stringify(errorData);

        // Extract validation errors if present
        if (errorData.errors) {
            const validationErrors = Object.entries(errorData.errors)
                .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                .join('\n');
            errorMessage += `\n\nDetails:\n${validationErrors}`;
        }
    } catch (e) {
        const text = await response.text();
        if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
}
