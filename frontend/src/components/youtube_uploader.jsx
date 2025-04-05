import React, { useState } from 'react';

const YouTubeUploader = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold mb-4 text-center">🎥 YouTube Uploader</h1>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">Select Audio/Video File</label>
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="Enter video title"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          rows="4"
          placeholder="Write something about the video..."
        />
      </div>

      <button
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-300"
        onClick={() => alert('Upload feature coming soon!')}
      >
        ⬆️ Upload to YouTube
      </button>

      {/* Placeholder for upload status */}
      <div className="mt-4 text-center text-gray-500">
        {/* Show uploading or success message here later */}
        <p>Status: Waiting for upload...</p>
      </div>
    </div>
  );
};

export default YouTubeUploader;
