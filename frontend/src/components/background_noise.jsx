import React, { useState } from "react";
import { Volume2, AudioWaveform as Waveform, Download, Play, Loader2 } from "lucide-react";
import UploadForm from "./UploadForm";
import axios from "axios";

export default function BackgroundNoise() {
  const [noiseLevel, setNoiseLevel] = useState(50);
  const [processedFile, setProcessedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  const handleFileProcessed = (fileUrl) => {
    setProcessedFile(fileUrl);
  };

  const handlePreview = () => {
    if (!processedFile) {
      alert("No processed file available to preview");
      return;
    }
    
    if (isPreviewing && audioElement) {
      // If already previewing, stop the preview
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsPreviewing(false);
      return;
    }

    setIsPreviewing(true);
    const audio = new Audio(processedFile);
    setAudioElement(audio);
    
    audio.play().catch(e => {
      console.error("Preview failed:", e);
      setIsPreviewing(false);
    });
    
    audio.onended = () => {
      setIsPreviewing(false);
      setAudioElement(null);
    };
  };

  const handleDownload = async () => {
    if (!processedFile) {
      alert("No processed file available to download");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await axios.get(processedFile, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from the URL or use a default
      const filename = processedFile.split('/').pop() || 'processed_audio.wav';
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Volume2 className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-gray-900">Background Noise Control</h1>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 transition duration-300 hover:shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Audio</h2>
        <UploadForm onFileProcessed={handleFileProcessed} />
      </div>

      {/* Noise Control Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 transition duration-300 hover:shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Noise Control</h2>

        {/* Processing Preview */}
        <div className="flex justify-between items-center p-4 bg-gray-100 rounded-xl mb-6 border border-gray-200">
          <div className="flex items-center gap-2">
            <Waveform className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-700">
              {processedFile ? "Ready to preview" : "Upload a file to preview"}
            </span>
          </div>
          <button 
            onClick={handlePreview}
            disabled={!processedFile}
            className={`px-4 py-2 flex items-center gap-2 text-sm font-medium rounded-lg shadow-md transition-all ${
              !processedFile 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isPreviewing
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isPreviewing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Stop Preview
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Preview
              </>
            )}
          </button>
        </div>

        {/* Process & Download Button */}
        <button 
          onClick={handleDownload}
          disabled={!processedFile || isProcessing}
          className={`w-full flex items-center justify-center px-5 py-3 text-lg font-semibold rounded-xl shadow-md transition-all ${
            !processedFile || isProcessing
              ? "bg-green-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Download className="w-5 h-5 mr-2" />
          )}
          {isProcessing ? "Processing..." : "Download Processed File"}
        </button>
      </div>
    </div>
  );
}