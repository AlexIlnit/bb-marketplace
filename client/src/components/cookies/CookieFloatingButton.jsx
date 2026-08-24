import { useCookieStore } from "../../store/cookieStore";
import { Settings } from "lucide-react";

export default function CookieFloatingButton() {
  const openModal = useCookieStore((s) => s.openModal);
  const accepted = useCookieStore((s) => s.accepted);

  return (
    <button
      onClick={openModal}
      className="
        fixed
        bottom-5
        left-5
        z-9999

        flex
        items-center
        gap-2

        px-2
        py-2

        bg-white
        border
        shadow-lg
        rounded-full

        hover:shadow-xl
        hover:scale-105
        transition
        duration-200
      "
    >
      {/* <Settings size={18} /> */}

      <span className="text-sm font-medium">
        🍪
      </span>

      {!accepted && (
        <span className="w-2 h-2 bg-red-500 rounded-full" />
      )}
    </button>
  );
}