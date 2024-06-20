'use client'
import { useSession } from '@/auth/hooks/useSession';
import { Session, SessionPayload } from '@/lib/zod';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type SessionContextType = {
  session: SessionPayload;
  loading: boolean;
  error: any;
  refetch: () => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const { session, loading, error, refetch, signOut } = useSession();

  return (
    <SessionContext.Provider value={{ session, loading, error, refetch, signOut }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
};
