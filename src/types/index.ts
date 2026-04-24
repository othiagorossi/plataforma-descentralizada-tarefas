export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done'

export interface User {
  id: string
  name: string
  avatar: string
  role: string
  credits: number
  skills: string[]
  assignedAreas?: string[]
}

export interface MacroArea {
  id: string
  name: string
  costCenter: string
  leaderId?: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  credits: number
  assignees: User[]
  tags: string[]
  dueDate?: string
  macroAreaId?: string
}

export interface Activity {
  id: string
  user: User
  action: string
  target: string
  date: string
}

export interface Space {
  id: string
  name: string
  icon: string
  memberCount: number
}
