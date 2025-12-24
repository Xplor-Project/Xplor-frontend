// src/pages/Home.tsx


const Home = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 text-white relative overflow-hidden">
    {/* Animated background blobs */}
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
      <div className="absolute w-96 h-96 bg-gray-950 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-blob1" style={{top: '-10%', left: '-10%'}} />
      <div className="absolute w-96 h-96 bg-gray-950 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-blob2" style={{bottom: '-10%', right: '-10%'}} />
    </div>
    <div className="relative z-10 w-full max-w-xl mx-auto">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl px-10 py-14 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 bg-clip-text drop-shadow-lg animate-fadein text-white">🚀 Welcome to XPLOR</h1>
        <p className="text-lg text-white mb-6 animate-fadein delay-100">A powerful platform to explore and manage your journey.</p>
        <hr className="border-white/20 w-2/3 mb-8 animate-fadein delay-200" />
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-fadein delay-300">
          <a
            href="/login"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </a>
          <a
            href="http://localhost:8000/auth/login/google-oauth2/"
            className="w-full sm:w-auto px-8 py-3 rounded-xl border-2 border-white/30 text-white font-bold shadow-lg bg-white/10 hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-700 hover:text-white hover:border-transparent hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Continue with Google
          </a>
        </div>
      </div>
    </div>
    {/* Custom keyframes for blobs and fadein */}
    <style>{`
      @keyframes blob1 { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-30px) scale(1.1);} }
      @keyframes blob2 { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(30px) scale(1.1);} }
      .animate-blob1 { animation: blob1 8s infinite ease-in-out; }
      .animate-blob2 { animation: blob2 10s infinite ease-in-out; }
      @keyframes fadein { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
      .animate-fadein { animation: fadein 1s both; }
      .delay-100 { animation-delay: 0.1s; }
      .delay-200 { animation-delay: 0.2s; }
      .delay-300 { animation-delay: 0.3s; }
    `}</style>
  </div>
);

export default Home;
