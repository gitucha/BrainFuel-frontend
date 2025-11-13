import React, { useState } from "react";

function QuestionBlock({ index, data, update }) {
  const [qText, setQText] = useState(data.text);
  const [options, setOptions] = useState(data.options || []);
  const [correct, setCorrect] = useState(data.correct);

  const addOption = () => {
    setOptions((o) => [...o, { id: Date.now(), text: "", is_correct: false }]);
  };

  const updateOption = (id, newValue) => {
    setOptions((o) => o.map((op) => (op.id === id ? newValue : op)));
  };

  const markCorrect = (id) => {
    setCorrect(id);
    setOptions((o) =>
      o.map((op) => ({
        ...op,
        is_correct: op.id === id,
      }))
    );
  };

  const commit = () => {
    update({
      ...data,
      text: qText,
      options: options,
      correct: correct,
    });
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-2">Question {index + 1}</h3>

      <input
        className="w-full border px-3 py-2 rounded mb-3"
        placeholder="Question text"
        value={qText}
        onChange={(e) => setQText(e.target.value)}
        onBlur={commit}
      />

      <div className="space-y-3">
        {options.map((opt) => (
          <div key={opt.id} className="flex items-center gap-3">
            <input
              className="border px-3 py-2 rounded w-full"
              placeholder="Option text"
              value={opt.text}
              onChange={(e) =>
                updateOption(opt.id, {
                  ...opt,
                  text: e.target.value,
                })
              }
              onBlur={commit}
            />

            <input
              type="radio"
              checked={correct === opt.id}
              onChange={() => {
                markCorrect(opt.id);
                commit();
              }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          addOption();
          commit();
        }}
        className="mt-3 px-3 py-1 border rounded"
      >
        Add Option
      </button>
    </div>
  );
}

export default QuestionBlock;
