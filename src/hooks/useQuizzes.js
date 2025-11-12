import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export const useQuizzes = () => {
  return useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const { data } = await api.get("/quizzes/");
      return data;
    },
  });
};

export const useQuiz = (quizId) => {
  return useQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      const { data } = await api.get(`/quizzes/${quizId}/`);
      return data;
    },
  });
};
