const API_URL = 'http://localhost:3000/api';

export const productoresAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/productores`);
    return response.json();
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_URL}/productores/${id}`);
    return response.json();
  },
  
  create: async (data) => {
    const response = await fetch(`${API_URL}/productores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  update: async (id, data) => {
    const response = await fetch(`${API_URL}/productores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_URL}/productores/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};

export const lotesAPI = {
  getAll: async (estado = '') => {
    const url = estado ? `${API_URL}/lotes?estado=${estado}` : `${API_URL}/lotes`;
    const response = await fetch(url);
    return response.json();
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_URL}/lotes/${id}`);
    return response.json();
  },
  
  create: async (data) => {
    const response = await fetch(`${API_URL}/lotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  update: async (id, data) => {
    const response = await fetch(`${API_URL}/lotes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

export const controlCalidadAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/control-calidad`);
    return response.json();
  },
  
  create: async (data) => {
    const response = await fetch(`${API_URL}/control-calidad`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

export const comprasAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/compras`);
    return response.json();
  },
  
  create: async (data) => {
    const response = await fetch(`${API_URL}/compras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};