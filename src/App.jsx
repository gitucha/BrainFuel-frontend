import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import QuizTaking from "./pages/QuizTaking";
import CreateQuiz from "./pages/CreateQuiz";
import AdminPanel from "./pages/AdminPanel";
import Subscription from "./pages/Subscription";
import Leaderboard from "./pages/Leaderboard";
import Achievements from "./pages/Achievements";
import Shop from "./pages/Shop";
import Minigames from "./pages/Minigames";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quizzes/:id" element={<QuizTaking />} />
            <Route path="/create-quiz" element={<CreateQuiz />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/minigames" element={<Minigames />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
