export type TaskStatus = 'todo' | 'in-progress' | 'done'

export interface User {
  id: string
  email: string
  name: string
  avatar: string
  role: string
  credits: number
  skills: string[]
  assignedAreas?: string[]
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  credits: number
  dueDate?: string
  macroAreaId?: string
  googleEventId?: string
  assignees?: string[]
}

export interface MacroArea {
  id: string
  name: string
  costCenter: string
  leaderId?: string
}

export interface Space {
  id: string
  name: string
  icon: string
}

export interface Activity {
  id: string
  userId: string
  action: string
  target: string
  date: string
  user: { name: string; avatar: string }
}
