import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from './loading.json'; // You'll need to add this animation file

const LoadingScreen = ({ isLoading, children }) => {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Add a slight delay before hiding the loading screen
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!showLoading) {
    return children;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center z-50">
      <div className="w-64 h-64">
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          autoplay={true}
        />
      </div>
      <p className="mt-4 text-lg text-blue-600 font-medium animate-pulse">
        Loading amazing things...
      </p>
    </div>
  );
};

export default LoadingScreen;