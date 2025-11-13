import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "../lib/api";

function QuizBuilder({ quizId, onPreview }) {
  const qc = useQueryClient();
  const [questions, setQuestions] = useState([]);

  // fetch questions/options for quiz
  const { data } = useQuery({
    queryKey: ["quiz-detail", quizId],
    queryFn: async () => {
      const { data } = await api.get(`/quizzes/${quizId}/`);
      return data;
    },
    enabled: !!quizId,
  });

  useEffect(() => {
    if (data) {
      // bring in order, map to simplified structure
      const q = data.questions.map((qItem) => ({
        id: qItem.id,
        text: qItem.text,
        options: qItem.options.map((o) => ({ id: o.id, text: o.text, is_correct: false })) // is_correct not exposed; we'll manage on edit
      }));
      setQuestions(q);
    }
  }, [data]);

  const addQuestionMut = useMutation({
    mutationFn: async ({ quizId, text }) => {
      const { data } = await api.post(`/quizzes/${quizId}/add-question/`, { text });
      return data;
    },
    onSuccess: (q) => {
      setQuestions((s) => [...s, { id: q.id, text: q.text, options: [] }]);
      qc.invalidateQueries({ queryKey: ["quiz-detail", quizId] });
    }
  });

  const addOptionMut = useMutation({
    mutationFn: async ({ quizId, questionId, text, is_correct }) => {
      const { data } = await api.post(`/quizzes/${quizId}/questions/${questionId}/add-option/`, { text, is_correct });
      return data;
    },
    onSuccess: (opt) => {
      setQuestions((s) => s.map(q => q.id === opt.question ? { ...q, options: [...q.options, { id: opt.id, text: opt.text, is_correct: opt.is_correct }] } : q));
      qc.invalidateQueries({ queryKey: ["quiz-detail", quizId] });
    }
  });

  const updateQuestionOrderMut = useMutation({
    mutationFn: async ({ quizId, order }) => {
      return await api.post(`/quizzes/${quizId}/reorder-questions/`, { order });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quiz-detail", quizId] })
  });

  const updateOptionOrderMut = useMutation({
    mutationFn: async ({ quizId, questionId, order }) => {
      return await api.post(`/quizzes/${quizId}/questions/${questionId}/reorder-options/`, { order });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quiz-detail", quizId] })
  });

  const handleAddQuestion = () => {
    const text = prompt("Question text:");
    if (!text) return;
    addQuestionMut.mutate({ quizId, text });
  };

  const handleAddOption = (questionId) => {
    const text = prompt("Option text:");
    if (!text) return;
    const is_correct = confirm("Mark as correct option?");
    addOptionMut.mutate({ quizId, questionId, text, is_correct });
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    // question reorder
    if (result.type === "QUESTION") {
      const newQs = Array.from(questions);
      const [moved] = newQs.splice(result.source.index, 1);
      newQs.splice(result.destination.index, 0, moved);
      setQuestions(newQs);

      // sync order by IDs
      const order = newQs.map((q) => q.id);
      updateQuestionOrderMut.mutate({ quizId, order });
    }

    // option reorder within a question
    if (result.type === "OPTION") {
      const qIndex = questions.findIndex(q => q.id === Number(result.source.droppableId));
      if (qIndex === -1) return;
      const newOptions = Array.from(questions[qIndex].options);
      const [moved] = newOptions.splice(result.source.index, 1);
      newOptions.splice(result.destination.index, 0, moved);

      const newQs = questions.map(q => q.id === Number(result.source.droppableId) ? { ...q, options: newOptions } : q);
      setQuestions(newQs);

      const order = newQs[qIndex].options.map(o => o.id);
      updateOptionOrderMut.mutate({ quizId, questionId: result.source.droppableId, order });
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Questions</h3>
        <div>
          <button onClick={handleAddQuestion} className="px-3 py-1 border rounded mr-2">Add Question</button>
          <button onClick={onPreview} className="px-3 py-1 bg-blue-600 text-white rounded">Preview</button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="questions" type="QUESTION">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
              {questions.map((q, idx) => (
                <Draggable key={q.id} draggableId={`q-${q.id}`} index={idx}>
                  {(drProv) => (
                    <div ref={drProv.innerRef} {...drProv.draggableProps} className="p-4 border rounded bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div {...drProv.dragHandleProps} className="cursor-move px-2">☰</div>
                          <div className="font-medium">{q.text}</div>
                        </div>
                        <div>
                          <button onClick={()=>handleAddOption(q.id)} className="px-2 py-1 border rounded text-sm">Add Option</button>
                        </div>
                      </div>

                      <Droppable droppableId={`${q.id}`} type="OPTION">
                        {(optProv) => (
                          <div ref={optProv.innerRef} {...optProv.droppableProps} className="space-y-2">
                            {q.options.map((opt, oi) => (
                              <Draggable key={opt.id} draggableId={`o-${opt.id}`} index={oi}>
                                {(oDr) => (
                                  <div ref={oDr.innerRef} {...oDr.draggableProps} className="flex items-center justify-between border rounded p-2">
                                    <div className="flex items-center gap-2">
                                      <div {...oDr.dragHandleProps} className="cursor-move px-2">⋮</div>
                                      <div>{opt.text}</div>
                                    </div>
                                    <div className="text-sm text-gray-500">{opt.is_correct ? "Correct" : ""}</div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {optProv.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default QuizBuilder;
