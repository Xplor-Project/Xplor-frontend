import React, { useState } from 'react';

const Profile = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Password update functionality not yet implemented.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 text-white relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute w-96 h-96 bg-gray-950 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-blob1" style={{top: '-10%', left: '-10%'}} />
        <div className="absolute w-96 h-96 bg-gray-950 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-blob2" style={{bottom: '-10%', right: '-10%'}} />
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl px-8 py-12 flex flex-col items-center">
          <h2 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 bg-clip-text drop-shadow-lg animate-fadein text-white">👤 Profile</h2>
          <p className="text-white mb-6 animate-fadein delay-100">Welcome to your profile. You can set your password below.</p>
          {message && (
            <div className="w-full mb-4 animate-fadein delay-200 bg-green-500/20 text-green-200 px-4 py-2 rounded-lg text-center">
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="w-full space-y-4 animate-fadein delay-200">
            <div>
              <label htmlFor="password" className="block text-sm text-white mb-1">New Password</label>
              <input type="password" id="password" className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-400 outline-none" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow-lg hover:scale-105 hover:from-gray-900 hover:to-gray-800 transition-all duration-200">Save Password</button>
          </form>
          <a href="/login" className="mt-6 px-8 py-3 rounded-xl border-2 border-blue-300 text-blue-100 font-bold shadow-lg bg-white/10 hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-700 hover:text-white hover:border-transparent hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 animate-fadein delay-300">Logout</a>
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
};

export default Profile;