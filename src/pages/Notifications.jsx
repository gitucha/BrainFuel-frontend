import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

export default function Notifications() {
  const qc = useQueryClient();

  // Fetch notifications
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/notifications/");
      return res.data;
    },
  });

  // Mark as read
  const markRead = useMutation({
    mutationFn: async (id) => {
      await api.post(`/notifications/${id}/read/`);
    },
    onSuccess: () => qc.invalidateQueries(["notifications"]),
  });

  // Delete notification
  const deleteNotif = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/notifications/${id}/delete/`);
    },
    onSuccess: () => qc.invalidateQueries(["notifications"]),
  });

  if (isLoading) return <div className="p-6">Loading notifications...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-8">Notifications</h2>

      {data.length === 0 && (
        <p className="text-center text-gray-500">No notifications yet.</p>
      )}

      <div className="space-y-4">
        {data.map((n) => (
          <div
            key={n.id}
            className={`p-5 rounded-lg shadow-sm border bg-white transition ${
              !n.is_read ? "border-blue-300 bg-blue-50" : "border-gray-200"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800">{n.title}</p>
                <p className="text-gray-600 text-sm">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {!n.is_read && (
                  <button
                    className="text-blue-600 text-sm hover:underline"
                    onClick={() => markRead.mutate(n.id)}
                  >
                    Mark as read
                  </button>
                )}

                <button
                  className="text-red-600 text-sm hover:underline"
                  onClick={() => deleteNotif.mutate(n.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
