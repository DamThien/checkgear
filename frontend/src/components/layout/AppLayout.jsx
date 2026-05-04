import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Toaster from '../ui/Toast';

export default function AppLayout() {
  return (
    <div className="flex h-full overflow-hidden bg-[var(--color-bg)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-7">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  );
}
