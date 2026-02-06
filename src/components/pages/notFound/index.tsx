import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const navigate = useNavigate()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden relative">
      {/* Animated gradient orb that follows mouse */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-30 blur-3xl transition-all duration-300 ease-out pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
          left: `${mousePosition.x - 192}px`,
          top: `${mousePosition.y - 192}px`,
        }}
      />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 border-2 border-purple-400/20 rotate-12 animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 border-2 border-blue-400/20 -rotate-45 animate-float-delayed" />
        <div className="absolute bottom-32 left-1/4 w-16 h-16 border-2 border-pink-400/20 rotate-90 animate-float-slow" />
        <div className="absolute bottom-20 right-1/3 w-24 h-24 rounded-full border-2 border-violet-400/20 animate-pulse" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-3xl animate-fade-in-up">
        {/* 404 number with glitch effect */}
        <div className="relative inline-block mb-8">
          <h1 className="text-[12rem] md:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 leading-none tracking-tighter select-none">
            404
          </h1>
          <div className="absolute inset-0 text-[12rem] md:text-[16rem] font-black text-purple-600/20 blur-sm leading-none tracking-tighter animate-pulse select-none">
            404
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4 mb-12 animate-fade-in-up-delayed">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Page not found
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-md mx-auto">
            The page you are looking for doesn't exist or another error occurred.
          </p>
          <p className="text-base text-gray-400">
            Go back, or head over to{' '}
            <button
              onClick={handleGoHome}
              className="text-purple-400 hover:text-purple-300 underline underline-offset-4 transition-colors"
            >
              home
            </button>
            {' '}to choose a new direction.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up-more-delayed">
          <button
            onClick={handleGoBack}
            className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 min-w-[160px]"
          >
            <span className="relative z-10 font-semibold">Go Back</span>
          </button>
          
          <button
            onClick={handleGoHome}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50 min-w-[160px]"
          >
            <span className="relative z-10 font-semibold">Go to Home</span>
            <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(-45deg);
          }
          50% {
            transform: translateY(-30px) rotate(-35deg);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(90deg);
          }
          50% {
            transform: translateY(-15px) rotate(100deg);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in-up-delayed {
          animation: fade-in-up 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-fade-in-up-more-delayed {
          animation: fade-in-up 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}