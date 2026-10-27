import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_STAFF } from '../services/db';

export interface DemoAccount {
  role: UserRole;
  label: string;
  email: string;
  staffId: string;
  defaultPass: string;
  description: string;
  status: 'ACTIVE' | 'REVOKED';
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'MANAGER',
    label: 'Manager Sir',
    email: 'manager@jnsd.edu',
    staffId: 'JNSD-MGR-001',
    defaultPass: 'Manager@2026',
    description: 'Full Administrative Authority & Exclusive Fees Management',
    status: 'ACTIVE',
  },
  {
    role: 'PRINCIPAL',
    label: 'Principal Madam',
    email: 'principal@jnsd.edu',
    staffId: 'JNSD-PRN-002',
    defaultPass: 'Principal@2026',
    description: 'Admissions, Teacher Accounts & Academic Oversight (Zero Fee Access)',
    status: 'ACTIVE',
  },
  {
    role: 'TEACHER',
    label: 'Class Teacher (Class 5-A)',
    email: 'rsharma@jnsd.edu',
    staffId: 'JNSD-TCH-101',
    defaultPass: 'Teacher@2026',
    description: 'Attendance & Marks Entry for Assigned Classes Only',
    status: 'ACTIVE',
  },
  {
    role: 'TEACHER',
    label: 'Revoked Staff Member',
    email: 'ashukla@jnsd.edu',
    staffId: 'JNSD-TCH-103',
    defaultPass: 'Teacher@2026',
    description: 'Test Account Locked Out by School Administration',
    status: 'REVOKED',
  },
];

interface AuthContextType {
  currentUser: UserProfile | null;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (account: DemoAccount) => void;
  switchUser: (role: UserRole, customStaffId?: string) => void;
  updatePassword: (newPass: string) => void;
  logout: () => void;
  isManager: boolean;
  isPrincipal: boolean;
  isTeacher: boolean;
  isRevoked: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('jnsd_erp_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Return default manager so development can proceed seamlessly if preferred,
    // or null if user logged out. Default to Manager for quick start.
    return {
      id: 'user-manager-1',
      email: 'manager@jnsd.edu',
      fullName: 'Sri Ramesh Chandra Sharma (Manager Sir)',
      role: 'MANAGER',
      status: 'ACTIVE',
      mustChangePassword: false,
    };
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('jnsd_erp_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('jnsd_erp_auth_user');
    }
  }, [currentUser]);

  const login = async (identifier: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const trimmed = identifier.trim().toLowerCase();

    // Check staff database
    const staffList = INITIAL_STAFF;
    const match = staffList.find(
      (s) => s.email.toLowerCase() === trimmed || s.employeeId.toLowerCase() === trimmed
    );

    if (!match) {
      return { success: false, error: 'Invalid Staff ID or Email Address. Please verify credentials.' };
    }

    if (pass.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    // Set user
    setCurrentUser({
      id: match.userId,
      email: match.email,
      fullName: match.fullName,
      role: match.role,
      status: match.status,
      mustChangePassword: match.mustChangePassword,
      revocationReason: match.revocationReason,
      revokedAt: match.revokedAt,
      lastLoginAt: new Date().toISOString(),
    });

    return { success: true };
  };

  const loginAsDemo = (account: DemoAccount) => {
    const staffList = INITIAL_STAFF;
    const match = staffList.find((s) => s.email === account.email);
    if (match) {
      setCurrentUser({
        id: match.userId,
        email: match.email,
        fullName: match.fullName,
        role: match.role,
        status: match.status,
        mustChangePassword: match.mustChangePassword,
        revocationReason: match.revocationReason,
        revokedAt: match.revokedAt,
        lastLoginAt: new Date().toISOString(),
      });
    }
  };

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
      setCurrentUser({
        id: 'user-manager-1',
        email: 'manager@jnsd.edu',
        fullName: 'Sri Ramesh Chandra Sharma (Manager Sir)',
        role: 'MANAGER',
        status: 'ACTIVE',
        mustChangePassword: false,
      });
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
    setCurrentUser((prev) => (prev ? { ...prev, mustChangePassword: false } : null));
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const isManager = currentUser?.role === 'MANAGER' && currentUser?.status === 'ACTIVE';
  const isPrincipal = currentUser?.role === 'PRINCIPAL' && currentUser?.status === 'ACTIVE';
  const isTeacher = currentUser?.role === 'TEACHER' && currentUser?.status === 'ACTIVE';
  const isRevoked = currentUser?.status === 'REVOKED' || currentUser?.status === 'SUSPENDED';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        loginAsDemo,
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
