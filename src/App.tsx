import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import TasksPage from './pages/tasks/TasksPage'
import PeoplePage from './pages/people/PeoplePage'
import SpacesPage from './pages/spaces/SpacesPage'
import LoginPage from './pages/auth/LoginPage'
import ManagementPage from './pages/admin/ManagementPage'
import ProfilePage from './pages/profile/ProfilePage'
import SettingsPage from './pages/settings/SettingsPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { MainStoreProvider } from './stores/main'
import { AuthProvider } from './hooks/use-auth'

const App = () => (
  <AuthProvider>
    <MainStoreProvider>
      <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Index />} />
              <Route path="/tarefas" element={<TasksPage />} />
              <Route path="/pessoas" element={<PeoplePage />} />
              <Route path="/espacos" element={<SpacesPage />} />
              <Route path="/gestao" element={<ManagementPage />} />
              <Route path="/perfil" element={<ProfilePage />} />
              <Route path="/configuracoes" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </MainStoreProvider>
  </AuthProvider>
)

export default App
