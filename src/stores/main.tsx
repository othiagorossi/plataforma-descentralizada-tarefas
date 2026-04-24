import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { Task, User, Activity, Space, TaskStatus } from '@/types'
import {
  mockTasks,
  mockUsers,
  mockActivities,
  mockSpaces,
  currentUser as mockCurrentUser,
} from '@/lib/mock-data'
import { toast } from 'sonner'

interface MainStoreState {
  currentUser: User
  tasks: Task[]
  users: User[]
  activities: Activity[]
  spaces: Space[]
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void
  awardCredits: (amount: number, userId?: string) => void
}

const MainStoreContext = createContext<MainStoreState | undefined>(undefined)

export const MainStoreProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(mockCurrentUser)
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [activities, setActivities] = useState<Activity[]>(mockActivities)
  const [spaces, setSpaces] = useState<Space[]>(mockSpaces)

  const updateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)),
    )
  }, [])

  const awardCredits = useCallback(
    (amount: number, userId: string = currentUser.id) => {
      if (userId === currentUser.id) {
        setCurrentUser((prev) => ({ ...prev, credits: prev.credits + amount }))
        toast.success(`Parabéns! Você ganhou ${amount} créditos. ✨`, {
          description: 'Os créditos foram adicionados ao seu saldo.',
        })
      }
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, credits: user.credits + amount } : user,
        ),
      )
    },
    [currentUser.id],
  )

  return (
    <MainStoreContext.Provider
      value={{
        currentUser,
        tasks,
        users,
        activities,
        spaces,
        updateTaskStatus,
        awardCredits,
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
