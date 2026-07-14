import { useState } from "react";
import { createRating } from "../../api/ratingApi";

export default function RatingModal({
  dealId,    // Принимаем правильный ID сделки
  chatId,    // Принимаем chatId для последующего удаления
  onClose,
  onSuccess, 
}) {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");

  const submit = async () => {
    try {
      // Теперь бэкенд получит то, что ищет
      await createRating({
        dealId, // ID сделки (например: "65a1b2c3...")
        stars,
        comment,
      });

      if (onSuccess) {
        await onSuccess(); // Вызывает handleRatingSubmit в ChatRoom (удалит чат и обновит страницу)
      }
      
      onClose();
    } catch (err) {
      console.error(
        "RATING ERROR:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <div className="
      fixed
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
      z-50
    ">
      <div className="
        bg-white
        rounded-2xl
        p-6
        w-96
      ">
        <h2 className="
          text-xl
          font-bold
          mb-4
        ">
          Оцените продавца
        </h2>

        <div className="
          flex
          gap-2
          text-3xl
        ">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              onClick={() => setStars(i)}
              className={
                i <= stars
                  ? "text-yellow-400"
                  : "text-gray-300"
              }
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          className="
            border
            rounded-xl
            w-full
            mt-4
            p-3
          "
          placeholder="Комментарий"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          onClick={submit}
          className="
            mt-4
            w-full
            bg-blue-600
            text-white
            py-3
            rounded-xl
          "
        >
          Отправить отзыв
        </button>

        <button
          onClick={onClose}
          className="
            mt-2
            w-full
            text-gray-500
          "
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
