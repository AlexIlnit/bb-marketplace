import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getOrCreateConversation = (userId) =>
  API.post("/chat/conversation", { userId });

export const getConversations = () =>
  API.get("/chat/conversations");

export const getMessages = (id) =>
  API.get(`/chat/messages/${id}`);

export const sendMessage = (data) =>
  API.post("/chat/message", data);