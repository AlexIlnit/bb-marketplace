import api from "./axios";

export const getDeal = (conversationId) =>
  api.get(`/deal/${conversationId}`);

export const requestCompletion = (conversationId) =>
  api.post("/deal/request", {
    conversationId,
  });

export const confirmDeal = (conversationId) =>
  api.post("/deal/confirm", {
    conversationId,
  });

export const cancelDeal = (conversationId) =>
  api.patch(`/deal/${conversationId}/cancel`);
