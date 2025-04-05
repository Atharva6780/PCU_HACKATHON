import React, { useState } from 'react';

const Dubbing = () => {
  const [file, setFile] = useState(null);
  const [targetLang, setTargetLang] = useState('en');

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold mb-4 text-center">🎙️ AI Dubbing</h1>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">Upload Video/Audio File</label>
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">Select Target Language</label>
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          {/* Add more languages as needed */}
        </select>
      </div>

      <button
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-300"
        onClick={() => alert('Dubbing feature coming soon!')}
      >
        🔁 Start Dubbing
      </button>

      {/* Placeholder for dubbed output */}
      <div className="mt-6 text-center text-gray-500">
        <p>🎬 Your dubbed video/audio will appear here.</p>
      </div>
    </div>
  );
};

export default Dubbing;
