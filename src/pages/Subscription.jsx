import React, { useState } from "react";

function Subscription() {
  const plans = [
    {
      name: "Basic Learner",
      price: "$0/month",
      features: [
        "Access to 100 quizzes",
        "Community leaderboards",
        "Standard progress tracking",
      ],
    },
    {
      name: "Advanced Scholar",
      price: "$7.99/month",
      features: [
        "Access to 400+ quizzes",
        "Ad-free experience",
        "Detailed quiz insights and stats",
        "Priority leaderboard visibility",
      ],
    },
    {
      name: "Premium Warrior",
      price: "$19.99/month",
      features: [
        "Access to 900+ premium quizzes",
        "AI-powered learning recommendations",
        "Monthly bonus in-game coins",
        "Exclusive community challenges",
        "Early access to new topics",
      ],
      recommended: true,
    },
    {
      name: "Elite Conqueror",
      price: "$34.99/month",
      features: [
        "All Premium benefits",
        "1-on-1 mentorship sessions",
        "Priority customer support",
        "VIP recognition badge",
      ],
    },
  ];

  const currentPlanName = "Premium Warrior";
  const [selectedPlan, setSelectedPlan] = useState(
    plans.find((p) => p.name === currentPlanName)
  );

  const payments = [
    { method: "Visa ending 4320" },
    { method: "MasterCard ending 9878" },
  ];

  const handleActionClick = () => {
    if (selectedPlan.name === currentPlanName) return;
    alert(`You have successfully upgraded to the ${selectedPlan.name} plan!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-center mb-10">
        Subscription & Payment Management
      </h2>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT SIDE — Selected Plan */}
        <div className="col-span-1 bg-linear-to-b from-blue-50 to-white p-8 rounded-xl shadow-sm border border-blue-100 flex flex-col">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            {selectedPlan.name}
          </h3>

          {selectedPlan.name === currentPlanName ? (
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full w-fit mb-4">
              Current Plan
            </span>
          ) : (
            <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full w-fit mb-4">
              Upgrade Preview
            </span>
          )}

          <ul className="space-y-3 text-gray-700 text-sm mb-6">
            {selectedPlan.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-green-500">✔</span>
                {f}
              </li>
            ))}
          </ul>

          <p className="text-3xl font-bold text-gray-800 mb-6">
            {selectedPlan.price}
          </p>

          <button
            onClick={handleActionClick}
            disabled={selectedPlan.name === currentPlanName}
            className={`mt-auto rounded-md py-2 font-medium transition ${
              selectedPlan.name === currentPlanName
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {selectedPlan.name === currentPlanName
              ? "You’re on this plan"
              : `Upgrade to ${selectedPlan.name}`}
          </button>
        </div>

        {/* RIGHT SIDE — Explore Plans & Payment Methods */}
        <div className="col-span-2 flex flex-col gap-8">
          {/* Explore Plans */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h4 className="font-semibold mb-4">Explore Plans</h4>
            <p className="text-sm text-gray-500 mb-6">
              Choose a plan to preview its benefits.
            </p>

            <div className="space-y-4">
              {plans.map((plan, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center border rounded-lg p-4 cursor-pointer hover:shadow-sm transition ${
                    selectedPlan.name === plan.name ? "border-blue-500" : ""
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="plan"
                      checked={selectedPlan.name === plan.name}
                      onChange={() => setSelectedPlan(plan)}
                      className="text-blue-600"
                    />
                    <div>
                      <h5 className="font-medium text-gray-800">{plan.name}</h5>
                      <p className="text-xs text-gray-500">{plan.price}</p>
                    </div>
                  </label>

                  <div className="flex items-center gap-3">
                    {plan.recommended && (
                      <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                    <button className="text-sm text-blue-600 hover:underline">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h4 className="font-semibold mb-4">Payment Methods</h4>
            <p className="text-sm text-gray-500 mb-6">
              Manage or change your saved payment methods.
            </p>

            <div className="space-y-3">
              {payments.map((p, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border rounded-lg p-3 hover:shadow-sm transition"
                >
                  <span className="text-gray-700 text-sm">{p.method}</span>
                  <button className="text-xs text-red-500 hover:underline">
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button className="mt-6 w-full py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
              + Add New Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscription;
