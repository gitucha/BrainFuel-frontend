import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./context/AuthProvider";
import { ToastProvider } from "./context/ToastContext";

// Pages
import HomePage from "./pages/Homepage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import QuizTakingGamified from "./pages/QuizTakingGamified";
import CreateQuiz from "./pages/CreateQuiz";
import AdminPanel from "./pages/AdminPanel";
import Subscription from "./pages/Subscription";
import Leaderboard from "./pages/Leaderboard";
import Achievements from "./pages/Achievements";
import Shop from "./pages/Shop";
import Minigames from "./pages/Minigames";
import Notifications from "./pages/Notifications";
import QuizMultiplayer from "./pages/QuizMultiplayer";
import Categories from "./pages/Categories";
import PaystackCallback from "./pages/PaystackCallback";
import PaymentsSuccess from "./pages/PaymentsSuccess";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>

          {/* FULL-SCREEN GRADIENT BACKGROUND */}
          <div className="min-h-screen w-full bg-linear-to-br from-[#c5d6e8] via-white to-[#c3ccdf]">

            {/* GLASS NAVBAR */}
            <Header />

            {/* CONTENT WRAPPER (FULL WIDTH, NO CONTAINER LIMITS) */}
            <main className="pt-4 pb-10">
              <Routes>

                {/* PUBLIC ROUTES */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

                {/* PAYSTACK */}
                <Route path="/payments/verify" element={<PaystackCallback />} />
                <Route path="/payments/success" element={<PaymentsSuccess />} />

                {/* PROTECTED ROUTES */}
                <Route
                  path="/dashboard"
                  element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
                />

                <Route
                  path="/categories"
                  element={<ProtectedRoute><Categories /></ProtectedRoute>}
                />

                <Route
                  path="/quizzes/:id"
                  element={<ProtectedRoute><QuizTakingGamified /></ProtectedRoute>}
                />

                <Route
                  path="/create-quiz"
                  element={<ProtectedRoute><CreateQuiz /></ProtectedRoute>}
                />

                <Route
                  path="/admin"
                  element={<ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>}
                />

                <Route
                  path="/subscription"
                  element={<ProtectedRoute><Subscription /></ProtectedRoute>}
                />

                <Route
                  path="/leaderboard"
                  element={<ProtectedRoute><Leaderboard /></ProtectedRoute>}
                />

                <Route
                  path="/achievements"
                  element={<ProtectedRoute><Achievements /></ProtectedRoute>}
                />

                <Route
                  path="/shop"
                  element={<ProtectedRoute><Shop /></ProtectedRoute>}
                />

                <Route
                  path="/minigames"
                  element={<ProtectedRoute><Minigames /></ProtectedRoute>}
                />

                <Route
                  path="/notifications"
                  element={<ProtectedRoute><Notifications /></ProtectedRoute>}
                />

                <Route
                  path="/multiplayer/:roomId"
                  element={<ProtectedRoute><QuizMultiplayer /></ProtectedRoute>}
                />

              </Routes>
            </main>

            {/* GLASS FOOTER */}
            <Footer />

          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
