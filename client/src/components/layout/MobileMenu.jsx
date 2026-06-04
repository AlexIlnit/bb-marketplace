import {
  X,
  Heart,
  User
} from "lucide-react";

export default function MobileMenu({
  open,
  onClose
}) {
  if (!open) return null;

  return (
    <div
      className="
      fixed
      inset-0
      bg-black/40
      z-50
    "
    >
      <div
        className="
        w-72
        bg-white
        h-full
        p-6
      "
      >
        <div
          className="
          flex
          justify-between
          mb-10
        "
        >
          <h2>Kufar</h2>

          <X
            onClick={onClose}
            className="
            cursor-pointer
          "
          />
        </div>

        <div
          className="
          flex
          flex-col
          gap-5
        "
        >
          <div
            className="
            flex
            gap-2
          "
          >
            <User />
            Профиль
          </div>

          <div
            className="
            flex
            gap-2
          "
          >
            <Heart />
            Избранное
          </div>

          <button
            className="
            bg-green-600
            text-white
            p-3
            rounded-xl
          "
          >
            Подать объявление
          </button>
        </div>
      </div>
    </div>
  );
}