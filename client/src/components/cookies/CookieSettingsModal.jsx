import { useState, useEffect } from "react";
import { useCookieStore } from "../../store/cookieStore";

export default function CookieSettingsModal() {
  const {
    modalOpen,
    closeModal,
    settings,
    save,
  } = useCookieStore();

  const [form, setForm] = useState(settings);

  useEffect(() => {
    setForm(settings);
  }, [settings, modalOpen]);

  if (!modalOpen) return null;

  const toggle = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const CookieItem = ({
    title,
    description,
    checked,
    disabled = false,
    onToggle,
  }) => (
    <div className="flex justify-between items-center py-5 border-b last:border-b-0">
      <div className="pr-5">
        <h3 className="font-semibold text-lg">
          {title}
        </h3>

        <p className="text-gray-500 text-sm mt-1">
          {description}
        </p>
      </div>

      <button
        disabled={disabled}
        onClick={onToggle}
        className={`
          relative
          w-14
          h-8
          rounded-full
          transition-all
          duration-300
          ${
            checked
              ? "bg-blue-600"
              : "bg-gray-300"
          }
          ${disabled ? "opacity-60 cursor-default" : ""}
        `}
      >
        <span
          className={`
            absolute
            top-1
            left-1
            w-6
            h-6
            rounded-full
            bg-white
            shadow
            transition-all
            duration-300
            ${
              checked
                ? "translate-x-6"
                : ""
            }
          `}
        />
      </button>
    </div>
  );

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/50
        backdrop-blur-sm
        flex
        items-center
        justify-center
        z-1000
        p-4
      "
    >
      <div
        className="
          bg-white
          rounded-3xl
          shadow-2xl
          w-full
          max-w-2xl
          overflow-hidden
        "
      >
        {/* Header */}

        <div className="p-7 border-b">

          <h2 className="text-3xl font-bold">
            🍪 Настройки cookies
          </h2>

          <p className="text-gray-500 mt-2">
            Вы можете выбрать, какие файлы cookie будут
            использоваться на сайте.
          </p>

        </div>

        {/* Content */}

        <div className="px-7">

          <CookieItem
            title="Обязательные"
            description="Необходимы для работы сайта, безопасности и авторизации."
            checked={true}
            disabled
          />

          <CookieItem
            title="Функциональные"
            description="Запоминают язык, тему оформления и другие персональные настройки."
            checked={form.functional}
            onToggle={() => toggle("functional")}
          />

          <CookieItem
            title="Аналитика"
            description="Помогают понять, как посетители используют сайт."
            checked={form.analytics}
            onToggle={() => toggle("analytics")}
          />

          <CookieItem
            title="Маркетинг"
            description="Используются для персонализированной рекламы."
            checked={form.marketing}
            onToggle={() => toggle("marketing")}
          />

        </div>

        {/* Footer */}

        <div
          className="
            bg-gray-50
            p-6
            flex
            flex-wrap
            justify-end
            gap-3
          "
        >
          <button
            onClick={closeModal}
            className="
              px-5
              py-3
              rounded-xl
              border
              hover:bg-gray-100
              transition
            "
          >
            Отмена
          </button>

          <button
            onClick={() => {
              save(form);
            }}
            className="
              px-6
              py-3
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-semibold
              transition
            "
          >
            Сохранить настройки
          </button>
        </div>

      </div>
    </div>
  );
}