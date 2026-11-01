'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { AuthSession, getStoredSession } from './api';
import { hasPermissionKey, ALL_PERMISSIONS, PermissionDefinition } from './permissions';

interface PermissionsContextValue {
  permissions: string[];
  isSuperAdmin: boolean;
  isSchoolAdmin: boolean;
  can: (permissionKey: string) => boolean;
  canAll: (permissionKeys: string[]) => boolean;
  canAny: (permissionKeys: string[]) => boolean;
  roleName?: string;
}

const PermissionsContext = createContext<PermissionsContextValue>({
  permissions: [],
  isSuperAdmin: false,
  isSchoolAdmin: false,
  can: () => false,
  canAll: () => false,
  canAny: () => false,
});

export function PermissionsProvider({
  children,
  session: propSession,
}: {
  children: React.ReactNode;
  session?: AuthSession | null;
}) {
  const session = propSession || (typeof window !== 'undefined' ? getStoredSession() : null);

  const value = useMemo(() => {
    const user = session?.user;
    const accountType = user?.accountType;
    const profile = user?.membership?.profile || user?.profile?.role || '';
    const rawPerms = user?.membership?.permissions || [];

    const isSuperAdmin = accountType === 'SUPER_ADMIN';
    const isSchoolAdmin =
      isSuperAdmin ||
      profile === 'PRINCIPAL' ||
      profile === 'SCHOOL_ADMIN' ||
      profile === 'HEADTEACHER';

    let userPermissions: string[] = [];
    if (isSuperAdmin || isSchoolAdmin) {
      userPermissions = ['*'];
    } else if (Array.isArray(rawPerms)) {
      userPermissions = rawPerms;
    } else if (typeof rawPerms === 'string') {
      userPermissions = [rawPerms];
    }

    const can = (key: string): boolean => {
      if (isSuperAdmin || isSchoolAdmin) return true;
      return hasPermissionKey(userPermissions, key);
    };

    const canAll = (keys: string[]): boolean => {
      return keys.every((k) => can(k));
    };

    const canAny = (keys: string[]): boolean => {
      return keys.some((k) => can(k));
    };

    return {
      permissions: userPermissions,
      isSuperAdmin,
      isSchoolAdmin,
      can,
      canAll,
      canAny,
      roleName: profile,
    };
  }, [session]);

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const ctx = useContext(PermissionsContext);
  if (!ctx) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return ctx;
}

// Reusable Can component
export interface CanProps {
  permission?: string;
  permissions?: string[];
  mode?: 'all' | 'any';
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Can({
  permission,
  permissions,
  mode = 'all',
  fallback = null,
  children,
}: CanProps) {
  const { can, canAll, canAny } = usePermissions();

  let allowed = false;
  if (permission) {
    allowed = can(permission);
  } else if (permissions && permissions.length > 0) {
    allowed = mode === 'all' ? canAll(permissions) : canAny(permissions);
  } else {
    allowed = true;
  }

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

