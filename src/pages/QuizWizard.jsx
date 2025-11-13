import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import QuizBuilder from "../components/QuizBuilder";

function QuizWizard() {
  const navigate = useNavigate();
  const { quizId } = useParams(); // optional: if editing existing quiz
  const qc = useQueryClient();

  const [step, setStep] = useState(0); // 0 meta, 1 builder, 2 preview
  const [quiz, setQuiz] = useState(null);
  const [meta, setMeta] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "easy",
    is_premium: false,
  });

  // Create quiz (or fetch existing if quizId passed)
  const createMut = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/quizzes/create/", payload);
      return data;
    },
    onSuccess: (data) => {
      setQuiz(data);
      setMeta((m) => ({ ...m, id: data.id }));
      navigate(`/quiz-builder/${data.id}`);
      setStep(1);
    },
  });

  const publishMut = useMutation({
    mutationFn: async (quizId) => {
      const { data } = await api.post(`/quizzes/${quizId}/publish/`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quizzes"] });
      alert("Quiz published and pending review.");
      navigate("/dashboard");
    },
    onError: () => alert("Failed to publish"),
  });

  const handleCreate = (e) => {
    e.preventDefault();
    createMut.mutate(meta);
  };

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Quiz Wizard</h2>
          <div className="text-sm text-gray-500">Step {step + 1} of 3</div>
        </div>

        {step === 0 && (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input name="title" value={meta.title} onChange={(e)=>setMeta({...meta,title:e.target.value})} required className="w-full border px-3 py-2 rounded"/>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea name="description" value={meta.description} onChange={(e)=>setMeta({...meta,description:e.target.value})} className="w-full border px-3 py-2 rounded"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Category</label>
                <input name="category" value={meta.category} onChange={(e)=>setMeta({...meta,category:e.target.value})} className="w-full border px-3 py-2 rounded"/>
              </div>
              <div>
                <label className="text-sm">Difficulty</label>
                <select value={meta.difficulty} onChange={(e)=>setMeta({...meta,difficulty:e.target.value})} className="w-full border px-3 py-2 rounded">
                  <option value="easy">easy</option>
                  <option value="medium">medium</option>
                  <option value="hard">hard</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" checked={meta.is_premium} onChange={(e)=>setMeta({...meta,is_premium:e.target.checked})}/>
              <span className="text-sm">Premium quiz</span>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{createMut.isPending ? "Creating..." : "Create & Continue"}</button>
            </div>
          </form>
        )}

        {step === 1 && (!quiz ? <div>Loading builder...</div> : <QuizBuilder quizId={quiz?.id || quizId} onPreview={()=>setStep(2)} />)}

        {step === 2 && quiz && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Preview</h3>
            <p className="mb-4 text-sm text-gray-600">Title: {quiz.title}</p>
            {/* Basic preview (questions fetched inside QuizBuilder could set quiz state) */}
            <div className="flex gap-3">
              <button onClick={()=>publishMut.mutate(quiz.id)} className="px-4 py-2 bg-green-600 text-white rounded">Publish (submit for review)</button>
              <button onClick={()=>setStep(1)} className="px-4 py-2 border rounded">Back to Edit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizWizard;
