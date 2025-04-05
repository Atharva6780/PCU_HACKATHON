import React, { useState } from 'react';

const Cloning = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold mb-4 text-center">🧬 Voice Cloning</h1>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">Upload Your Voice Sample</label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">Give it a Name</label>
        <input
          type="text"
          placeholder="e.g. AlexClone"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      <button
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition duration-300"
        onClick={() => alert('Voice cloning feature coming soon!')}
      >
        🧪 Clone Voice
      </button>

      {/* Placeholder for cloned voice preview */}
      <div className="mt-6 text-center text-gray-500">
        <p>🎧 Your cloned voice preview will appear here.</p>
      </div>
    </div>
  );
};

export default Cloning;
