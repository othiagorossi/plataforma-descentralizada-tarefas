import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Task, User, Activity, Space, TaskStatus, MacroArea } from '@/types'

interface MainStoreState {
  currentUser: User | null
  login: (user: User) => void
  logout: () => void
  tasks: Task[]
  users: User[]
  activities: Activity[]
  spaces: Space[]
  macroAreas: MacroArea[]
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => Promise<void>
  awardCredits: (amount: number, userId?: string) => Promise<void>
  updateMacroArea: (areaId: string, data: Partial<MacroArea>) => Promise<void>
  updateUserRole: (userId: string, role: string, assignedAreas?: string[]) => Promise<void>
  deleteUser: (userId: string) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  addTask: (task: Omit<Task, 'id'>) => Promise<void>
}

const MainStoreContext = createContext<MainStoreState | undefined>(undefined)

export const MainStoreProvider = ({ children }: { children: ReactNode }) => {
  const { user, signOut } = useAuth()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [spaces, setSpaces] = useState<Space[]>([])
  const [macroAreas, setMacroAreas] = useState<MacroArea[]>([])

  useEffect(() => {
    if (!user) {
      setCurrentUser(null)
      setTasks([])
      setUsers([])
      setActivities([])
      setSpaces([])
      setMacroAreas([])
      return
    }

    const fetchData = async () => {
      try {
        const [profilesRes, tasksRes, spacesRes, areasRes, activitiesRes] = await Promise.all([
          supabase.from('profiles').select('*'),
          supabase.from('tasks').select('*'),
          supabase.from('spaces').select('*').order('created_at', { ascending: false }),
          supabase.from('macro_areas').select('*'),
          supabase
            .from('activities')
            .select('*, profiles(name, avatar)')
            .order('created_at', { ascending: false })
            .limit(20),
        ])

        if (profilesRes.data) {
          const mappedUsers = profilesRes.data.map((d: any) => ({
            id: d.id,
            email: d.email,
            name: d.name,
            avatar: d.avatar || `https://img.usecurling.com/ppl/thumbnail?seed=${d.id}`,
            role: d.role,
            credits: d.credits,
            skills: d.skills || [],
            assignedAreas: d.assigned_areas || [],
          }))
          setUsers(mappedUsers)
          setCurrentUser(mappedUsers.find((u: User) => u.id === user.id) || null)
        }

        if (tasksRes.data) {
          setTasks(
            tasksRes.data.map((t: any) => ({
              id: t.id,
              title: t.title,
              description: t.description || undefined,
              status: t.status as TaskStatus,
              credits: t.credits,
              dueDate: t.due_date || undefined,
              macroAreaId: t.macro_area_id || undefined,
              googleEventId: t.google_event_id || undefined,
            })),
          )
        }

        if (spacesRes.data) {
          setSpaces(
            spacesRes.data.map((s: any) => ({
              id: s.id,
              name: s.name,
              icon: s.icon,
            })),
          )
        }

        if (areasRes.data) {
          setMacroAreas(
            areasRes.data.map((a: any) => ({
              id: a.id,
              name: a.name,
              costCenter: a.cost_center,
              leaderId: a.leader_id || undefined,
            })),
          )
        }

        if (activitiesRes.data) {
          setActivities(
            activitiesRes.data.map((a: any) => ({
              id: a.id,
              userId: a.user_id,
              action: a.action,
              target: a.target,
              date: new Date(a.created_at).toLocaleDateString(),
              user: {
                name: a.profiles?.name || 'User',
                avatar:
                  a.profiles?.avatar ||
                  `https://img.usecurling.com/ppl/thumbnail?seed=${a.user_id}`,
              },
            })),
          )
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [user])

  const login = useCallback((u: User) => setCurrentUser(u), [])
  const logout = useCallback(async () => {
    await signOut()
    setCurrentUser(null)
  }, [signOut])

  const addTask = async (task: Omit<Task, 'id'>) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: task.title,
        description: task.description || null,
        status: task.status,
        credits: task.credits,
        due_date: task.dueDate || null,
        macro_area_id: task.macroAreaId || null,
      })
      .select()
      .single()

    if (error) {
      toast.error('Erro ao criar tarefa')
      return
    }

    if (data) {
      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        status: data.status as TaskStatus,
        credits: data.credits,
        dueDate: data.due_date || undefined,
        macroAreaId: data.macro_area_id || undefined,
      }
      setTasks((prev) => [...prev, newTask])
      toast.success('Tarefa criada com sucesso!')
    }
  }

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId)
    if (error) {
      toast.error('Erro ao excluir tarefa')
      return
    }
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    toast.success('Tarefa excluída')
  }

  const deleteUser = async (userId: string) => {
    const { error } = await supabase.from('profiles').delete().eq('id', userId)
    if (error) {
      toast.error('Erro ao remover usuário')
      return
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId))
    toast.success('Usuário removido da plataforma')
  }

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId)
    if (!error) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))
    }
  }

  const updateMacroArea = async (areaId: string, data: Partial<MacroArea>) => {
    const { error } = await supabase
      .from('macro_areas')
      .update({
        name: data.name,
        cost_center: data.costCenter,
        leader_id: data.leaderId,
      })
      .eq('id', areaId)
    if (!error) {
      setMacroAreas((prev) => prev.map((a) => (a.id === areaId ? { ...a, ...data } : a)))
    }
  }

  const updateUserRole = async (userId: string, role: string, assignedAreas?: string[]) => {
    const { error } = await supabase
      .from('profiles')
      .update({
        role,
        assigned_areas: assignedAreas || [],
      })
      .eq('id', userId)
    if (!error) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role, assignedAreas } : u)))
      if (currentUser?.id === userId) {
        setCurrentUser((prev) => (prev ? { ...prev, role, assignedAreas } : null))
      }
    }
  }

  const awardCredits = async (amount: number, targetUserId?: string) => {
    const uid = targetUserId || currentUser?.id
    if (!uid) return
    const targetUser = users.find((u) => u.id === uid)
    if (!targetUser) return

    const newCredits = targetUser.credits + amount
    const { error } = await supabase.from('profiles').update({ credits: newCredits }).eq('id', uid)

    if (!error) {
      setUsers((prev) => prev.map((u) => (u.id === uid ? { ...u, credits: newCredits } : u)))
      if (currentUser?.id === uid) {
        setCurrentUser((prev) => (prev ? { ...prev, credits: newCredits } : null))
        toast.success(`Parabéns! Você ganhou ${amount} créditos. ✨`)
      }
    }
  }

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
        deleteUser,
        deleteTask,
        addTask,
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
