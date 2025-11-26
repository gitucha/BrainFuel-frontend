import React, { useEffect, useState } from "react";

export default function Notifications() {
  const STORAGE_KEY = "brainfuel_notifications";

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default static notifications (shown only when user has none saved)
  const defaultNotifications = [
    {
      id: 1,
      title: "Welcome to BrainFuel!",
      message: "Your learning journey begins now.",
      is_read: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Daily Challenge Ready",
      message: "Your new daily quiz challenge is available!",
      is_read: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Achievement Unlocked",
      message: "You reached Level 2! Keep going.",
      is_read: false,
      created_at: new Date().toISOString(),
    },
  ];

  // Load notifications from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (saved && Array.isArray(saved)) {
      setNotifications(saved);
    } else {
      setNotifications(defaultNotifications);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultNotifications));
    }

    setLoading(false);
  }, []);

  // Save back to localStorage whenever notifications change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }
  }, [notifications, loading]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const dismiss = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">You have no notifications.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl shadow flex justify-between items-start transition ${
                n.is_read ? "bg-gray-100" : "bg-white"
              }`}
            >
              <div>
                <h3 className="font-semibold">{n.title}</h3>
                <p className="text-gray-600 text-sm">{n.message}</p>
                <small className="text-gray-400">
                  {new Date(n.created_at).toLocaleString()}
                </small>
              </div>

              <div className="flex flex-col items-end gap-2">
                {!n.is_read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Mark as Read
                  </button>
                )}

                <button
                  onClick={() => dismiss(n.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
