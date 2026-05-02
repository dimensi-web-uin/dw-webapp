import { useAuth } from '@/contexts/auth.context';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const Protected = ({
  protect = 'redirect',
  isStaff = false,
  children,
}: {
  protect?: 'redirect' | 'exception' | 'null';
  isStaff?: boolean;
  children: ReactNode;
}) => {
  const { user, isLoading } = useAuth();

  const members = useQuery(
    supabase
      .from('members')
      .select('*')
      .eq('is_active', true)
      .eq('user_id', user?.id ?? '')
      .maybeSingle(),
    {
      enabled: isStaff && !!user?.id,
    }
  );

  let hasAccess = user !== null;

  if (isStaff)
    hasAccess =
      !!members.data?.role && members.data.role.toLowerCase() != 'anggota';

  if (!isLoading && !hasAccess)
    return protect == 'redirect' ? <Navigate to="/auth/login" replace /> : null;

  return children;
};

export default Protected;
