import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from 'react'
import { Task, User, Activity, Space, TaskStatus, MacroArea } from '@/types'
import { mockTasks, mockUsers, mockActivities, mockSpaces, mockMacroAreas } from '@/lib/mock-data'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'

interface MainStoreState {
  currentUser: User | null
  login: (user: User) => void
  logout: () => void
  tasks: Task[]
  users: User[]
  activities: Activity[]
  spaces: Space[]
  macroAreas: MacroArea[]
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void
  awardCredits: (amount: number, userId?: string) => void
  updateMacroArea: (areaId: string, data: Partial<MacroArea>) => void
  updateUserRole: (userId: string, role: string, assignedAreas?: string[]) => void
}

const MainStoreContext = createContext<MainStoreState | undefined>(undefined)

export const MainStoreProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [users, setUsers] = useState<User[]>(mockUsers)

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('profiles').select('*')
      if (data && data.length > 0) {
        const dbUsers = data.map((d: any) => ({
          id: d.id,
          email: d.email,
          name: d.name,
          avatar: d.avatar || `https://img.usecurling.com/ppl/thumbnail?seed=${d.id}`,
          role: d.role,
          credits: d.credits,
          skills: d.skills || [],
          assignedAreas: d.assigned_areas || [],
        }))
        setUsers(dbUsers)

        if (user) {
          const current = dbUsers.find((u: User) => u.id === user.id)
          if (current) setCurrentUser(current)
        } else {
          setCurrentUser(null)
        }
      } else if (user) {
        // Fallback if db is empty but user is logged in
        setCurrentUser({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || 'User',
          avatar: `https://img.usecurling.com/ppl/thumbnail?seed=${user.id}`,
          role: 'Member',
          credits: 0,
          skills: [],
        })
      } else {
        setCurrentUser(null)
      }
    }
    fetchUsers()
  }, [user])
  const [activities, setActivities] = useState<Activity[]>(mockActivities)
  const [spaces, setSpaces] = useState<Space[]>(mockSpaces)
  const [macroAreas, setMacroAreas] = useState<MacroArea[]>(mockMacroAreas)

  const login = useCallback((u: User) => setCurrentUser(u), [])
  const logout = useCallback(() => setCurrentUser(null), [])

  const updateMacroArea = useCallback((areaId: string, data: Partial<MacroArea>) => {
    setMacroAreas((prev) => prev.map((area) => (area.id === areaId ? { ...area, ...data } : area)))
  }, [])

  const updateUserRole = useCallback(
    (userId: string, role: string, assignedAreas?: string[]) => {
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, role, assignedAreas } : user)),
      )
      if (currentUser?.id === userId) {
        setCurrentUser((prev) => (prev ? { ...prev, role, assignedAreas } : null))
      }
    },
    [currentUser],
  )

  const updateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)),
    )
  }, [])

  const awardCredits = useCallback(
    (amount: number, userId?: string) => {
      const targetId = userId || currentUser?.id
      if (!targetId) return

      if (targetId === currentUser?.id) {
        setCurrentUser((prev) => (prev ? { ...prev, credits: prev.credits + amount } : null))
        toast.success(`Parabéns! Você ganhou ${amount} créditos. ✨`, {
          description: 'Os créditos foram adicionados ao seu saldo.',
        })
      }
      setUsers((prev) =>
        prev.map((user) =>
          user.id === targetId ? { ...user, credits: user.credits + amount } : user,
        ),
      )
    },
    [currentUser?.id],
  )

  return (
    <MainStoreContext.Provider
      value={{
        currentUser,
        login,
        logout,
        tasks,
        users,
        activities,
        spaces,
        macroAreas,
        updateTaskStatus,
        awardCredits,
        updateMacroArea,
        updateUserRole,
      }}
    >
      {children}
    </MainStoreContext.Provider>
  )
}

export default function useMainStore() {
  const context = useContext(MainStoreContext)
  if (context === undefined) {
    throw new Error('useMainStore must be used within a MainStoreProvider')
  }
  return context
}
