// BE HAPPY\frontend\src\App.jsx
import React, { useState, useEffect } from 'react';

function App() {
  const [backendMessage, setBackendMessage] = useState('Loading...');

  useEffect(() => {
    // ⚠️ CRITICAL: Fetching from the FastAPI URL (http://127.0.0.1:8000/api/message)
    fetch('http://127.0.0.1:8000/api/message')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setBackendMessage(data.message);
      })
      .catch(error => {
        console.error("Fetch error:", error);
        setBackendMessage(`Error: Could not connect to FastAPI. (Check console for details)`);
      });
  }, []);

  return (
    // Styling applied using Tailwind CSS classes
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl border-t-8 border-indigo-600 text-center max-w-lg w-full">
        <h1 className="text-4xl font-extrabold text-indigo-800 mb-6">
          BE HAPPY App
        </h1>
        <p className="text-lg font-medium text-gray-700 mb-4">
          Status: Message from Backend Retrieved!
        </p>
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-300">
          <code className="text-xl font-mono text-indigo-900">
            {backendMessage}
          </code>
        </div>
        <p className="mt-4 text-sm text-gray-400">
          Frontend (React + Tailwind) connected to Backend (FastAPI).
        </p>
      </div>
    </div>
  );
}

export default App;