import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
const USER_ID_STORAGE_KEY = "medical-user-id";

export const getOrCreateUserId = () => {
  let userId = localStorage.getItem(USER_ID_STORAGE_KEY);
  if (!userId) {
    const randomPart =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    userId = `user-${randomPart}`;
    localStorage.setItem(USER_ID_STORAGE_KEY, userId);
  }
  return userId;
};

export const sendMessage = async (message, specialty, userId, language = "en") => {
  const response = await axios.post(`${API_BASE_URL}/api/chat`, {
    message,
    specialty,
    user_id: userId,
    language
  });

  return response.data;
};

/**
 * Simulated streaming: calls the API then reveals words incrementally.
 * onChunk(partialText) is called as words appear.
 * Returns the final full response object.
 */
export const sendMessageStreaming = async (message, specialty, userId, onChunk, language = "en") => {
  const response = await axios.post(`${API_BASE_URL}/api/chat`, {
    message,
    specialty,
    user_id: userId,
    language
  });

  const data = response.data;
  const words = data.reply.split(" ");
  let partial = "";

  for (let i = 0; i < words.length; i++) {
    partial += (i > 0 ? " " : "") + words[i];
    onChunk(partial);
    await new Promise((r) => setTimeout(r, 25));
  }

  return data;
};

export const getChatHistory = async (specialty, userId, limit = 50) => {
  const response = await axios.get(`${API_BASE_URL}/api/history`, {
    params: {
      specialty,
      user_id: userId,
      limit
    }
  });

  return response.data;
};


// ============ Doctors ============

export const getDoctors = async (filters = {}) => {
  const response = await axios.get(`${API_BASE_URL}/api/doctors`, { params: filters });
  return response.data.doctors;
};

export const getDoctor = async (doctorId) => {
  const response = await axios.get(`${API_BASE_URL}/api/doctors/${doctorId}`);
  return response.data;
};


// ============ Medicines ============

export const getMedicines = async (filters = {}) => {
  const response = await axios.get(`${API_BASE_URL}/api/medicines`, { params: filters });
  return response.data.medicines;
};


// ============ Lab Tests ============

export const getLabTests = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/lab-tests`);
  return response.data.lab_tests;
};

export const getLabTest = async (testId) => {
  const response = await axios.get(`${API_BASE_URL}/api/lab-tests/${testId}`);
  return response.data;
};


// ============ Surgeries ============

export const getSurgeries = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/surgeries`);
  return response.data.surgeries;
};


// ============ Cart ============

export const getCart = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/api/cart/${userId}`);
  return response.data;
};

export const addToCart = async (userId, itemId, itemType, quantity = 1) => {
  const response = await axios.post(`${API_BASE_URL}/api/cart`, {
    user_id: userId,
    item_id: itemId,
    item_type: itemType,
    quantity
  });
  return response.data;
};

export const removeFromCart = async (userId, itemId) => {
  const response = await axios.delete(`${API_BASE_URL}/api/cart/${userId}/${itemId}`);
  return response.data;
};

export const updateCartQuantity = async (userId, itemId, quantity) => {
  const response = await axios.put(`${API_BASE_URL}/api/cart/${userId}/${itemId}`, null, {
    params: { quantity }
  });
  return response.data;
};


// ============ Orders ============

export const placeOrder = async (userId, deliveryInfo) => {
  const response = await axios.post(`${API_BASE_URL}/api/orders`, {
    user_id: userId,
    ...deliveryInfo
  });
  return response.data;
};

export const getOrders = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/api/orders/${userId}`);
  return response.data.orders;
};


// ============ Appointments ============

export const bookAppointment = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/api/appointments`, data);
  return response.data;
};

export const getAppointments = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/api/appointments/${userId}`);
  return response.data.appointments;
};


// ============ Lab Bookings ============

export const bookLabTest = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/api/lab-bookings`, data);
  return response.data;
};

export const getLabBookings = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/api/lab-bookings/${userId}`);
  return response.data.lab_bookings;
};
