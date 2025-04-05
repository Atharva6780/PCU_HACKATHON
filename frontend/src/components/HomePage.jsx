import { useNavigate } from "react-router-dom";
import { Volume2, Headphones, Mic, Zap, ArrowRight } from "lucide-react";
import {
  FileText,
  BadgeCheck,
  Languages,
  Scissors,
  Film,
  ShieldCheck,
} from "lucide-react";
export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Voice Cloning",
      description: "Generate a voice that sounds just like you, powered by AI.",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Transcripter",
      description: "Accurately transcribe and translate your audio content.",
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Speech to Text",
      description: "Convert spoken audio into accurate and readable text.",
    },
    {
      icon: <Volume2 className="w-6 h-6" />,
      title: "Text to Speech",
      description: "Turn written content into natural-sounding spoken audio.",
    },
    {
      icon: <BadgeCheck className="w-6 h-6" />,
      title: "Background Voice Remover",
      description: "Remove unwanted voices and isolate primary speakers.",
    },
    {
      icon: <Languages className="w-6 h-6" />,
      title: "Time Stamp Generation",
      description: "Insert precise timestamps into transcribed audio content.",
    },
    {
      icon: <Scissors className="w-6 h-6" />,
      title: "AI Generated Shorts/Reels",
      description: "Auto-generate video shorts and reels from your audio.",
    },
    {
      icon: <Film className="w-6 h-6" />,
      title: "Dubbing",
      description: "Translate and dub your videos into multiple languages.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Watermark for AI Shorts",
      description:
        "Add secure watermarks to protect and verify AI-generated content.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Floating voice bubbles */}
        <div className="absolute top-1/4 left-[10%] w-12 h-12 rounded-full bg-indigo-400 opacity-20 animate-float1"></div>
        <div className="absolute top-1/3 right-[15%] w-16 h-16 rounded-full bg-indigo-500 opacity-25 animate-float2"></div>
        <div className="absolute bottom-1/4 left-[20%] w-14 h-14 rounded-full bg-indigo-400 opacity-20 animate-float3"></div>

        {/* Soundwave Animation */}
        <div className="absolute bottom-0 left-0 right-0 h-48 flex items-end justify-center gap-1 px-4">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="w-full rounded-t-lg animate-soundwave"
              style={{
                height: `${Math.random() * 100 + 40}px`,
                animationDelay: `${i * 0.03}s`,
                opacity: 2,
                background: `hsl(${260 + i * 0.5}, 80%, 65%)`,
                boxShadow: "0 0 8px rgba(129, 140, 248, 0.6)",
              }}
            ></div>
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-gray-900/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-indigo-400" />
            <span className="text-xl font-bold text-white">EchoSynth</span>
          </div>
          <div className="flex space-x-4">
            {/* <button className="px-4 py-2 rounded-lg font-medium text-gray-300 hover:text-white">Sign In</button> */}
            <button
              onClick={() => navigate("/text-to-speech")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-bold max-w-3xl mx-auto leading-tight text-white">
            Bring your voice to life with{" "}
            <span className="text-indigo-400">AI-powered sound</span>
          </h1>
          <p className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto">
            Generate human-like voices, clean audio, and smart edits — all in
            one place. Perfect for creators, educators, storytellers, and
            individuals with speech or hearing disabilities.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/text-to-speech")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/20"
            >
              Try for free <ArrowRight className="ml-2 w-4 h-4" />
            </button>
            <button className="px-6 py-3 border border-gray-600 text-gray-200 rounded-lg font-medium hover:bg-gray-800/50 flex items-center justify-center transition-all duration-300">
              View pricing
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-16 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">
              Why choose our AI voices
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Our technology delivers the most realistic and versatile AI voices
              available.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-gray-700/50 transition duration-300 hover:border-indigo-500 hover:shadow-[0_0_15px_#6366f1]"
              >
                <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        {/* <section className="bg-gray-800/50 py-16 relative z-10">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">Trusted by creators worldwide</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-700/50">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-full mr-3 flex items-center justify-center text-indigo-400">
                      {item}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Sarah Johnson</h4>
                      <p className="text-gray-400 text-sm">Podcast Producer</p>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    "This has completely transformed how I produce content. The voices are indistinguishable from real humans."
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="py-16 bg-indigo-600/90 text-white relative z-10">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to try our AI voices?
            </h2>
            <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
              Join thousands of creators using our technology to enhance their
              content creation.
            </p>
            <button
              onClick={() => navigate("/text-to-speech")}
              className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300"
            >
              Get Started for Free
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className="w-6 h-6 text-indigo-400" />
                  <span className="text-white font-bold">EchoSynth</span>
                </div>
                <p className="text-sm">
                  The most realistic AI voice generator and text to speech
                  software.
                </p>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white">
                      Text to Speech
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Voice Cloning
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Community
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-sm">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p>© 2023 EchoSynth. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                  <a href="#" className="hover:text-white">
                    Cookies
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes float1 {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-30px) translateX(20px);
          }
        }
        @keyframes float2 {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(25px) translateX(-25px);
          }
        }
        @keyframes float3 {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(30px);
          }
        }
        @keyframes soundwave {
          0%,
          100% {
            transform: scaleY(0.7);
            height: 50px;
          }
          50% {
            transform: scaleY(1.5);
            height: 140px;
          }
        }
        .animate-float1 {
          animation: float1 10s ease-in-out infinite;
        }
        .animate-float2 {
          animation: float2 12s ease-in-out infinite;
        }
        .animate-float3 {
          animation: float3 14s ease-in-out infinite;
        }
        .animate-soundwave {
          animation: soundwave 3s cubic-bezier(0.4, 0, 0.6, 1) infinite
            alternate;
          transform-origin: bottom center;
        }
      `}</style>
    </div>
  );
}
