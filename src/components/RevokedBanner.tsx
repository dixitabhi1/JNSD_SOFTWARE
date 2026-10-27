import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertOctagon, Lock } from 'lucide-react';

export const RevokedBanner: React.FC = () => {
  const { currentUser, isRevoked } = useAuth();

  if (!isRevoked || !currentUser) return null;

  return (
    <div className="bg-rose-50 border-b-2 border-rose-500 p-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-start space-x-3">
        <div className="p-2 bg-rose-100 rounded-full text-rose-700 shrink-0">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-rose-900 flex items-center space-x-2">
            <span>ACCOUNT ACCESS REVOKED</span>
            <span className="text-xs px-2 py-0.5 bg-rose-200 text-rose-800 rounded font-medium">LOCKED</span>
          </h3>
          <p className="text-sm text-rose-800 mt-1">
            Access for <strong>{currentUser.fullName}</strong> has been revoked by School Administration.
            All protected functions (admissions, attendance, marks, documents) are disabled.
          </p>
          {currentUser.revocationReason && (
            <p className="text-xs text-rose-700 mt-1 italic bg-white/70 p-2 rounded border border-rose-200">
              <strong>Official Revocation Reason:</strong> "{currentUser.revocationReason}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
