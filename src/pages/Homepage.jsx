import React from "react";
import { Link } from "react-router-dom";


function HomePage() {
  return (
    <div className="bg-gray-50">
      {/* HERO */}
      <section className="bg-linear-to-r from-blue-50 to-blue-100 py-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              Unlock Your Brainpower with BrainFuel:
              <span className="block">Gamified Learning Made Engaging.</span>
            </h1>
            <p className="mt-6 text-gray-600 max-w-xl">
              Dive into interactive quizzes, challenge friends, and climb the leaderboards.
              Education has never been this fun — learn faster and remember more.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/register"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
              >
                Start Your Journey
              </Link>
              <Link
                to="/login"
                className="inline-block px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Log in
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md mx-auto">
              {/* Illustration placeholder — replace with <img /> if you have asset */}
              <div className="h-56 rounded bg-linear-to-br from-white to-blue-50 flex items-center justify-center text-blue-400 font-semibold">
               <img src="/assets/download(10).jpeg"  />
               <p>We Make It Work</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-center text-2xl font-semibold mb-6">
          Ignite Your Learning Journey with BrainFuel
        </h2>
        <p className="text-center text-gray-500 max-w-2xl mx-auto mb-8">
          Discover powerful features designed to make education fun, engaging, and effective.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { t: "Interactive Quizzes", d: "Engage with dynamic question formats and instant feedback." },
            { t: "Gamified Leaderboards", d: "Compete with friends, climb rankings and earn rewards." },
            { t: "Personalized Progress", d: "Track your skills and get tailored learning paths." },
            { t: "Create Your Own Quizzes", d: "Design, share and manage quizzes for any topic." },
            { t: "Community Challenges", d: "Join group contests and collaborate with peers." },
            { t: "AI-Powered Recommendations", d: "Get suggested quizzes and topics based on performance." },
          ].map((f) => (
            <div key={f.t} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">★</div>
                <div>
                  <h3 className="font-semibold">{f.t}</h3>
                  <p className="text-sm text-gray-500 mt-1">{f.d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS / TRANSFORM */}
      <section className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h3 className="text-xl font-semibold">How BrainFuel Transforms Your Learning</h3>
          <p className="text-gray-500 mt-2 mb-8">Simple steps to master new topics and enjoy the journey.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg">
              <div className="h-10 w-10 rounded-full bg-blue-50 mx-auto flex items-center justify-center text-blue-600 font-bold">1</div>
              <h4 className="mt-4 font-semibold">Sign Up & Explore</h4>
              <p className="text-sm text-gray-500 mt-2">Create your free account and discover quizzes across topics.</p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="h-10 w-10 rounded-full bg-blue-50 mx-auto flex items-center justify-center text-blue-600 font-bold">2</div>
              <h4 className="mt-4 font-semibold">Play Quizzes</h4>
              <p className="text-sm text-gray-500 mt-2">Choose from thousands of quizzes and track immediate results.</p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="h-10 w-10 rounded-full bg-blue-50 mx-auto flex items-center justify-center text-blue-600 font-bold">3</div>
              <h4 className="mt-4 font-semibold">Level Up & Learn</h4>
              <p className="text-sm text-gray-500 mt-2">Earn XP, unlock badges, and follow a path to mastery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-center text-xl font-semibold mb-6">Hear It From Our Learners</h3>
        <p className="text-center text-gray-500 mb-8">Real stories from users who love learning with BrainFuel.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { text: "BrainFuel has revolutionized how I study! The quizzes are genuine fun.", name: "Sarah L.", role: "University Student" },
            { text: "Finally, an educational platform that understands engagement. My students improved.", name: "David L.", role: "High School Teacher" },
            { text: "Custom quizzes are a game-changer for study groups — flexible and motivating.", name: "Emily K.", role: "Lifelong Learner" },
            { text: "BrainFuel provides incredible tools for tracking progress and managing content.", name: "Michael R.", role: "School Admin" },
          ].map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-700">“{t.text}”</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full" />
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-linear-to-b from-blue-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-lg font-semibold">Ready to Supercharge Your Learning?</h3>
          <p className="text-gray-500 mt-2 mb-6">Join thousands of learners discovering a smarter, more engaging way to study.</p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register" className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700">
              Get Started Free
            </Link>
            <Link to="/login" className="px-5 py-2 border rounded-md text-gray-700 hover:bg-gray-50">
              Existing User? Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
