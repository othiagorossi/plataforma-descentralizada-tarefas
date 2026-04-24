import React from 'react'
import { Task, TaskStatus } from '@/types'
import { TaskCard } from './task-card'
import useMainStore from '@/stores/main'

interface TaskKanbanProps {
  onTaskClick: (task: Task) => void
}

const columns: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'A Fazer' },
  { id: 'in-progress', title: 'Em Progresso' },
  { id: 'review', title: 'Em Revisão' },
  { id: 'done', title: 'Concluído' },
]

export function TaskKanban({ onTaskClick }: TaskKanbanProps) {
  const { tasks, updateTaskStatus } = useMainStore()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('taskId')
    if (taskId) {
      updateTaskStatus(taskId, status)
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4 h-full min-h-[500px]">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id)

        return (
          <div
            key={col.id}
            className="flex-1 min-w-[280px] flex flex-col bg-muted/30 rounded-xl p-3"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-semibold text-sm text-foreground/80 uppercase tracking-wider">
                {col.title}
              </h3>
              <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full font-medium">
                {columnTasks.length}
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={onTaskClick} />
              ))}
              {columnTasks.length === 0 && (
                <div className="flex-1 border-2 border-dashed border-muted/50 rounded-lg flex items-center justify-center text-muted-foreground/50 text-sm p-4 text-center">
                  Arraste tarefas para cá
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
