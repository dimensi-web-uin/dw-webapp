import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/auth.context';
import browserRouter from './router';
import { Toaster } from './components/atoms/sonner';
import ConfirmDialog from './components/molecules/confirm-dialog';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={browserRouter} />
      <Toaster position="top-center" richColors />
      <ConfirmDialog />
    </AuthProvider>
  );
}

export default App;
