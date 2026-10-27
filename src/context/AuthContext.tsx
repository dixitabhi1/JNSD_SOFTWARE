import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_STAFF } from '../services/db';

interface AuthContextType {
  currentUser: UserProfile;
  switchUser: (role: UserRole, customStaffId?: string) => void;
  updatePassword: (newPass: string) => void;
  logout: () => void;
  isManager: boolean;
  isPrincipal: boolean;
  isTeacher: boolean;
  isRevoked: boolean;
}

const DEFAULT_MANAGER: UserProfile = {
  id: 'user-manager-1',
  email: 'manager@jnsd.edu',
  fullName: 'Sri Ramesh Chandra Sharma (Manager Sir)',
  role: 'MANAGER',
  status: 'ACTIVE',
  mustChangePassword: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('jnsd_erp_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_MANAGER;
      }
    }
    return DEFAULT_MANAGER;
  });

  useEffect(() => {
    localStorage.setItem('jnsd_erp_auth_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchUser = (role: UserRole, customStaffId?: string) => {
    if (customStaffId) {
      const staffList = INITIAL_STAFF;
      const target = staffList.find((s) => s.id === customStaffId);
      if (target) {
        setCurrentUser({
          id: target.userId,
          email: target.email,
          fullName: target.fullName,
          role: target.role,
          status: target.status,
          mustChangePassword: target.mustChangePassword,
          revocationReason: target.revocationReason,
          revokedAt: target.revokedAt,
        });
        return;
      }
    }

    if (role === 'MANAGER') {
      setCurrentUser(DEFAULT_MANAGER);
    } else if (role === 'PRINCIPAL') {
      setCurrentUser({
        id: 'user-principal-1',
        email: 'principal@jnsd.edu',
        fullName: 'Dr. Aruna Saxena (Principal)',
        role: 'PRINCIPAL',
        status: 'ACTIVE',
        mustChangePassword: false,
      });
    } else if (role === 'TEACHER') {
      setCurrentUser({
        id: 'user-teacher-sharma',
        email: 'rsharma@jnsd.edu',
        fullName: 'Rajesh Sharma (Class 5-A Teacher)',
        role: 'TEACHER',
        status: 'ACTIVE',
        mustChangePassword: false,
      });
    }
  };

  const updatePassword = (_newPass: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      mustChangePassword: false,
    }));
  };

  const logout = () => {
    switchUser('MANAGER');
  };

  const isManager = currentUser.role === 'MANAGER' && currentUser.status === 'ACTIVE';
  const isPrincipal = currentUser.role === 'PRINCIPAL' && currentUser.status === 'ACTIVE';
  const isTeacher = currentUser.role === 'TEACHER' && currentUser.status === 'ACTIVE';
  const isRevoked = currentUser.status === 'REVOKED' || currentUser.status === 'SUSPENDED';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchUser,
        updatePassword,
        logout,
        isManager,
        isPrincipal,
        isTeacher,
        isRevoked,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
