import { useEffect, useState } from "react";
import { useCookieStore } from "../../store/cookieStore";
import CookieSettingsModal from "./CookieSettingsModal";

export default function CookieBanner() {
  const { accepted, save, load, openModal } = useCookieStore();

   useEffect(() => {
    load();
  }, []);

  if (accepted) return null;

  return (
    <>
      <div
        className="
        fixed
        bottom-5
        left-1/2
        -translate-x-1/2
        w-[95%]
        max-w-3xl
        bg-white
        rounded-2xl
        shadow-2xl
        border
        p-6
        z-9999
      "
      >
        <h2 className="text-xl font-bold mb-2">
          🍪 Мы используем cookies
        </h2>

        <p className="text-gray-600 mb-5">
          Мы используем файлы cookie для работы сайта,
          запоминания ваших настроек и анализа посещаемости.
        </p>

        <div className="flex flex-wrap gap-3 justify-end">

          <button
            onClick={() =>
              save({
                necessary: true,
                functional: false,
                analytics: false,
                marketing: false,
              })
            }
            className="px-4 py-2 rounded-xl border"
          >
            Только обязательные
          </button>

          <button
    onClick={openModal}
    className="px-4 py-2 rounded-xl bg-gray-200"
>
    Настроить
</button>

          <button
            onClick={() =>
              save({
                necessary: true,
                functional: true,
                analytics: true,
                marketing: true,
              })
            }
            className="px-4 py-2 rounded-xl bg-blue-600  hover:bg-blue-700 text-white"
          >
            Принять все
          </button>

        </div>
      </div>

     
    </>
  );
}