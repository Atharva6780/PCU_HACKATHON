import { useState } from "react";
import axios from "axios";
import { CloudUpload, Loader2, FileAudio, X } from "lucide-react";

const UploadForm = ({ onFileProcessed }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) {
      const selectedFile = e.dataTransfer.files[0];
      if (isValidFileType(selectedFile)) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Invalid file type. Please upload an audio file.");
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    // Reset the file input
    const fileInput = document.getElementById("file-upload");
    if (fileInput) fileInput.value = "";
  };

  const isValidFileType = (file) => {
    const validTypes = ["audio/wav", "audio/mpeg", "audio/mp3", "audio/x-m4a", "audio/flac", "audio/ogg"];
    return validTypes.includes(file.type);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file!");
      return;
    }

    if (!isValidFileType(file)) {
      setError("Invalid file type. Please upload an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if (response.data.processed_file) {
        if (onFileProcessed) {
          onFileProcessed(response.data.processed_file);
        }
      } else {
        setError("Processing failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.response?.data?.error || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Upload Box */}
      <div
        className={`border-2 border-dashed ${
          dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition duration-300`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-upload").click()}
      >
        {file ? (
          <div className="w-full text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileAudio className="w-6 h-6 text-blue-500" />
              <span className="font-medium text-gray-700 truncate max-w-xs">{file.name}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
            </p>
          </div>
        ) : (
          <>
            <CloudUpload className="w-10 h-10 text-blue-500 mb-2" />
            <p className="text-gray-700 text-sm text-center">
              Drop your audio file here or click to upload
            </p>
            <p className="text-gray-500 text-xs mt-1">Supports MP3, WAV, M4A, FLAC, OGG</p>
          </>
        )}
      </div>

      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        accept=".wav,.mp3,.m4a,.flac,.ogg,audio/*"
      />

      {/* Error message */}
      {error && (
        <div className="mt-4 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Upload Button */}
      {file && (
        <button
          type="submit"
          onClick={handleUpload}
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition duration-300 flex items-center justify-center disabled:bg-blue-300 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            "Upload & Process"
          )}
        </button>
      )}
    </div>
  );
};

export default UploadForm;