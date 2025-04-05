import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Mic, MessageSquare, Volume2, Brain, Copy, Youtube } from 'lucide-react';

import TextToSpeech from './components/text_to_speech';
import SpeechToText from './components/speech_to_text';
import BackgroundNoise from './components/background_noise';
import InterviewPrep from './components/interview_prep';
import Dubbing from './components/dubbing';
import Cloning from './components/cloning';
import YoutubeUploader from './components/youtube_uploader';
import HomePage from './components/HomePage';

function Sidebar({ isOpen, setIsOpen }) {
  const menuItems = [
    { title: 'Text to Speech', icon: MessageSquare, path: '/text-to-speech' },
    { title: 'Speech to Text', icon: Mic, path: '/speech-to-text' },
    { title: 'Background Noise', icon: Volume2, path: '/background-noise' },
    { title: 'Interview Prep', icon: Brain, path: '/interview-prep' },
    { title: 'Dubbing', icon: Copy, path: '/dubbing' },
    { title: 'Voice Cloning', icon: Mic, path: '/cloning' },
    { title: 'YouTube AI Uploader', icon: Youtube, path: '/youtube-uploader' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0`}>
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">EchoSynth</h1>
        <button onClick={() => setIsOpen(false)} className="lg:hidden">
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            to={item.path}
            className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

function AppWithRouter() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Only show mobile menu button when not on homepage */}
      {!isHomePage && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-md shadow-md"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Only show sidebar when not on homepage */}
      {!isHomePage && (
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      )}

      {/* Main Content - adjust margin only when not on homepage */}
      <div className={!isHomePage ? "lg:ml-64" : ""}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/text-to-speech" element={<TextToSpeech />} />
          <Route path="/speech-to-text" element={<SpeechToText />} />
          <Route path="/background-noise" element={<BackgroundNoise />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
          <Route path="/dubbing" element={<Dubbing />} />
          <Route path="/cloning" element={<Cloning />} />
          <Route path="/youtube-uploader" element={<YoutubeUploader />} />
        </Routes>
      </div>

      {/* Only show overlay when not on homepage */}
      {sidebarOpen && !isHomePage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
}