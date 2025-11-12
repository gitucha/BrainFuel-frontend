import React from "react";

function Shop() {
  const items = [
    {
      name: "Small Coin Pack",
      desc: "Add 500 BrainFuel Coins to your balance.",
      price: "$1.99",
    },
    {
      name: "Medium Coin Pack",
      desc: "Add 2,000 BrainFuel Coins for extended fun.",
      price: "$4.99",
    },
    {
      name: "Mega Coin Chest",
      desc: "Unlock 10,000 BrainFuel Coins with bonus perks.",
      price: "$9.99",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-8">BrainFuel Shop </h2>

      <div className="flex justify-between items-center mb-8">
        <p className="text-gray-600 text-sm">
          Your Balance: <span className="font-semibold text-blue-600">5,000 Coins</span>
        </p>
        <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
          Get More Coins
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((i, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="h-24 bg-linear-to-br from-blue-50 to-blue-100 rounded mb-4 flex items-center justify-center text-4xl">
            </div>
            <h3 className="font-semibold">{i.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{i.desc}</p>
            <div className="flex justify-between items-center mt-4">
              <p className="font-bold text-blue-600">{i.price}</p>
              <button className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;