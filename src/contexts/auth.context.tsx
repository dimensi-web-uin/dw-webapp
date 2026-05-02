import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

type UserProfile = {
  name: string;
  email: string;
  avatarUrl: string;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const extractProfile = (user: User | null): UserProfile | null => {
  if (!user) return null;

  const metadata = user.user_metadata ?? {};
  const name =
    metadata.full_name ||
    metadata.name ||
    metadata.user_name ||
    (user.email ? user.email.split('@')[0] : 'Anonymous');

  return {
    name,
    email: user.email ?? metadata.email ?? '',
    avatarUrl: metadata.avatar_url || metadata.picture || '',
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setIsLoading(false);
    };

    void initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
      setIsAuthenticating(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsAuthenticating(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: import.meta.env.VITE_APP_URL,
        },
      });
      if (error) {
        setIsAuthenticating(false);
        toast.success('Gagal login dengan Google');
        return;
      }
      setIsAuthenticating(false);
    } catch {
      setIsAuthenticating(false);
    }
  };

  const signOut = async () => {
    const toastId = toast.loading('Logout...');
    try {
      setIsAuthenticating(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        setIsAuthenticating(false);
        return;
      }
      setIsAuthenticating(false);
    } catch {
      setIsAuthenticating(false);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const user = session?.user ?? null;
  const value: AuthContextValue = {
    user,
    session,
    profile: extractProfile(user),
    isLoading: isLoading || isAuthenticating,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
