import React from "react";
import SideNav from "../components/SideNav";

function CreateQuiz() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
      <SideNav />
      <main className="flex-1 bg-white p-8 rounded shadow-sm">
        <h2 className="text-xl font-bold mb-6">Create a New Quiz</h2>

        <div className="space-y-4">
          <input className="w-full border rounded p-3" placeholder="Quiz Title" />
          <textarea className="w-full border rounded p-3" placeholder="Quiz Description" rows={3} />

          {[1, 2].map((num) => (
            <div key={num} className="border rounded p-4 space-y-3">
              <p className="font-semibold">Question {num}</p>
              <input className="w-full border rounded p-2" placeholder="Question text" />
              {["A", "B", "C", "D"].map((o) => (
                <div key={o} className="flex items-center gap-2">
                  <input type="radio" name={`q${num}`} />
                  <input
                    className="flex-1 border rounded p-2"
                    placeholder={`Option ${o}`}
                  />
                </div>
              ))}
            </div>
          ))}

          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 border rounded hover:bg-gray-50">
              Save Draft
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Publish
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateQuiz;
