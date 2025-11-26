import React, { useState } from "react";
import PaystackButton from "../components/PaystackButton";


export default function Subscription() {
  // MUST match a real plan key
  const [selected, setSelected] = useState("warrior");

  const plans = {
    basic: {
      price: "Free",
      features: [
        "Access to community quizzes",
        "Basic progress tracking",
        "Standard support",
      ],
    },
    scholar: {
      price: "$7.99 / month",
      features: [
        "Access to 300 premium quizzes",
        "Ad-free learning",
        "Community events access",
      ],
    },
    warrior: {
      price: "$19.99 / month",
      features: [
        "Access to 900+ premium quizzes",
        "Ad-free learning experience",
        "Priority customer support",
        "Monthly bonus in-game coins",
        "Exclusive challenges and events",
      ],
    },
    elite: {
      price: "$34.99 / month",
      features: [
        "All Premium Warrior features",
        "Early access to quiz packs",
        "Exclusive Elite-only badges",
        "Double XP rewards",
        "VIP leaderboards",
      ],
    },
  };

  const currentPlan = "warrior"; // will come from backend later
  const plan = plans[selected]; // prevent undefined access

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

            {/* SAFE: will never crash because `plan` is defined */}
            <ul className="space-y-3 mb-6">
              {plan.features.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  ✔ {f}
                </li>
              ))}
            </ul>

            <p className="text-xl font-bold mt-4">{plan.price}</p>

            <button className="mt-6 w-full px-4 py-2 bg-gray-100 rounded-lg text-sm">
              Manage Payment Methods
            </button>
          </div>

          {/* RIGHT - PLAN SELECTION */}
          <div className="bg-white p-6 rounded-xl shadow lg:col-span-2">
            <h3 className="font-semibold mb-4">Explore Plans</h3>

            <div className="space-y-4">
              {Object.keys(plans).map((planKey) => (
                <div
                  key={planKey}
                  className={`p-4 border rounded-xl ${selected === planKey
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold capitalize">{planKey}</p>
                      <p className="text-sm text-gray-500">
                        {plans[planKey].price}
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
                    {currentPlan === plan.id ? (
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full text-sm cursor-default">
                        You are on this plan
                      </button>
                    ) : (
                      <PaystackButton
                        planKey={plan.id}
                        amountMajor={plan.price}
                        purpose={`subscription_${plan.id}`}
                      />
                    )}

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
