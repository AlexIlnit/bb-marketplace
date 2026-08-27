import { useEffect, useMemo, useRef, useState } from "react";

import {
  Search,
  Trash2,
  MessageCircle,
  User,
  Package,
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
  CircleDot,
  ArrowLeft,
  Users,
} from "lucide-react";

import {
  getAdminChats,
  getAdminChatMessages,
  deleteChat,
} from "../../api/adminApi";

import { useAuthStore } from "../../store/authStore";


// =====================================================
// DEAL STATUS
// =====================================================

const DEAL_STATUS = {
  active: {
    label: "Сделка в процессе",
    icon: Clock3,
    className:
      "bg-amber-50 text-amber-700 border-amber-200",
  },

  completed: {
    label: "Сделка завершена",
    icon: CheckCircle2,
    className:
      "bg-green-50 text-green-700 border-green-200",
  },

  cancelled: {
    label: "Сделка отменена",
    icon: XCircle,
    className:
      "bg-red-50 text-red-700 border-red-200",
  },
};


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
// HELPERS
// =====================================================

const getUserId = (user) =>
  typeof user === "object"
    ? user?._id
    : user;


const getAvatar = (user) =>
  user?.avatar || "/default-avatar.png";


const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString(
    "ru-RU",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
};


const formatTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString(
    "ru-RU",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};


const formatDateTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleString(
    "ru-RU",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};


// =====================================================
// AVATAR
// =====================================================

function UserAvatar({
  user,
  size = "w-11 h-11",
}) {
  return (
    <div
      className={`
        ${size}
        shrink-0
        rounded-full
        overflow-hidden
        bg-gray-100
        border
        border-gray-200
      `}
    >
      {user?.avatar ? (
        <img
          src={getAvatar(user)}
          alt=""
          className="w-full h-full object-cover"
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
  );
}


// =====================================================
// MAIN
// =====================================================

export default function AdminChats() {
  const user = useAuthStore((s) => s.user);

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const [search, setSearch] = useState("");

  const [loadingChats, setLoadingChats] =
    useState(true);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const messagesContainerRef = useRef(null);
  // const messagesEndRef = useRef(null);


  // =====================================================
  // LOAD CHATS
  // =====================================================

  useEffect(() => {
    loadChats();
  }, []);


  const loadChats = async () => {
    try {
      setLoadingChats(true);

      const { data } = await getAdminChats();

      setChats(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Ошибка загрузки чатов:",
        error
      );
    } finally {
      setLoadingChats(false);
    }
  };


  // =====================================================
  // OPEN CHAT
  // =====================================================

  const openChat = async (chat) => {
  if (selectedChat?._id === chat._id) return;

  setSelectedChat(chat);
  setMessages([]);
  setLoadingMessages(true);

  try {
    const { data } = await getAdminChatMessages(chat._id);

    setMessages(
      Array.isArray(data) ? data : []
    );
  } catch (error) {
    console.error(
      "Ошибка загрузки сообщений:",
      error
    );

    setMessages([]);
  } finally {
    setLoadingMessages(false);
  }
};

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Удалить этот диалог?\n\nВсе сообщения этого чата будут удалены."
    );

    if (!ok || deleting) return;

    try {
      setDeleting(true);

      await deleteChat(id);

      setChats((prev) =>
        prev.filter(
          (chat) =>
            chat._id !== id
        )
      );

      if (
        selectedChat?._id === id
      ) {
        setSelectedChat(null);
        setMessages([]);
      }
    } catch (error) {
      console.error(
        "Ошибка удаления чата:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Не удалось удалить чат"
      );
    } finally {
      setDeleting(false);
    }
  };


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredChats = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) return chats;

    return chats.filter((chat) => {
      const users =
        chat.members
          ?.map(
            (member) =>
              member?.name || ""
          )
          .join(" ")
          .toLowerCase();

      const listing =
        chat.listing?.title
          ?.toLowerCase() || "";

      const lastMessage =
        chat.lastMessage
          ?.toLowerCase() || "";

      return (
        users?.includes(query) ||
        listing.includes(query) ||
        lastMessage.includes(query)
      );
    });
  }, [chats, search]);


  // =====================================================
  // AUTO SCROLL
  // =====================================================

  useEffect(() => {
  const container = messagesContainerRef.current;

  if (!container) return;

  requestAnimationFrame(() => {
    container.scrollTop = container.scrollHeight;
  });
}, [messages]);


  // =====================================================
  // CHAT USERS
  // =====================================================

  const selectedMembers =
    selectedChat?.members || [];

  const otherUsers =
    selectedMembers.filter(
      (member) =>
        String(
          getUserId(member)
        ) !==
        String(
          user?._id
        )
    );


  // =====================================================
  // DEAL
  // =====================================================

  const deal =
    selectedChat?.deal || null;

  const dealStatus =
    deal?.status
      ? DEAL_STATUS[deal.status]
      : null;

  const DealIcon =
    dealStatus?.icon;


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
  className="
    h-[calc(100vh-100px)]
    min-h-150
    flex
    bg-gray-100
    overflow-hidden
    rounded-2xl
    border
    border-gray-200
    shadow-sm
  "
>

      {/* =================================================
          LEFT SIDEBAR
      ================================================= */}

      <aside
        className="
          w-95
          shrink-0
          bg-white
          border-r
          border-gray-200
          flex
          flex-col
        "
      >

        {/* HEADER */}

        <div
          className="
            px-5
            pt-5
            pb-4
            border-b
            border-gray-100
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              mb-4
            "
          >

            <div>
              <h1
                className="
                  text-xl
                  font-bold
                  text-gray-900
                "
              >
                Чаты
              </h1>

              <p
                className="
                  text-xs
                  text-gray-400
                  mt-1
                "
              >
                Всего диалогов:{" "}
                <span className="font-semibold">
                  {chats.length}
                </span>
              </p>
            </div>

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-gray-100
                flex
                items-center
                justify-center
                text-gray-500
              "
            >
              <MessageCircle
                size={20}
              />
            </div>

          </div>


          {/* SEARCH */}

          <div className="relative">

            <Search
              size={17}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Поиск по чатам..."
              className="
                w-full
                h-10
                pl-9
                pr-3
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                text-sm
                outline-none
                transition
                focus:bg-white
                focus:border-green-500
                focus:ring-2
                focus:ring-green-100
              "
            />

          </div>

        </div>


        {/* CHAT LIST */}

        <div
          className="
            flex-1
            overflow-y-auto
          "
        >

          {loadingChats ? (

            <div
              className="
                p-8
                text-center
                text-sm
                text-gray-400
              "
            >
              Загрузка чатов...
            </div>

          ) : filteredChats.length === 0 ? (

            <div
              className="
                p-8
                text-center
              "
            >

              <div
                className="
                  w-12
                  h-12
                  mx-auto
                  rounded-full
                  bg-gray-100
                  flex
                  items-center
                  justify-center
                  text-gray-400
                  mb-3
                "
              >
                <MessageCircle
                  size={22}
                />
              </div>

              <p
                className="
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Чаты не найдены
              </p>

              <p
                className="
                  text-xs
                  text-gray-400
                  mt-1
                "
              >
                Попробуйте изменить поиск
              </p>

            </div>

          ) : (

            filteredChats.map(
              (chat) => {

                const active =
                  selectedChat?._id ===
                  chat._id;

                const members =
                  chat.members || [];

                const firstUser =
                  members[0];

                const secondUser =
                  members[1];

                const status =
                  chat.deal?.status;

                const statusInfo =
                  status
                    ? DEAL_STATUS[status]
                    : null;

                return (
                  <div
                    key={chat._id}
                    onClick={() =>
                      openChat(chat)
                    }
                    className={`
                      group
                      relative
                      px-4
                      py-3.5
                      border-b
                      border-gray-100
                      cursor-pointer
                      transition
                      ${
                        active
                          ? "bg-green-50"
                          : "hover:bg-gray-50"
                      }
                    `}
                  >

                    {/* ACTIVE LINE */}

                    {active && (
                      <div
                        className="
                          absolute
                          left-0
                          top-0
                          bottom-0
                          w-1
                          bg-green-600
                        "
                      />
                    )}


                    <div
                      className="
                        flex
                        gap-3
                      "
                    >

                      {/* AVATARS */}

                      <div
                        className="
                          relative
                          w-12
                          h-12
                          shrink-0
                        "
                      >

                        <div
                          className="
                            absolute
                            left-0
                            top-0
                          "
                        >
                          <UserAvatar
                            user={firstUser}
                            size="
                              w-9 h-9
                            "
                          />
                        </div>

                        {secondUser && (
                          <div
                            className="
                              absolute
                              right-0
                              bottom-0
                            "
                          >
                            <UserAvatar
                              user={
                                secondUser
                              }
                              size="
                                w-8 h-8
                              "
                            />
                          </div>
                        )}

                      </div>


                      {/* CONTENT */}

                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >

                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-2
                          "
                        >

                          <div
                            className="
                              min-w-0
                              flex-1
                            "
                          >

                            <div
                              className="
                                text-sm
                                font-semibold
                                text-gray-900
                                truncate
                              "
                            >
                              {members
                                .map(
                                  (m) =>
                                    m?.name ||
                                    "Пользователь"
                                )
                                .join(
                                  " ↔ "
                                )}
                            </div>

                          </div>

                          <span
                            className="
                              shrink-0
                              text-[10px]
                              text-gray-400
                            "
                          >
                            {formatDate(
                              chat.updatedAt ||
                                chat.createdAt
                            )}
                          </span>

                        </div>


                        {/* LISTING */}

                        {chat.listing
                          ?.title && (
                          <div
                            className="
                              flex
                              items-center
                              gap-1
                              mt-1
                              text-[11px]
                              text-gray-500
                            "
                          >
                            <Package
                              size={12}
                            />

                            <span className="truncate">
                              {
                                chat
                                  .listing
                                  .title
                              }
                            </span>
                          </div>
                        )}


                        {/* LAST MESSAGE */}

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-2
                            mt-1
                          "
                        >

                          <p
                            className="
                              text-xs
                              text-gray-400
                              truncate
                            "
                          >
                            {chat.lastMessage ||
                              "Нет сообщений"}
                          </p>

                          <span
                            className="
                              shrink-0
                              text-[10px]
                              text-gray-400
                            "
                          >
                            {formatTime(
                              chat.updatedAt ||
                                chat.createdAt
                            )}
                          </span>

                        </div>


                        {/* DEAL */}

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            mt-2
                          "
                        >

                          {statusInfo ? (
                            <span
                              className={`
                                inline-flex
                                items-center
                                gap-1
                                px-2
                                py-0.5
                                rounded-md
                                border
                                text-[10px]
                                font-medium
                                ${statusInfo.className}
                              `}
                            >
                              {statusInfo.icon && (
                                <statusInfo.icon
                                  size={11}
                                />
                              )}

                              {
                                statusInfo.label
                              }
                            </span>
                          ) : (
                            <span
                              className="
                                inline-flex
                                items-center
                                gap-1
                                text-[10px]
                                text-gray-400
                              "
                            >
                              <CircleDot
                                size={11}
                              />

                              Без сделки
                            </span>
                          )}


                          <span
                            className="
                              text-[10px]
                              text-gray-400
                            "
                          >
                            {chat.messageCount != null
                              ? `${chat.messageCount} сообщ.`
                              : ""}
                          </span>

                        </div>

                      </div>


                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDelete(
                            chat._id
                          );
                        }}
                        className="
                          absolute
                          right-3
                          bottom-3
                          w-7
                          h-7
                          rounded-lg
                          flex
                          items-center
                          justify-center
                          text-gray-300
                          opacity-0
                          group-hover:opacity-100
                          hover:bg-red-50
                          hover:text-red-500
                          transition
                        "
                        title="Удалить чат"
                      >
                        <Trash2
                          size={14}
                        />
                      </button>

                    </div>

                  </div>
                );
              }
            )
          )}

        </div>

      </aside>


      {/* =================================================
          RIGHT CHAT
      ================================================= */}

      <main
  className="
    flex-1
    min-w-0
    min-h-0
    flex
    flex-col
    bg-[#f6f7f8]
    overflow-hidden
  "
>

        {!selectedChat ? (

          <div
            className="
              flex-1
              flex
              flex-col
              items-center
              justify-center
              text-center
            "
          >

            <div
              className="
                w-20
                h-20
                rounded-3xl
                bg-white
                shadow-sm
                flex
                items-center
                justify-center
                text-gray-300
                mb-5
              "
            >
              <MessageCircle
                size={34}
              />
            </div>

            <h2
              className="
                text-lg
                font-semibold
                text-gray-700
              "
            >
              Выберите чат
            </h2>

            <p
              className="
                text-sm
                text-gray-400
                mt-1
              "
            >
              Здесь будут отображаться сообщения пользователей
            </p>

          </div>

        ) : (

          <>

            {/* =================================================
                CHAT HEADER
            ================================================= */}

            <header
              className="
                shrink-0
                bg-white
                border-b
                border-gray-200
                px-5
                py-3
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >

                {/* USERS */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    min-w-0
                  "
                >

                  <div
                    className="
                      flex
                      -space-x-2
                      shrink-0
                    "
                  >

                    {selectedMembers
                      .slice(0, 3)
                      .map((member) => (
                        <UserAvatar
                          key={
                            member._id
                          }
                          user={member}
                          size="
                            w-11 h-11
                          "
                        />
                      ))}

                  </div>


                  <div
                    className="
                      min-w-0
                    "
                  >

                    <h2
                      className="
                        font-semibold
                        text-gray-900
                        truncate
                      "
                    >
                      {selectedMembers
                        .map(
                          (member) =>
                            member?.name ||
                            "Пользователь"
                        )
                        .join(
                          " ↔ "
                        )}
                    </h2>

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        mt-0.5
                        text-xs
                        text-gray-400
                      "
                    >
                      <span
                        className="
                          flex
                          items-center
                          gap-1
                        "
                      >
                        <Users
                          size={12}
                        />

                        {selectedMembers.length}{" "}
                        участника
                      </span>

                      <span>
                        ID:{" "}
                        {selectedChat._id}
                      </span>
                    </div>

                  </div>

                </div>


                {/* LISTING */}

                {selectedChat.listing && (
                  <div
  className="
    hidden
    lg:flex
    w-80
    shrink-0
    items-center
    gap-3
    px-3
    py-2
    rounded-xl
    bg-gray-50
    border
    border-gray-100
  "
>

                    {selectedChat.listing
                      .images?.[0] && (
                      <img
                        src={
                          selectedChat
                            .listing
                            .images[0]
                        }
                        alt=""
                        className="
                          w-10
                          h-10
                          rounded-lg
                          object-cover
                        "
                      />
                    )}

                    <div
                      className="
                        min-w-0
                      "
                    >

                      <div
                        className="
                          text-[10px]
                          text-gray-400
                        "
                      >
                        Объявление
                      </div>

                      <div
                        className="
                          text-xs
                          font-medium
                          text-gray-700
                          truncate
                        "
                      >
                        {
                          selectedChat
                            .listing
                            .title
                        }
                      </div>

                      {selectedChat
                        .listing
                        .price != null && (
                        <div
                          className="
                            text-xs
                            font-semibold
                            text-gray-900
                          "
                        >
                          {
                            selectedChat
                              .listing
                              .price
                          }{" "}
                          BYN
                        </div>
                      )}

                    </div>

                  </div>
                )}

              </div>

            </header>


            {/* =================================================
                DEAL INFO
            ================================================= */}

            {deal && (
              <div
                className="
                  shrink-0
                  bg-white
                  border-b
                  border-gray-200
                  px-5
                  py-3
                "
              >

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-3
                  "
                >

                  <span
                    className="
                      text-xs
                      font-semibold
                      text-gray-500
                    "
                  >
                    Сделка
                  </span>

                  {dealStatus &&
                    DealIcon && (
                    <span
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
                      <DealIcon
                        size={13}
                      />

                      {
                        dealStatus.label
                      }
                    </span>
                  )}


                  {deal.seller && (
                    <span
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      Продавец:{" "}
                      <b className="text-gray-700">
                        {deal.seller.name ||
                          "—"}
                      </b>
                    </span>
                  )}

                  {deal.buyer && (
                    <span
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      Покупатель:{" "}
                      <b className="text-gray-700">
                        {deal.buyer.name ||
                          "—"}
                      </b>
                    </span>
                  )}

                  {deal.cancelReason && (
                    <span
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      Причина:{" "}
                      <b className="text-gray-700">
                        {CANCEL_REASONS[
                          deal.cancelReason
                        ] ||
                          deal.cancelReason}
                      </b>
                    </span>
                  )}

                </div>

              </div>
            )}


            {/* =================================================
                MESSAGES
            ================================================= */}

            <div
  ref={messagesContainerRef}
  className="
    flex-1
    min-h-0
    overflow-y-auto
    overscroll-contain
    px-5
    py-6
    scroll-smooth
  "
>

              {loadingMessages ? (

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
                      rounded-2xl
                      bg-white
                      shadow-sm
                      flex
                      items-center
                      justify-center
                      text-gray-300
                      mb-3
                    "
                  >
                    <MessageCircle
                      size={24}
                    />
                  </div>

                  <p
                    className="
                      text-sm
                      font-medium
                      text-gray-600
                    "
                  >
                    Сообщений нет
                  </p>

                </div>

              ) : (

                <div
                  className="
                    max-w-4xl
                    mx-auto
                    space-y-4
                  "
                >

                  {messages.map(
                    (message, index) => {

                      const sender =
                        message.senderId;

                      const senderId =
                        getUserId(
                          sender
                        );

                      const isMe =
                        String(
                          senderId
                        ) ===
                        String(
                          user?._id
                        );

                      const previous =
                        messages[
                          index - 1
                        ];

                      const currentDate =
                        new Date(
                          message.createdAt
                        ).toDateString();

                      const previousDate =
                        previous
                          ? new Date(
                              previous.createdAt
                            ).toDateString()
                          : null;

                      const showDate =
                        currentDate !==
                        previousDate;

                      return (
                        <div
                          key={
                            message._id
                          }
                        >

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
                                  border
                                  border-gray-100
                                  shadow-sm
                                  text-[10px]
                                  text-gray-400
                                "
                              >
                                {formatDate(
                                  message.createdAt
                                )}
                              </span>
                            </div>
                          )}


                          {/* MESSAGE */}

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
                                max-w-[75%]
                                ${
                                  isMe
                                    ? "flex-row-reverse"
                                    : ""
                                }
                              `}
                            >

                              {/* AVATAR */}

                              {!isMe && (
                                <UserAvatar
                                  user={
                                    sender
                                  }
                                  size="
                                    w-8 h-8
                                  "
                                />
                              )}


                              {/* BUBBLE */}

                              <div
                                className={`
                                  min-w-25
                                  px-4
                                  py-3
                                  rounded-2xl
                                  shadow-sm
                                  ${
                                    isMe
                                      ? "bg-green-600 text-white rounded-br-md"
                                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-md"
                                  }
                                `}
                              >

                                {/* NAME */}

                                <div
                                  className={`
                                    text-[10px]
                                    font-semibold
                                    mb-1.5
                                    ${
                                      isMe
                                        ? "text-green-100"
                                        : "text-gray-400"
                                    }
                                  `}
                                >
                                  {sender?.name ||
                                    "Пользователь"}
                                </div>


                                {/* TEXT */}

                                <div
                                  className="
                                    text-sm
                                    whitespace-pre-wrap
                                    wrap-break-word
                                    leading-relaxed
                                  "
                                >
                                  {
                                    message.text
                                  }
                                </div>


                                {/* TIME */}

                                <div
                                  className={`
                                    text-[10px]
                                    mt-2
                                    text-right
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
                                </div>

                              </div>

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                  

                </div>
              )}

            </div>


            {/* =================================================
                CHAT INFORMATION FOOTER
            ================================================= */}

            <div
              className="
                shrink-0
                bg-white
                border-t
                border-gray-200
                px-5
                py-3
              "
            >

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-x-5
                  gap-y-2
                  text-[11px]
                  text-gray-400
                "
              >

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                  "
                >
                  <MessageCircle
                    size={12}
                  />

                  Сообщений:{" "}
                  <b className="text-gray-600">
                    {messages.length}
                  </b>
                </span>


                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                  "
                >
                  <CalendarDays
                    size={12}
                  />

                  Создан:{" "}
                  <b className="text-gray-600">
                    {formatDate(
                      selectedChat.createdAt
                    )}
                  </b>
                </span>


                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                  "
                >
                  <Clock3
                    size={12}
                  />

                  Последняя активность:{" "}
                  <b className="text-gray-600">
                    {formatDateTime(
                      selectedChat.updatedAt
                    )}
                  </b>
                </span>

              </div>

            </div>

          </>
        )}

      </main>

    </div>
  );
}
