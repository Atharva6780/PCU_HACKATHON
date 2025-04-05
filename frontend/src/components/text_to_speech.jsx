import React, { useState } from 'react';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('en');

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold mb-4 text-center">🗣️ Text to Speech</h1>

      <label className="block mb-2 font-medium text-gray-700">Enter Text</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="5"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type your text here..."
      />

      <div className="mt-4">
        <label className="block mb-2 font-medium text-gray-700">Select Voice/Language</label>
        <select
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="es">Spanish</option>
          {/* Add more languages as needed */}
        </select>
      </div>

      <button
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300"
        onClick={() => alert('Feature not implemented yet')}
      >
        🔊 Convert to Speech
      </button>

      {/* Placeholder for audio preview */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">🎧 Output audio will appear here.</p>
        {/* <audio controls src="output_url_here.mp3" className="mt-2" /> */}
      </div>
    </div>
  );
};

export default TextToSpeech;
