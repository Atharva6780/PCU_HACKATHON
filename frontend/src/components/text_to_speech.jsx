import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [character, setCharacter] = useState('young_woman');
  const [engine, setEngine] = useState('edge');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [characterVoices, setCharacterVoices] = useState({});

  // Fetch available character voices
  useEffect(() => {
    axios.get('http://localhost:5000/character-voices')
      .then(response => setCharacterVoices(response.data))
      .catch(err => console.error('Error fetching voices:', err));
  }, []);

  const handleConvert = async () => {
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    setIsLoading(true);
    setError('');
    setAudioUrl('');
    
    try {
      const response = await axios.post('http://localhost:5000/text-to-speech', {
        text: text,
        character: character,
        engine: engine
      });

      setAudioUrl(`http://localhost:5000${response.data.audio_url}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate voice');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold mb-4 text-center">🎭 Character Voice Generator</h1>

      <label className="block mb-2 font-medium text-gray-700">Enter Text</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="5"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type what you want the character to say..."
      />

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Character</label>
          <select
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            {Object.entries(characterVoices).map(([key, description]) => (
              <option key={key} value={key}>
                {description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Engine</label>
          <select
            value={engine}
            onChange={(e) => setEngine(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="edge">Edge TTS (Online, Better Quality)</option>
            <option value="pyttsx3">Pyttsx3 (Offline, Basic Voices)</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300 disabled:bg-blue-300"
        onClick={handleConvert}
        disabled={isLoading || !text.trim()}
      >
        {isLoading ? 'Generating Voice...' : '🎙️ Generate Character Voice'}
      </button>

      <div className="mt-6">
        {audioUrl && (
          <>
            <p className="text-gray-600 mb-2">🔊 Character Voice Preview:</p>
            <audio controls src={audioUrl} className="w-full" />
            <div className="mt-2 text-right">
              <a 
                href={audioUrl} 
                download={`${character}_voice.mp3`}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Download Voice
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TextToSpeech;