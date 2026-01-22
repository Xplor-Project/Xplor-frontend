

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 text-white relative overflow-hidden">
    {/* Animated background blobs */}
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
      <div className="absolute w-96 h-96 bg-gray-950 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-blob1" style={{top: '-10%', left: '-10%'}} />
      <div className="absolute w-96 h-96 bg-gray-950 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-blob2" style={{bottom: '-10%', right: '-10%'}} />
    </div>
    <div className="relative z-10 w-full max-w-lg mx-auto">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl px-10 py-16 flex flex-col items-center">
        <h1 className="text-7xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 bg-clip-text drop-shadow-lg animate-fadein text-white">404</h1>
        <p className="text-2xl text-white mb-6 animate-fadein delay-100">Page Not Found</p>
        <a href="/" className="mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow-lg hover:scale-105 hover:from-gray-900 hover:to-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 animate-fadein delay-200">Go Home</a>
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
    `}</style>
  </div>
);

export default NotFound;