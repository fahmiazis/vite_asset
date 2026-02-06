import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Forbidden() {
  const navigate = useNavigate()
  const [glitchActive, setGlitchActive] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 200)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative">
      {/* Red scanning lines effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-600 to-transparent animate-scan" />
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Warning stripes */}
      <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-yellow-500 via-black to-yellow-500 opacity-80">
        <div className="w-full h-full bg-repeating-stripes animate-slide" />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-yellow-500 via-black to-yellow-500 opacity-80">
        <div className="w-full h-full bg-repeating-stripes animate-slide-reverse" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Lock icon */}
        <div className="mb-8 animate-fade-in">
          <div className="relative inline-block">
            <svg
              className="w-24 h-24 md:w-32 md:h-32 mx-auto text-red-500 animate-pulse-slow"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <div className="absolute inset-0 blur-xl bg-red-500/30 animate-pulse" />
          </div>
        </div>

        {/* 403 number with glitch */}
        <div className="relative mb-8 animate-fade-in-delayed">
          <h1 
            className={`text-[8rem] md:text-[12rem] font-black leading-none tracking-tighter select-none transition-all duration-100 ${
              glitchActive ? 'text-red-500 translate-x-1' : 'text-red-600'
            }`}
            style={{
              textShadow: glitchActive 
                ? '3px 3px 0 rgba(239, 68, 68, 0.5), -3px -3px 0 rgba(239, 68, 68, 0.5)'
                : '2px 2px 0 rgba(0, 0, 0, 0.8)'
            }}
          >
            403
          </h1>
          
          {/* Glitch overlay */}
          {glitchActive && (
            <div className="absolute inset-0 text-[8rem] md:text-[12rem] font-black text-yellow-400 leading-none tracking-tighter select-none opacity-70 -translate-x-1">
              403
            </div>
          )}
        </div>

        {/* Warning banner */}
        <div className="mb-8 animate-fade-in-more-delayed">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-600/20 border-2 border-red-600 rounded-lg backdrop-blur-sm">
            <svg className="w-6 h-6 text-yellow-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-xl md:text-2xl font-bold text-red-400 uppercase tracking-wider">
              Access Denied
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4 mb-12 animate-fade-in-last">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Forbidden
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            You don't have permission to access this resource.
            <br />
            This area is restricted to authorized personnel only.
          </p>
          <div className="inline-block mt-4 px-4 py-2 bg-black/50 border border-red-900/50 rounded text-sm text-red-400 font-mono">
            ERROR CODE: 403_FORBIDDEN
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-last">
          <button
            onClick={handleGoBack}
            className="group relative px-8 py-4 bg-gray-800 text-white rounded-lg border-2 border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 min-w-[160px] overflow-hidden"
          >
            <span className="relative z-10 font-semibold flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </span>
          </button>
          
          <button
            onClick={handleGoHome}
            className="group relative px-8 py-4 bg-red-600 text-white rounded-lg border-2 border-red-500 hover:bg-red-700 hover:border-red-600 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/50 min-w-[160px] overflow-hidden"
          >
            <span className="relative z-10 font-semibold flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Return Home
            </span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(50px);
          }
        }

        @keyframes slide-reverse {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-scan {
          animation: scan 4s linear infinite;
        }

        .animate-slide {
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(0, 0, 0, 0.5) 10px,
            rgba(0, 0, 0, 0.5) 20px
          );
          animation: slide 2s linear infinite;
        }

        .animate-slide-reverse {
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(0, 0, 0, 0.5) 10px,
            rgba(0, 0, 0, 0.5) 20px
          );
          animation: slide-reverse 2s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-fade-in-delayed {
          animation: fade-in 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-fade-in-more-delayed {
          animation: fade-in 0.6s ease-out 0.4s forwards;
          opacity: 0;
        }

        .animate-fade-in-last {
          animation: fade-in 0.6s ease-out 0.6s forwards;
          opacity: 0;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}