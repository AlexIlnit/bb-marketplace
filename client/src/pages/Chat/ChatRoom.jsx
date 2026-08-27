import { useEffect, useRef, useState } from "react";

import {
  Send,
  MoreVertical,
  ArrowLeft,
  Check,
  CheckCheck,
  CircleCheck,
  CircleX,
  Clock3,
  Star,
  X,
  Package,
  User,
} from "lucide-react";

import { useAuthStore } from "../../store/authStore";

import {
  getMessages,
  sendMessage,
  deleteConversation,
} from "../../api/chatApi";

import { socket } from "../../socket";

import RatingModal from "../../components/rating/RatingModal";

import {
  getDeal,
  requestCompletion,
  confirmDeal,
  cancelDeal,
} from "../../api/dealApi";


// =====================================================
// CANCEL REASONS
// =====================================================

const CANCEL_REASONS = {
  changed_mind: "Передумал(а)",
  sold_elsewhere: "Товар уже продан",
  could_not_agree: "Не удалось договориться",
  buyer_not_responding: "Покупатель не отвечает",
  seller_not_responding: "Продавец не отвечает",
  no_longer_needed: "Сделка больше не актуальна",
  other: "Другое",
};


// =====================================================
// DEAL STATUS
// =====================================================

const DEAL_STATUS = {
  active: {
    label: "Сделка в процессе",
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },

  completed: {
    label: "Сделка завершена",
    icon: CircleCheck,
    className: "bg-green-50 text-green-700 border-green-200",
  },

  cancelled: {
    label: "Сделка отменена",
    icon: CircleX,
    className: "bg-red-50 text-red-700 border-red-200",
  },
};


export default function ChatRoom({
  chatId,
  otherUserId,
  onBack,
  conversation,
}) {
  const user = useAuthStore((s) => s.user);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);

  const [deal, setDeal] = useState(null);

  const [showRating, setShowRating] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelComment, setCancelComment] = useState("");

  const [sending, setSending] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const chatRef = useRef(null);
  const typingTimeout = useRef(null);


  // =====================================================
  // USER / DEAL
  // =====================================================

  const sellerId =
    deal?.seller?._id?.toString() ||
    deal?.seller?.toString();

  const buyerId =
    deal?.buyer?._id?.toString() ||
    deal?.buyer?.toString();

  const userId = user?._id?.toString();

  const isSeller = sellerId === userId;
  const isBuyer = buyerId === userId;

  const alreadyRated =
    (isBuyer && deal?.buyerRated) ||
    (isSeller && deal?.sellerRated);


  // =====================================================
  // LOAD MESSAGES
  // =====================================================

  const loadMessages = async () => {
    if (!chatId) return;

    try {
      const { data } = await getMessages(chatId);

      setMessages(data || []);
    } catch (error) {
      console.error(
        "Ошибка загрузки сообщений:",
        error
      );
    }
  };


  useEffect(() => {
    if (!chatId) return;

    const load = async () => {
      try {
        setLoading(true);

        await loadMessages();
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [chatId]);


  // =====================================================
  // LOAD DEAL
  // =====================================================

  useEffect(() => {
    if (!chatId) return;

    const loadDeal = async () => {
      try {
        const { data } = await getDeal(chatId);

        setDeal(data);
      } catch (error) {
        console.error(
          "Ошибка загрузки сделки:",
          error
        );

        // Если сделки пока нет — это не критическая ошибка
        setDeal(null);
      }
    };

    loadDeal();
  }, [chatId]);


  // =====================================================
  // SOCKET — NEW MESSAGE
  // =====================================================

  useEffect(() => {
    if (!chatId) return;

    const handler = (message) => {
      if (
        String(message.conversationId) !==
        String(chatId)
      ) {
        return;
      }

      setMessages((prev) => {
        const exists = prev.some(
          (item) =>
            String(item._id) ===
            String(message._id)
        );

        if (exists) {
          return prev;
        }

        return [...prev, message];
      });
    };

    socket.on("newMessage", handler);

    return () => {
      socket.off("newMessage", handler);
    };
  }, [chatId]);


  // =====================================================
  // SOCKET — MESSAGES READ
  // =====================================================

  useEffect(() => {
    if (!chatId || !user?._id) return;

    const handler = ({ conversationId }) => {
      if (
        String(conversationId) !==
        String(chatId)
      ) {
        return;
      }

      setMessages((prev) =>
        prev.map((message) => {
          const senderId =
            typeof message.senderId === "object"
              ? message.senderId?._id
              : message.senderId;

          const isMe =
            String(senderId) ===
            String(user._id);

          return {
            ...message,

            // Свои сообщения не изменяем.
            // Входящие помечаем как прочитанные.
            isRead: isMe
              ? message.isRead
              : true,
          };
        })
      );
    };

    socket.on("messagesRead", handler);

    return () => {
      socket.off("messagesRead", handler);
    };
  }, [chatId, user?._id]);


  // =====================================================
  // SOCKET — TYPING
  // =====================================================

  useEffect(() => {
    if (!otherUserId) return;

    const handler = ({
      senderId,
      isTyping,
    }) => {
      if (
        String(senderId) !==
        String(otherUserId)
      ) {
        return;
      }

      setTyping(isTyping);
    };

    socket.on("typing", handler);

    return () => {
      socket.off("typing", handler);
    };
  }, [otherUserId]);


  const handleTyping = () => {
    if (!otherUserId) return;

    socket.emit("typing", {
      receiverId: otherUserId,
      isTyping: true,
    });

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("typing", {
        receiverId: otherUserId,
        isTyping: false,
      });
    }, 700);
  };


  // =====================================================
  // AUTO SCROLL
  // =====================================================

  useEffect(() => {
    const element = chatRef.current;

    if (!element) return;

    requestAnimationFrame(() => {
      element.scrollTop = element.scrollHeight;
    });
  }, [messages.length, typing]);


  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const handleSendMessage = async () => {
  const messageText = text.trim();

  if (
    !messageText ||
    sending ||
    !chatId ||
    !user?._id
  ) {
    return;
  }

  setSending(true);

  try {
    const { data } = await sendMessage({
      conversationId: chatId,
      text: messageText,
      receiverId: otherUserId,
    });

    // Сразу показываем отправленное сообщение
    if (data) {
      setMessages((prev) => {
        const exists = prev.some(
          (message) =>
            String(message._id) ===
            String(data._id)
        );

        if (exists) {
          return prev;
        }

        return [...prev, data];
      });
    }

    setText("");

    // Останавливаем индикатор "печатает"
    socket.emit("typing", {
      receiverId: otherUserId,
      isTyping: false,
    });

  } catch (error) {
    console.error(
      "Ошибка отправки сообщения:",
      error?.response?.data || error
    );
  } finally {
    setSending(false);
  }
};

  // =====================================================
  // REQUEST COMPLETION
  // =====================================================

  const handleRequestCompletion = async () => {
    try {
      const { data } =
        await requestCompletion(chatId);

      setDeal(data);
    } catch (error) {
      console.error(
        "Ошибка завершения сделки:",
        error
      );
    }
  };


  // =====================================================
  // CONFIRM DEAL
  // =====================================================

  const handleConfirmDeal = async () => {
    try {
      const { data } =
        await confirmDeal(chatId);

      setDeal(data);
    } catch (error) {
      console.error(
        "Ошибка подтверждения сделки:",
        error
      );
    }
  };


  // =====================================================
  // CANCEL DEAL
  // =====================================================

  const handleCancelDeal = async () => {
    if (!cancelReason) {
      alert("Выберите причину отмены");
      return;
    }

    try {
      const { data } =
        await cancelDeal(
          chatId,
          {
            reason: cancelReason,
            comment: cancelComment,
          }
        );

      setDeal(data);

      setShowCancelModal(false);
      setCancelReason("");
      setCancelComment("");
    } catch (error) {
      console.error(
        "Ошибка отмены сделки:",
        error
      );

      alert("Не удалось отменить сделку");
    }
  };


  // =====================================================
  // RATING
  // =====================================================

  const handleRatingSubmit = async () => {
    setDeal((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,

        buyerRated: isBuyer
          ? true
          : prev.buyerRated,

        sellerRated: isSeller
          ? true
          : prev.sellerRated,
      };
    });

    setShowRating(false);
  };


  // =====================================================
  // DELETE CHAT
  // =====================================================

  const handleDeleteConversation = async () => {
    const confirmed = window.confirm(
      "Удалить этот диалог?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteConversation(chatId);

      setShowMenu(false);

      if (onBack) {
        onBack();
      }
    } catch (error) {
      console.error(
        "Ошибка удаления диалога:",
        error
      );

      alert(
        "Не удалось удалить диалог"
      );
    }
  };


  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString(
      "ru-RU",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatMessageDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString(
      "ru-RU",
      {
        day: "numeric",
        month: "long",
      }
    );
  };


  // =====================================================
  // DEAL STATUS
  // =====================================================

  const dealStatus =
    deal?.status
      ? DEAL_STATUS[deal.status]
      : null;

  const DealStatusIcon =
    dealStatus?.icon;


  // =====================================================
  // NO CHAT
  // =====================================================

  if (!chatId) {
    return (
      <div
        className="
          h-full
          flex
          flex-col
          items-center
          justify-center
          text-gray-400
          bg-gray-50
        "
      >
        <div
          className="
            w-16
            h-16
            rounded-full
            bg-white
            flex
            items-center
            justify-center
            shadow-sm
            mb-4
          "
        >
          <Send
            size={26}
            className="text-gray-300"
          />
        </div>

        <p
          className="
            text-sm
            font-medium
            text-gray-500
          "
        >
          Выберите диалог
        </p>

        <p
          className="
            text-xs
            text-gray-400
            mt-1
          "
        >
          Здесь появятся ваши сообщения
        </p>
      </div>
    );
  }


  // =====================================================
  // MAIN
  // =====================================================

  return (
    <div
      className="
        h-full
        flex
        flex-col
        bg-[#f6f7f8]
        min-w-0
      "
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <header
        className="
          h-18
          shrink-0
          bg-white
          border-b
          border-gray-200
          flex
          items-center
          px-3
          sm:px-5
          gap-3
          relative
          z-20
        "
      >

        {/* BACK BUTTON */}

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="
              lg:hidden
              w-9
              h-9
              rounded-full
              flex
              items-center
              justify-center
              hover:bg-gray-100
              transition
            "
          >
            <ArrowLeft size={20} />
          </button>
        )}


        {/* AVATAR */}

        <div
          className="
            w-11
            h-11
            rounded-full
            bg-gray-100
            overflow-hidden
            shrink-0
          "
        >
          {conversation?.otherUser?.avatar ? (
            <img
              src={
                conversation.otherUser.avatar
              }
              alt=""
              className="
                w-full
                h-full
                object-cover
              "
            />
          ) : (
            <div
              className="
                w-full
                h-full
                flex
                items-center
                justify-center
                text-gray-400
              "
            >
              <User size={20} />
            </div>
          )}
        </div>


        {/* USER INFO */}

        <div
          className="
            min-w-0
            flex-1
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <h2
              className="
                font-semibold
                text-gray-900
                truncate
              "
            >
              {conversation?.otherUser?.name ||
                "Пользователь"}
            </h2>

            {conversation?.otherUser?.online && (
              <span
                className="
                  hidden
                  sm:inline-flex
                  items-center
                  gap-1
                  text-xs
                  text-green-600
                "
              >
                <span
                  className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-green-500
                  "
                />

                онлайн
              </span>
            )}
          </div>


          {/* LISTING */}

          {conversation?.listing?.title && (
            <div
              className="
                flex
                items-center
                gap-1
                text-xs
                text-gray-500
                mt-0.5
                min-w-0
              "
            >
              <Package
                size={12}
                className="shrink-0"
              />

              <span className="truncate">
                {conversation.listing.title}
              </span>
            </div>
          )}
        </div>


        {/* MENU */}

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setShowMenu((prev) => !prev)
            }
            className="
              w-9
              h-9
              rounded-full
              flex
              items-center
              justify-center
              hover:bg-gray-100
              text-gray-500
              transition
            "
          >
            <MoreVertical size={20} />
          </button>


          {showMenu && (
            <>
              {/* CLOSE MENU */}

              <div
                className="
                  fixed
                  inset-0
                  z-[-1]
                "
                onClick={() =>
                  setShowMenu(false)
                }
              />


              {/* MENU */}

              <div
                className="
                  absolute
                  right-0
                  top-11
                  w-48
                  bg-white
                  border
                  border-gray-200
                  rounded-xl
                  shadow-xl
                  py-1
                  overflow-hidden
                "
              >
                <button
                  type="button"
                  onClick={
                    handleDeleteConversation
                  }
                  className="
                    w-full
                    text-left
                    px-4
                    py-2.5
                    text-sm
                    text-red-600
                    hover:bg-red-50
                    transition
                  "
                >
                  Удалить диалог
                </button>
              </div>
            </>
          )}
        </div>
      </header>


      {/* =================================================
          DEAL BAR
      ================================================= */}

      {deal && (
        <div
          className="
            shrink-0
            bg-white
            border-b
            border-gray-200
            px-3
            sm:px-5
            py-3
          "
        >
          <div
            className="
              max-w-4xl
              mx-auto
              flex
              flex-wrap
              items-center
              gap-2
            "
          >

            {/* STATUS */}

            {dealStatus && DealStatusIcon && (
              <div
                className={`
                  inline-flex
                  items-center
                  gap-1.5
                  px-2.5
                  py-1
                  rounded-lg
                  border
                  text-xs
                  font-medium
                  ${dealStatus.className}
                `}
              >
                <DealStatusIcon size={14} />

                {dealStatus.label}
              </div>
            )}


            {/* ACTIVE DEAL */}

            {deal.status === "active" && (
              <>
                {/* SELLER → COMPLETE */}

                {isSeller &&
                  !deal.completionRequested && (
                    <button
                      type="button"
                      onClick={
                        handleRequestCompletion
                      }
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        px-3
                        py-1.5
                        rounded-lg
                        bg-green-600
                        hover:bg-green-700
                        text-white
                        text-xs
                        font-medium
                        transition
                      "
                    >
                      <Check size={14} />

                      Завершить
                    </button>
                  )}


                {/* BUYER → CONFIRM */}

                {isBuyer &&
                  deal.completionRequested && (
                    <button
                      type="button"
                      onClick={
                        handleConfirmDeal
                      }
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        px-3
                        py-1.5
                        rounded-lg
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        text-xs
                        font-medium
                        transition
                      "
                    >
                      <Check size={14} />

                      Подтвердить
                    </button>
                  )}


                {/* CANCEL */}

                <button
                  type="button"
                  onClick={() =>
                    setShowCancelModal(true)
                  }
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    px-3
                    py-1.5
                    rounded-lg
                    bg-white
                    border
                    border-gray-200
                    hover:bg-red-50
                    hover:text-red-600
                    hover:border-red-200
                    text-gray-600
                    text-xs
                    font-medium
                    transition
                  "
                >
                  <X size={14} />

                  Отменить
                </button>
              </>
            )}


            {/* SELLER WAITING */}

            {deal.status === "active" &&
              isSeller &&
              deal.completionRequested && (
                <span
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  Ожидаем подтверждения покупателя
                </span>
              )}


            {/* BUYER WAITING */}

            {deal.status === "active" &&
              isBuyer &&
              !deal.completionRequested && (
                <span
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  Ожидаем завершения сделки продавцом
                </span>
              )}


            {/* COMPLETED */}

            {deal.status === "completed" && (
              <>
                {!alreadyRated ? (
                  <button
                    type="button"
                    onClick={() =>
                      setShowRating(true)
                    }
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      px-3
                      py-1.5
                      rounded-lg
                      bg-yellow-500
                      hover:bg-yellow-600
                      text-white
                      text-xs
                      font-medium
                      transition
                    "
                  >
                    <Star
                      size={14}
                      fill="currentColor"
                    />

                    Оставить отзыв
                  </button>
                ) : (
                  <span
                    className="
                      text-xs
                      text-gray-500
                    "
                  >
                    Вы уже оставили отзыв
                  </span>
                )}
              </>
            )}
          </div>


          {/* CANCEL INFO */}

          {deal.status === "cancelled" && (
            <div
              className="
                max-w-4xl
                mx-auto
                mt-2
                text-xs
                text-gray-500
              "
            >
              Причина:

              <span
                className="
                  ml-1
                  font-medium
                  text-gray-700
                "
              >
                {CANCEL_REASONS[
                  deal.cancelReason
                ] || "Причина не указана"}
              </span>


              {deal.cancelReason === "other" &&
                deal.cancelComment && (
                  <div
                    className="
                      mt-1
                      text-gray-500
                    "
                  >
                    {deal.cancelComment}
                  </div>
                )}
            </div>
          )}
        </div>
      )}


      {/* =================================================
          MESSAGES
      ================================================= */}

      <div
        ref={chatRef}
        className="
          flex-1
          overflow-y-auto
          px-3
          sm:px-6
          py-5
        "
      >
        {loading ? (
          <div
            className="
              h-full
              flex
              items-center
              justify-center
              text-sm
              text-gray-400
            "
          >
            Загрузка сообщений...
          </div>
        ) : messages.length === 0 ? (
          <div
            className="
              h-full
              flex
              flex-col
              items-center
              justify-center
              text-center
            "
          >
            <div
              className="
                w-14
                h-14
                rounded-full
                bg-white
                shadow-sm
                flex
                items-center
                justify-center
                mb-3
              "
            >
              <Send
                size={22}
                className="text-gray-300"
              />
            </div>

            <p
              className="
                text-sm
                font-medium
                text-gray-600
              "
            >
              Начните общение
            </p>

            <p
              className="
                text-xs
                text-gray-400
                mt-1
                max-w-xs
              "
            >
              Напишите сообщение продавцу или покупателю
            </p>
          </div>
        ) : (
          <div
            className="
              max-w-4xl
              mx-auto
              space-y-2
            "
          >
            {messages.map(
              (message, index) => {
                const senderId =
                  typeof message.senderId ===
                  "object"
                    ? message.senderId?._id
                    : message.senderId;

                const isMe =
                  String(senderId) ===
                  String(user?._id);

                const previous =
                  messages[index - 1];

                const showDate =
                  !previous ||
                  new Date(
                    previous.createdAt
                  ).toDateString() !==
                    new Date(
                      message.createdAt
                    ).toDateString();

                return (
                  <div key={message._id}>
                    {/* DATE */}

                    {showDate && (
                      <div
                        className="
                          flex
                          justify-center
                          my-5
                        "
                      >
                        <span
                          className="
                            px-3
                            py-1
                            rounded-full
                            bg-white
                            shadow-sm
                            text-[11px]
                            text-gray-400
                          "
                        >
                          {formatMessageDate(
                            message.createdAt
                          )}
                        </span>
                      </div>
                    )}


                    {/* MESSAGE ROW */}

                    <div
                      className={`
                        flex
                        ${
                          isMe
                            ? "justify-end"
                            : "justify-start"
                        }
                      `}
                    >
                      <div
                        className={`
                          flex
                          items-end
                          gap-2
                          max-w-[88%]
                          sm:max-w-[70%]
                          ${
                            isMe
                              ? "flex-row-reverse"
                              : ""
                          }
                        `}
                      >

                        {/* AVATAR */}

                        {!isMe && (
                          <div
                            className="
                              w-7
                              h-7
                              rounded-full
                              overflow-hidden
                              bg-gray-200
                              shrink-0
                            "
                          >
                            {message.senderId
                              ?.avatar ? (
                              <img
                                src={
                                  message
                                    .senderId
                                    .avatar
                                }
                                alt=""
                                className="
                                  w-full
                                  h-full
                                  object-cover
                                "
                              />
                            ) : (
                              <div
                                className="
                                  w-full
                                  h-full
                                  flex
                                  items-center
                                  justify-center
                                  text-gray-400
                                "
                              >
                                <User size={14} />
                              </div>
                            )}
                          </div>
                        )}


                        {/* MESSAGE */}

                        <div
                          className={`
                            px-3.5
                            py-2.5
                            rounded-2xl
                            shadow-sm
                            ${
                              isMe
                                ? "bg-green-600 text-white rounded-br-md"
                                : "bg-white text-gray-800 border border-gray-100 rounded-bl-md"
                            }
                          `}
                        >
                          <p
                            className="
                              text-sm
                              whitespace-pre-wrap
                              wrap-break-word
                            "
                          >
                            {message.text}
                          </p>


                          {/* TIME */}

                          <div
                            className={`
                              flex
                              items-center
                              justify-end
                              gap-1
                              mt-1
                              text-[10px]
                              ${
                                isMe
                                  ? "text-green-100"
                                  : "text-gray-400"
                              }
                            `}
                          >
                            {formatTime(
                              message.createdAt
                            )}

                            {isMe &&
                              (message.isRead ? (
                                <CheckCheck
                                  size={14}
                                />
                              ) : (
                                <Check size={13} />
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}


            {/* TYPING */}

            {typing && (
              <div
                className="
                  flex
                  items-center
                  gap-2
                  mt-2
                "
              >
                <div
                  className="
                    px-3
                    py-2
                    rounded-2xl
                    rounded-bl-md
                    bg-white
                    border
                    border-gray-100
                    text-xs
                    text-gray-400
                  "
                >
                  Печатает
                  <span className="animate-pulse">
                    ...
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>


    
{/* =================================================
    INPUT
================================================= */}

<div className="shrink-0 bg-white border-t border-gray-200 px-3 sm:px-5 py-3">
  <div className="max-w-4xl mx-auto flex items-end gap-2">

    <textarea
      value={text}
      onChange={(event) => {
        setText(event.target.value);
        handleTyping();
      }}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" &&
          !event.shiftKey
        ) {
          event.preventDefault();
          handleSendMessage();
        }
      }}
      rows={1}
      placeholder="Напишите сообщение..."
      className="
        flex-1
        resize-none
        min-h-11
        max-h-32
        border
        border-gray-200
        rounded-2xl
        px-4
        py-3
        text-sm
        outline-none
        focus:border-green-500
        focus:ring-2
        focus:ring-green-100
        transition
        bg-gray-50
        focus:bg-white
      "
    />

    <button
      type="button"
      onClick={handleSendMessage}
      disabled={!text.trim() || sending}
      aria-label="Отправить сообщение"
      className="
        w-11
        h-11
        rounded-full
        flex
        items-center
        justify-center
        bg-green-600
        hover:bg-green-700
        disabled:bg-gray-200
        disabled:text-gray-400
        text-white
        transition
        shrink-0
      "
    >
      <Send
        size={18}
        className="translate-x-px"
      />
    </button>

  </div>

  <div className="max-w-4xl mx-auto text-[10px] text-gray-400 mt-1.5 px-1">
    Enter — отправить · Shift + Enter — новая строка
  </div>
</div>


      {/* =================================================
          RATING MODAL
      ================================================= */}

      {showRating && (
        <RatingModal
          dealId={deal?._id}
          chatId={chatId}
          onClose={() =>
            setShowRating(false)
          }
          onSuccess={
            handleRatingSubmit
          }
        />
      )}


      {/* =================================================
          CANCEL MODAL
      ================================================= */}

      {showCancelModal && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/40
            backdrop-blur-[2px]
            flex
            items-center
            justify-center
            p-4
          "
        >
          <div
            className="
              w-full
              max-w-md
              bg-white
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
          >

            {/* HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                px-5
                py-4
                border-b
              "
            >
              <div>
                <h2
                  className="
                    font-semibold
                    text-gray-900
                  "
                >
                  Отменить сделку
                </h2>

                <p
                  className="
                    text-xs
                    text-gray-500
                    mt-0.5
                  "
                >
                  Укажите причину отмены
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCancelModal(false)
                }
                className="
                  w-8
                  h-8
                  rounded-full
                  flex
                  items-center
                  justify-center
                  hover:bg-gray-100
                  text-gray-400
                  transition
                "
              >
                <X size={18} />
              </button>
            </div>


            {/* BODY */}

            <div className="p-5">
              <div className="space-y-2">
                {Object.entries(
                  CANCEL_REASONS
                ).map(
                  ([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setCancelReason(
                          value
                        )
                      }
                      className={`
                        w-full
                        text-left
                        px-4
                        py-3
                        rounded-xl
                        border
                        text-sm
                        transition
                        ${
                          cancelReason === value
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                        }
                      `}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>


              {/* OTHER COMMENT */}

              {cancelReason === "other" && (
                <textarea
                  value={cancelComment}
                  onChange={(event) =>
                    setCancelComment(
                      event.target.value
                    )
                  }
                  placeholder="Опишите причину..."
                  rows={4}
                  className="
                    w-full
                    mt-3
                    border
                    border-gray-200
                    rounded-xl
                    p-3
                    text-sm
                    resize-none
                    outline-none
                    focus:border-red-400
                    focus:ring-2
                    focus:ring-red-100
                  "
                />
              )}
            </div>


            {/* FOOTER */}

            <div
              className="
                px-5
                py-4
                bg-gray-50
                flex
                gap-2
              "
            >
              <button
                type="button"
                onClick={() =>
                  setShowCancelModal(false)
                }
                className="
                  flex-1
                  h-11
                  rounded-xl
                  bg-white
                  border
                  border-gray-200
                  text-sm
                  font-medium
                  text-gray-700
                  hover:bg-gray-100
                  transition
                "
              >
                Не отменять
              </button>

              <button
                type="button"
                disabled={!cancelReason}
                onClick={
                  handleCancelDeal
                }
                className="
                  flex-1
                  h-11
                  rounded-xl
                  bg-red-600
                  hover:bg-red-700
                  disabled:bg-gray-200
                  disabled:text-gray-400
                  text-white
                  text-sm
                  font-medium
                  transition
                "
              >
                Отменить сделку
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}