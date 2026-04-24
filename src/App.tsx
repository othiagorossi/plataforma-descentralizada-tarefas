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
import { MainStoreProvider } from './stores/main'

const App = () => (
  <MainStoreProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/tarefas" element={<TasksPage />} />
            <Route path="/pessoas" element={<PeoplePage />} />
            <Route path="/espacos" element={<SpacesPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </MainStoreProvider>
)

export default App
