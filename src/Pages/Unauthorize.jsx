import React from 'react';
import { Shield, HomeIcon, AlertCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 space-y-8 text-center">
        {/* Lock Icon Animation */}
        <div className="relative mx-auto w-24 h-24 animate-bounce">
          <div className="absolute inset-0 bg-red-100 rounded-full opacity-25 animate-ping" />
          <Lock className="w-24 h-24 text-red-500 relative z-10" />
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-xl text-gray-600">
            Whoops! Looks like you've wandered into restricted territory.
          </p>
        </div>

        {/* Alert Message */}
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="ml-2">
            You don't have the necessary permissions to access this page.
          </AlertDescription>
        </Alert>

        {/* Security Shield */}
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <Shield className="w-5 h-5" />
          <span>Protected by security protocols</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="default"
            className="flex items-center gap-2"
            onClick={() => window.location.href = '/'}
          >
            <HomeIcon className="w-4 h-4" />
            Return Home
          </Button>
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500">
          If you believe this is an error, please contact your system administrator
          or support team for assistance.
        </p>
      </Card>
    </div>
  );
};

export default Unauthorized;