import React from "react";
import SideNav from "../components/Sidebar";

function AdminPanel() {
  const reports = [
    { quiz: "Math Basics", reporter: "John D", reason: "Incorrect answer" },
    { quiz: "World History", reporter: "Mary P", reason: "Offensive question" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
      <SideNav />
      <main className="flex-1">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { title: "Total Users", count: "1,200" },
            { title: "Premium Users", count: "320" },
            { title: "Pending Quizzes", count: "18" },
          ].map((stat) => (
            <div key={stat.title} className="bg-white p-6 rounded shadow-sm border-t-4 border-blue-500">
              <p className="text-gray-500">{stat.title}</p>
              <p className="text-3xl font-bold mt-2">{stat.count}</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="font-semibold mb-4">Recent Reports</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 border-b text-sm">
                <th className="py-2">Quiz</th>
                <th className="py-2">Reporter</th>
                <th className="py-2">Reason</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td>{r.quiz}</td>
                  <td>{r.reporter}</td>
                  <td>{r.reason}</td>
                  <td>
                    <button className="text-blue-600 text-sm hover:underline">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AdminPanel;
