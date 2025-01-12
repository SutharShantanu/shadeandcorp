import React from 'react';

export default function Home() {
  return (
    <div className="min-h-[150vh] bg-gray-100">
      <main className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to E-Shop</h1>
          <p className="mt-4 text-gray-600">Find the best products at unbeatable prices.</p>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src="https://via.placeholder.com/300" alt="Product" className="w-full h-48 object-cover"/>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">Product 1</h2>
              <p className="text-gray-600">$29.99</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded hover:bg-blue-600">Add to Cart</button>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src="https://via.placeholder.com/300" alt="Product" className="w-full h-48 object-cover"/>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">Product 2</h2>
              <p className="text-gray-600">$39.99</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded hover:bg-blue-600">Add to Cart</button>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src="https://via.placeholder.com/300" alt="Product" className="w-full h-48 object-cover"/>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">Product 3</h2>
              <p className="text-gray-600">$49.99</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded hover:bg-blue-600">Add to Cart</button>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
