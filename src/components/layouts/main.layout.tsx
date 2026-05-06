import { Outlet } from 'react-router-dom';
import Header from '../molecules/header';
import { HeaderSticky } from '../atoms/header-sticky';
import Footer from '../molecules/footer';

const MainLayout = () => {
  return (
    <div className="flex min-h-svh flex-col items-stretch overflow-x-hidden">
      <HeaderSticky>
        <Header />
      </HeaderSticky>
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
