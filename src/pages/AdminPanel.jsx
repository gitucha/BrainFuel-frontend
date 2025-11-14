import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

const fetchPending = async () => {
  const { data } = await api.get("/quizzes/pending/");
  return data;
};

const fetchReports = async () => {
  const { data } = await api.get("/quizzes/reports/");
  return data;
};

const fetchInsights = async () => {
  const { data } = await api.get("/admin/insights/");
  return data;
};

const AdminPanel = () => {
  const qc = useQueryClient();

  const { data: pending, isPending: loadingPending } = useQuery({
    queryKey: ["pending-quizzes"],
    queryFn: fetchPending,
  });

  const { data: reports, isPending: loadingReports } = useQuery({
    queryKey: ["quiz-reports"],
    queryFn: fetchReports,
  });

  const { data: insights } = useQuery({
    queryKey: ["admin-insights"],
    queryFn: fetchInsights,
  });

  const approveMutation = useMutation({
    mutationFn: (id) => api.post(`/quizzes/${id}/approve/`),
    onSuccess: () => {
      qc.invalidateQueries(["pending-quizzes"]);
      alert("Quiz approved.");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => api.post(`/quizzes/${id}/reject/`),
    onSuccess: () => {
      qc.invalidateQueries(["pending-quizzes"]);
      alert("Quiz rejected.");
    },
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

      {/* INSIGHTS */}
      <div className="bg-white p-6 rounded shadow mb-10">
        <h2 className="text-xl font-semibold mb-3">Platform Analytics</h2>

        {insights ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded shadow-sm">
              <h3 className="font-semibold">Total Users</h3>
              <p className="text-2xl">{insights.total_users}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded shadow-sm">
              <h3 className="font-semibold">Total Quizzes</h3>
              <p className="text-2xl">{insights.total_quizzes}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded shadow-sm">
              <h3 className="font-semibold">Revenue</h3>
              <p className="text-2xl">${insights.total_revenue}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>

      {/* PENDING QUIZZES */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pending Quizzes</h2>

        {loadingPending ? (
          <p>Loading...</p>
        ) : pending?.length === 0 ? (
          <p className="text-gray-500">No pending quizzes.</p>
        ) : (
          <div className="space-y-4">
            {pending.map((q) => (
              <div key={q.id} className="p-4 bg-white rounded shadow">
                <h3 className="font-semibold">{q.title}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  By: {q.created_by_username} • Category: {q.category}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => approveMutation.mutate(q.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectMutation.mutate(q.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REPORTS */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Reported Quizzes</h2>

        {loadingReports ? (
          <p>Loading...</p>
        ) : reports?.length === 0 ? (
          <p className="text-gray-500">No reports at the moment.</p>
        ) : (
          <div className="space-y-4">
            {reports.map((r) => (
              <div key={r.id} className="p-4 bg-white rounded shadow">
                <h3 className="font-semibold">{r.quiz_title}</h3>
                <p className="text-gray-600 text-sm mb-2">Reason: {r.reason}</p>
                <p className="text-gray-500 text-sm">
                  By: {r.reported_by_username} • {new Date(r.created_at).toDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EXPORT */}
      <div>
        <a
          href="http://127.0.0.1:8000/api/admin/reports/export/"
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
        >
          Export Reports
        </a>
      </div>
    </div>
  );
};

export default AdminPanel;
