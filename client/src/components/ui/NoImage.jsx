import { Package } from "lucide-react";

export default function NoImage({ className = "" }) {
  return (
    <div
      className={`
        w-full
        h-full
        min-h-32
        bg-linear-to-br
        from-gray-100
        via-gray-50
        to-blue-50
        flex
        flex-col
        items-center
        justify-center
        ${className}
      `}
    >
      <div
        className="
          w-16
          h-16
          rounded-2xl
          bg-white
          border
          border-gray-200
          shadow-sm
          flex
          items-center
          justify-center
        "
      >
        <Package
          size={30}
          strokeWidth={1.5}
          className="text-blue-400"
        />
      </div>

      <span className="mt-3 text-sm font-medium text-gray-400">
        Без фотографии
      </span>
    </div>
  );
}