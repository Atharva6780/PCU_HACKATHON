import React, { useState } from 'react';
import axios from 'axios';

const Cloning = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [text, setText] = useState('Hello, this is my cloned voice');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleClone = async () => {
    if (!file) {
      setError('Please upload a voice sample');
      return;
    }
    if (!text.trim()) {
      setError('Please enter text to clone');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      formData.append('text', text);

      const response = await axios.post('http://localhost:5000/clone-voice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to clone voice');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold mb-4 text-center">🧬 Voice Cloning</h1>

      <div className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Upload Your Voice Sample (10-30 seconds)</label>
          <input
            type="file"
            accept=".wav,.mp3"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <p className="text-sm text-gray-500 mt-1">.wav or .mp3 format recommended</p>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Clone Name</label>
          <input
            type="text"
            placeholder="e.g. MyVoiceClone"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Text to Clone</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Enter text you want your clone to speak"
          />
        </div>

        {error && (
          <div className="p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition duration-300 disabled:bg-purple-300"
          onClick={handleClone}
          disabled={isLoading}
        >
          {isLoading ? 'Cloning...' : '🧪 Clone Voice'}
        </button>

        {result && (
          <div className="mt-4 space-y-2">
            <div>
              <p className="font-medium">Original Sample:</p>
              <audio controls src={`http://localhost:5000${result.original_sample}`} className="w-full" />
            </div>
            <div>
              <p className="font-medium">Cloned Voice:</p>
              <audio controls src={`http://localhost:5000${result.cloned_audio}`} className="w-full" />
              <a 
                href={`http://localhost:5000${result.cloned_audio}`} 
                download={`${name}_clone.wav`}
                className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                Download Cloned Voice
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cloning;