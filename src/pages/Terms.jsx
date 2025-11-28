// src/pages/Terms.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function Terms() {
  const navigate = useNavigate();

  const handleBack = () => {
    // If you prefer, change to navigate("/dashboard") or navigate("/")
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#e8f3ff] via-white to-[#dce8ff]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header / top bar */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-blue-500">
              Legal
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Please read this carefully before using BrainFuel.
            </p>
          </div>

          <button
            onClick={handleBack}
            className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
          >
            Go back
          </button>
        </div>

        {/* Main card */}
        <div className="bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-white/70 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] text-slate-500">BrainFuel</p>
              <p className="text-xs text-slate-400">
                Last updated: 28 November 2025
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-[11px] font-medium text-blue-700">
              Study. Play. Respect the rules.
            </span>
          </div>

          {/* Intro */}
          <section className="space-y-2 mb-6">
            <h2 className="text-sm font-semibold text-slate-900">
              1. Acceptance of Terms
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              By creating an account or using BrainFuel, you agree to be bound
              by these Terms &amp; Conditions and our Privacy Policy. If you do
              not agree, you should not use the platform.
            </p>
          </section>

          {/* Eligibility */}
          <section className="space-y-2 mb-6">
            <h2 className="text-sm font-semibold text-slate-900">
              2. Eligibility &amp; Accounts
            </h2>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-1 list-disc pl-4">
              <li>You are responsible for all activity on your account.</li>
              <li>
                You agree to provide accurate information during registration
                and keep it up to date.
              </li>
              <li>
                Do not share your password or allow others to use your account.
              </li>
            </ul>
          </section>

          {/* Use of Service */}
          <section className="space-y-2 mb-6">
            <h2 className="text-sm font-semibold text-slate-900">
              3. Use of BrainFuel
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              BrainFuel is designed for learning, revision and friendly
              competition. You agree not to:
            </p>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-1 list-disc pl-4">
              <li>Use the platform for cheating in formal exams or tests.</li>
              <li>
                Upload content that is illegal, hateful, or violates the rights
                of others.
              </li>
              <li>
                Attempt to attack, reverse-engineer or disrupt the service,
                including multiplayer games.
              </li>
            </ul>
          </section>

          {/* Content & Ownership */}
          <section className="space-y-2 mb-6">
            <h2 className="text-sm font-semibold text-slate-900">
              4. Content &amp; Ownership
            </h2>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-1 list-disc pl-4">
              <li>
                BrainFuel content (branding, UI, core questions and features) is
                owned by BrainFuel or its licensors.
              </li>
              <li>
                If you create quizzes or questions, you retain rights to your
                content but grant BrainFuel a license to display and use it
                within the platform.
              </li>
            </ul>
          </section>

          {/* Rewards / Premium / Multiplayer */}
          <section className="space-y-2 mb-6">
            <h2 className="text-sm font-semibold text-slate-900">
              5. Rewards, Premium &amp; Multiplayer
            </h2>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-1 list-disc pl-4">
              <li>
                XP, levels and thalers are virtual rewards with no cash value.
              </li>
              <li>
                Premium subscriptions and payments are subject to your local
                laws and app store / payment provider terms.
              </li>
              <li>
                Multiplayer rooms are for fair play only. Exploiting bugs,
                griefing or harassing other users is not allowed.
              </li>
            </ul>
          </section>

          {/* Termination */}
          <section className="space-y-2 mb-6">
            <h2 className="text-sm font-semibold text-slate-900">
              6. Suspension &amp; Termination
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We may suspend or terminate accounts that violate these terms, our
              community guidelines, or applicable law. In serious cases, we may
              also restrict access to multiplayer features or reporting tools.
            </p>
          </section>

          {/* Changes / Contact */}
          <section className="space-y-2 mb-2">
            <h2 className="text-sm font-semibold text-slate-900">
              7. Changes &amp; Contact
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We may update these Terms from time to time. When we make
              significant changes, we will notify you in-app or by email. If you
              continue using BrainFuel after changes take effect, you agree to
              the updated Terms.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              If you have questions about these Terms, you can reach us via the{" "}
              <span className="font-semibold">Help &amp; Contact</span> section
              inside BrainFuel.
            </p>
          </section>
        </div>

        {/* Footer hint */}
        <div className="text-center text-[11px] text-slate-500">
          This page is a summary of the BrainFuel Terms &amp; Conditions.
        </div>
      </div>
    </div>
  );
}

export default Terms;
