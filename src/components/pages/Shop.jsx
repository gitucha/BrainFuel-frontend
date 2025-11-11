import React from "react";

function Shop() {
  const items = [
    { name: "Coin Pack (Small)", price: "$1.99" },
    { name: "Coin Pack (Medium)", price: "$4.99" },
    { name: "Coin Pack (Large)", price: "$9.99" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-8">BrainFuel Shop</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.name} className="bg-white p-6 rounded shadow hover:shadow-md">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-gray-600 mt-2">{item.price}</p>
            <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;
