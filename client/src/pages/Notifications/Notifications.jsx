import { useEffect } from "react";
import { useNotificationStore } from "../../store/notificationStore";

export default function Notifications() {
  const { notifications, fetchNotifications } =
    useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Уведомления
      </h1>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n._id}
            className="p-4 border rounded-lg bg-white"
          >
            <p>{n.message}</p>

            <span className="text-xs text-gray-500">
              {n.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}