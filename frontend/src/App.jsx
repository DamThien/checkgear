import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MarketPage from './pages/MarketPage';
import MyGearPage from './pages/MyGearPage';
import AddGearPage from './pages/AddGearPage';
import GearDetailPage from './pages/GearDetailPage';
import PriceSearchPage from './pages/PriceSearchPage';

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PrivateRoute({ children }) {
  const { canEdit } = useAuthStore();
  return canEdit() ? children : <Navigate to="/" replace />;
}

function AuthGuard({ children }) {
  const { isAuthenticated, isGuest } = useAuthStore();
  if (!isAuthenticated() && !isGuest) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <AuthGuard>
                <AppLayout />
              </AuthGuard>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="market" element={<MarketPage />} />
            <Route path="my-gear" element={<PrivateRoute><MyGearPage /></PrivateRoute>} />
            <Route path="add-gear" element={<PrivateRoute><AddGearPage /></PrivateRoute>} />
            <Route path="gear/:id" element={<PrivateRoute><GearDetailPage /></PrivateRoute>} />
            <Route path="price-search" element={<PrivateRoute><PriceSearchPage /></PrivateRoute>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
