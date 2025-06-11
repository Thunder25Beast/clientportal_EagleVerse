
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Shield, Camera, Lock } from 'lucide-react';

interface PrivacyNoticeProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ open, onAccept, onDecline }) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="text-coral-500" size={24} />
            <AlertDialogTitle>Privacy Notice</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-4">
            <div className="flex items-start space-x-3">
              <Camera className="text-gray-500 mt-1" size={16} />
              <div>
                <p className="font-medium">Photo Capture</p>
                <p className="text-sm">We will capture your photo for skin analysis purposes only.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Lock className="text-gray-500 mt-1" size={16} />
              <div>
                <p className="font-medium">Data Security</p>
                <p className="text-sm">Your images are processed securely and stored encrypted. You can delete them anytime.</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium">Your data will be used to:</p>
              <ul className="text-xs mt-1 space-y-1 text-gray-600">
                <li>• Analyze your skin condition</li>
                <li>• Provide personalized treatment recommendations</li>
                <li>• Track your skin health progress over time</li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onDecline}>Decline</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onAccept}
            className="bg-coral-500 hover:bg-coral-600"
          >
            I Agree & Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PrivacyNotice;
