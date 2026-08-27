import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// =========================
// Авторизация
// =========================

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// =========================
// Диалоги
// =========================

// Создать или получить диалог
export const getOrCreateConversation = (
  userId,
  listingId
) =>
  API.post("/chat/conversation", {
    userId,
    listingId,
  });

// Получить все диалоги
export const getConversations = () =>
  API.get("/chat/conversations");

// Удалить диалог
export const deleteConversation = (id) =>
  API.delete(`/chat/conversation/${id}`);

// =========================
// Сообщения
// =========================

// Получить сообщения диалога
export const getMessages = (id) =>
  API.get(`/chat/messages/${id}`);

// Отправить сообщение
export const sendMessage = ({
  conversationId,
  text,
  receiverId,
}) =>
  API.post("/chat/message", {
    conversationId,
    text,
    receiverId,
  });