import { useEffect, useState } from "react";

import {
  getConversations,
  deleteConversation,
} from "../../api/chatApi";

import { useAuthStore } from "../../store/authStore";
import { socket } from "../../socket";

const DEAL_STATUS = {
  active: {
    label: "Сделка в процессе",
    className: "text-amber-600 bg-amber-50",
    icon: "🟡",
  },

  completed: {
    label: "Сделка завершена",
    className: "text-green-600 bg-green-50",
    icon: "✓",
  },

  cancelled: {
    label: "Сделка отменена",
    className: "text-red-600 bg-red-50",
    icon: "×",
  },
};

const CANCEL_REASONS = {
  changed_mind: "Передумал(а)",
  sold_elsewhere: "Товар уже продан",
  could_not_agree: "Не удалось договориться",
  buyer_not_responding: "Покупатель не отвечает",
  seller_not_responding: "Продавец не отвечает",
  no_longer_needed: "Сделка больше не актуальна",
  other: "Другое",
};

export default function ConversationsList({
  selectedChat,
  setSelectedChat,
}) {
  const user = useAuthStore((s) => s.user);

  const [conversations, setConversations] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  // =========================
  // Выбранные диалоги
  // =========================

  const [selectedConversations, setSelectedConversations] =
    useState([]);

  const [deleting, setDeleting] = useState(false);

  // =========================
  // Загрузка
  // =========================

  const loadConversations = async () => {
    try {
      const { data } = await getConversations();

      setConversations(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Ошибка загрузки диалогов:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // =========================
  // Socket
  // =========================

  useEffect(() => {
    const handleDealCancelled = () => {
      loadConversations();
    };

    const handleDealCompleted = () => {
      loadConversations();
    };

    const handleNewMessage = () => {
      loadConversations();
    };

    socket.on(
      "dealCancelled",
      handleDealCancelled
    );

    socket.on(
      "dealCompleted",
      handleDealCompleted
    );

    socket.on(
      "newMessage",
      handleNewMessage
    );

    return () => {
      socket.off(
        "dealCancelled",
        handleDealCancelled
      );

      socket.off(
        "dealCompleted",
        handleDealCompleted
      );

      socket.off(
        "newMessage",
        handleNewMessage
      );
    };
  }, []);

  // =========================
  // Online / Offline
  // =========================

  useEffect(() => {
    const handleOnline = (userId) => {
      setConversations((prev) =>
        prev.map((conversation) => ({
          ...conversation,

          members: conversation.members.map(
            (member) =>
              String(member._id) ===
              String(userId)
                ? {
                    ...member,
                    online: true,
                  }
                : member
          ),
        }))
      );
    };

    const handleOffline = (userId) => {
      setConversations((prev) =>
        prev.map((conversation) => ({
          ...conversation,

          members: conversation.members.map(
            (member) =>
              String(member._id) ===
              String(userId)
                ? {
                    ...member,
                    online: false,
                  }
                : member
          ),
        }))
      );
    };

    socket.on(
      "userOnline",
      handleOnline
    );

    socket.on(
      "userOffline",
      handleOffline
    );

    return () => {
      socket.off(
        "userOnline",
        handleOnline
      );

      socket.off(
        "userOffline",
        handleOffline
      );
    };
  }, []);

  // =========================
  // Счётчики
  // =========================

  const counts = {
    all: conversations.length,

    active: conversations.filter(
      (conversation) =>
        conversation.deal?.status === "active"
    ).length,

    completed: conversations.filter(
      (conversation) =>
        conversation.deal?.status === "completed"
    ).length,

    cancelled: conversations.filter(
      (conversation) =>
        conversation.deal?.status === "cancelled"
    ).length,
  };

  // =========================
  // Фильтрация
  // =========================

  const filteredConversations =
    conversations.filter((conversation) => {
      if (activeTab === "all") {
        return true;
      }

      return (
        conversation.deal?.status ===
        activeTab
      );
    });

  // =========================
  // Выбор одного
  // =========================

  const toggleConversation = (id) => {
    setSelectedConversations((prev) => {
      if (prev.includes(id)) {
        return prev.filter(
          (item) => item !== id
        );
      }

      return [...prev, id];
    });
  };

  // =========================
  // Выбрать все
  // =========================

  const allVisibleSelected =
    filteredConversations.length > 0 &&
    filteredConversations.every((conversation) =>
      selectedConversations.includes(
        conversation._id
      )
    );

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedConversations((prev) =>
        prev.filter(
          (id) =>
            !filteredConversations.some(
              (conversation) =>
                conversation._id === id
            )
        )
      );

      return;
    }

    const visibleIds =
      filteredConversations.map(
        (conversation) =>
          conversation._id
      );

    setSelectedConversations((prev) => [
      ...new Set([
        ...prev,
        ...visibleIds,
      ]),
    ]);
  };

  // =========================
  // Удаление
  // =========================

  const handleDeleteSelected = async () => {
    if (
      selectedConversations.length === 0 ||
      deleting
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Удалить выбранные диалоги (${selectedConversations.length})?`
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      await Promise.all(
        selectedConversations.map((id) =>
          deleteConversation(id)
        )
      );

      const deletedIds = [
        ...selectedConversations,
      ];

      setConversations((prev) =>
        prev.filter(
          (conversation) =>
            !deletedIds.includes(
              conversation._id
            )
        )
      );

      // Если открытый чат удалён —
      // закрываем его
      if (
        selectedChat &&
        deletedIds.includes(selectedChat)
      ) {
        setSelectedChat(null);
      }

      setSelectedConversations([]);
    } catch (error) {
      console.error(
        "Ошибка удаления диалогов:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Не удалось удалить выбранные диалоги"
      );
    } finally {
      setDeleting(false);
    }
  };

  // =========================
  // Статус сделки
  // =========================

  const getDealStatus = (conversation) => {
    const status =
      conversation.deal?.status;

    if (!status) return null;

    return DEAL_STATUS[status] || null;
  };

  // =========================
  // Время
  // =========================

  const formatTime = (date) => {
    if (!date) return "";

    const messageDate = new Date(date);
    const now = new Date();

    const sameDay =
      messageDate.toDateString() ===
      now.toDateString();

    if (sameDay) {
      return messageDate.toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    }

    return messageDate.toLocaleDateString(
      [],
      {
        day: "2-digit",
        month: "2-digit",
      }
    );
  };

  // =========================
  // Смена вкладки
  // =========================

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    // Чтобы выбранные элементы
    // не оставались от другой вкладки
    setSelectedConversations([]);
  };

  // =========================
  // Render
  // =========================

  return (
    <div className="w-full min-w-0 bg-white">

      {/* ========================= */}
      {/* Заголовок */}
      {/* ========================= */}

      <div className="px-4 sm:px-6 pt-5 pb-3">

        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Сообщения
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Ваши диалоги с покупателями и продавцами
        </p>

      </div>

      {/* ========================= */}
      {/* Вкладки */}
      {/* ========================= */}

      <div className="px-4 sm:px-6 pb-3">

        <div className="flex flex-wrap gap-2 pb-1">

          {[
            {
              id: "all",
              label: "Все",
              count: counts.all,
            },
            {
              id: "active",
              label: "В процессе",
              count: counts.active,
            },
            {
              id: "completed",
              label: "Завершённые",
              count: counts.completed,
            },
            {
              id: "cancelled",
              label: "Отменённые",
              count: counts.cancelled,
            },
          ].map((tab) => {
            const active =
              activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  handleTabChange(tab.id)
                }
                className={`
                  shrink-0
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-medium
                  transition

                  ${
                    active
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }
                `}
              >
                {tab.label}

                <span
                  className={`
                    min-w-5
                    h-5
                    px-1.5
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-xs

                    ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-white text-gray-500"
                    }
                  `}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}

        </div>

      </div>

      {/* ========================= */}
      {/* Панель выбора */}
      {/* ========================= */}

      {!loading &&
        filteredConversations.length > 0 && (
          <div
            className="
              px-4
              sm:px-6
              py-2.5
              border-y
              border-gray-100
              bg-gray-50
              flex
              items-center
              justify-between
              gap-3
            "
          >

            <button
              type="button"
              onClick={toggleSelectAll}
              className="
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-gray-700
                hover:text-green-600
                transition
              "
            >

              <span
                className={`
                  w-5
                  h-5
                  rounded-md
                  border
                  flex
                  items-center
                  justify-center
                  transition

                  ${
                    allVisibleSelected
                      ? "bg-green-600 border-green-600 text-white"
                      : "bg-white border-gray-300"
                  }
                `}
              >
                {allVisibleSelected && "✓"}
              </span>

              {allVisibleSelected
                ? "Снять выбор"
                : "Выбрать все"}

            </button>

            {selectedConversations.length > 0 && (
              <div className="flex items-center gap-3">

                <span className="text-sm text-gray-500">
                  Выбрано:{" "}
                  <b className="text-gray-900">
                    {selectedConversations.length}
                  </b>
                </span>

                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  disabled={deleting}
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    px-3
                    py-1.5
                    rounded-lg
                    bg-red-50
                    text-red-600
                    hover:bg-red-100
                    disabled:opacity-50
                    text-sm
                    font-medium
                    transition
                  "
                >
                  🗑
                  {deleting
                    ? "Удаление..."
                    : "Удалить"}
                </button>

              </div>
            )}

          </div>
        )}

      {/* ========================= */}
      {/* Список */}
      {/* ========================= */}

      <div className="border-t border-gray-100">

        {loading ? (

          <div className="p-10 text-center text-sm text-gray-500">
            Загрузка сообщений...
          </div>

        ) : filteredConversations.length === 0 ? (

          <div className="p-10 text-center">

            <div className="text-4xl mb-3">
              💬
            </div>

            <h3 className="font-semibold text-gray-900">
              Здесь пока пусто
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {activeTab === "all"
                ? "У вас пока нет диалогов"
                : "В этой категории нет диалогов"}
            </p>

          </div>

        ) : (

          <div>

            {filteredConversations.map(
              (conversation) => {

                const otherUser =
                  conversation.members?.find(
                    (member) =>
                      String(member._id) !==
                      String(user?._id)
                  );

                const dealStatus =
                  getDealStatus(
                    conversation
                  );

                const isSelected =
                  selectedChat ===
                  conversation._id;

                const isChecked =
                  selectedConversations.includes(
                    conversation._id
                  );

                const unread =
                  conversation.unreadCount || 0;

                const image =
                  conversation.listing
                    ?.images?.[0] ||
                  otherUser?.avatar ||
                  "/default-avatar.png";

                const cancelReason =
                  conversation.deal
                    ?.cancelReason;

                return (
                  <div
                    key={conversation._id}
                    className={`
                      flex
                      items-stretch
                      border-b
                      border-gray-100
                      transition

                      ${
                        isChecked
                          ? "bg-green-50"
                          : isSelected
                          ? "bg-green-50"
                          : "bg-white hover:bg-gray-50"
                      }
                    `}
                  >

                    {/* ========================= */}
                    {/* CHECKBOX */}
                    {/* ========================= */}

                    <button
                      type="button"
                      aria-label={
                        isChecked
                          ? "Снять выбор"
                          : "Выбрать диалог"
                      }
                      onClick={() =>
                        toggleConversation(
                          conversation._id
                        )
                      }
                      className="
                        w-12
                        shrink-0
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <span
                        className={`
                          w-5
                          h-5
                          rounded-md
                          border
                          flex
                          items-center
                          justify-center
                          transition

                          ${
                            isChecked
                              ? "bg-green-600 border-green-600 text-white"
                              : "bg-white border-gray-300 hover:border-green-500"
                          }
                        `}
                      >
                        {isChecked && "✓"}
                      </span>

                    </button>

                    {/* ========================= */}
                    {/* ДИАЛОГ */}
                    {/* ========================= */}

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedChat(
                          conversation._id
                        );

                        // При открытии не меняем
                        // выбор чекбокса
                      }}
                      className="
                        flex-1
                        min-w-0
                        text-left
                        px-2
                        sm:px-3
                        py-3
                      "
                    >

                      <div className="flex gap-3 sm:gap-4">

                        {/* Фото */}

                        <div className="relative shrink-0">

                          <img
                            src={image}
                            alt=""
                            className="
                              w-16
                              h-16
                              sm:w-18
                              sm:h-18
                              rounded-xl
                              object-cover
                              bg-gray-100
                            "
                          />

                          {otherUser?.online && (
                            <span
                              className="
                                absolute
                                right-0
                                bottom-0
                                w-3
                                h-3
                                rounded-full
                                bg-green-500
                                border-2
                                border-white
                              "
                            />
                          )}

                        </div>

                        {/* Контент */}

                        <div className="flex-1 min-w-0">

                          <div className="flex items-start justify-between gap-3">

                            <div className="min-w-0">

                              <div className="flex items-center gap-2">

                                <h3
                                  className="
                                    font-semibold
                                    text-gray-900
                                    truncate
                                  "
                                >
                                  {otherUser?.name ||
                                    "Пользователь"}
                                </h3>

                                {otherUser?.online && (
                                  <span
                                    className="
                                      text-[11px]
                                      text-green-600
                                      hidden
                                      sm:inline
                                    "
                                  >
                                    онлайн
                                  </span>
                                )}

                              </div>

                            </div>

                            <span
                              className="
                                shrink-0
                                text-xs
                                text-gray-400
                              "
                            >
                              {formatTime(
                                conversation.updatedAt
                              )}
                            </span>

                          </div>

                          {/* Объявление */}

                          {conversation.listing
                            ?.title && (
                            <div
                              className="
                                text-xs
                                text-gray-500
                                truncate
                                mt-0.5
                              "
                            >
                              {conversation.listing.title}
                            </div>
                          )}

                          {/* Сделка */}

                          {dealStatus && (
                            <div className="mt-1.5">

                              <span
                                className={`
                                  inline-flex
                                  items-center
                                  gap-1
                                  px-2
                                  py-0.5
                                  rounded-md
                                  text-[11px]
                                  font-medium
                                  ${dealStatus.className}
                                `}
                              >

                                <span>
                                  {dealStatus.icon}
                                </span>

                                {dealStatus.label}

                              </span>

                              {conversation.deal
                                ?.status ===
                                "cancelled" &&
                                cancelReason && (
                                  <span
                                    className="
                                      ml-2
                                      text-[11px]
                                      text-gray-400
                                    "
                                  >
                                    ·{" "}
                                    {CANCEL_REASONS[
                                      cancelReason
                                    ] ||
                                      cancelReason}
                                  </span>
                                )}

                            </div>
                          )}

                          {/* Последнее сообщение */}

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              gap-3
                              mt-1.5
                            "
                          >

                            <p
                              className={`
                                text-sm
                                truncate

                                ${
                                  unread > 0
                                    ? "font-semibold text-gray-900"
                                    : "text-gray-500"
                                }
                              `}
                            >
                              {conversation.lastMessage ||
                                "Нет сообщений"}
                            </p>

                            {unread > 0 && (
                              <span
                                className="
                                  shrink-0
                                  min-w-5
                                  h-5
                                  px-1.5
                                  rounded-full
                                  bg-green-600
                                  text-white
                                  text-[11px]
                                  font-bold
                                  flex
                                  items-center
                                  justify-center
                                "
                              >
                                {unread > 99
                                  ? "99+"
                                  : unread}
                              </span>
                            )}

                          </div>

                        </div>

                      </div>

                    </button>

                  </div>
                );
              }
            )}

          </div>

        )}

      </div>

    </div>
  );
}