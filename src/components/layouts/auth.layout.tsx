import { LogoDimensi } from '@/assets/images';
import { Link, Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex min-h-svh w-screen flex-col items-center justify-center pb-24">
      <Link to={'/'} className="text-primary mb-6 flex items-center gap-3">
        <img src={LogoDimensi} className="w-8" />
        <h3 className="typo-heading-md">Dimensi Web</h3>
      </Link>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
