import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 space-y-8 text-center">
        {/* 404 Animation */}
        <div className="relative">
          <div className="text-8xl font-bold text-blue-500 animate-bounce">
            404
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Search className="w-32 h-32 text-blue-200 animate-pulse" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-lg text-gray-600">
            We've searched high and low, but couldn't find what you're looking for.
          </p>
        </div>

        {/* URL Display */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-500 break-all">
            <span className="font-semibold">Requested URL: </span>
            {window.location.pathname}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="default"
            className="flex items-center gap-2"
            onClick={() => navigate('/')}
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Button>
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500">
          If you believe this is an error, please contact our support team.
        </p>
      </Card>
    </div>
  );
};

export default NotFound;