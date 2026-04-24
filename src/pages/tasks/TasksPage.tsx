import { useState } from 'react'
import { Task } from '@/types'
import { TaskKanban } from '@/components/tasks/task-kanban'
import { TaskDialog } from '@/components/tasks/task-dialog'
import { Button } from '@/components/ui/button'
import { Kanban, List, Plus } from 'lucide-react'

export default function TasksPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
          <p className="text-muted-foreground">Coordene o trabalho de forma descentralizada.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-muted p-1 rounded-md flex items-center">
            <Button
              variant={view === 'kanban' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8"
              onClick={() => setView('kanban')}
            >
              <Kanban className="w-4 h-4 mr-2" /> Quadro
            </Button>
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8"
              onClick={() => setView('list')}
            >
              <List className="w-4 h-4 mr-2" /> Lista
            </Button>
          </div>
          <Button size="sm" className="h-9">
            <Plus className="w-4 h-4 mr-1" /> Nova Tarefa
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden animate-fade-in">
        {view === 'kanban' ? (
          <TaskKanban onTaskClick={handleTaskClick} />
        ) : (
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
            Visualização em lista em desenvolvimento. Por favor, use o modo Kanban.
          </div>
        )}
      </div>

      <TaskDialog task={selectedTask} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}
