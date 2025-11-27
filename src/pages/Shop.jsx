import React from "react";
import PaystackButton from "../components/PaystackButton";
import { useAuth } from "../hooks/useAuth";

export default function Shop() {
  const { user } = useAuth();

  const items = [
    {
      id: "small",
      name: "Small Thaler Pack",
      desc: "Add 500 BrainFuel Thalers to your balance.",
      thalers: 500,
      priceKES: 200,
    },
    {
      id: "medium",
      name: "Medium Thaler Pack",
      desc: "Add 2,000 BrainFuel Thalers for longer sessions.",
      thalers: 2000,
      priceKES: 600,
    },
    {
      id: "mega",
      name: "Mega Thaler Chest",
      desc: "Unlock 10,000 BrainFuel Thalers with bonus perks.",
      thalers: 10000,
      priceKES: 1200,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-10">BrainFuel Shop</h2>

      {/* BALANCE + CTA */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10">
        <p className="text-gray-600 text-sm mb-3 sm:mb-0">
          Your Balance:{" "}
          <span className="font-semibold text-blue-600">
            {user?.thalers ?? 0} Thalers
          </span>
        </p>

        <a
          href="#shop"
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Buy More Thalers
        </a>
      </div>

      {/* ITEMS GRID */}
      <div id="shop" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((i) => (
          <div
            key={i.id}
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-xl transition border border-gray-100"
          >
            <div className="h-24 rounded-xl bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center text-5xl">
              💰
            </div>

            <h3 className="font-semibold text-lg mt-4">{i.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{i.desc}</p>

            <div className="flex justify-between items-center mt-6">
              <p className="font-bold text-blue-600 text-lg">
                KES {i.priceKES.toLocaleString()}
              </p>

              <PaystackButton
                amountMajor={i.priceKES}
                purpose={`shop_${i.id}`}
                shopThalers={i.thalers}
                redirectTo="/shop"
                label="Buy"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
