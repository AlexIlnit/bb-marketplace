import { useState } from "react";

export default function AdminImageSlider({ images = [] }) {
  const [current, setCurrent] = useState(0);

  const photos = Array.isArray(images) ? images : [];

  if (photos.length === 0) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        Нет фото
      </div>
    );
  }

  const prevImage = (e) => {
    e.stopPropagation();

    setCurrent((prev) =>
      prev === 0 ? photos.length - 1 : prev - 1
    );
  };

  const nextImage = (e) => {
    e.stopPropagation();

    setCurrent((prev) =>
      prev === photos.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      <img
        src={photos[current]}
        alt={`Фото ${current + 1}`}
        className="w-full h-full object-cover"
      />

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevImage}
            className="
              absolute
              left-2
              top-1/2
              -translate-y-1/2
              bg-white/80
              rounded-full
              px-2
              py-1
              shadow
            "
          >
            ‹
          </button>

          <button
            type="button"
            onClick={nextImage}
            className="
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              bg-white/80
              rounded-full
              px-2
              py-1
              shadow
            "
          >
            ›
          </button>

          <div
            className="
              absolute
              bottom-2
              left-1/2
              -translate-x-1/2
              bg-black/60
              text-white
              text-xs
              px-2
              py-1
              rounded-full
            "
          >
            {current + 1}/{photos.length}
          </div>
        </>
      )}
    </div>
  );
}