import React, { useState, useEffect } from "react";
import PaystackButton from "../components/PaystackButton";
import { useAuth } from "../hooks/useAuth";

export default function Subscription() {
  const { user } = useAuth();

  const plans = {
    basic: {
      id: "basic",
      priceLabel: "Free",
      amountMajor: 0,
      features: [
        "Access to community quizzes",
        "Basic progress tracking",
        "Standard support",
      ],
    },
    scholar: {
      id: "scholar",
      priceLabel: "500KES / month",
      amountMajor: 500,
      features: [
        "Access to 300 premium quizzes",
        "Ad-free learning",
        "Community events access",
      ],
    },
    warrior: {
      id: "warrior",
      priceLabel: "750KES / month",
      amountMajor: 750,
      features: [
        "Access to 900+ premium quizzes",
        "Ad-free learning experience",
        "Priority customer support",
        "Monthly bonus in-game coins",
        "Exclusive challenges and events",
      ],
    },
    elite: {
      id: "elite",
      priceLabel: "1200KES / month",
      amountMajor: 1200,
      features: [
        "All Premium Warrior features",
        "Early access to quiz packs",
        "Exclusive Elite-only badges",
        "Double XP rewards",
        "VIP leaderboards",
      ],
    },
  };

  // For a new user (no plan), treat as "basic" (free)
  const currentPlan = user?.subscription_plan || "basic";

  const [selected, setSelected] = useState(currentPlan);

  useEffect(() => {
    setSelected(currentPlan);
  }, [currentPlan]);

  const selectedPlan = plans[selected] || plans.basic;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-center text-2xl font-semibold mb-10">
          Subscription & Payment Management
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT - SELECTED PLAN DETAILS */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold text-lg mb-4 capitalize">
              {selected} Plan
            </h2>

            <ul className="space-y-3 mb-6">
              {selectedPlan.features.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  ✔ {f}
                </li>
              ))}
            </ul>

            <p className="text-xl font-bold">{selectedPlan.priceLabel}</p>

            <button className="mt-6 w-full px-4 py-2 bg-gray-100 rounded-lg text-sm">
              Manage Payment Methods
            </button>
          </div>

          {/* RIGHT - PLAN SELECTION */}
          <div className="bg-white p-6 rounded-xl shadow lg:col-span-2">
            <h3 className="font-semibold mb-4">Explore Plans</h3>

            <div className="space-y-4">
              {Object.keys(plans).map((planKey) => {
                const p = plans[planKey];
                const isCurrent = currentPlan === planKey;

                return (
                  <div
                    key={planKey}
                    className={`p-4 border rounded-xl ${
                      selected === planKey
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold capitalize">{planKey}</p>
                        <p className="text-sm text-gray-500">
                          {p.priceLabel}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelected(planKey)}
                        className="px-4 py-1 text-sm border rounded-lg bg-white hover:bg-gray-50"
                      >
                        View details
                      </button>
                    </div>

                    <div className="mt-3">
                      {isCurrent ? (
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full text-sm cursor-default">
                          You are on this plan
                        </button>
                      ) : p.amountMajor === 0 ? (
                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg w-full text-sm cursor-default">
                          Free plan
                        </button>
                      ) : (
                        <PaystackButton
                          planKey={planKey}
                          amountMajor={p.amountMajor}
                          purpose={`subscription_${planKey}`}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
