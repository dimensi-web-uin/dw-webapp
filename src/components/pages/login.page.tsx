import { Button } from '@/components/atoms/button';
import { useAuth } from '@/contexts/auth.context';
import { Navigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../atoms/card';

const LoginPage = () => {
  const { signInWithGoogle, user } = useAuth();

  if (user) return <Navigate to={'/'} replace />;

  return (
    <div className="w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Login ke Akun</CardTitle>
          <CardDescription>
            Sudah siap untuk maju dan berkembang bersama?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" variant={'secondary'} onClick={signInWithGoogle}>
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg"
              className="size-4"
            />
            Lanjutkan dengan Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
