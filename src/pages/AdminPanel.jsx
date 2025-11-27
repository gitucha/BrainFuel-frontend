// src/pages/AdminPanel.jsx
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

const fetchPending = async () => {
  const { data } = await api.get("/quizzes/pending/");
  return Array.isArray(data) ? data : [];
};

const fetchReports = async () => {
  const { data } = await api.get("/admin/reports/");
  return Array.isArray(data) ? data : [];
};

const fetchInsights = async () => {
  const { data } = await api.get("/admin/insights/");
  return data || null;
};

export default function AdminPanel() {
  const qc = useQueryClient();

  const {
    data: pending = [],
    isLoading: loadingPending,
    isError: errorPending,
  } = useQuery({
    queryKey: ["pending-quizzes"],
    queryFn: fetchPending,
  });

  const {
    data: reports = [],
    isLoading: loadingReports,
    isError: errorReports,
  } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: fetchReports,
  });

  const {
    data: insights,
    isLoading: loadingInsights,
    isError: errorInsights,
  } = useQuery({
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
    <div className="min-h-screen bg-linear-to-br from-[#e8f3ff] via-white to-[#dce8ff]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-blue-500">
              Admin
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              BrainFuel Control Center
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Moderate quizzes, review reports, and track high-level performance.
            </p>
          </div>
          <a
            href="/api/admin/reports/?format=csv"
            className="inline-flex items-center px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold shadow hover:bg-black"
          >
            Export reports (CSV)
          </a>
        </header>

        {/* INSIGHTS CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur rounded-3xl border border-white/60 shadow-sm p-4">
            <p className="text-[11px] text-slate-500 uppercase tracking-wide">
              New users (7d)
            </p>
            {loadingInsights ? (
              <p className="mt-2 text-sm text-slate-400">Loading…</p>
            ) : errorInsights ? (
              <p className="mt-2 text-sm text-red-500">Failed to load.</p>
            ) : (
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {insights?.new_users_last_7_days ?? 0}
              </p>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur rounded-3xl border border-white/60 shadow-sm p-4">
            <p className="text-[11px] text-slate-500 uppercase tracking-wide">
              Quiz attempts (7d)
            </p>
            {loadingInsights ? (
              <p className="mt-2 text-sm text-slate-400">Loading…</p>
            ) : errorInsights ? (
              <p className="mt-2 text-sm text-red-500">Failed to load.</p>
            ) : (
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {insights?.quiz_attempts_last_7_days ?? 0}
              </p>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur rounded-3xl border border-white/60 shadow-sm p-4">
            <p className="text-[11px] text-slate-500 uppercase tracking-wide">
              Revenue (7d)
            </p>
            {loadingInsights ? (
              <p className="mt-2 text-sm text-slate-400">Loading…</p>
            ) : errorInsights ? (
              <p className="mt-2 text-sm text-red-500">Failed to load.</p>
            ) : (
              <p className="mt-1 text-2xl font-bold text-slate-900">
                KES {insights?.revenue_last_7_days ?? 0}
              </p>
            )}
          </div>
        </section>

        {/* TOTALS STRIP */}
        <section className="bg-white/80 backdrop-blur rounded-3xl border border-white/60 shadow-sm p-4 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-700">
              Total users:{" "}
              <span className="font-semibold">
                {insights?.total_users ?? "—"}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-slate-700">
              Premium users:{" "}
              <span className="font-semibold">
                {insights?.total_premium_users ?? "—"}
              </span>
            </span>
          </div>
        </section>

        {/* PENDING + REPORTS GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PENDING QUIZZES */}
          <div className="bg-white/80 backdrop-blur rounded-3xl border border-white/60 shadow-sm p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Pending quizzes
                </h2>
                <p className="text-[11px] text-slate-500">
                  Quizzes awaiting review and approval.
                </p>
              </div>
              <span className="text-[11px] px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                {pending.length} pending
              </span>
            </div>

            {loadingPending ? (
              <p className="text-xs text-slate-500">Loading pending quizzes…</p>
            ) : errorPending ? (
              <p className="text-xs text-red-500">
                Failed to load pending quizzes.
              </p>
            ) : pending.length === 0 ? (
              <p className="text-xs text-slate-400">No pending quizzes.</p>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {pending.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          {q.title}
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          By:{" "}
                          {q.created_by_username ||
                            q.created_by ||
                            "Unknown"}{" "}
                          • Category: {q.category || "Uncategorized"}
                        </p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                        Pending
                      </span>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => approveMutation.mutate(q.id)}
                        className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectMutation.mutate(q.id)}
                        className="px-3 py-1.5 rounded-full bg-red-600 text-white text-[11px] font-semibold hover:bg-red-700"
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
          <div className="bg-white/80 backdrop-blur rounded-3xl border border-white/60 shadow-sm p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Reported quizzes
                </h2>
                <p className="text-[11px] text-slate-500">
                  Recent user reports and feedback.
                </p>
              </div>
              <span className="text-[11px] px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                {reports.length} reports
              </span>
            </div>

            {loadingReports ? (
              <p className="text-xs text-slate-500">Loading reports…</p>
            ) : errorReports ? (
              <p className="text-xs text-red-500">Failed to load reports.</p>
            ) : reports.length === 0 ? (
              <p className="text-xs text-slate-400">No reports at the moment.</p>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {reports.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50"
                  >
                    <h3 className="text-sm font-semibold text-slate-900">
                      {r.quiz_title || "Unknown quiz"}
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Reason: {r.reason}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      By: {r.reported_by_email || "Unknown"} •{" "}
                      {r.created_at
                        ? new Date(r.created_at).toLocaleString()
                        : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
