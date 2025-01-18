import React, { useState } from 'react';
import { 
  HelpCircle, 
  Mail, 
  Lock,
  Smile,
  Sparkles,
  Coffee,
  Ghost
} from 'lucide-react';

const HelpSignin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const funMessages = [
    "🎮 Loading super secret level... Just kidding! This is a demo!",
    "🎨 You've discovered our interactive art exhibit! Keep clicking!",
    "🚀 3... 2... 1... Demo mode activated!",
    "🌈 You found the end of the rainbow! But still just a demo!",
    "🎪 Welcome to the greatest show in demo-land!",
    "🎭 Plot twist: This is all smoke and mirrors (and code)!",
    "🎪 Step right up to the most entertaining demo in town!",
    "🎨 Creating digital masterpiece... of demos!",
    "🎯 Bulls-eye! You've hit the demo target!",
    "🎪 Welcome to the circus of interactive demos!"
  ];

  const handleSignIn = (e) => {
    e.preventDefault();
    setAttempts(prev => prev + 1);
    setIsSpinning(true);
    
    // Random fun message selection
    const randomMessage = funMessages[Math.floor(Math.random() * funMessages.length)];
    setMessage(randomMessage);
    
    // Reset spinning after animation
    setTimeout(() => setIsSpinning(false), 1000);
  };

  const handleAdminContact = () => {
    const adminMessages = [
      "🧙‍♂️ The admin wizard is currently in another castle!",
      "🎭 Plot twist: The admin was the demo all along!",
      "🎪 The admin has run away to join the circus!",
      "🎨 The admin is busy painting digital rainbows!"
    ];
    setMessage(adminMessages[Math.floor(Math.random() * adminMessages.length)]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <form onSubmit={handleSignIn} className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          {/* Whimsical Header */}
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 p-6 relative overflow-hidden">
            <div className="flex items-center space-x-3 relative z-10">
              <HelpCircle className={`text-white ${isSpinning ? 'animate-spin' : 'animate-bounce'}`} size={24} />
              <h2 className="text-xl font-semibold text-white">Adventure Awaits! ✨</h2>
            </div>
            <p className="text-purple-100 mt-2 text-sm">Warning: Contains dangerous levels of whimsy! 🎉</p>
            <div className="absolute top-0 right-0 transform translate-x-6 -translate-y-6">
              <Sparkles className="text-white opacity-20" size={48} />
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Magical Input Fields */}
            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your magical email address"
                  className="w-full p-3 border rounded-lg pl-10 group-hover:border-purple-500 transition-all duration-300 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <Mail className="absolute left-3 top-3.5 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" size={18} />
              </div>
              
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Super secret spell word"
                  className="w-full p-3 border rounded-lg pl-10 group-hover:border-purple-500 transition-all duration-300 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <Lock className="absolute left-3 top-3.5 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" size={18} />
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white p-3 rounded-lg font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group"
              >
                <span className="group-hover:animate-bounce">Cast Your Spell! ✨</span>
                {attempts === 0 ? 
                  <Smile size={18} className="group-hover:rotate-180 transition-transform duration-300" /> : 
                  <Ghost size={18} className="animate-bounce" />}
              </button>
            </div>

            {/* Enchanted Message Display */}
            {message && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg text-purple-700 text-center animate-fade-in relative overflow-hidden">
                <div className="relative z-10">{message}</div>
                <Sparkles className="absolute top-0 right-0 text-purple-200" size={24} />
              </div>
            )}

            {/* Mystical Admin Contact */}
            <div className="border-t pt-4">
              <button
                onClick={handleAdminContact}
                className="text-purple-600 font-medium flex items-center space-x-2 hover:text-pink-500 transition-colors duration-300 group w-full justify-center"
              >
                <Coffee className="group-hover:animate-spin" size={18} />
                <span className="group-hover:animate-pulse">Summon the Admin Wizard!</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HelpSignin;