import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getOrCreateConversation = (
  userId,
  listingId
) =>
  API.post("/chat/conversation", {
    userId,
    listingId,
  });
export const getConversations = () =>
  API.get("/chat/conversations");

export const getMessages = (id) =>
  API.get(`/chat/messages/${id}`);

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